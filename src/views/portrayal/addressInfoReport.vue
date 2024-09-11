<!-- 地址信息报告 -->
<template>
  <div>
    <el-card class="content" v-if="false">
      <div class="header">
        <div style="white-space: nowrap;">
          <div prop="region">
            <el-radio-group v-model="formData.tabPosition">
              <el-radio-button label="行政区">行政区</el-radio-button>
              <el-radio-button label="商圈">商圈</el-radio-button>
            </el-radio-group>
            <span style="margin-left: 10px;">
              <el-select
                v-if="formData.tabPosition == '行政区'"
                v-model="formData.region"
                @change="regionChange"
                filterable
                clearable
                placeholder="请选择或输入行政区"
                style="width: 50%;"
              >
                <el-option
                  v-for="item in regions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-else
                v-model="formData.business"
                filterable
                clearable
                placeholder="请选择或输入商圈"
                style="width: 50%;"
              >
                <el-option
                  v-for="item in businesses"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <i class="el-icon-setting setting" @click="settingDialog"></i>
          <el-image
            style="cursor: pointer;"
            :src="require('@/assets/images/slices/download.svg')"
            @click="downloadReportFile"
          ></el-image>
        </div>
      </div>
    </el-card>
    <el-card class="mapBox">
      <div class="mapBox_0">
        <AMap
          :heatmapData="heatmapData"
          class="left_box"
          ref="child"
          :value="formData.searchValue"
          @click="poiClick"
        ></AMap>
        <div class="right_box">
          <div class="setting_box">
            <div class="city">{{ dataList.city }}</div>
            <div class="data_box" v-if="dataList.peopleData">
              <div
                class="dataBox1"
                v-for="(item, index) in dataList.peopleData"
                :key="'people' + index"
              >
                <div>
                  <span>{{ item.value }}</span>
                  万
                </div>
                <div>{{ item.name }}</div>
              </div>
            </div>
            <div class="data_box dataBox2" v-if="dataList.data">
              <div v-for="(item, index) in dataList.data" :key="'data' + index">
                <div>
                  <span>{{ item.value }}</span>
                  个
                </div>
                <div>{{ item.name }}</div>
              </div>
            </div>
            <el-tabs v-model="activeName" class="tabs" @tab-click="tabClick">
              <el-tab-pane label="热门商圈" name="first" v-if="false">
                <div v-if="activeName == 'first'">
                  <div class="label">Top 5 热门商圈</div>
                  <Column
                    :data="columnData.business1.dataList"
                    :xAxis="columnData.business1.xaxis"
                    :yName="['万人/天']"
                    text="全市日均客流量top 5 商圈"
                    height="160px"
                    style="margin-bottom: 20px;"
                  />
                  <Column
                    :data="columnData.business2.dataList"
                    :xAxis="columnData.business2.xaxis"
                    :yName="['占比', 'TGI']"
                    text="目标客群热门分布top 5 商圈"
                    height="160px"
                    style="margin-bottom: 20px;"
                  />
                  <div class="label">Top 5 热门商圈客流趋势</div>
                  <myLine
                    :data="columnData.lineData.dataList"
                    :xAxis="columnData.lineData.xaxis"
                    height="160px"
                  />
                </div>
              </el-tab-pane>
              <el-tab-pane label="热门商场" name="second">
                <div v-if="activeName == 'second' && dataList.targetCustomer">
                  <div class="label">目标客群热门分布top 5 商场</div>
                  <Column
                    :data="dataList.targetCustomer.dataList"
                    :xAxis="dataList.targetCustomer.xaxis"
                    units="万"
                    :legendShow="false"
                    height="160px"
                    style="margin-bottom: 20px;"
                  />
                  <div class="label">客流top 5 商场月客流量趋势</div>
                  <myLine
                    :data="dataList.passingFlowVO.dataList"
                    :xAxis="dataList.passingFlowVO.xaxis"
                    :interval="1"
                    :xLength="9"
                    height="160px"
                    units="万人"
                  />
                </div>
              </el-tab-pane>
              <el-tab-pane label="热门小区" name="third" v-if="false">
                <div class="label">TOP5热门小区</div>
                <el-table
                  :data="dataList.houseTableData"
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
                  <el-table-column prop="houseName" label="小区名称">
                    <template slot-scope="scope">
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          text-align: left;
                          margin-left: 40px;
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
                        <span
                          style="
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                          "
                        >
                          {{ scope.row.houseName }}
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="peopleNum" label="总居住人数">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.peopleNum + '万' }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="label">全部小区信息</div>
                <el-table
                  :data="dataList.houseTableDataNumber"
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
                  <el-table-column prop="businessName" label="商圈名称">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.businessName }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="floorArea" label="占地面积">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.floorArea + '万㎡' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="peopleNum" label="居住人口">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.peopleNum + '万' }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-card>
    <setting
      :dialog-form-visible.sync="dialogFormVisible"
      :dialogFormData="dialogFormData"
      @dialogFormVisible="closeFrom"
    />
  </div>
</template>
<script>
import {
  getAllCityCode,
  getAdministrativeRegionsCodeByCityName,
} from '@/api/crowdControl'
import { active } from '@/api/sceneApplication'
import { getThermalMapByTaskId } from '@/api/report'
import AMap from '@/components/MapContainer/AMap'
import Column from '@/components/echarts/ColumnLine.vue'
import myLine from '@/components/echarts/Line.vue'
import setting from '@/views/sceneApplication/components/settingDialog.vue'
import { bMapTransAMap } from '@/utils/public'
import columnData from '/public/testData/portrayalData.json'
import tagList from '/public/testData/tagList.json'
export default {
  components: {
    AMap,
    Column,
    myLine,
    setting,
  },
  data() {
    return {
      data: this.$route.query,
      activeName: 'second', //tab
      formData: {
        city: '',
        tabPosition: '行政区',
        region: '',
        business: '',
        radio: 1,
        searchValue: '',
      },
      citys: [], //城市选择下拉框
      regions: [], //行政区下拉框
      businesses: [], //商圈下拉框
      dialogFormVisible: false, //规则配置弹窗
      dialogFormData: {},
      dataList: {}, //数据
      heatmapData: [], //热力数据
      columnData: columnData,
    }
  },
  created() {
    this.getData()
    this.getRegions()
  },
  methods: {
    async getData() {
      // this.dataList = {
      //   tagList2: tagList.data2, //商场标签数据
      //   peopleData: [
      //     { value: 1881.06, name: '常住人口' },
      //     { value: 880, name: '户籍人口' },
      //     { value: 1011.53, name: '流动人口' },
      //   ],
      //   data: [
      //     { value: 20, name: '商圈数量' },
      //     { value: 1621, name: '商场/购物中心' },
      //     { value: 5000, name: '楼盘数量' },
      //   ],
      //   columnData: columnData,
      //   houseTableData: [
      //     {
      //       houseName: '祈福新村',
      //       peopleNum: '16',
      //     },
      //     {
      //       houseName: '碧桂园凤凰城',
      //       peopleNum: '50',
      //     },
      //     {
      //       houseName: '金碧花园',
      //       peopleNum: '5',
      //     },
      //     {
      //       houseName: '光大花园',
      //       peopleNum: '4.5',
      //     },
      //     {
      //       houseName: '逸景翠园',
      //       peopleNum: '4',
      //     },
      //   ],
      //   houseTableDataNumber: [
      //     {
      //       businessName: '荔港南湾',
      //       peopleNum: '3',
      //       floorArea: '21',
      //     },
      //     {
      //       businessName: '碧桂园凤凰城',
      //       peopleNum: '50',
      //       floorArea: '6000',
      //     },
      //     {
      //       businessName: '金碧花园',
      //       peopleNum: '5',
      //       floorArea: '52',
      //     },
      //     {
      //       businessName: '光大花园',
      //       peopleNum: '4.5',
      //       floorArea: '43',
      //     },
      //     {
      //       businessName: '逸景翠园',
      //       peopleNum: '4',
      //       floorArea: '40',
      //     },
      //   ],
      // }
      console.log(this.data, '参数')
      let res = await active(this.data.id)
      if (res.code == 200) {
        //热力图数据请求
        getThermalMapByTaskId(res.data.thermalMapId).then((response) => {
          if (response.code == 200) {
            this.heatmapData = response.data
          }
        })
        this.dataList = res.data
        //商场位置打点
        let url = require('@/assets/images/slices/map0_blue.png')
        let url2 = require('@/assets/images/slices/map0_red.png')
        let pois = []
        let pois2 = []
        if (this.dataList.top5ShopGeoList.length > 0) {
          this.dataList.top5ShopGeoList.forEach((e) => {
            pois.push({
              name: e.name,
              location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
              url: url,
              isCircle: true,
            })
          })
          this.dataList.allShopGeoList.forEach((e) => {
            pois.push({
              name: e.name,
              location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
              url: url2,
              color: 'red',
            })
          })
          this.$nextTick(() => {
            this.$refs.child.addMarker({ poi: pois })
          })
        }
      }
    },
    //获取行政区
    getRegions() {
      this.regions = []
      this.formData.region = ''
      if (this.data.cityCode) {
        getAdministrativeRegionsCodeByCityName({
          cityCode: this.data.cityCode,
        }).then((res) => {
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
    regionChange(val) {
      let region = this.regions.find((e) => e.value == val).label
      this.$refs.child.regionSearch(region)
    },
    //点击地图
    poiClick(val) {
      console.log(val, 'marker点击事件')
      let { href } = this.$router.resolve({
        name: 'marketDetail',
        query: val.data,
      })
      window.open(href, '_blank')
    },
    tabClick() {},
    //配置弹窗
    settingDialog() {
      this.dialogFormVisible = true
      let data = {
        selectData: [
          {
            label: '商圈客流量',
            value: 0,
          },
          {
            label: '商常客流量',
            value: 1,
          },
          {
            label: '竞品密度',
            value: 2,
          },
          {
            label: '品牌密度',
            value: 3,
          },
          {
            label: '成本',
            value: 4,
          },
          {
            label: '目标人群占比（覆盖率）',
            value: 5,
          },
          {
            label: '目标人群TGI（浓度）',
            value: 6,
          },
          {
            label: '交通',
            value: 7,
          },
          {
            label: '消费水平定位',
            value: 8,
          },
        ],
      }
      this.dialogFormData = data
    },
    //关闭弹窗
    closeFrom(val) {
      this.dialogFormVisible = val
    },
    downloadReportFile() {},
  },
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  :last-child {
    margin-left: auto;
    margin-right: 0;
  }
}
.city {
  font-weight: 900;
  margin-bottom: 8px;
}
.setting {
  color: #418ff6;
  cursor: pointer;
  font-size: 18px;
  margin-left: 5px;
  padding: 3px;
  border-radius: 3px;
  background: linear-gradient(120deg, #e6f3fd 50%, #f5e4ff 100%);
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
    flex: 1;
  }
  .right_box {
    height: auto;
    // overflow-y: auto;
    // flex: 1;
    // width: 320px;
    width: 250px;
    padding: 10px;
  }
  .label {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .setting_box {
    margin-bottom: 20px;
  }
}
.data_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: #666666;
  :nth-child(n + 1) {
    margin-right: 5px;
  }
  :last-child {
    margin-right: 0;
  }
  .dataBox1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    -webkit-transform: scale(0.95);
    width: 75px;
    height: 55px;
    background: linear-gradient(
      65deg,
      rgba(160, 255, 252, 0.11) 0%,
      rgba(102, 184, 255, 0.21) 100%
    );
    border: 1px solid rgba(104, 183, 255, 0.13);
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 0 5px;
    :nth-child(n + 1) {
      margin-bottom: 5px;
    }
    span {
      font-size: 10px !important;
      font-weight: 600;
      color: #333333;
    }
  }
}
.dataBox2 {
  height: 68px;
  background: linear-gradient(
    41deg,
    #f5e4ff 0%,
    rgba(202, 229, 255, 0.48) 100%
  );
  box-shadow: 0px 0px 4px 0px rgba(185, 214, 255, 0.18);
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  white-space: nowrap;
  padding: 20px;
  :nth-child(n + 1) {
    margin-bottom: 5px;
  }
  span {
    font-size: 12px;
    font-weight: 600;
    color: #333333;
  }
}
.mapImg {
  padding: 5px;
}
.mapImgHover {
  padding: 5px;
  border: 1px solid #1296db;
}
.content {
  text-align: center;
  .count_box {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    .count {
      color: #66b1ff;
      margin: 0 10px;
      font-size: 18px;
      font-weight: 900;
    }
  }
}
::v-deep .content .el-form-item__label {
  width: 80px !important;
}
::v-deep .tabs .el-tabs__item {
  font-size: 12px;
  font-weight: 600;
  padding: 0 15px;
}
</style>
