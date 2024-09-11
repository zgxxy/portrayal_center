<!-- 住宅分析 -->
<template>
  <div>
    <el-card class="father-card">
      <el-card>
        <div class="selectBox">
          <el-cascader
            v-model="formData.city"
            :options="capitals"
            :props="{ expandTrigger: 'hover' }"
            @change="capitalChange"
            clearable
            style="width: 20%; margin-right: 10px;"
          ></el-cascader>
          <el-select
            v-model="formData.region"
            placeholder="请选择或输入行政区"
            @change="regionChange"
            clearable
            filterable
            style="width: 20%;"
          >
            <el-option
              v-for="(item, index) in regions"
              :key="'city' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!--
          <div class="select_right">
            <div class="imgBox">
              <el-image
                v-for="(item, index) in mapUrl"
                :key="'mapUrl' + index"
                class="mapImg"
                :class="mapIndex == index ? 'mapImgHover' : 'mapImg'"
                :src="item"
                @click="iconChange(item, index)"
              ></el-image>
            </div>
            <el-image
              style="cursor: pointer; width: 37px; height: 37px;"
              :src="require('@/assets/images/slices/download.svg')"
              @click="downloadReportFile"
            ></el-image>
          </div>
          -->
        </div>
      </el-card>
      <div class="mapBox_0">
        <!--
        <pack-up class="left_box" @change="foldChange" ref="packUp">
          <AMap ref="child"></AMap>
        </pack-up>
        -->
        <AMap class="left_box" ref="child"></AMap>
        <div class="middle_box">
          <div
            class="label"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>住宅列表</div>
            <div class="editBtn">
              <tagEditBtn
                :checkedList="checkedList"
                label="对比编辑"
                @change="poiChange"
                :direction="detailShow ? 'ltr' : 'rtl'"
              ></tagEditBtn>
              <el-button
                type="primary"
                @click="toHouseContrast"
                v-show="checkedList.length > 0"
              >
                对比详情
              </el-button>
            </div>
          </div>
          <el-input
            placeholder="请选择或输入商场名称"
            v-model="formData.business"
            @keyup.enter.native="search"
            style="width: 100%;"
            clearable
          >
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="search"
            ></i>
          </el-input>

          <div class="list" v-if="marketList.length > 0">
            <div v-for="(item, index) in marketList">
              <div
                class="listBox"
                :key="'market' + index"
                v-if="marketList.length > 0"
              >
                <div style="display: flex; cursor: pointer;">
                  <div
                    class="rank-box"
                    :class="{
                      'rank-redBox1': index == 0,
                      'rank-redBox2': index == 1,
                      'rank-redBox3': index == 2,
                      'rank-blueBox': index > 2,
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :disabled="item.label | showTooltip(150)"
                    :content="item.label"
                    placement="top-start"
                  >
                    <span
                      style="
                        max-width: 150px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                    >
                      {{ item.label }}
                    </span>
                  </el-tooltip>
                </div>
                <div
                  :class="{
                    addBtn: !item.isDisabled,
                    addBtn_disable: item.isDisabled,
                  }"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="点击添加住宅对比"
                    placement="top-start"
                    :open-delay="800"
                  >
                    <i
                      class="el-icon-circle-plus"
                      :class="{
                        addBtn_disable1: item.isDisabled,
                      }"
                      @click="poiSelect(item, index)"
                    ></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无数据" />
        </div>
        <div class="right_box" v-show="detailShow">
          <div style="display: flex;">
            <div class="label">壹方城</div>
            <div class="org_box">购物中心</div>
          </div>
          <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="基础信息" name="first">
              <div v-if="activeName == 'first'">
                <div class="data_box">
                  <div class="dataBox1">
                    <div>
                      <span>{{ basicData.openDate || '--' }}</span>
                    </div>
                    <div>开业时间</div>
                  </div>
                  <div class="dataBox1">
                    <div>
                      <span>{{ basicData.businessData || 0 }}</span>
                      年
                    </div>
                    <div>营业年限</div>
                  </div>
                  <div class="dataBox1">
                    <div>
                      <span>{{ basicData.retailGFA || 0 }}</span>
                      万㎡
                    </div>
                    <div>商业面积</div>
                  </div>
                  <div class="dataBox1">
                    <div>
                      <span>{{ basicData.floorNum || 0 }}</span>
                      层
                    </div>
                    <div>楼层数</div>
                  </div>
                  <div class="dataBox1">
                    <div>
                      <span>{{ '约' + basicData.parkingSpot || 0 }}</span>
                      个
                    </div>
                    <div>停车位</div>
                  </div>
                  <div class="dataBox1">
                    <div>
                      <span>{{ basicData.settledMerchant || 0 }}</span>
                      个
                    </div>
                    <div>入驻商户</div>
                  </div>
                </div>
                <div style="margin-bottom: 20px;">
                  <div class="label">月总客流量趋势</div>
                  <myLine
                    :data="basicData.columnData.lineData1.dataList"
                    :xAxis="basicData.columnData.lineData1.xaxis"
                    :smooth="true"
                    :areaStyle="true"
                    symbol="none"
                    height="160px"
                  />
                </div>
                <div style="margin-bottom: 20px;">
                  <div class="label">工作日/节假日日均客流量</div>
                  <dataBar
                    :data="50"
                    :height="10"
                    name="工作日"
                    :value="thousandFormat(basicData.workCustomerNum)"
                  />
                  <dataBar
                    :data="80"
                    color="yellow"
                    :height="10"
                    name="节假日"
                    :value="thousandFormat(basicData.weekCustomerNum)"
                  />
                </div>
                <div style="margin-bottom: 20px;">
                  <div class="label">工作日/节假日分时段客流量</div>
                  <Column
                    :data="basicData.columnData.customer1.dataList"
                    :xAxis="basicData.columnData.customer1.xAxis"
                    height="160px"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="客流画像" name="second">
              <div v-if="activeName == 'second'">
                <div style="margin-bottom: 20px;">
                  <div class="label">性别与年龄</div>
                  <dataBar
                    :data="customerData.manProPort"
                    color="yellow"
                    :height="10"
                    type="double"
                  >
                    <template v-slot:top>
                      <div
                        style="display: flex; justify-content: space-between;"
                      >
                        <span>男</span>
                        <span>女</span>
                      </div>
                    </template>
                    <template v-slot:bottom>
                      <div
                        style="display: flex; justify-content: space-between;"
                      >
                        <div>
                          <span class="manFont">
                            {{ customerData.manProPort || 0 }}
                          </span>
                          %
                          <span style="margin-left: 5px;">TGI</span>
                          <span class="manFont">
                            {{ customerData.manTGI || 0 }}
                          </span>
                        </div>
                        <div>
                          <span>TGI</span>
                          <span class="womanFont">
                            {{ customerData.femaleTGI || 0 }}
                          </span>
                          <span style="margin-left: 5px;"></span>
                          <span class="womanFont">
                            {{ customerData.femaleProPort || 0 }}
                          </span>
                          %
                        </div>
                      </div>
                    </template>
                  </dataBar>
                  <Column
                    :data="customerData.columnData.customer2.dataList"
                    :xAxis="customerData.columnData.customer2.xAxis"
                    :yName="['单位(%)']"
                    height="160px"
                  />
                </div>
                <div style="margin-bottom: 20px;">
                  <div class="label">学历分布</div>
                  <PIE :data="customerData.educationData" :labelShow="false" />
                </div>
                <div style="margin-bottom: 20px;">
                  <div class="label">职业分布</div>
                  <PIE :data="customerData.careerData" :labelShow="false" />
                </div>
                <div style="margin-bottom: 20px;">
                  <div class="label">收入分布</div>
                  <Column
                    :data="customerData.columnData.customer3.dataList"
                    :xAxis="customerData.columnData.customer3.xAxis"
                    height="160px"
                  />
                </div>
                <div style="margin-bottom: 20px;">
                  <div class="label">消费水平</div>
                  <Column
                    :data="customerData.columnData.customer4.dataList"
                    :xAxis="customerData.columnData.customer4.xAxis"
                    height="160px"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="周边小区" name="third">
              <div style="margin-bottom: 20px;">
                <div class="label">住宅区基础信息</div>
                <div class="data_box">
                  <div class="dataBox2">
                    <div>
                      <span>{{ houseData.homeNum || '' }}</span>
                      个
                    </div>
                    <div>住宅数量</div>
                  </div>
                  <div class="dataBox2">
                    <div>
                      <span>{{ houseData.residentNum || '' }}</span>
                      万人
                    </div>
                    <div>居住人数</div>
                  </div>
                </div>
              </div>
              <div class="label">人口总规模热力分布区域top N</div>
              <el-table
                :data="houseData.houseTableData"
                :header-cell-style="{
                  background: '#eef5ff',
                  color: '#606266',
                  borderColor: '#d8e6fe',
                  fontSize: '12px',
                }"
                :row-style="{ height: '20px' }"
                :cell-style="{
                  borderColor: '#d8e6fe',
                }"
                style="width: 100%; margin-bottom: 20px;"
              >
                <el-table-column label="排名" width="150">
                  <template slot-scope="scope">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <div
                        class="rank-box"
                        :class="{
                          'rank-redBox1': scope.$index == 0,
                          'rank-redBox2': scope.$index == 1,
                          'rank-redBox3': scope.$index == 2,
                          'rank-blueBox': scope.$index > 2,
                        }"
                      >
                        {{ scope.$index + 1 }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="houseName" label="区域位置">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.houseName }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="label">住宅基础数据</div>
              <el-table
                :data="houseData.houseTableDataNumber"
                :header-cell-style="{
                  background: '#eef5ff',
                  color: '#606266',
                  borderColor: '#d8e6fe',
                  fontSize: '12px',
                }"
                :row-style="{ height: '20px' }"
                :cell-style="{
                  borderColor: '#d8e6fe',
                }"
                style="width: 100%; margin-bottom: 20px;"
              >
                <el-table-column type="index" label="序号" sortable />
                <el-table-column prop="businessName" label="名称">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.businessName }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="lineDistance" label="直线距离">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.lineDistance + '万m' }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="permeability" label="渗透率">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.permeability + '%' }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getPoiList,
  getResidencePoiInfo,
  getCityDistrictByCityName,
} from '@/api/sceneApplication'
import AMap from '@/components/MapContainer/AMap'
import Column from '@/components/echarts/ColumnLine.vue'
import myLine from '@/components/echarts/Line.vue'
import PIE from '@/components/echarts/Pie.vue'
import columnData from '/public/testData/portrayalData.json'
import setting from './components/settingDialog.vue'
import { thousandFormat, AMapTransBMap, bMapTransAMap } from '@/utils/public'
import packUp from './components/packUp'
import dataBar from './components/dataBar'
import capitals from '@/components/MapContainer/capitals.json'
import poiData from '/public/testData/poiData.json'
import tagEditBtn from '@/components/tag/tagEditBtn'
export default {
  components: {
    AMap,
    Column,
    myLine,
    PIE,
    setting,
    packUp,
    dataBar,
    tagEditBtn,
  },
  data() {
    let validateName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9_`~!@$^\u4e00-\u9fa5\.\-]+$/
      if (!reg.test(value)) {
        callback(new Error('输入的字符只能包含：中英文、数字或符号_-.`~!@$^'))
      } else {
        callback()
      }
    }
    return {
      thousandFormat: thousandFormat,
      activeName: 'first', //详情信息tab
      detailShow: false,
      mapUrl: [
        require('@/assets/images/slices/map0_blue.png'),
        require('@/assets/images/slices/map0_red.png'),
        require('@/assets/images/slices/map0_org.png'),
        require('@/assets/images/slices/map1_blue.png'),
        require('@/assets/images/slices/map1_red.png'),
        require('@/assets/images/slices/map1_org.png'),
      ],
      mapIndex: null, //当前选中图标序号，对应mapUrl图标数组下标
      checkedList: [], //选中的地址列表
      formData: {
        city: [], //省份城市
        region: '', //行政区
        business: '', //商场
      },
      capitals: [], //省份数据
      citys: [], //城市选择下拉框
      regions: [], //行政区下拉框
      businesses: [], //商圈下拉框
      marketList: [], //商场列表
      basicData: {
        openDate: '2017-10-28', //开业时间
        businessData: 5, //营业年限
        retailGFA: 36, //商业面积
        floorNum: 8, //楼层数
        parkingSpot: 2054, //停车位
        settledMerchant: 583, //入驻商户
        workCustomerNum: 125678, //工作日客流量
        weekCustomerNum: 18901, //节假日客流量
        columnData: columnData, //echarts数据
      },
      customerData: {
        manProPort: 55,
        manTGI: 145,
        femaleProPort: 45,
        femaleTGI: 123,
        columnData: columnData, //echarts数据
        educationData: [
          {
            name: '高中',
            value: '25',
          },
          {
            name: '本科',
            value: '57',
          },
          {
            name: '研究生',
            value: '18',
          },
        ],
        careerData: [
          {
            name: '其他',
            value: '28',
            TGI: 12,
          },
          {
            name: '文娱',
            value: '14',
            TGI: 9,
          },
          {
            name: '房地产',
            value: '21',
            TGI: 10,
          },
          {
            name: '互联网',
            value: '12',
            TGI: 5,
          },
          {
            name: '零售',
            value: '7',
            TGI: 8,
          },
          {
            name: '制浩',
            value: '13',
            TGI: 7,
          },
          {
            name: '建筑',
            value: '5',
            TGI: 2,
          },
        ],
      },
      houseData: {
        homeNum: 20, //住宅数量
        residentNum: 34.6, //居住人数
        houseTableData: [
          {
            houseName: '祈福新村',
            peopleNum: '16',
          },
          {
            houseName: '碧桂园凤凰城',
            peopleNum: '50',
          },
          {
            houseName: '金碧花园',
            peopleNum: '5',
          },
          {
            houseName: '光大花园',
            peopleNum: '4.5',
          },
          {
            houseName: '逸景翠园',
            peopleNum: '4',
          },
        ],
        houseTableDataNumber: [
          {
            businessName: '荔港南湾',
            lineDistance: '36',
            permeability: '21',
          },
          {
            businessName: '碧桂园凤凰城',
            lineDistance: '50',
            permeability: '13',
          },
          {
            businessName: '金碧花园',
            lineDistance: '53',
            permeability: '22',
          },
          {
            businessName: '光大花园',
            lineDistance: '22',
            permeability: '18',
          },
          {
            businessName: '逸景翠园',
            lineDistance: '11',
            permeability: '40',
          },
        ],
      },
      rules: {
        brandName: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        source: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getCityList()
  },
  methods: {
    // 获取城市下拉列表
    getCityList() {
      this.citys = []
      let children = []
      getPoiList().then((res) => {
        if (res.code == 200) {
          this.capitals = res.data
        }
      })
    },
    //选择城市
    capitalChange(val) {
      if (this.checkedList.length > 0) {
        this.$confirm('切换城市会清空当前已选商场，是否继续？', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.checkedList = []
        })
      }
      this.formData.business = ''
      this.getPoiData()
      this.getRegions(val)
    },
    //获取行政区
    getRegions(val) {
      this.regions = []
      this.formData.region = ''
      let value = ''
      this.capitals.forEach((e) => {
        if (e.children.length > 0) {
          e.children.forEach((item) => {
            if (item.value == val[1]) {
              value = item.label
            }
          })
          // value = e.children.find((ele) => ele.value == val[1]).value2
        }
      })
      if (value) {
        getCityDistrictByCityName(value).then((res) => {
          if (res.code == 200) {
            res.data.forEach((e) => {
              if (e.name) {
                this.regions.push({
                  label: e.name,
                  value: e.value,
                })
              }
            })
          }
        })
      }
    },
    //获取poi数据
    async getPoiData() {
      const that = this
      this.businesses = []
      this.marketList = []
      let params = {
        provinceCode: this.formData.city[0],
        cityCode: this.formData.city[1],
        queryName: this.formData.business,
      }
      let res = null
      if (this.formData.city.length > 0) {
        res = await getResidencePoiInfo(params)
      }
      // getResidencePoiInfo(params).then((res) => {
      if (res.code == 200) {
        console.log(res.data, 'poi数据')
        res.data.forEach((e) => {
          this.businesses.push({
            label: e.name,
            value: e.name,
            name: e.name,
            location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
            isDisabled: false,
          })
        })
        this.marketList = JSON.parse(JSON.stringify(this.businesses))
        //把上一次选中的状态加上
        if (this.checkedList.length > 0) {
          this.checkedList.forEach((el) => {
            this.marketList.forEach((val) => {
              if (el.name === val.name) {
                val.isDisabled = el.isDisabled
              }
            })
          })
        }
        let pois = []
        this.businesses.forEach((e) => {
          pois.push({
            name: e.name,
            location: e.location,
          })
        })
        this.$refs.child.addMarker({
          poi: pois,
        })
      }
      // })
    },
    cityCompute(val) {
      let city = []
      this.citys.forEach((e) => {
        if (val == e.value) {
          city = e.label
        }
      })
      return city
    },
    //选择行政区
    regionChange(val) {
      let region = this.regions.find((e) => e.value == val).label
      this.$refs.child.regionSearch(region)
    },
    //地图折叠方法
    foldChange(val) {
      this.detailShow = !val
    },
    //地址查询
    search() {
      // this.$refs.child.searchPoint(this.mapUrl[this.mapIndex])
      // this.$refs.child.searchPoint()
      //当地图收起时，点击标点展开地图（解决地图收起时打点错位问题）
      if (this.formData.city.length > 0) {
        this.getPoiData()
      } else {
        this.$message.warning('请选择城市！')
      }
    },
    //选择小区
    poiSelect(item, index) {
      if (this.checkedList.length > 2) {
        this.$message.warning('所选地址不能超过3个！')
        return
      }
      this.checkedList.push(item)
      if (this.checkedList.length > 0) {
        this.checkedList.forEach((e) => {
          this.marketList.forEach((val) => {
            if (e.name === val.name) {
              val.isDisabled = true
            }
          })
        })
      }
    },
    //标签编辑组件，删除地址时调用方法
    poiChange(val) {
      this.marketList.forEach((e) => {
        if (e.name === val.name) {
          e.isDisabled = false
        }
      })
    },
    toHouseContrast() {
      if (this.checkedList.length < 2) {
        this.$message.warning('至少选择两个小区！')
        return
      }
      let data = []
      this.checkedList.forEach((e) => {
        data.push(e.shopId)
      })
      //对比页面还没开发，开发了删掉跳转页面
      this.$message.warning('暂无对比数据！')
      return
      ////////////////////////////////////
      this.$router.push({
        path: '/sceneApplication/shopContrastPortrayal',
        query: { data: data },
      })
    },
    iconChange(item, index) {
      //当地图收起时，点击标点展开地图（解决地图收起时打点错位问题）
      if (this.detailShow) {
        this.$refs.packUp.handlePack()
      }
      this.mapIndex = index
      let color = null
      if (index == 0 || index == 3) {
        color = 'blue'
      } else if (index == 1 || index == 4) {
        color = 'red'
      } else {
        color = 'org'
      }
      let pois = []
      this.businesses.forEach((e) => {
        if (e.label !== '全部') {
          pois.push({
            name: e.name,
            location: e.location,
          })
        }
      })
      console.log(pois, 'pois数据')
      this.$refs.child.addMarker(pois, item, color, false)
    },
    downloadReportFile() {},
  },
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
::v-deep .mapBox .el-card__body {
  padding: 0;
  background: linear-gradient(
    179deg,
    #edf8ff 0%,
    rgba(248, 252, 255, 0.46) 51%,
    #ffffff 100%,
    #ffffff 100%
  );
}
.mapBox_0 {
  display: flex;
  .left_box {
    flex: 2;
    // height: 555px;
    justify-content: center;
    align-items: center;
  }
  .middle_box {
    height: auto;
    // flex: 1;
    width: 230px;
    padding-left: 10px;
  }
  .right_box {
    // height: 555px;
    height: auto;
    overflow-y: auto;
    flex: 1;
    padding: 10px;
  }
  .label {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .org_box {
    width: 56px;
    height: 16px;
    color: #fff;
    text-align: center;
    margin-left: 10px;
    background: linear-gradient(
      90deg,
      #f48e45 0%,
      rgba(244, 142, 69, 0.65) 100%
    );
    border-radius: 2px;
  }
  .setting_box {
    margin-bottom: 20px;
  }
}
.data_box {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  margin-bottom: 20px;
  .dataBox1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    height: 68px;
    color: #666666;
    background: linear-gradient(
      65deg,
      rgba(160, 255, 252, 0.11) 0%,
      rgba(102, 184, 255, 0.21) 100%
    );
    border: 1px solid rgba(104, 183, 255, 0.13);
    border-radius: 5px;
    padding: 0 10px;
    margin: 0 10px 10px 0; // 间隙为12px
    width: calc(
      (100% - 20px) / 3
    ); // 这里的25px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
    min-width: calc((100% - 20px) / 3); // 加入这两个后每个盒子的宽度就生效了
    max-width: calc((100% - 20px) / 3); // 加入这两个后每个盒子的宽度就生效了
    &:nth-child(3n) {
      // 去除第3n个的margin-right
      margin-right: 0;
    }
    :nth-child(n + 1) {
      margin-bottom: 8px;
    }
    span {
      font-size: 12px;
      font-weight: 600;
      color: #333333;
    }
  }
  .dataBox2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    flex: 1;
    margin-right: 10px;
    height: 68px;
    color: #666666;
    background: linear-gradient(
      65deg,
      rgba(160, 255, 252, 0.11) 0%,
      rgba(102, 184, 255, 0.21) 100%
    );
    border: 1px solid rgba(104, 183, 255, 0.13);
    border-radius: 5px;
    padding: 0 10px;
    :nth-child(n + 1) {
      margin-bottom: 8px;
    }
    span {
      font-size: 12px;
      font-weight: 600;
      color: #333333;
    }
  }
}
.selectBox {
  display: flex;
  .select_right {
    margin-left: auto;
    margin-right: 0;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
}
.imgBox {
  padding-top: 2px;
  margin-right: 10px;
  background: #f8fafc;
  border-radius: 2px;
  border: 1px solid rgba(104, 183, 255, 0.13);
}
.mapImg {
  padding: 5px;
  margin: 0 5px;
  width: 30px;
  height: 30px;
}
.mapImgHover {
  height: 30px;
  // padding: 5px;
  border: 1px solid #a3c5f5;
}
.list {
  height: 480px;
  overflow-y: auto;
  margin-top: 5px;
  padding-right: 5px;
}
.listBox {
  display: flex;
  align-items: center;
  margin-top: 10px;
  :last-child {
    margin-left: auto;
    margin-right: 0;
  }
}
.manFont {
  // margin-right: 3px;
  color: #418ff6;
}
.womanFont {
  // margin-right: 3px;
  color: #e47c91;
}
.addBtn {
  color: #8eb9f5;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}
//添加动画效果
.addBtn:active {
  transform: translateY(5px);
}
.addBtn_disable {
  color: #c4c6ca;
  font-size: 16px;
  cursor: not-allowed;
}
.addBtn_disable1 {
  pointer-events: none;
}
.editBtn {
  display: flex;
  ::v-deep .el-button {
    padding: 5px 8px !important;
    height: 26px !important;
    -webkit-transform: scale(0.95);
    margin-left: 8px;
  }
}
::v-deep .tabs .el-tabs__item {
  font-size: 12px;
  font-weight: 600;
  padding: 0 15px;
}
::v-deep .el-upload-dragger {
  width: 400px;
  height: 170px;
}
::v-deep .sussess_box .el-form-item__label {
  width: 80px !important;
}
::v-deep .el-form-item__error {
  left: 150px;
}
//进度条样式修改
.theSteps {
  /* 进行中状态：圈线 */
  ::v-deep .el-step__head.is-process {
    color: #409eff;
    border-color: #409eff;
  }
  // /* 进行中状态：圈内 */
  ::v-deep .el-step__head.is-process > .el-step__icon {
    background: #409eff;
    color: #fff;
  }
  /* 进行中状态：title（文字） */
  // ::v-deep .el-step__title.is-process {
  //   color: #606266;
  // }
  /* 未进行的状态：title（文字） */
  ::v-deep.el-step__title.is-wait {
    font-weight: 100;
  }
  /* 完成状态：圈线 */
  ::v-deep .el-step__head.is-success {
    color: #409eff;
    border-color: #409eff;
  }
  /* 完成状态：title（文字） */
  ::v-deep .el-step__title.is-success {
    color: #409eff;
  }
}
</style>
