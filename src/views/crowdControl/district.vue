<!-- 区域圈人 -->
<template>
  <div>
    <el-card class="father-card">
      <el-form ref="formData" :model="formData" :rules="rules">
        <el-card>
          <el-row :gutter="90">
            <el-col :span="8" style="white-space: nowrap;">
              <el-form-item prop="crowdName" label="人群名称：">
                <el-tooltip
                  :content="formData.crowdName"
                  placement="top"
                  effect="light"
                  :disabled="formData.crowdName | showTooltip(inputWidth1)"
                >
                  <el-input
                    v-model="formData.crowdName"
                    placeholder="最多不超过30字"
                    maxlength="30"
                    id="inputWidth1"
                    style="width: 100%;"
                  ></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="white-space: nowrap;">
              <el-form-item prop="isGenerateReport">
                <el-checkbox
                  style="margin-left: 10px;"
                  v-model="formData.isGenerateReport"
                  :true-label="1"
                  :false-label="0"
                >
                  生成洞察分析报告
                </el-checkbox>
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              style="white-space: nowrap;"
              v-if="formData.isGenerateReport"
            >
              <div style="display: flex; align-items: center;">
                <span style="color: #f56d6d; font-weight: 600;">
                  *
                </span>
                <el-form-item prop="reportName" label="报告名称：">
                  <el-tooltip
                    :content="formData.reportName"
                    placement="top"
                    effect="light"
                    :disabled="formData.reportName | showTooltip(inputWidth2)"
                  >
                    <el-input
                      v-model="formData.reportName"
                      placeholder="最多不超过30字"
                      maxlength="30"
                      id="inputWidth2"
                      style="width: 100%;"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <!--
        <el-card>
          <el-row :gutter="90">
            <el-col :span="8" style="white-space: nowrap;">
              <el-form-item prop="city" label="城市：">
                <el-select
                  v-model="formData.city"
                  filterable
                  clearable
                  :filterable="true"
                  placeholder="请选择或输入城市"
                  @change="getRegions"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in citys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="white-space: nowrap;">
              <el-form-item prop="region" label="行政区：">
                <el-select
                  v-model="formData.region"
                  filterable
                  clearable
                  :filterable="true"
                  placeholder="请选择或输入行政区"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in regions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        -->
        <el-card class="mapBox">
          <div class="mapBox_0">
            <AMap
              class="left_box"
              :value="formData.searchValue"
              :radius="formData.radius"
              @searchPoi="searchPoi"
              ref="child"
            ></AMap>
            <div class="right_box">
              <!--
              <div class="setting_box">
                <div class="label">位置信息匹配</div>
                <el-radio-group v-model="radio">
                  <el-radio :label="1">搜索地址</el-radio>
                </el-radio-group>
              </div>
              -->
              <div class="setting_box" v-if="radio == 1">
                <div class="label">地址关键字</div>
                <div class="search_box">
                  <el-popover
                    v-model="popshow"
                    popper-class="setting"
                    placement="left"
                    width="300"
                    trigger="manual"
                  >
                    <i
                      v-if="popshow"
                      class="el-icon-zoom-out"
                      slot="reference"
                      style="cursor: pointer;"
                      @click="popshow = !popshow"
                    ></i>
                    <i
                      v-if="!popshow"
                      class="el-icon-zoom-in"
                      slot="reference"
                      style="cursor: pointer;"
                      @click="popshow = !popshow"
                    ></i>
                    <div style="display: flex; justify-content: space-between;">
                      <div v-if="poiList.length > 0">
                        <el-checkbox
                          :indeterminate="isIndeterminate"
                          v-model="checkAll"
                          @change="handleCheckAllChange"
                        >
                          全选
                        </el-checkbox>
                      </div>
                      <div v-else></div>
                      <span
                        style="color: #999; cursor: pointer;"
                        @click="popshow = false"
                      >
                        收起
                      </span>
                    </div>
                    <div style="margin: 10px 0;"></div>
                    <el-checkbox-group
                      v-model="checkedPoi"
                      @change="handleCheckedCitiesChange"
                      v-if="poiList.length > 0"
                    >
                      <div
                        v-for="(poi, index) in poiList"
                        :key="'poi' + index"
                        style="margin-bottom: 10px;"
                      >
                        <el-checkbox :label="poi.name">
                          {{ poi.name }}
                        </el-checkbox>
                      </div>
                    </el-checkbox-group>
                    <div v-else>
                      <el-empty description="暂无数据" style="height: 50px;" />
                      <div style="margin: 50px 0;"></div>
                    </div>
                    <div
                      v-if="poiList.length > 0"
                      style="
                        margin-top: 10px;
                        display: flex;
                        justify-content: flex-end;
                      "
                    >
                      <el-button size="small" type="primary" @click="addMarker">
                        确定
                      </el-button>
                    </div>
                  </el-popover>
                  <el-input
                    v-model="formData.searchValue"
                    placeholder="请输入关键字"
                    class="input-with-select"
                    @keyup.enter.native="search()"
                    @change="searchInputChange"
                    clearable
                    id="searchValue"
                    style="width: 100%;"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="search()"
                    ></el-button>
                  </el-input>
                </div>
              </div>
              <div class="setting_box" v-else>
                <div class="label">地址文件</div>
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action
                  accept=".xlsx,.xls,.csv,.txt"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="formData.fileList"
                  :auto-upload="false"
                >
                  <el-button slot="trigger" size="small" type="primary">
                    添加文件
                  </el-button>
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitUpload"
                  >
                    上传
                  </el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传xlsx/xls/csv/txt文件，且不超过500kb
                  </div>
                </el-upload>
              </div>
              <div class="setting_box">
                <div class="label">辐射距离</div>
                <div style="display: flex; align-items: center;">
                  <el-slider
                    class="my_slider"
                    v-model="formData.radius"
                    :step="600"
                    :min="150"
                    :max="3000"
                    :marks="{ 150: '150m', 3000: '3000m' }"
                    show-stops
                    show-input
                    :show-input-controls="false"
                    @change="radiusChange"
                  ></el-slider>
                  <span>m</span>
                </div>
              </div>
              <div class="setting_box">
                <div class="label">受众</div>
                <el-radio-group v-model="formData.areaType">
                  <el-radio :label="1" style="margin-bottom: 8px;">
                    居住区域
                  </el-radio>
                  <el-radio :label="2" style="margin-bottom: 8px;">
                    工作区域
                  </el-radio>
                  <el-radio :label="3" style="margin-bottom: 8px;">
                    到访过这里
                  </el-radio>
                </el-radio-group>
              </div>
              <div v-if="formData.areaType == 3">
                <div class="setting_box">
                  <div class="label">开始时间</div>
                  <el-date-picker
                    v-model="formData.startDate"
                    :picker-options="
                      formData.areaType == 3 ? PickerOptions1 : PickerOptions2
                    "
                    popper-class="no-atTheMoment"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="dateChange(1)"
                    style="width: 100%;"
                  ></el-date-picker>
                  <!--
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-tooltip
                        :disabled="!formData.startDate"
                        effect="dark"
                        :content="formData.startDate"
                        placement="top"
                      >
                        <el-date-picker
                          type="date"
                          placeholder="选择日期"
                          v-model="formData.startDate"
                          :picker-options="
                            formData.areaType == 3
                              ? PickerOptions1
                              : PickerOptions2
                          "
                          value-format="yyyy-MM-dd"
                          @change="dateChange(1)"
                          style="width: 100%;"
                        ></el-date-picker>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="12">
                      <el-tooltip
                        :disabled="!formData.startTime"
                        effect="dark"
                        :content="formData.startTime"
                        placement="top"
                      >
                        <el-time-picker
                          placeholder="选择时间"
                          v-model="formData.startTime"
                          :picker-options="
                            startTimeDisable ? PickerOptions3 : PickerOptions4
                          "
                          value-format="HH:mm:ss"
                          @change="timeChange(1)"
                          style="width: 100%;"
                        ></el-time-picker>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  -->
                </div>
                <div class="setting_box">
                  <div class="label">结束时间</div>
                  <el-date-picker
                    v-model="formData.endDate"
                    :picker-options="PickerOptions1"
                    popper-class="no-atTheMoment"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="dateChange(2)"
                    style="width: 100%;"
                  ></el-date-picker>
                  <!--
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-tooltip
                        :disabled="!formData.endDate"
                        effect="dark"
                        :content="formData.endDate"
                        placement="top"
                      >
                        <el-date-picker
                          type="date"
                          placeholder="选择日期"
                          v-model="formData.endDate"
                          :picker-options="PickerOptions2"
                          value-format="yyyy-MM-dd"
                          @change="dateChange(2)"
                          style="width: 100%;"
                        ></el-date-picker>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="12">
                      <el-tooltip
                        :disabled="!formData.endTime"
                        effect="dark"
                        :content="formData.endTime"
                        placement="top"
                      >
                        <el-time-picker
                          placeholder="选择时间"
                          v-model="formData.endTime"
                          :picker-options="
                            endTimeDisable ? PickerOptions3 : PickerOptions4
                          "
                          value-format="hh:mm:ss"
                          @change="timeChange(2)"
                          style="width: 100%;"
                        ></el-time-picker>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  -->
                </div>
                <div class="setting_box gray_text">
                  <p>时间段筛选须知：</p>
                  <p>1. 支持筛选过去半年内经过此地区的人群</p>
                  <p>2. 日期跨度需小于一个月，最晚为前一日的23:59:59</p>
                  <p>
                    3. 如果全选范围分布在1个以上的城市，时间范围需控制在7天内
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-form>
    </el-card>
    <bottom-fixed>
      <div class="bottom_box">
        <tagEditBtn
          :checkedList="markerList"
          type="checkbox"
          @addrDelete="addrDelete"
        ></tagEditBtn>
        <div class="btn">
          <el-button type="">
            <router-link :to="{ name: 'crowdList' }">
              取消
            </router-link>
          </el-button>
          <el-button type="primary" @click="confirm('formData')">
            确定
          </el-button>
        </div>
      </div>
    </bottom-fixed>
  </div>
</template>

<script>
import { uploadCrowdByFile } from '@/api/crowdPackage'
import {
  getAllCityCode,
  getAdministrativeRegionsCodeByCityName,
  addLbsCrowd,
} from '@/api/crowdControl'
import { addPortraitReport } from '@/api/crowdInsight'
import { stopDifference, uniqueArr, AMapTransBMap } from '@/utils/public'
import AMap from '@/components/MapContainer/AMap'
import tagEditBtn from '@/components/tag/tagEditBtn'
export default {
  components: {
    AMap,
    tagEditBtn,
  },
  filters: {
    className(className) {
      let res = ''
      if (className == 1) res = '汽车出行'
      else if (className == 2) res = '媒体社交'
      else if (className == 3) res = '购物电商'
      else if (className == 4) res = '学习教育'
      return res
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
      radio: 1,
      inputWidth1: null, //输入框长度--用于判断tooltip是否显示
      inputWidth2: null,
      popshow: false, //设置按钮下拉框显示
      poiList: [], //查询到的poi列表
      checkAll: false,
      checkedPoi: [], //每次查询选择的poi
      markerList: [], //标点列表--储存多次查询选中的数据
      isIndeterminate: false,
      formData: {
        crowdName: '',
        reportName: '',
        isGenerateReport: 1,
        city: '', //选择城市
        region: '', //行政区
        searchValue: '', //地址搜索
        fileList: [],
        radius: 150, //辐射半径
        areaType: 1, //受众
        startDate: '', //开始日期
        startTime: '', //开始时间
        endDate: '', //结束日期
        endTime: '', //结束时间
      },
      dataList: {},
      citys: [], //选择城市下拉框
      regions: [], //行政区下拉框
      rules: {
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' },
          { validator: validateName },
        ],
        reportName: [
          { required: false, message: '请输入报告名称', trigger: 'blur' },
          { validator: validateName },
        ],
      },
      startTimeDisable: false, //开始时间禁用判断
      endTimeDisable: false, //结束时间禁用判断
      //时间选择器--禁选半年之前的时间 且 禁选今天之后的时间
      PickerOptions1: {
        disabledDate: (time) => {
          const curDate = new Date().getTime()
          // 算出半年的毫秒数，平均一个月30天
          const day = 180 * 24 * 3600 * 1000
          const dateRegion = curDate - day
          return (
            time.getTime() > Date.now() - 8.64e7 || time.getTime() < dateRegion
          )
        },
      },
      //时间选择器--禁选今天之后的时间
      PickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        },
      },
      //只能选择此刻减去两个小时之前的时间
      PickerOptions3: {
        selectableRange: `00:00:00 - ${
          this.initTime(Date.now()) ? this.initTime(Date.now()) : '23:59:59'
        }`,
      },
      PickerOptions4: {
        disabledDate(time) {
          return ''
        },
        selectableRange: '00:00:00 -23:59:59',
      },
    }
  },
  created() {
    this.getList()
    this.getDropDownList()
  },
  mounted() {
    this.inputWidth1 = document.getElementById('inputWidth1').offsetWidth - 35
    this.inputWidth2 = document.getElementById('inputWidth2').offsetWidth - 35
  },
  methods: {
    // 获取列表
    getList() {
      this.dataList = {}
    },
    //获取下拉框数据
    getDropDownList() {
      this.citys = []
      //城市下拉框
      getAllCityCode().then((res) => {
        if (res.code == 200) {
          res.data.forEach((e) => {
            //目前只添加北上广深
            if (
              e.name == '北京市' ||
              e.name == '上海市' ||
              e.name == '广州市' ||
              e.name == '深圳市'
            ) {
              this.citys.push({
                label: e.name,
                value: e.value,
              })
            }
          })
        }
      })
    },
    //获取行政区
    getRegions(val) {
      this.regions = []
      this.formData.region = ''
      if (val) {
        getAdministrativeRegionsCodeByCityName({ cityCode: val }).then(
          (res) => {
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
          },
        )
      }
    },
    //日期选择事件
    dateChange(type) {
      let start = this.formData.startDate
      let end = this.formData.endDate
      let startTime = new Date(this.formData.startDate)
      let endTime = new Date(this.formData.endDate)
      let usedTime = endTime - startTime // 相差的毫秒数
      let days = Math.floor(usedTime / (24 * 3600 * 1000)) // 计算出天数
      let date = new Date()
      let Y = date.getFullYear()
      let M =
        date.getMonth() + 1 < 10
          ? '0' + date.getMonth() + 1
          : date.getMonth() + 1
      let D = date.getDate()
      let nowDate = Y + '-' + M + '-' + D //当前时间YYYY-MM-DD
      if (type == 1) {
        this.formData.startTime = ''
      } else {
        this.formData.endTime = ''
      }
      if (start && end && startTime > endTime) {
        this.$message.warning('开始日期不能大于结束日期！')
        if (type == 1) {
          this.formData.startDate = ''
        } else {
          this.formData.endDate = ''
        }
      }
      if (start && end && days > 30) {
        this.$message.warning('起止日期间隔不能超过一个月！')
        if (type == 1) {
          this.formData.startDate = ''
        } else {
          this.formData.endDate = ''
        }
      }
    },
    //时间选择事件
    timeChange(type) {
      let SD = this.formData.startDate
      let ED = this.formData.endDate
      let ST = this.formData.startTime
      let ET = this.formData.endTime
      if (SD && ED) {
        let S = this.timeToSec(ST)
        let E = this.timeToSec(ET)
        if (SD == ED && S > E) {
          this.$message.warning('开始时间不能大于结束时间！')
          if (type == 1) {
            this.formData.startTime = ''
          } else {
            this.formData.endTime = ''
          }
        }
      }
    },
    //时分秒（hh:mm:ss）转换为时间戳
    timeToSec(time) {
      var s = ''
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      var sec = time.split(':')[2]
      s = Number(hour * 3600) + Number(min * 60) + Number(sec)
      return s
    },
    //获取当前时分秒 hh:mm:ss
    initTime(time) {
      let date = new Date(time)
      let h =
        date.getHours() - 2 < 0
          ? date.getHours() + ':'
          : date.getHours() - 2 + ':'
      let m = date.getMinutes() + ':'
      let s = date.getSeconds()
      return h + m + s
    },
    //删除地址
    addrDelete(val) {
      this.$nextTick(() => {
        this.$refs.child.pointMarker(val)
      })
    },
    radiusChange(val) {
      this.$nextTick(() => {
        this.$refs.child.pointMarker(this.markerList, val)
      })
    },
    //查询输入框change事件
    searchInputChange(val) {
      this.isIndeterminate = false
      this.checkAll = false
      if (!val) {
        this.poiList = []
      }
      console.log(val, 'change')
    },
    //查询按钮
    search() {
      this.isIndeterminate = false
      this.checkAll = false
      this.$refs.child.searchAddress()
      this.popshow = true
    },
    //地图查询回调
    searchPoi(val) {
      this.poiList = val
      console.log(this.poiList, '查询地址')
    },
    //poi全选
    handleCheckAllChange(val) {
      let allList = []
      this.poiList.forEach((e) => {
        allList.push(e.name)
      })
      this.checkedPoi = val ? allList : []
      this.isIndeterminate = false
    },
    //poi选择
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.poiList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.poiList.length
    },
    //选择地址弹窗--确定
    addMarker() {
      let marker = null
      this.checkedPoi.forEach((e) => {
        marker = this.poiList.find((elem) => elem.name === e)
        this.markerList.push(marker)
      })
      const res = new Map()
      this.markerList = uniqueArr(this.markerList)
      this.$nextTick(() => {
        this.$refs.child.pointMarker(this.markerList)
      })
      this.popshow = false
      this.checkedPoi = []
      this.isIndeterminate = false
      this.checkAll = false
      console.log(this.markerList, '选择的地址')
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    //确定
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.radio == 1 && this.markerList.length == 0) {
            this.$message.warning('请选择地址！')
            return
          }
          if (
            this.formData.areaType == 3 &&
            (!this.formData.startDate || !this.formData.endDate)
          ) {
            this.$message.warning('请选择时间！')
            return
          }
          let points = []
          let keyName = []
          let cityCode = []
          let startTime = this.formData.startDate
          let endTime = this.formData.endDate
          let leads = stopDifference([startTime, endTime])
          this.markerList.forEach((e) => {
            points.push(AMapTransBMap(e.location.lng, e.location.lat))
            keyName.push(e.name)
            cityCode.push(e.citycode)
          })
          cityCode = Array.from(new Set(cityCode))
          if (
            this.formData.areaType == 3 &&
            cityCode.length > 1 &&
            leads > 7 * 24 * 60 * 60
          ) {
            this.$message.warning('时间范围需控制在7天内！')
            return
          }
          let params = {
            administrativeRegionsTag: this.formData.region
              ? [this.formData.region]
              : [this.formData.city],
            crowdName: this.formData.crowdName,
            dataOrigin: this.formData.areaType,
            endTime:
              this.formData.areaType == 3
                ? endTime.replace(/-|:|\s*/g, '').substring(0, 10)
                : '',
            isGenerateReport: this.formData.isGenerateReport,
            keywordList: keyName,
            name: this.formData.reportName,
            points: points,
            radius: this.formData.radius,
            startTime:
              this.formData.areaType == 3
                ? startTime.replace(/-|:|\s*/g, '').substring(0, 10)
                : '',
            userId: sessionStorage.getItem('id'),
          }
          console.log(params, '参数')
          addLbsCrowd(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('添加区域人群成功！')
              this.$router.push('/crowdControl')
            }
          })
          console.log(this.formData, 'formData')
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单...',
          })
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
::v-deep .el-form-item__label {
  width: 10px !important;
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
  }
  .right_box {
    height: 555px;
    overflow-y: auto;
    flex: 1;
    padding: 10px 25px;
    .label {
      font-weight: 600;
    }
  }
  .setting_box {
    margin-bottom: 20px;
  }
  .search_box {
    display: flex;
    align-items: center;
    i {
      margin-right: 10px;
    }
    .poi_content {
      margin-bottom: 10px;
    }
  }
}
.label {
  font-weight: 900;
  padding: 10px 0;
}
.gray_text {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  :nth-child(n + 1) {
    margin: 5px;
  }
}
.bottom_box {
  display: flex;
  align-items: center;
}
.btn {
  margin-right: 0;
  margin-left: auto;
  margin-top: 10px;
}
.my_slider {
  flex: 3;
  ::v-deep .el-slider__runway {
    width: calc(100% - 100px);
    margin: 10px;
  }
}
::v-deep .el-empty__image svg {
  height: 80%;
  width: 60%;
  margin-top: 30px;
}
::v-deep .el-input-number.is-without-controls .el-input__inner {
  padding: 0;
  position: relative;
  right: -80px;
  width: 45px;
}
::v-deep .el-form-item__label {
  width: 80px !important;
}
::v-deep .el-form-item__error {
  left: 80px;
}
</style>
