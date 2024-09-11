<!-- 商场对比分析 -->
<template>
  <div>
    <el-card class="father-card">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="商场信息" name="first">
          <div v-if="activeName == 'first' && firstShow">
            <div>
              <headline>商场信息</headline>
              <AMap ref="child" height="300px" />
              <div class="detail-box">
                <el-card
                  class="market-box"
                  v-for="(item, i) in firstData.marketDetail"
                >
                  <div class="title">{{ item.marketName }}</div>
                  <div>详细地址：{{ item.address || '--' }}</div>
                  <div>
                    建筑面积：{{
                      item.commerceArea ? item.commerceArea + '万㎡' : '--'
                    }}
                  </div>
                  <div>
                    开业时长：{{
                      item.openDuration ? item.openDuration + '年' : '--'
                    }}
                  </div>
                  <div>租金均价：{{ item.rent || '--' }}</div>
                  <div style="font-weight: 600;">评估指标：</div>
                  <div class="second-content">
                    <div>
                      工作日均客流指数：{{
                        item.workDailyPassengerFlow.toFixed(2) || '--'
                      }}
                    </div>
                    <div>
                      节假日均客流指数：{{
                        item.weekDailyPassengerFlow.toFixed(2) || '--'
                      }}
                    </div>
                    <div>
                      周边3km居住人口：{{
                        item.threeKMLivePopulation
                          ? thousandFormat(item.threeKMLivePopulation) + '人'
                          : '--'
                      }}
                    </div>
                    <div>
                      周边3km工作人口：{{
                        item.threeKMWorkPopulation
                          ? thousandFormat(item.threeKMWorkPopulation) + '人'
                          : '--'
                      }}
                    </div>
                    <div>
                      目标人群渗透率：{{
                        item.targetCrowdPenetrance.toFixed(2) + '%' || '--'
                      }}
                    </div>
                    <div>
                      1km内公交站点：{{
                        item.busStationNum ? item.busStationNum + '个' : '--'
                      }}
                    </div>
                    <div>
                      1km内地铁站点：{{
                        item.subwayStationNum
                          ? item.subwayStationNum + '个'
                          : '--'
                      }}
                    </div>
                    <div>
                      1km内停车场：{{
                        item.parkNum ? item.parkNum + '个' : '--'
                      }}
                    </div>
                    <div>商场成熟度类型：{{ item.ripenessType || '--' }}</div>
                  </div>
                </el-card>
              </div>
            </div>
            <div>
              <el-card v-if="firstData.passengerFlowInfo">
                <headline>客流信息</headline>
                <myLine
                  ref="echarts"
                  :data="firstData.passengerFlowInfo.dataList"
                  :xAxis="firstData.passengerFlowInfo.xaxis"
                  :xLength="10"
                  yName="单位：万人"
                />
              </el-card>
              <div class="fixe_line">
                <el-card
                  class="two_column"
                  v-if="firstData.passengerFlowDistribution"
                >
                  <headline>客流分布情况</headline>
                  <ColumnLine
                    ref="echarts"
                    :data="firstData.passengerFlowDistribution.dataList"
                    :xAxis="firstData.passengerFlowDistribution.xaxis"
                    :xLength="10"
                    stack
                    :yName="['单位：万人']"
                  />
                </el-card>
                <el-card
                  class="two_column"
                  v-if="firstData.surroundingPopulation"
                >
                  <headline>周边人口组成</headline>
                  <ColumnLine
                    ref="echarts"
                    :data="firstData.surroundingPopulation.dataList"
                    :xAxis="firstData.surroundingPopulation.xaxis"
                    :xLength="10"
                    stack
                    :yName="['单位：万人']"
                  />
                </el-card>
                <el-card class="two_column" v-if="firstData.trafficMating">
                  <headline>交通配套情况（1km）</headline>
                  <ColumnLine
                    ref="echarts"
                    :data="firstData.trafficMating.dataList"
                    :xAxis="firstData.trafficMating.xaxis"
                    :xLength="10"
                  />
                </el-card>
                <el-card class="two_column" v-if="firstData.peripheralMaturity">
                  <headline>周边成熟度（5km）</headline>
                  <ColumnLine
                    ref="echarts"
                    :data="firstData.peripheralMaturity.dataList"
                    :xAxis="firstData.peripheralMaturity.xaxis"
                    :xLength="10"
                  />
                </el-card>
              </div>
              <div class="column-box">
                <el-card
                  v-for="(item, index) in firstData.commercialGroup"
                  :key="'commercialGroup' + index"
                  v-if="item.data"
                >
                  <headline>{{ item.name }}业态组成</headline>
                  <PIE
                    ref="echarts"
                    :data="item.data"
                    labelPosition="outside"
                    legendPosition="bottom"
                  />
                </el-card>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无数据" />
        </el-tab-pane>
        <el-tab-pane label="画像" name="second">
          <div v-if="activeName == 'second' && secondShow">
            <div class="fixe_line">
              <el-card class="two_column" v-if="secondData.genderVO">
                <headline>年龄分布</headline>
                <ColumnLine
                  ref="echarts"
                  :data="secondData.genderVO.dataList"
                  :xAxis="secondData.genderVO.xaxis"
                  :xLength="10"
                  units="%"
                />
              </el-card>
              <el-card class="two_column" v-if="secondData.ageDistributeVO">
                <headline>年龄段分布</headline>
                <ColumnLine
                  ref="echarts"
                  :data="secondData.ageDistributeVO.dataList"
                  :xAxis="secondData.ageDistributeVO.xaxis"
                  :xLength="10"
                  units="%"
                />
              </el-card>
              <el-card class="two_column" v-if="secondData.isMarried">
                <headline>已婚客群占比</headline>
                <PIE ref="echarts" :data="secondData.isMarried" multiple />
              </el-card>
              <el-card class="two_column" v-if="secondData.haveChild">
                <headline>已育客群占比</headline>
                <PIE ref="echarts" :data="secondData.haveChild" multiple />
              </el-card>
              <el-card
                class="two_column"
                v-if="secondData.childrenAgeDistributeVO"
              >
                <headline>已育人群孩子年龄段分布</headline>
                <ColumnLine
                  ref="echarts"
                  :data="secondData.childrenAgeDistributeVO.dataList"
                  :xAxis="secondData.childrenAgeDistributeVO.xaxis"
                  :xLength="15"
                  units="%"
                />
              </el-card>
              <el-card class="two_column" v-if="secondData.haveHouseCustomer">
                <headline>有房客群量对比</headline>
                <Column
                  ref="echarts"
                  :data="secondData.haveHouseCustomer.dataList"
                  :xAxis="secondData.haveHouseCustomer.xaxis"
                  :xLength="10"
                  horizontal
                  :legendShow="false"
                  labelShow
                  labelPosition="right"
                  :grid="[10, 65]"
                />
              </el-card>
              <!--
              <el-card class="two_column" v-if="secondData.incomeLevel">
                <headline>收入等级分布</headline>
                <ColumnLine
                  ref="echarts"
                  :data="secondData.incomeLevel.dataList"
                  :xAxis="secondData.incomeLevel.xaxis"
                  :xLength="10"
                  units="%"
                />
              </el-card>
              <el-card class="two_column" v-if="secondData.consumptionLevel">
                <headline>消费等级分布</headline>
                <ColumnLine
                  ref="echarts"
                  :data="secondData.consumptionLevel.dataList"
                  :xAxis="secondData.consumptionLevel.xaxis"
                  :xLength="10"
                />
              </el-card>
              -->
            </div>
            <div class="column-box">
              <el-card v-if="secondData.incomeLevel">
                <headline>收入等级分布</headline>
                <ColumnLine
                  ref="echarts"
                  :data="secondData.incomeLevel.dataList"
                  :xAxis="secondData.incomeLevel.xaxis"
                  :xLength="10"
                  units="%"
                />
              </el-card>
              <el-card v-if="secondData.consumptionLevel">
                <headline>消费等级分布</headline>
                <ColumnLine
                  ref="echarts"
                  :data="secondData.consumptionLevel.dataList"
                  :xAxis="secondData.consumptionLevel.xaxis"
                  :xLength="10"
                />
              </el-card>
            </div>
          </div>
          <el-empty v-else description="暂无数据" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import {
  getMarketcontrast,
  getShopContrastData,
  getShopContrastAudience,
} from '@/api/sceneApplication'
import { deleteSign } from '@/utils/public'
import AMap from '@/components/MapContainer/AMap'
import ColumnLine from '@/components/echarts/ColumnLine.vue'
import myLine from '@/components/echarts/Line.vue'
import Column from '@/components/echarts/column.vue'
import PIE from '@/components/echarts/Pie.vue'
import { thousandFormat, bMapTransAMap } from '@/utils/public'
export default {
  components: {
    AMap,
    ColumnLine,
    myLine,
    Column,
    PIE,
  },
  data() {
    return {
      data: this.$route.query.data, //页面传参
      thousandFormat: thousandFormat,
      activeName: 'first', //tab
      firstData: {}, //tab1数据
      secondData: {}, //tab2数据
      firstShow: false,
      secondShow: false,
    }
  },
  mounted() {
    this.getFirstData()
    this.getSecondData()
  },
  methods: {
    async getFirstData() {
      let params = {
        shopIds: this.data,
      }
      // let res = await getMarketcontrast(params)
      // if (res.status == 200) {
      let res = await getShopContrastData(params)
      if (res.code == 200) {
        if (
          res.data.commercialGroup.length > 0 &&
          res.data.marketDetail &&
          res.data.passengerFlowDistribution &&
          res.data.passengerFlowInfo &&
          res.data.peripheralMaturity &&
          res.data.surroundingPopulation &&
          res.data.trafficMating
        ) {
          this.firstShow = true
          res.data.commercialGroup?.forEach((e) => {
            if (e.data) {
              e.data.forEach((el) => {
                el.value = (Number(el.value) * 100).toFixed(2)
              })
            }
          })
          this.firstData = res.data
          let pois = []
          this.firstData.marketDetail.forEach((e) => {
            pois.push({
              name: e.marketName,
              location: bMapTransAMap([e.lng, e.lat]),
            })
          })
          this.$nextTick(() => {
            this.$refs.child.addMarker({
              poi: pois,
              color: 'red',
              url: require('@/assets/images/slices/map_shop.png'),
            })
          })
          console.log(res.data)
        } else {
          this.firstShow = false
        }
      }
    },
    async getSecondData() {
      let res = await getShopContrastAudience({
        shopIds: this.data,
      })
      if (res.code == 200) {
        if (
          res.data.haveChild.length > 0 &&
          res.data.isMarried.length > 0 &&
          res.data.ageDistributeVO &&
          res.data.childrenAgeDistributeVO &&
          res.data.genderVO &&
          res.data.haveHouseCustomer &&
          res.data.incomeLevel
        ) {
          this.secondShow = true
          //年龄段分布
          res.data.ageDistributeVO?.dataList?.forEach((e) => {
            if (e.cdata) {
              e.cdata = deleteSign(e.cdata, '%')
            }
          })
          //年龄分布
          res.data.genderVO?.dataList?.forEach((e) => {
            if (e.cdata) {
              e.cdata = deleteSign(e.cdata, '%')
            }
          })
          //已育人群孩子年龄段分布
          res.data.childrenAgeDistributeVO?.dataList?.forEach((e) => {
            if (e.cdata) {
              e.cdata = deleteSign(e.cdata, '%')
            }
          })
          //收入等级
          res.data.incomeLevel?.dataList?.forEach((e) => {
            if (e.cdata) {
              e.cdata = deleteSign(e.cdata, '%')
            }
          })
          //已婚客群占比
          res.data.isMarried = deleteSign(res.data.isMarried, '%', 'value')
          //已育客群占比
          res.data.haveChild = deleteSign(res.data.haveChild, '%', 'value')
          console.log(res.data, '画像数据')
          this.secondData = res.data
        } else {
          this.secondShow = false
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.detail-box {
  display: flex;
  margin: 10px 0;
  .title {
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
  }
  .market-box {
    flex: 1;
    margin-right: 10px;
    :nth-child(n + 1) {
      margin-bottom: 10px;
    }
    :last-child {
      margin-bottom: 0;
    }
  }
  .second-content {
    margin-left: 25px;
  }
  :last-child {
    margin-right: 0;
  }
}
.column-box {
  display: flex;
  .el-card {
    margin-right: 10px;
    flex: 1;
  }
  :last-child {
    margin-right: 0;
  }
}
::v-deep .tabs .el-tabs__item {
  font-size: 14px;
  font-weight: 600;
}
</style>
