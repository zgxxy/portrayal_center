<!-- 客群对比画像 -->
<template>
  <div>
    <el-card class="father-card">
      <div class="topBox">
        <el-image :src="topBoxUrl[0]"></el-image>
        <span class="name">{{ data.portraitReportName }}</span>
        <el-image
          style="cursor: pointer;"
          :src="topBoxUrl[1]"
          @click="downloadContrastReportFile"
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
        <div
          class="dataBox_1"
          :ref="'imageTofile' + index"
          v-for="(item, index) in sampleSizeAndCoverageVO"
          :key="index"
        >
          <div class="dataBox_2">
            <div class="img_box">
              <el-image
                style="width: 97px; height: 86px;"
                :src="dataBoxUrl[index]"
              ></el-image>
            </div>
            <div class="carSeriesName_box">{{ item.insightName }}</div>
          </div>
          <div>
            <div class="label">总受众样本</div>
            <div>
              <span class="rate">
                {{ item.sampleSize ? thousandFormat(item.sampleSize) : 0 }}
              </span>
              人
            </div>
            <div style="margin-top: 10px;"></div>
            <div class="label">可洞察样本覆盖率</div>
            <div>
              <span class="rate">
                {{ item.coverage || 0 }}
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
                <headline>性别分布</headline>
                <div>
                  <div
                    class="chartsBox_1"
                    v-for="(item, index) in basicInformVO.genderVO"
                    :key="'gender' + index"
                  >
                    <div class="name_box">{{ item.insightName }}</div>
                    <div class="progress">
                      <div class="manData">
                        <span>男</span>
                        <span>女</span>
                      </div>
                      <el-progress
                        :show-text="false"
                        :percentage="Number(item.manProPort)"
                        class="manProgress"
                      ></el-progress>
                      <div class="manData">
                        <!-- 男 -->
                        <div>
                          <span>占比</span>
                          <span class="manFont">
                            {{ item.manProPort || 0 }}
                          </span>
                          %
                          <span style="margin-left: 5px;">TGI</span>
                          <span class="manFont">
                            {{ item.manTGI || 0 }}
                          </span>
                        </div>
                        <!-- 女 -->
                        <div>
                          <span>TGI</span>
                          <span class="womanFont">
                            {{ item.femaleTGI || 0 }}
                          </span>
                          <span style="margin-left: 5px;">占比</span>
                          <span class="womanFont">
                            {{ item.femaleProPort || 0 }}
                          </span>
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="chartsCard template"
                v-if="basic.yearShow"
                ref="imageTofile4"
              >
                <headline>年龄分布</headline>
                <Column
                  :data="basicInformVO.ageDistributeVO.ageList"
                  :xAxis="basicInformVO.ageDistributeVO.agexAxis"
                  height="250px"
                />
              </div>
              <div
                class="chartsCard template"
                v-if="basic.familyShow"
                ref="imageTofile5"
              >
                <headline>家庭情况-已婚</headline>
                <div style="display: flex;">
                  <Gauge
                    v-for="(item, index) in basicInformVO.familyConduitVO"
                    :key="'marry' + index"
                    v-if="item.marry"
                    :type="index"
                    :text="item.insightName"
                    :data="Number(Number(item.marry).toFixed(2))"
                    :imageUrl="marryUrl[index]"
                    :axisWidth="
                      basicInformVO.familyConduitVO.length == 1
                        ? 24
                        : basicInformVO.familyConduitVO.length == 2
                        ? 20
                        : 16
                    "
                    :fontSize="
                      basicInformVO.familyConduitVO.length == 1
                        ? 20
                        : basicInformVO.familyConduitVO.length == 2
                        ? 16
                        : 14
                    "
                  />
                </div>
              </div>
              <div
                class="chartsCard template"
                v-if="basic.familyShow"
                ref="imageTofile5"
              >
                <headline>家庭情况-有小孩</headline>
                <div style="display: flex;">
                  <Gauge
                    v-for="(item, index) in basicInformVO.familyConduitVO"
                    :key="'child' + index"
                    v-if="item.haveChildren"
                    :type="index"
                    :text="item.insightName"
                    :data="Number(Number(item.haveChildren).toFixed(2))"
                    :imageUrl="childUrl[index]"
                    :axisWidth="
                      basicInformVO.familyConduitVO.length == 1
                        ? 24
                        : basicInformVO.familyConduitVO.length == 2
                        ? 20
                        : 16
                    "
                    :fontSize="
                      basicInformVO.familyConduitVO.length == 1
                        ? 20
                        : basicInformVO.familyConduitVO.length == 2
                        ? 16
                        : 14
                    "
                  />
                </div>
              </div>
              <div
                class="chartsCard template"
                v-if="basic.familyShow"
                ref="imageTofile5"
              >
                <headline>是否有车</headline>
                <div style="display: flex;">
                  <Gauge
                    v-for="(item, index) in basicInformVO.familyConduitVO"
                    :key="'car' + index"
                    v-if="item.haveCar"
                    :type="index"
                    :text="item.insightName"
                    :data="Number(Number(item.haveCar).toFixed(2))"
                    :imageUrl="carUrl[index]"
                    :axisWidth="
                      basicInformVO.familyConduitVO.length == 1
                        ? 24
                        : basicInformVO.familyConduitVO.length == 2
                        ? 20
                        : 16
                    "
                    :fontSize="
                      basicInformVO.familyConduitVO.length == 1
                        ? 20
                        : basicInformVO.familyConduitVO.length == 2
                        ? 16
                        : 14
                    "
                  />
                </div>
              </div>
              <div class="chartsCard template" v-if="basic.incomeShow">
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
                <headline>消费水平</headline>
                <Column
                  :data="basicInformVO.consumptionLevelVO.consumptionLevelList"
                  :xAxis="
                    basicInformVO.consumptionLevelVO.consumptionLevelxAxis
                  "
                />
              </div>
              <div class="chartsCard template" v-if="basic.houseShow">
                <headline>是否有房</headline>
                <Gauge
                  :type="0"
                  text="有房"
                  :data="basicInformVO.house"
                  :imageUrl="require('@/assets/images/slices/house_1.png')"
                />
              </div>
            </div>
            <div class="chartsCard" v-if="basic.careerShow" ref="imageTofile7">
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
              <div class="radio_group">
                <el-radio-group v-model="heatMapRadio" @change="heatMapChange">
                  <el-radio
                    :label="index"
                    v-for="(item, index) in insightNameVOList"
                    :key="'heatMap' + index"
                  >
                    {{ item.insightName }}
                  </el-radio>
                </el-radio-group>
              </div>
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
                  <el-radio-group v-model="mapRadio" @change="mapChange">
                    <el-radio
                      :label="index"
                      v-for="(item, index) in insightNameVOList"
                      :key="'map' + index"
                    >
                      {{ item.insightName }}
                    </el-radio>
                  </el-radio-group>
                </div>

                <div>
                  <MapContainer
                    :areaData="regionDistributeVOList"
                    @change="cityChange"
                  ></MapContainer>
                </div>
              </div>

              <div class="rankBox">
                <div class="chartsCard">
                  <headline>
                    城市等级分布
                  </headline>
                  <PIE
                    :data="regionDistributeVOList.cityLevelPieChartVOList"
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
              <div class="chartsCard">
                <headline>高活跃度 APP 类别</headline>
                <Column
                  :data="crowdPreferVO.top10CategoryVO.categoryList"
                  :xAxis="crowdPreferVO.top10CategoryVO.categoryXAxis"
                />
              </div>
              <div class="chartsCard">
                <headline>高活跃度TOP10 app</headline>
                <Column
                  :data="crowdPreferVO.top10AppChartVO.top10AppList"
                  :xAxis="crowdPreferVO.top10AppChartVO.top10AppxAxis"
                />
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
  getContrastThermalMap,
  getContrastInsightVO,
  downloadContrastReportFile,
  generalPdf,
} from '@/api/report'
import { shareContrastReportByMail } from '@/api/crowdInsight'
import { downloadFile } from '@/utils/file'
import { thousandFormat } from '@/utils/public'
import Column from '@/components/echarts/ColumnLine.vue'
import Gauge from '@/components/echarts/Gauge.vue'
import PIE from '@/components/echarts/Pie.vue'
import WordCloud from '@/components/echarts/WordCloud.vue'
import AMap from '@/components/MapContainer/AMap'
import MapContainer from '@/components/MapContainer/MapContainer'
// import portrayalData from '/public/testData/portrayalData.json'
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
      insightName: '',
      activeName: 'first', //tab
      heatMapRadio: 0, //热力图分布切换--单选框
      mapRadio: 0, //区域分布切换--单选框
      //顶部按钮图标
      topBoxUrl: [
        require('@/assets/images/slices/computer.svg'),
        require('@/assets/images/slices/download.svg'),
        require('@/assets/images/slices/share.svg'),
      ],
      //顶部信息汽车图
      dataBoxUrl: [
        require('@/assets/images/slices/car1.svg'),
        require('@/assets/images/slices/car2.svg'),
        require('@/assets/images/slices/car3.svg'),
      ],
      //基本信息性别
      chartsBoxUrl: [
        require('@/assets/images/slices/man.png'),
        require('@/assets/images/slices/woman.png'),
      ],
      //基本信息已婚图标
      marryUrl: [
        require('@/assets/images/slices/marry_1.png'),
        require('@/assets/images/slices/marry_2.png'),
        require('@/assets/images/slices/marry_3.png'),
      ],
      //基本信息有小孩图标
      childUrl: [
        require('@/assets/images/slices/child_1.png'),
        require('@/assets/images/slices/child_2.png'),
        require('@/assets/images/slices/child_3.png'),
      ],
      //基本信息有房图标
      houseUrl: [
        require('@/assets/images/slices/house_1.png'),
        require('@/assets/images/slices/house_2.png'),
        require('@/assets/images/slices/house_3.png'),
      ],
      //基本信息有车图标
      carUrl: [
        require('@/assets/images/slices/havecar_1.png'),
        require('@/assets/images/slices/havecar_2.png'),
        require('@/assets/images/slices/havecar_3.png'),
      ],
      //基础信息图显示
      basic: {
        genderShow: false, //性别
        yearShow: false, //年龄分布
        familyShow: false, //家庭情况
        incomeShow: false, //收入水平
        consumeShow: false, //消费水平
        houseShow: false, //有房
        careerShow: false, //职业
      },
      //人群偏好图显示
      preference: {
        activeAppShow: false, //高活跃app
        activeAppTOPShow: false, //高活跃top10app
      },
      sampleSizeAndCoverageVO: [], //头部数据
      basicInformVO: [], //基础信息数据
      heatData: [], //热力图数据当前tab
      heatDataAll: {}, //储存所有tab的热力数据
      regionList: [], //区域分布--储存该tab所有数据
      regionDistributeVOList: {}, //行政图--单车系
      cityList: [], //城市排名列表
      crowdPreferVO: {}, //人群偏好数据
      insightNameVOList: [], //车系列表
      heatMap: '0',
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
    async getList() {
      getContrastInsightVO({ reportId: this.data.id }).then((res) => {
        console.log(res, '基础信息报告')
        //头部数据
        this.sampleSizeAndCoverageVO = res.data.sampleSizeAndCoverageVO
        this.sampleSizeAndCoverageVO.statistDeadline = res.data.statistDeadline
        this.insightNameVOList = res.data.insightNameVOList //报告id列表
        //基础数据
        if (res.data.basicInform == 1) {
          this.basicInformVO = res.data.basicInformVO
          this.basicShow = true
        } else {
          this.basicShow = false
        }
        //人群偏好数据
        if (res.data.crowdPrefer == 1) {
          this.crowdPreferVO = res.data.crowdPreferVO
          this.preferShow = true
        } else {
          this.preferShow = false
        }
        //是否显示热力图
        this.heatMap = res.data.heatMap
        if (this.heatMap == 1) {
          getContrastThermalMap(this.insightNameVOList[0].insightId).then(
            (res) => {
              if (res.code == 200) {
                this.heatData = res.data
                this.heatDataAll.data0 = res.data != null ? res.data : []
              }
            },
          )
        }
        //区域分布数据
        if (res.data.regionDistribute == 1) {
          this.regionList = res.data.regionDistributeVOList
          this.regionList?.forEach((val, i) => {
            val.cityTop10VOList?.forEach((item, index) => {
              item['num'] = index + 1
            })
          })
          this.regionDistributeVOList = this.regionList[0]
          this.cityList = this.regionList[0].cityTop10VOList
          this.regionShow = true
        } else {
          this.regionShow = false
        }
        console.log(this.regionDistributeVOList, '行政区图数据')
        // 判断tab默认选中
        if (this.basicShow) {
          this.activeName = 'first'
        } else if (!this.basicShow && this.heatMap == 1) {
          this.activeName = 'second'
        } else if (
          !this.basicShow &&
          this.heatMap == 0 &&
          this.regionDistributeVOList.cityLevelPieChartVOList
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
          this.crowdPreferVO.top10CategoryVO
            ? (this.preference.activeAppShow = true)
            : (this.preference.activeAppShow = false)
          this.crowdPreferVO.top10AppChartVO
            ? (this.preference.activeAppTOPShow = true)
            : (this.preference.activeAppTOPShow = false)
        }
      })
      console.log(this.data, '传参')
    },
    //下载报告
    downloadContrastReportFile() {
      downloadContrastReportFile(this.data.id).then((res) => {
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
          shareContrastReportByMail(this.emailForm).then((res) => {
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
      this.cityList = val
      this.cityList.forEach((item, index) => {
        item['num'] = index + 1
      })
    },
    //热力地图报告切换
    heatMapChange(val) {
      if (!this.heatDataAll['data' + val]) {
        getContrastThermalMap(this.insightNameVOList[val].insightId).then(
          (res) => {
            if (res.code == 200) {
              this.heatData = res.data
              this.heatDataAll['data' + val] = res.data
            }
          },
        )
      } else {
        this.heatData = this.heatDataAll['data' + val]
      }
    },
    //行政地图报告切换
    mapChange(val) {
      console.log(val, '车系切换')
      this.regionList.forEach((e, i) => {
        if (i == val) {
          this.regionDistributeVOList = e
          this.cityList = e.cityTop10VOList
        }
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
  height: 148px;
  margin-right: 25px;
  padding: 10px 20px 10px 10px;
  border-radius: 3px;
  background: linear-gradient(40deg, #efedfe, #e6f3fd);
  display: flex;
  align-items: center;
  .dataBox_2 {
    margin-right: 20px;
    width: 128px;
    // height: 148px;
    text-align: center;
    .img_box {
      background: #f2f5ff;
      border: 1px solid rgba(104, 183, 255, 0.13);
    }
    .carSeriesName_box {
      height: 22px;
      line-height: 20px;
      font-size: 12px;
      background: linear-gradient(
        65deg,
        rgba(160, 255, 252, 0.11) 0%,
        rgba(102, 184, 255, 0.21) 100%
      );
      border: 1px solid rgba(104, 183, 255, 0.13);
    }
  }

  .label {
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 5px;
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
      // 去除第3n个的margin-right
      margin-right: 0;
    }
  }
  //性别分布
  .chartsBox_1 {
    display: flex;
    height: 70px;
    margin-bottom: 25px;
    border: 1px solid rgba(104, 183, 255, 0.13);
    border-radius: 3px;
    .name_box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      // line-height: 70px;
      text-align: center;
      background: linear-gradient(
        65deg,
        rgba(160, 255, 252, 0.11) 0%,
        rgba(102, 184, 255, 0.21) 100%
      );
      border-radius: 3px;
    }
    .progress {
      flex: 1;
      margin: 0 12px;
      align-self: center;
    }
    .manData {
      font-size: 12px;
      margin: 7px 0;
      display: flex;
      justify-content: space-between;
    }
    .manFont {
      margin-left: 3px;
      color: #418ff6;
    }
    .womanFont {
      margin-left: 3px;
      color: #e47c91;
    }
  }
}
//一行三格
.chartsBox_2 {
  display: flex;
  flex-wrap: wrap;
  //子盒子，设置为：
  .template {
    flex: 1;
    margin: 0 12px 10px 0; // 间隙为12px
    width: calc(
      (100% - 25px) / 3
    ); // 这里的25px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
    min-width: calc((100% - 25px) / 3); // 加入这两个后每个盒子的宽度就生效了
    max-width: calc((100% - 25px) / 3); // 加入这两个后每个盒子的宽度就生效了
    &:nth-child(3n) {
      // 去除第3n个的margin-right
      margin-right: 0;
    }
  }
}
.radio_group {
  margin-bottom: 20px;
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
    .rankTitle {
      margin-bottom: 20px;
      font-weight: 900;
    }
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
//进度条颜色--蓝色
::v-deep .manProgress .el-progress-bar__inner {
  background: linear-gradient(90deg, #aecbff 0%, #5ea3ff 100%);
  box-shadow: 0px 0px 7px 0px rgba(96, 164, 255, 0.41);
}
//进度条底色--粉色
::v-deep .manProgress .el-progress-bar__outer {
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
