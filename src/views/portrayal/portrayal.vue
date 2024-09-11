<!-- 人群画像 -->
<template>
  <div>
    <el-card class="father-card">
      <div class="topBox">
        <el-image :src="topBoxUrl[0]"></el-image>
        <span class="name">{{ data.portraitReportName }}</span>
        <el-image
          style="cursor: pointer;"
          :src="topBoxUrl[1]"
          @click="downloadReportFile"
        ></el-image>
        <el-image
          style="cursor: pointer;"
          :src="topBoxUrl[2]"
          @click="dialogVisible = true"
        ></el-image>
        <!--<i class="el-icon-camera picture" @click="pdfDownload(activeName)"></i>-->
        <div class="lastChild" style="font-size: 12px; color: #666666;">
          统计时间截止：{{ sampleSizeAndCoverageVO.statistDeadline }}
        </div>
      </div>
      <div class="dataBox_0">
        <div class="dataBox_1" ref="imageTofile1">
          <el-image
            style="width: 97px; height: 86px;"
            :src="dataBoxUrl[0]"
          ></el-image>
          <div>
            <div class="label">总样本量</div>
            <div>
              <span class="rate">
                {{
                  sampleSizeAndCoverageVO.sampleSize
                    ? thousandFormat(sampleSizeAndCoverageVO.sampleSize)
                    : 0
                }}
              </span>
              人
            </div>
          </div>
        </div>
        <div class="dataBox_1" ref="imageTofile2">
          <el-image
            style="width: 97px; height: 86px;"
            :src="dataBoxUrl[1]"
          ></el-image>
          <div>
            <div class="label">可洞察样本覆盖率</div>
            <div>
              <span class="rate">
                {{ sampleSizeAndCoverageVO.coverage || 0 }}
              </span>
              %
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="first" v-if="basicShow">
            <div class="chartsBox_0" v-if="activeName == 'first'">
              <div
                class="chartsCard template"
                v-if="basic.genderShow"
                ref="imageTofile3"
              >
                <!--
                <i
                  class="el-icon-circle-close"
                  style="color: #c0c4cc; float: right;"
                  @click="basic.genderShow = !basic.genderShow"
                ></i>
                -->
                <headline>性别分布</headline>
                <div class="chartsBox_1">
                  <el-image
                    style="width: 60px; height: 63px;"
                    :src="chartsBoxUrl[0]"
                  ></el-image>
                  <div class="progress">
                    <el-progress
                      :show-text="false"
                      :percentage="Number(basicInformVO.genderVO.manProPort)"
                      :color="customColor"
                      class="manProgress"
                    ></el-progress>
                    <div class="manData">
                      <span>占比</span>
                      <span class="manFont">
                        {{ basicInformVO.genderVO.manProPort || 0 }}
                      </span>
                      %
                      <span style="margin-left: 5px;">TGI</span>
                      <span class="manFont">
                        {{ basicInformVO.genderVO.manTGI || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="chartsBox_2">
                  <el-image
                    style="width: 60px; height: 63px;"
                    :src="chartsBoxUrl[1]"
                  ></el-image>
                  <div class="progress">
                    <el-progress
                      :show-text="false"
                      :percentage="Number(basicInformVO.genderVO.femaleProPort)"
                      :color="customColor"
                      class="womanProgress"
                    ></el-progress>
                    <div class="womanData">
                      <span>占比</span>
                      <span class="womanFont">
                        {{ basicInformVO.genderVO.femaleProPort || 0 }}
                      </span>
                      %
                      <span style="margin-left: 5px;">TGI</span>
                      <span class="womanFont">
                        {{ basicInformVO.genderVO.femaleTGI || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="chartsCard template"
                v-if="basic.yearShow"
                ref="imageTofile4"
              >
                <!--
                <i
                  class="el-icon-circle-close"
                  style="color: #c0c4cc; float: right;"
                  @click="basic.yearShow = !basic.yearShow"
                ></i>
                -->
                <headline>年龄分布</headline>
                <Column
                  :data="basicInformVO.ageDistributeVO.ageList"
                  :xAxis="basicInformVO.ageDistributeVO.agexAxis"
                />
              </div>
              <div
                class="chartsCard template"
                v-if="basic.familyShow"
                ref="imageTofile5"
              >
                <!--
                <i
                  class="el-icon-circle-close"
                  style="color: #c0c4cc; float: right;"
                  @click="basic.familyShow = !basic.familyShow"
                ></i>
                -->
                <headline>家庭情况</headline>
                <div style="display: flex;">
                  <Gauge
                    :type="0"
                    text="已婚"
                    :data="
                      Number(
                        Number(basicInformVO.familyConduitVO.marry).toFixed(2),
                      )
                    "
                    :imageUrl="require('@/assets/images/slices/marry_1.png')"
                    :axisWidth="22"
                    :fontSize="18"
                  />
                  <Gauge
                    :type="1"
                    text="有小孩"
                    :data="
                      Number(
                        Number(
                          basicInformVO.familyConduitVO.haveChildren,
                        ).toFixed(2),
                      )
                    "
                    :imageUrl="require('@/assets/images/slices/child_2.png')"
                    :axisWidth="22"
                    :fontSize="18"
                  />
                </div>
              </div>
              <div class="chartsCard template" v-if="basic.incomeShow">
                <!--
                <i
                  class="el-icon-circle-close"
                  style="color: #c0c4cc; float: right;"
                  @click="basic.incomeShow = !basic.incomeShow"
                ></i>
                -->
                <headline>收入水平</headline>
                <Column
                  :data="basicInformVO.incomeLevelVo.incomeLevelList"
                  :xAxis="basicInformVO.incomeLevelVo.incomeLevelxAxis"
                />
              </div>
              <div
                class="chartsCard template"
                v-if="basic.consumeShow"
                ref="imageTofile6"
              >
                <!--
                <i
                  class="el-icon-circle-close"
                  style="color: #c0c4cc; float: right;"
                  @click="basic.consumeShow = !basic.consumeShow"
                ></i>
                -->
                <headline>消费水平</headline>
                <Column
                  :data="basicInformVO.consumptionLevelVO.consumptionLevelList"
                  :xAxis="
                    basicInformVO.consumptionLevelVO.consumptionLevelxAxis
                  "
                />
              </div>
              <div class="chartsCard template" v-if="basic.houseShow">
                <!--
                <i
                  class="el-icon-circle-close"
                  style="color: #c0c4cc; float: right;"
                  @click="basic.houseShow = !basic.houseShow"
                ></i>
                -->
                <headline>是否有房</headline>
                <Gauge
                  :type="0"
                  text="有房"
                  :data="basicInformVO.house"
                  :imageUrl="require('@/assets/images/slices/house_1.png')"
                  :fontSize="20"
                />
              </div>
            </div>
            <div class="chartsCard" v-if="basic.careerShow" ref="imageTofile7">
              <!--
              <i
                class="el-icon-circle-close"
                style="color: #c0c4cc; float: right;"
                @click="basic.careerShow = !basic.careerShow"
              ></i>
              -->
              <headline>
                职业TOP{{ basicInformVO.occurDistributeVO.occurxAxis.length }}
                分布
              </headline>
              <Column
                v-if="activeName == 'first'"
                :data="basicInformVO.occurDistributeVO.occurList"
                :xAxis="basicInformVO.occurDistributeVO.occurxAxis"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="热力分布" name="second" v-if="heatMap == 1">
            <div class="chartsCard" ref="imageTofile10">
              <div>
                <AMap :heatmapData="heatData" :isFullScreen="true"></AMap>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="区域分布" name="third" v-if="regionShow">
            <div
              v-if="activeName == 'third'"
              class="areaBox"
              ref="imageTofile11"
            >
              <div class="chartsCard">
                <div>
                  <MapContainer
                    :areaData="regionDistributeVO"
                    @change="cityChange"
                  ></MapContainer>
                </div>
                <!--
                  <div>
                    <AMap :heatmapData="heatData"></AMap>
                  </div>
                -->
              </div>

              <div class="rankBox">
                <div class="chartsCard">
                  <headline>
                    城市等级分布
                  </headline>
                  <PIE
                    :data="regionDistributeVO.cityLevelPieChartVOList"
                    labelPosition="outside"
                    legendPosition="bottom"
                  />
                </div>
                <div
                  class="chartsCard"
                  style="margin-top: 10px; min-height: 410px;"
                >
                  <headline>
                    潜客热点居住地TOP 10
                  </headline>
                  <div class="cityTop10" v-for="(item, index) in cityList">
                    <div style="flex: 1;">
                      {{ item.num < 10 ? '0' + item.num : item.num }}.
                    </div>
                    <div style="flex: 2;">{{ item.name }}</div>
                    <div class="city_progress" style="">
                      <el-progress
                        class="city"
                        :text-inside="true"
                        :stroke-width="15"
                        :percentage="Number(item.value)"
                      ></el-progress>
                      <div>{{ item.tgi }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="人群偏好" name="fourth" v-if="preferShow">
            <div v-if="activeName == 'fourth'">
              <div style="display: flex;">
                <div
                  class="chartsCard"
                  style="flex: 1; margin-right: 10px;"
                  v-if="preference.onlineBehaviorShow"
                  ref="imageTofile12"
                >
                  <!--
                  <i
                    class="el-icon-circle-close"
                    style="color: #c0c4cc; float: right;"
                    @click="
                      preference.onlineBehaviorShow = !preference.onlineBehaviorShow
                    "
                  ></i>
                  -->
                  <headline>APP受众率</headline>
                  <Gauge
                    :type="0"
                    text="受众率"
                    :imageUrl="require('@/assets/images/slices/cover.png')"
                    :data="Number(crowdPreferVO.audienceRate)"
                    :fontSize="20"
                  />
                  <div class="fractionNum">
                    <div>app覆盖人数</div>
                    <div>
                      {{
                        crowdPreferVO.numberPeopleCover
                          ? thousandFormat(crowdPreferVO.numberPeopleCover)
                          : 0
                      }}
                    </div>
                  </div>
                </div>
                <div class="chartsCard" style="flex: 3;" ref="imageTofile13">
                  <!--
                  <i
                    class="el-icon-circle-close"
                    style="color: #c0c4cc; float: right;"
                  ></i>
                  -->
                  <headline>兴趣偏好</headline>
                  <WordCloud :data="crowdPreferVO.wordCloudVOList" />
                </div>
                <!--
                <el-card style="flex: 3;" v-if="preference.appValueShow">
                  <i
                    class="el-icon-circle-close"
                    style="color: #c0c4cc; float: right;"
                    @click="preference.appValueShow = !preference.appValueShow"
                  ></i>
                  <headline>最具价值app推荐</headline>
                  <div class="cardBanner">
                    <div class="appCard">
                      <div
                        class="appBox flexd"
                        v-for="(item, index) in crowdPreferVO.recommendAppList"
                      >
                        <div class="app_top">
                          <el-image
                            style="
                              width: 64px;
                              height: 67px;
                              border-radius: 10px;
                              margin-left: 25px;
                              margin-top: 15px;
                            "
                            :src="item.imgUrl"
                          ></el-image>
                          <div class="appValueBox">
                            <div class="first_text">{{ item.appName }}</div>
                            <div class="second_text">
                              价值分
                              <span style="color: #418ff6;">
                                {{ item.valueScoreRank }}
                              </span>
                            </div>
                          </div>
                          <div class="appScoreBox">
                            <div class="first_score">
                              {{ item.valueScore }}
                            </div>
                            <div class="second_score">总体评分</div>
                          </div>
                        </div>
                        <div class="app_bottom">
                          <div class="bottomBox">
                            <div>
                              {{ item.coverageRate }}
                              <span>%</span>
                            </div>
                            <div>
                              覆盖率
                              <span>
                                {{ item.activeRank ? item.activeRank : 0 }}
                              </span>
                            </div>
                          </div>
                          <div class="bottomBox">
                            <div>
                              {{ item.TGI ? item.TGI : 0 }}
                            </div>
                            <div>
                              TGI
                              <span>{{ item.TGIRate ? item.TGIRate : 0 }}</span>
                            </div>
                          </div>
                          <div class="bottomBox">
                            <div>
                              {{ item.active ? item.active : 0 }}
                              <span>%</span>
                            </div>
                            <div>
                              活跃率
                              <span>
                                {{ item.activeRate ? item.activeRate : 0 }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <i
                      class="el-icon-caret-left arrow-left"
                      @click="toggleFun(-1)"
                    />
                    <i
                      class="el-icon-caret-right arrow-right"
                      @click="toggleFun(1)"
                    />
                  </div>
                </el-card>
                -->
              </div>
              <div style="display: flex;">
                <div
                  class="preferenceBox chartsCard"
                  style="margin-right: 10px;"
                  v-if="preference.activeAppShow"
                  ref="imageTofile14"
                >
                  <!--
                  <i
                    class="el-icon-circle-close"
                    style="color: #c0c4cc; float: right;"
                    @click="
                      preference.activeAppShow = !preference.activeAppShow
                    "
                  ></i>
                  -->
                  <headline>高活跃度app类别</headline>
                  <Column
                    :data="crowdPreferVO.top10CategoryVO.categoryList"
                    :xAxis="crowdPreferVO.top10CategoryVO.categoryXAxis"
                  />
                </div>
                <div
                  class="preferenceBox chartsCard"
                  v-if="preference.activeAppTOPShow"
                  ref="imageTofile15"
                >
                  <!--
                  <i
                    class="el-icon-circle-close"
                    style="color: #c0c4cc; float: right;"
                    @click="
                      preference.activeAppTOPShow = !preference.activeAppTOPShow
                    "
                  ></i>
                  -->
                  <headline>高活跃度TOP10 app</headline>
                  <Column
                    :data="crowdPreferVO.top10AppChartVO.top10AppList"
                    :xAxis="crowdPreferVO.top10AppChartVO.top10AppxAxis"
                  />
                </div>
              </div>
              <div
                class="chartsBox_0"
                style="display: flex; flex-wrap: nowrap;"
              >
                <div
                  class="chartsCard"
                  style="flex: 1; margin-right: 10px;"
                  v-if="preference.networkShow"
                  ref="imageTofile16"
                >
                  <!--
                  <i
                    class="el-icon-circle-close"
                    style="color: #c0c4cc; float: right;"
                    @click="preference.networkShow = !preference.networkShow"
                  ></i>
                  -->
                  <headline>手机网络</headline>
                  <PIE
                    :data="crowdPreferVO.serviceProvidePieChartVOList"
                    labelPosition="outside"
                    legendPosition="bottom"
                  />
                </div>
                <div
                  class="chartsCard"
                  style="flex: 2;"
                  v-if="preference.phoneBrandShow"
                  ref="imageTofile17"
                >
                  <!--
                  <i
                    class="el-icon-circle-close"
                    style="color: #c0c4cc; float: right;"
                    @click="
                      preference.phoneBrandShow = !preference.phoneBrandShow
                    "
                  ></i>
                  -->
                  <headline>手机品牌偏好</headline>
                  <Column
                    :data="
                      crowdPreferVO.top10PhoneBrandChartVO.top10PhoneBrandList
                    "
                    :xAxis="
                      crowdPreferVO.top10PhoneBrandChartVO.top10PhoneBrandxAxis
                    "
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        class="newadd"
        title=""
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
      >
        <el-form ref="formData" :model="emailForm" :rules="rules">
          <el-form-item prop="email">
            <div
              class="demo-input-suffix"
              style="display: flex; align-items: center;"
            >
              <div style="min-width: 90px;">发送至邮箱：</div>
              <el-input
                v-model.trim="emailForm.email"
                type="textarea"
                :autosize="{ minRows: 1 }"
                placeholder="请输入邮箱"
                style="width: 100%;"
                clearable
              />
              <span
                class="dialog-footer"
                style="display: flex; margin-left: 15px;"
              >
                <el-button @click="handleClose()">取 消</el-button>
                <el-button type="primary" @click="sendEmail('formData')">
                  确定
                </el-button>
              </span>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import {
  getThermalMap,
  getInsightVo,
  downloadReportFile,
  generalPdf,
} from '@/api/report'
import { shareReportByEmail } from '@/api/crowdInsight'
import { downloadFile } from '@/utils/file'
import { thousandFormat } from '@/utils/public'
import Column from '@/components/echarts/ColumnLine.vue'
import Gauge from '@/components/echarts/Gauge.vue'
import PIE from '@/components/echarts/Pie.vue'
import WordCloud from '@/components/echarts/WordCloud.vue'
import AMap from '@/components/MapContainer/AMap'
import MapContainer from '@/components/MapContainer/MapContainer'
export default {
  components: {
    Column,
    Gauge,
    PIE,
    WordCloud,
    AMap,
    MapContainer,
  },
  filters: {
    status(status) {
      let res = ''
      if (status == 0) res = '已禁用'
      else if (status == 1) res = '已启用'
      return res
    },
  },
  data() {
    let validateEmail = (rule, value, callback) => {
      var reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/
      if (!reg.test(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    return {
      data: this.$route.query,
      thousandFormat: thousandFormat,
      dialogVisible: false, //分享报告弹窗
      emailForm: {
        reportId: this.$route.query.id,
        email: '', //邮箱
      }, //分享报告--发送邮箱
      email: '', //发送邮件
      crowdName: '',
      activeName: 'first', //tab
      isContainer: 1,
      //顶部按钮图标
      topBoxUrl: [
        require('@/assets/images/slices/computer.svg'),
        require('@/assets/images/slices/download.svg'),
        require('@/assets/images/slices/share.svg'),
      ],
      //顶部信息图
      dataBoxUrl: [
        require('@/assets/images/slices/client.png'),
        require('@/assets/images/slices/statistics.png'),
      ],
      //基本信息性别
      chartsBoxUrl: [
        require('@/assets/images/slices/man.png'),
        require('@/assets/images/slices/woman.png'),
      ],
      basic: {
        genderShow: false, //性别
        yearShow: false, //年龄分布
        familyShow: false, //家庭情况
        incomeShow: false, //收入水平
        consumeShow: false, //消费水平
        houseShow: false, //有房
        careerShow: false, //职业
      }, //基础信息图显示
      preference: {
        onlineBehaviorShow: false, //线上行为
        appValueShow: false, //最具价值app
        activeAppShow: false, //高活跃app
        activeAppTOPShow: false, //高活跃top10app
        networkShow: false, //手机网络
        phoneBrandShow: false, //手机品牌偏好
      }, //人群偏好图显示
      sampleSizeAndCoverageVO: {}, //头部数据
      basicInformVO: [], //基础信息数据
      heatData: [], //热力图数据
      regionDistributeVO: {}, //行政图
      cityList: [], //城市排名列表
      crowdPreferVO: [], //人群偏好数据
      customColor: '',
      heatMap: '0', //是否热力图
      basicShow: false,
      preferShow: false,
      regionShow: false,
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail },
        ],
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    //app卡片左右切换
    toggleFun(p) {
      this.crowdPreferVO.recommendAppList = this.crowdPreferVO.recommendAppList.map(
        (item, index, array) => {
          if (index === array.length - 1 && p === 1) {
            item = array[0]
          } else if (index === 0 && p === -1) {
            item = array[array.length - 1]
          } else {
            item = array[index + p]
          }
          return item
        },
      )
    },
    async getList() {
      //this.data.id
      getInsightVo({ reportId: this.data.id }).then((res) => {
        console.log(res, '基础信息报告')
        //头部数据
        this.sampleSizeAndCoverageVO = res.data.sampleSizeAndCoverageVO
        this.sampleSizeAndCoverageVO.statistDeadline = res.data.statistDeadline
        //基础数据
        // this.basicInformVO = res.data.basicInformVO
        if (res.data.basicInform == 1) {
          this.basicInformVO = res.data.basicInformVO
          this.basicShow = true
        } else {
          this.basicShow = false
        }
        //人群偏好数据
        // this.crowdPreferVO = res.data.crowdPreferVO
        if (res.data.crowdPrefer == 1) {
          this.crowdPreferVO = res.data.crowdPreferVO
          this.preferShow = true
        } else {
          this.preferShow = false
        }
        //是否显示热力图
        this.heatMap = res.data.heatMap
        if (this.heatMap == 1) {
          getThermalMap(this.data.id).then((res) => {
            console.log(res.data, '热力图')
            if (res.code == 200) {
              this.heatData = res.data != null ? res.data : []
            }
          })
        }
        //区域分布数据
        if (res.data.regionDistribute == 1) {
          res.data.regionDistributeVO?.cityTop10VOList?.forEach(
            (item, index) => {
              item['num'] = index + 1
            },
          )
          this.regionDistributeVO = res.data.regionDistributeVO
          this.cityList = this.regionDistributeVO.cityTop10VOList
          this.regionShow = true
        } else {
          this.regionShow = false
        }
        //判断tab默认选中
        if (this.basicShow) {
          this.activeName = 'first'
        } else if (!this.basicShow && this.heatMap == 1) {
          this.activeName = 'second'
        } else if (
          !this.basicShow &&
          this.heatMap == 0 &&
          this.regionDistributeVO.cityLevelPieChartVOList
        ) {
          this.activeName = 'third'
        } else {
          this.activeName = 'fourth'
        }
        //判断基础信息图像显示
        if (this.basicShow) {
          this.basicInformVO.genderVO
            ? (this.basic.genderShow = true)
            : (this.basic.genderShow = false)
          this.basicInformVO.ageDistributeVO
            ? (this.basic.yearShow = true)
            : (this.basic.yearShow = false)
          this.basicInformVO.familyConduitVO
            ? (this.basic.familyShow = true)
            : (this.basic.familyShow = false)
          this.basicInformVO.incomeLevelVo
            ? (this.basic.incomeShow = true)
            : (this.basic.incomeShow = false)
          this.basicInformVO.consumptionLevelVO
            ? (this.basic.consumeShow = true)
            : (this.basic.consumeShow = false)
          this.basicInformVO.house
            ? (this.basic.houseShow = true)
            : (this.basic.houseShow = false)
          this.basicInformVO.occurDistributeVO
            ? (this.basic.careerShow = true)
            : (this.basic.careerShow = false)
        }
        //判断人群偏好图像显示
        if (this.preferShow) {
          this.crowdPreferVO.audienceRate
            ? (this.preference.onlineBehaviorShow = true)
            : (this.preference.onlineBehaviorShow = false)
          this.crowdPreferVO.recommendAppList
            ? (this.preference.appValueShow = true)
            : (this.preference.appValueShow = false)
          this.crowdPreferVO.top10CategoryVO
            ? (this.preference.activeAppShow = true)
            : (this.preference.activeAppShow = false)
          this.crowdPreferVO.top10AppChartVO
            ? (this.preference.activeAppTOPShow = true)
            : (this.preference.activeAppTOPShow = false)
          this.crowdPreferVO.serviceProvidePieChartVOList?.length > 0
            ? (this.preference.networkShow = true)
            : (this.preference.networkShow = false)
          this.crowdPreferVO.top10PhoneBrandChartVO
            ? (this.preference.phoneBrandShow = true)
            : (this.preference.phoneBrandShow = false)
        }
      })
      console.log(this.data, '传参')
    },
    //下载报告
    downloadReportFile() {
      downloadReportFile(this.data.id).then((res) => {
        const resData = res.data
        if (resData.size == 0) {
          this.$message.warning('暂无下载文件')
          return
        }
        downloadFile(res).then((e) => {
          if (e.code !== 200) {
            this.$message.error(`${e.msg}`)
          }
        })
      })
    },
    //热力图行政区图切换
    mapSwitch(num) {
      if (num == 0) {
        this.isContainer = 1
      } else {
        this.isContainer = 0
      }
    },
    //城市排名top15数据条
    setItemText(row) {
      return () => {
        return row
      }
    },
    //校验邮箱格式
    isEmail(val) {
      var reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/
      if (!reg.test(val)) {
        this.$message.warning('邮箱格式不正确！')
        return false
      }
    },
    //发送邮箱
    sendEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          shareReportByEmail(this.emailForm).then((res) => {
            if (res.code == 200) {
              this.$message.success('分享成功！')
            }
          })
          this.dialogVisible = false
        }
      })
    },
    //关闭弹窗
    handleClose() {
      this.emailForm.email = ''
      this.dialogVisible = false
    },
    //行政地图点击事件
    cityChange(val) {
      console.log(val, 'top10数据')
      this.cityList = val
      this.cityList.forEach((item, index) => {
        item['num'] = index + 1
      })
    },
    //快照点击事件
    async pdfDownload(tab) {
      console.log(tab, 'tab')
      let name = null
      let list = [] //要生成的dom列表
      var pageData = [] //生成的图片base64
      switch (tab) {
        case 'first':
          for (let i = 1; i <= 7; i++) {
            name = 'imageTofile' + i
            list.push(name)
          }
          for (let j = 0; j < list.length; j++) {
            let res = await this.toImage(list[j])
            pageData.push(res.pageData)
          }
          break
        case 'second':
          list = ['imageTofile1', 'imageTofile2', 'imageTofile10']
          for (let j = 0; j < list.length; j++) {
            let res = await this.toImage(list[j])
            pageData.push(res.pageData)
          }
          break
        case 'third':
          list = ['imageTofile1', 'imageTofile2', 'imageTofile11']
          for (let j = 0; j < list.length; j++) {
            let res = await this.toImage(list[j])
            pageData.push(res.pageData)
          }
          break
        case 'fourth':
          list = ['imageTofile1', 'imageTofile2']
          for (let i = 12; i <= 17; i++) {
            name = 'imageTofile' + i
            list.push(name)
          }
          for (let j = 0; j < list.length; j++) {
            let res = await this.toImage(list[j])
            pageData.push(res.pageData)
          }
          break
      }
      if (pageData.length > 0) {
        console.log(pageData, 'toImage结果')
        let params = {
          base64s: pageData,
          reportId: this.data.id,
          tagName:
            tab == 'first'
              ? '基础信息'
              : tab == 'second'
              ? '热力分布'
              : tab == 'third'
              ? '区域分布'
              : '人群偏好',
        }
        generalPdf(params).then((res) => {
          console.log(res, '下载pdf')
          const resData = res.data
          if (resData.size == 0) {
            this.$message.warning('暂无下载文件')
            return
          }
          downloadFile(res).then((e) => {
            if (e.code !== 200) {
              this.$message.error(`${e.msg}`)
            }
          })
        })
        pageData = []
      }
    },
    // 页面元素转图片
    toImage(name) {
      // 手动创建一个 canvas 标签
      const canvas = document.createElement('canvas')
      // 根据ref名称获取父标签，截取这个标签内的 DOM 元素生成图片
      let canvasBox = this.$refs[name]
      // 获取父级的宽高
      const width = parseInt(window.getComputedStyle(canvasBox).width)
      const height = parseInt(window.getComputedStyle(canvasBox).height)
      // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
      canvas.width = width * 2
      canvas.height = height * 2
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      const context = canvas.getContext('2d')
      context.scale(1, 1)
      const options = {
        scale: 2,
        backgroundColor: null,
        canvas: canvas,
        useCORS: true,
        width: width, //dom 原始宽度
        height: height,
      }
      return new Promise((resolve) => {
        html2canvas(canvasBox, options).then((canvas) => {
          // toDataURL 图片格式转成 base64
          var pageData = canvas.toDataURL('image/jpeg', 1.0)
          let data = {
            width: canvas.width,
            height: canvas.height,
            pageData: pageData,
          }
          resolve(data)
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
//卡片样式
.chartsCard {
  // margin: 0 6px;
  // min-width: 250px;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 3px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(39, 85, 145, 0.12);
  backdrop-filter: blur(32px);
}
.topBox {
  display: flex;
  align-items: center;
  .lastChild {
    margin-right: 0;
    margin-left: auto;
  }
}
.picture {
  color: #418ff6;
  cursor: pointer;
  font-size: 18px;
  margin-left: 5px;
  padding: 3px;
  border-radius: 3px;
  background: linear-gradient(120deg, #e6f3fd 50%, #f5e4ff 100%);
}
.name {
  color: #418ff6;
  margin: 0 10px;
}
//app排行框--暂时隐藏
.appBox {
  background: url('../../assets/images/slices/bg_1.png') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 199px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .app_top {
    display: flex;
    .appValueBox {
      margin: 25px 0 0 18px;
      .first_text {
        font-size: 18px;
        margin-bottom: 10px;
      }
      .second_text {
        font-size: 12px;
        padding: 3px 15px;
        border-radius: 10px;
        background-image: linear-gradient(to right, #e9f4ff, #f3e6ff);
      }
    }
    .appScoreBox {
      margin-left: auto;
      text-align: center;
      margin-top: 20px;
      padding-right: 35px;
      .first_score {
        font-size: 32px;
        color: #418ff6;
        margin-bottom: 5px;
      }
      .second_score {
        font-size: 12px;
        color: #5c5c5c;
      }
    }
  }
  .app_bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 20px 20px;
    .bottomBox {
      flex: 1 1 33.33%;
      div:nth-child(1) {
        font-size: 25px;
        font-weight: bold;
        margin-bottom: 10px;
        span:nth-child(1) {
          font-size: 18px;
        }
      }
      div:nth-child(2) {
        font-size: 12px;
        span {
          color: #418ff6;
        }
      }
    }
  }
}
.dataBox_0 {
  display: flex;
  margin: 25px 0;
}
.dataBox_1 {
  margin-right: 25px;
  padding: 10px 20px 10px 10px;
  border-radius: 3px;
  background: linear-gradient(40deg, #efedfe, #e6f3fd);
  display: flex;
  align-items: center;
  .label {
    font-size: 12px;
    // font-weight: 400;
    margin-bottom: 8px;
  }
  .rate {
    font-size: 18px;
    font-weight: 900;
  }
}
/*去掉tabs底部的下划线*/
::v-deep .el-tabs__nav-wrap::after {
  position: static !important;
}
::v-deep .el-tabs__item {
  font-weight: normal;
  font-size: 12px;
}
.fractionNum {
  display: flex;
  border: 1px solid #edf7ff;
  border-radius: 5px;
  margin-top: 10px;
  :nth-child(1) {
    color: #418ff6;
    background-color: #edf7ff;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    padding: 5px;
    font-size: 12px;
  }
  :nth-child(2) {
    padding: 5px;
    font-size: 12px;
    font-weight: 900;
  }
}
//兴趣偏好--活跃app
.preferenceBox {
  flex: 1;
}
.chartsBox_0 {
  display: flex;
  flex-wrap: wrap;
  //子盒子，设置为：
  .template {
    flex: 1;
    margin: 0 10px 10px 0; // 间隙为12px
    width: calc(
      (100% - 10px) / 2
    ); // 这里的25px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
    min-width: calc((100% - 10px) / 2); // 加入这两个后每个盒子的宽度就生效了
    max-width: calc((100% - 10px) / 2); // 加入这两个后每个盒子的宽度就生效了
    &:nth-child(2n) {
      // 去除第2个的margin-right
      margin-right: 0;
    }
  }
  //性别分布
  .chartsBox_1 {
    display: flex;
    margin-bottom: 25px;
    border: 1px solid rgba(104, 183, 255, 0.13);
    border-radius: 3px;
    .progress {
      flex: 1;
      margin: 0 12px;
      align-self: center;
    }
    .manData {
      font-size: 12px;
      margin-top: 7px;
    }
    .manFont {
      margin-left: 3px;
      color: #418ff6;
    }
  }
  .chartsBox_2 {
    display: flex;
    margin-bottom: 25px;
    border: 1px solid #ffeef6;
    border-radius: 3px;
    .progress {
      flex: 1;
      margin: 0 12px;
      align-self: center;
    }
    .womanData {
      font-size: 12px;
      margin-top: 7px;
    }
    .womanFont {
      margin-left: 3px;
      color: #e47c91;
    }
  }
}
.cardBanner {
  padding: 10px 0;
  position: relative;
  .appCard {
    display: flex;
    .flexd {
      margin-right: 10px; // 间隙为12px
      &:nth-child(2n) {
        margin-right: 50px;
      }
      width: 49.5%;
      flex-shrink: 0;
    }
  }
}
.arrow-left {
  position: absolute;
  left: -15px;
  top: 50%;
  color: #ffc600;
  font-size: 20px;
}
.arrow-right {
  position: absolute;
  right: -15px;
  top: 50%;
  color: #ffc600;
  font-size: 20px;
}
//区域地图
.areaBox {
  // height: 600px;
  display: flex;
  justify-content: space-between;
  :nth-child(1) {
    flex: 2;
  }
  .rankBox {
    font-size: 12px;
    flex: 1;
    margin-left: 10px;
  }
}
//城市排行榜
.cityTop10 {
  display: flex;
  color: #999999;
  :nth-child(n + 1) {
    margin-bottom: 5px;
  }
  .city_progress {
    flex: 6;
    display: flex;
    justify-content: flex-end;
    :nth-child(1) {
      flex: 3;
      margin-right: 3px;
    }
    :nth-child(2) {
      flex: 1;
    }
  }
}
::v-deep .el-form-item__error {
  left: 90px;
}
::v-deep .city .el-progress-bar__inner {
  background: linear-gradient(270deg, #aecbff 0%, #5ea3ff 100%);
  box-shadow: 0px 0px 7px 0px rgba(96, 164, 255, 0.41);
}
::v-deep .city .el-progress-bar__innerText {
  color: #ffffff !important;
}
::v-deep .city .el-progress-bar__outer {
  background-color: #daeaff !important;
}
::v-deep .manProgress .el-progress-bar__inner {
  background: linear-gradient(90deg, #aecbff 0%, #5ea3ff 100%);
  box-shadow: 0px 0px 7px 0px rgba(96, 164, 255, 0.41);
}
::v-deep .womanProgress .el-progress-bar__inner {
  background: linear-gradient(64deg, #ffb2c4 0%, #e47c91 100%);
  box-shadow: 0px 0px 7px 0px rgba(222, 119, 138, 0.35);
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #ffffff;
}
::v-deep .el-dialog__body {
  display: flex;
  align-items: normal;
  padding: 10px;
}
</style>
