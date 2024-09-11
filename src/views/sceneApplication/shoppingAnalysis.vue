<!-- 商场分析 -->
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
        <pack-up
          :class="detailShow ? 'left_box0' : 'left_box'"
          @change="foldChange"
          :disabled="packUpDisabled"
          message="请选择商场！"
          ref="packUp"
        >
          <AMap ref="child" @click="poiClick" />
        </pack-up>
        <!--
        <AMap
          class="left_box"
          ref="child"
          @click="poiClick"
        ></AMap>
        -->
        <div class="middle_box">
          <div>
            <div
              class="label"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>商场列表</div>
              <div class="editBtn">
                <tagEditBtn
                  :checkedList="checkedList"
                  label="对比编辑"
                  @change="poiChange"
                  :direction="detailShow ? 'ltr' : 'rtl'"
                ></tagEditBtn>
                <el-button
                  type="primary"
                  @click="toShopContrast"
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
                  <div
                    style="display: flex; cursor: pointer;"
                    @click="marketClick(item)"
                  >
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
                      content="点击添加商场对比"
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
            <el-empty v-else description="暂无数据" style="height: 100%;" />
          </div>
        </div>
        <div class="right_box" v-show="detailShow && marketName">
          <div class="title_box" style="display: flex; align-items: center;">
            <span>{{ marketName }}</span>
            <div class="org_box" v-show="marketName">购物中心</div>
            <el-button
              class="blue_box"
              type="primary"
              v-show="datailBtn"
              @click="toDetail"
            >
              商场详情
            </el-button>
          </div>
          <div v-if="basicData.monthPassingFlowVO" class="right_box_content">
            <div class="data_box">
              <div class="dataBox1">
                <div>
                  <span>
                    {{ basicData.shopBaseDataVO.openingTime || '--' }}
                  </span>
                </div>
                <div>开业时间</div>
              </div>
              <div class="dataBox1">
                <div>
                  <span>
                    {{ basicData.shopBaseDataVO.openDuration || '--' }}
                  </span>
                  {{ basicData.shopBaseDataVO.openDuration ? '年' : '' }}
                </div>
                <div>开业时长</div>
              </div>
              <div class="dataBox1">
                <div>
                  <span>
                    {{ basicData.shopBaseDataVO.commerceArea || '--' }}
                  </span>
                  {{ basicData.shopBaseDataVO.commerceArea ? '万㎡' : '' }}
                </div>
                <div>商业面积</div>
              </div>
              <div class="dataBox1">
                <div>
                  <span>
                    {{ basicData.shopBaseDataVO.numberFloor || '--' }}
                  </span>
                  {{ basicData.shopBaseDataVO.numberFloor ? '层' : '' }}
                </div>
                <div>楼层数</div>
              </div>
              <div class="dataBox1">
                <div>
                  <span>
                    {{ basicData.shopBaseDataVO.parkingSpot || '--' }}
                  </span>
                  {{ basicData.shopBaseDataVO.parkingSpot ? '个' : '' }}
                </div>
                <div>停车位</div>
              </div>
              <div class="dataBox1">
                <div>
                  <span>{{ basicData.shopBaseDataVO.numberStore || '' }}</span>
                  {{ basicData.shopBaseDataVO.numberStore ? '个' : '' }}
                </div>
                <div>入驻商户</div>
              </div>
            </div>
            <div style="margin-bottom: 20px;">
              <headline>月总客流量趋势</headline>
              <myLine
                v-if="basicData.monthPassingFlowVO"
                ref="chart"
                :data="basicData.monthPassingFlowVO.dataList"
                :xAxis="basicData.monthPassingFlowVO.xaxis"
                :smooth="true"
                :areaStyle="true"
                :xLength="10"
                yName="单位：万人"
                symbol="none"
                height="160px"
              />
            </div>
            <div style="margin-bottom: 20px;">
              <headline>工作日/节假日日均客流量</headline>
              <column
                ref="chart1"
                :data="basicData.dayPassingFlowVO.dataList"
                :xAxis="basicData.dayPassingFlowVO.xaxis"
                :yName="['单位：万人', '单位：万人']"
                :interval="1"
                :xLength="10"
              />
            </div>
            <!--
            <div style="margin-bottom: 20px;">
              <headline>工作日/节假日日均客流量</headline>
              <dataBar
                :data="50"
                :height="10"
                name="工作日"
                :value="
                  basicData.workDayPassingFlow
                    ? thousandFormat(basicData.workDayPassingFlow)
                    : 0
                "
              />
              <dataBar
                :data="80"
                color="yellow"
                :height="10"
                name="节假日"
                :value="
                  basicData.holidayPassingFlow
                    ? thousandFormat(basicData.holidayPassingFlow)
                    : 0
                "
              />
            </div>
            -->
            <!--

                <div style="margin-bottom: 20px;">
                  <div class="label">工作日/节假日分时段客流量</div>
                  <ColumnLine
                    :data="basicData.columnData.customer1.dataList"
                    :xAxis="basicData.columnData.customer1.xaxis"
                    height="160px"
                  />
                </div>
                -->
          </div>
          <el-empty v-else description="暂无数据" style="height: 100%;" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAdministrativeRegionsCodeByCityName } from '@/api/crowdControl'
import {
  getPoiList,
  getMarketPoiInfo,
  getShopBriefDataById,
  getCityDistrictByCityName,
} from '@/api/sceneApplication'
import AMap from '@/components/MapContainer/AMap'
import ColumnLine from '@/components/echarts/ColumnLine.vue'
import myLine from '@/components/echarts/Line.vue'
import column from '@/components/echarts/column.vue'
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
    ColumnLine,
    column,
    myLine,
    PIE,
    setting,
    packUp,
    dataBar,
    tagEditBtn,
  },
  watch: {
    marketName(v) {
      if (v) {
        this.packUpDisabled = false
      }
    },
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
      // data: this.$route.query,
      data: this.$route.params,
      marketName: '',
      thousandFormat: thousandFormat,
      detailShow: false,
      packUpDisabled: null, //折叠组件禁用
      datailBtn: null,
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
      basicData: {},
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
      getPoiList().then((res) => {
        if (res.code == 200) {
          this.capitals = res.data
          //从活动选址跳转过来赋值
          if (this.data) {
            res.data.forEach((e) => {
              e.children.forEach((el) => {
                if (el.label == this.data.city) {
                  this.formData.city = [e.value, el.value]
                }
              })
            })
            this.getPoiData()
            this.getRegions(this.formData.city)
          }
        }
      })
      //行政区下拉列表
      // this.regions = [
      //   {
      //     label: '顺义区',
      //     value: '顺义区',
      //   },
      //   {
      //     label: '海淀区',
      //     value: '海淀区',
      //   },
      //   {
      //     label: '丰台区',
      //     value: '丰台区',
      //   },
      //   {
      //     label: '通州区',
      //     value: '通州区',
      //   },
      //   {
      //     label: '大兴区',
      //     value: '大兴区',
      //   },
      //   {
      //     label: '白云区',
      //     value: '白云区',
      //   },
      //   {
      //     label: '雁山区',
      //     value: '雁山区',
      //   },
      // ]
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
      //防止地图关闭时调用打点方法导致点样式错位
      if (this.detailShow) this.$refs.packUp.handlePack()
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
    //获取商场poi数据
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
        res = await getMarketPoiInfo(params)
        if (res.code == 200) {
          console.log(res.data, 'poi数据')
          res.data.forEach((e) => {
            this.businesses.push({
              label: e.name,
              value: e.name,
              name: e.name,
              openingTime: e.openingTime,
              numberStore: e.numberStore,
              commerceArea: e.commerceArea,
              dayPassingFlow: e.dayPassingFlow,
              location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
              // isDisabled: false,
              packUpDisabled: e.shopId ? false : true,
              shopId: e.shopId,
            })
          })
          // this.businesses.unshift({
          //   label: '全部',
          //   value: '全部',
          // })
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
              date: e.openingTime,
              shopNum: e.numberStore,
              area: e.commerceArea,
              dayPassingFlow: e.dayPassingFlow,
              location: e.location,
              packUpDisabled: e.packUpDisabled,
              shopId: e.shopId,
            })
          })
          this.$refs.child.addMarker({
            poi: pois,
            content: true,
          })
        }
      }
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
    //选择商场
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
    //跳转对比页
    toShopContrast() {
      if (this.checkedList.length < 2) {
        this.$message.warning('至少选择两个商场！')
        return
      }
      let data = []
      this.checkedList.forEach((e) => {
        data.push(e.shopId)
      })
      this.$router.push({
        path: '/sceneApplication/shopContrastPortrayal',
        query: { data: data },
      })
    },
    //选择地图打点图标（暂不需要）
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
        if (e.label !== '全部')
          pois.push({
            name: e.name,
            location: e.location,
          })
      })
      console.log(pois, 'pois数据')
      this.$refs.child.addMarker(pois, item, color)
    },
    //地址查询
    search() {
      // this.$refs.child.searchPoint(this.mapUrl[this.mapIndex])
      // this.$refs.child.searchPoint()
      //当地图收起时，点击标点展开地图（解决地图收起时打点错位问题）
      if (this.detailShow) this.$refs.packUp.handlePack()
      if (this.formData.city.length > 0) {
        this.getPoiData()
      } else {
        this.$message.warning('请选择城市！')
      }
    },
    //点击地图
    poiClick(val) {
      console.log(val, 'marker点击事件')
      this.marketName = val.data.name
      this.detailShow = val.detailShow
      if (this.detailShow) {
        setTimeout((e) => {
          this.$refs.chart.init()
          this.$refs.chart1.init()
        }, 550)
        this.getDetail()
        this.$refs.packUp.handlePack()
        this.datailBtn = true
      } else {
        this.$message.warning('暂无数据！')
        this.basicData = {}
        this.datailBtn = false
      }
    },
    //点击列表商场
    marketClick(val) {
      console.log(val, '点击商场列表')
      this.marketName = val.name
      if (!val.packUpDisabled) {
        this.getDetail()
        if (!this.detailShow) {
          this.$refs.packUp.handlePack()
          //详情页在关闭的情况下，重新加载echarts，避免折叠状态下宽度计算错误
          setTimeout((e) => {
            this.$refs.chart.init()
            this.$refs.chart1.init()
          }, 550)
        }
        this.datailBtn = true
      } else {
        this.$message.warning('暂无数据！')
        this.basicData = {}
        this.datailBtn = false
      }
    },
    //跳转详情页
    toDetail() {
      let data = this.businesses.find((el) => el.name === this.marketName)
      // this.$router.push({
      //   path: '/sceneApplication/marketDetail',
      //   query: data,
      // })
      //打开新页签
      let { href } = this.$router.resolve({
        name: 'marketDetail',
        query: data,
      })
      window.open(href, '_blank')
      console.log(data, '跳转详情参数')
    },
    //获取详情数据--调接口
    getDetail() {
      getShopBriefDataById(this.marketName).then((res) => {
        if (res.code == 200) {
          this.basicData = res.data
        }
      })
      //假数据
      // this.basicData = {
      //   openingTime: '2017-10-28', //开业时间
      //   openDuration: 5, //营业年限
      //   commerceArea: 36, //商业面积
      //   numberFloor: 8, //楼层数
      //   parkingSpot: 2054, //停车位
      //   numberStore: 583, //入驻商户
      //   monthPassingFlowVO: columnData.lineData1, //月总客流趋势
      //   dayPassingFlowVO: columnData.customer6, //工作日/节假日日均客流量
      // }
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
  height: 555px;
  .left_box0 {
    // height: 555px;
    justify-content: center;
    align-items: center;
  }
  .left_box {
    flex: 2.5;
    justify-content: center;
    align-items: center;
  }
  .middle_box {
    height: auto;
    width: 230px;
    // flex: 1;
    // padding: 10px;
  }
  .right_box {
    height: auto;
    // overflow-y: auto;
    flex: 2.5;
    padding: 0 10px;
  }
  .label {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .title_box {
    margin-bottom: 10px;
    span {
      font-weight: 600;
    }
    .org_box {
      width: 56px;
      height: 16px;
      line-height: 16px;
      font-size: 12px !important;
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
    .blue_box {
      font-size: 12px !important;
      // width: 56px;
      // height: 16px;
      // color: #fff;
      // text-align: center;
      // background: linear-gradient(90deg, #92bfe0 0%, rgb(183 190 233 / 65%) 100%);
      // border-radius: 2px;
      // cursor: pointer;
      margin-left: auto;
      margin-right: 15px;
      padding: 5px 8px !important;
      height: 26px !important;
    }
  }

  .setting_box {
    margin-bottom: 20px;
  }
}
.right_box_content {
  height: 520px;
  overflow-y: auto;
  padding-right: 8px;
}
.data_box {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  margin-bottom: 10px;
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
//添加按钮样式--蓝色
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
//禁用样式
.addBtn_disable {
  color: #c4c6ca;
  font-size: 16px;
  cursor: not-allowed;
}
//禁用点击事件
.addBtn_disable1 {
  pointer-events: none;
}
//编辑地址按钮
// ::v-deep .editBtn .el-button {
//   padding: 5px 6px !important;
//   height: 26px !important;
//   -webkit-transform: scale(0.95);
// }
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
::v-deep .sussess_box .el-form-item__label {
  width: 80px !important;
}
::v-deep .el-form-item__error {
  left: 150px;
}
</style>
