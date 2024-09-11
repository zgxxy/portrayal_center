<!-- 多客群对比分析 -->
<template>
  <div>
    <el-card class="father-card">
      <el-card>
        <div class="theSteps">
          <el-steps
            :active="active"
            finish-status="success"
            :align-center="true"
          >
            <el-step title="多人群对比任务基础信息配置"></el-step>
            <el-step title="对比客群选择或配置、洞察维度配置"></el-step>
            <el-step title="查看多人群对比分析报告"></el-step>
          </el-steps>
        </div>
      </el-card>
      <el-card>
        <el-form
          ref="formData0"
          :model="formData0"
          :rules="rules0"
          v-if="active == 0"
        >
          <el-form-item prop="reportName" label="任务名称：">
            <el-tooltip
              :content="formData0.reportName"
              placement="top"
              effect="light"
              :disabled="formData0.reportName | showTooltip(inputWidth)"
            >
              <el-input
                v-model="formData0.reportName"
                placeholder="最多不超过30字"
                maxlength="30"
                id="inputWidth"
                clearable
                style="width: 50%;"
              ></el-input>
            </el-tooltip>
          </el-form-item>
          <div style="margin: 20px;"></div>
          <el-form-item prop="brand" label="品牌类型配置：">
            <el-radio-group v-model="formData0.brand">
              <el-radio :label="1">已有人群对比</el-radio>
              <el-radio :label="2">品牌/车型目标人群对比</el-radio>
              <el-radio :label="3">城市人群对比</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 已有人群对比start -->
        <el-form
          ref="formData1"
          :model="formData1"
          v-if="active == 1 && formData0.brand == 1"
        >
          <div
            class="formData_box"
            v-for="(item, index) in formData1.list"
            :key="'formData1' + index"
          >
            <div class="title_box">
              {{ '客群' + (index + 1) }}
              <el-button
                class="icon_delete"
                type="text"
                :disabled="item.disabled"
                v-if="formData1.list.length > 1"
                @click="deleteList(index, 1)"
                icon="el-icon-delete"
              ></el-button>
            </div>
            <div class="data_box1">
              <el-form-item
                :prop="'list.' + index + '.crowd'"
                :rules="rules1.crowd"
                label="人群："
              >
                <div style="white-space: nowrap;">
                  <el-select
                    v-model="item.crowd"
                    placeholder="请选择或输入人群"
                    clearable
                    :filterable="true"
                    :disabled="item.disabled"
                    @change="selectChange(1, item.crowd, index)"
                    style="width: 85%;"
                  >
                    <el-option
                      v-for="(item, optionIndex) in customerList"
                      :key="optionIndex"
                      :label="item.label"
                      :disabled="getDisable(item.value, 1)"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <div v-if="index != formData1.list.length - 1" class="vs_box">
              <el-image
                :src="require('@/assets/images/slices/vs.png')"
              ></el-image>
            </div>
          </div>
          <div
            class="addBox"
            @click="addList(1)"
            v-if="formData1.list.length < 3"
          >
            +
            <span class="gray_box">添加对比客群</span>
          </div>
        </el-form>
        <!-- 已有人群对比end -->
        <!-- 品牌/车型目标人群对比start -->
        <el-form
          ref="formData2"
          :model="formData2"
          v-if="active == 1 && formData0.brand == 2"
        >
          <div
            class="formData_box"
            v-for="(item, index) in formData2.list"
            :key="'formData2' + index"
          >
            <div class="title_box">
              {{ '客群' + (index + 1) }}
              <i
                class="el-icon-delete"
                @click="deleteList(index, 2)"
                v-if="formData2.list.length > 1"
              ></i>
            </div>
            <div class="data_box2">
              <el-form-item :prop="'list.' + index + '.brandType'" label="">
                <div style="white-space: nowrap;">
                  <el-radio-group v-model="item.brandType">
                    <el-radio :label="1">本品牌车系</el-radio>
                    <el-radio :label="2">其他品牌</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <div v-if="item.brandType == 1">
                <el-form-item
                  :prop="'list.' + index + '.carSeries'"
                  :rules="rules2.carSeries"
                  label="所属车系："
                >
                  <div style="white-space: nowrap;">
                    <el-select
                      v-model="item.carSeries"
                      placeholder="请选择或输入车系"
                      clearable
                      :filterable="true"
                      style="width: 85%;"
                    >
                      <el-option
                        v-for="(item, optionIndex) in ownCarList"
                        :key="optionIndex"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <div style="margin: 20px;"></div>
                <el-form-item
                  :prop="'list.' + index + '.crowdName'"
                  :rules="rules2.crowdName"
                  label="人群名称："
                >
                  <div style="white-space: nowrap;">
                    <el-select
                      v-model="item.crowdName"
                      placeholder="请选择或输入人群"
                      clearable
                      :filterable="true"
                      @change="selectChange(2, item.crowdName, index)"
                      style="width: 70%;"
                    >
                      <el-option
                        v-for="(val, optionIndex) in crowdList"
                        :key="'crowdList' + optionIndex"
                        :label="val.label"
                        :disabled="getDisable(val.value, 2)"
                        :value="val.value"
                      ></el-option>
                    </el-select>
                    <el-button class="addCustomer" type="" @click="addCustomer">
                      新建客群
                    </el-button>
                  </div>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item
                  :prop="'list.' + index + '.brandName'"
                  :rules="rules2.brandName"
                  label="品牌名称："
                >
                  <div style="white-space: nowrap;">
                    <el-select
                      v-model="item.brandName"
                      placeholder="请选择或输入品牌"
                      clearable
                      :filterable="true"
                      @change="selectChange(3, item.brandName, index)"
                      style="width: 85%;"
                    >
                      <el-option
                        v-for="(item, optionIndex) in otherCarList"
                        :key="optionIndex"
                        :label="item.label"
                        :disabled="getDisable(item.value, 3)"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <div style="margin: 20px;"></div>
                <el-form-item
                  :prop="'list.' + index + '.source'"
                  :rules="rules2.source"
                  label="受众来源："
                >
                  <div style="white-space: nowrap;">
                    <checkbox :data="item.source"></checkbox>
                  </div>
                </el-form-item>
              </div>
            </div>
            <div v-if="index != formData2.list.length - 1" class="vs_box">
              <el-image
                :src="require('@/assets/images/slices/vs.png')"
              ></el-image>
            </div>
          </div>
          <div
            class="addBox"
            @click="addList(2)"
            v-if="formData2.list.length < 3"
          >
            +
            <span class="gray_box">添加对比客群</span>
          </div>
        </el-form>
        <!-- 品牌/车型目标人群对比end -->
        <!-- 城市人群对比start -->
        <el-form
          ref="formData3"
          :model="formData3"
          v-if="active == 1 && formData0.brand == 3"
        >
          <div
            class="formData_box"
            v-for="(item, index) in formData3.list"
            :key="'formData3' + index"
          >
            <div class="title_box">
              {{ '客群' + (index + 1) }}
              <i
                class="el-icon-delete"
                @click="deleteList(index, 3)"
                v-if="formData3.list.length > 1"
              ></i>
            </div>
            <div class="data_box1">
              <el-form-item
                :prop="'list.' + index + '.prov'"
                :rules="rules3.prov"
                label="省份："
              >
                <div style="white-space: nowrap;">
                  <el-select
                    v-model="item.prov"
                    placeholder="请选择或输入省份"
                    v-on:change="getProv($event, item)"
                    :filterable="true"
                    clearable
                    style="width: 85%;"
                  >
                    <el-option
                      v-for="(item, optionIndex) in provs"
                      :key="optionIndex"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
              <div style="margin: 20px;"></div>
              <el-form-item
                :prop="'list.' + index + '.city'"
                :rules="rules3.city"
                label="城市："
              >
                <div style="white-space: nowrap;">
                  <el-select
                    v-model="item.city"
                    placeholder="请选择或输入城市"
                    clearable
                    v-on:change="selectChange(4, item.city, index)"
                    :filterable="true"
                    style="width: 85%;"
                  >
                    <el-option
                      v-for="(val, optionIndex) in item.citys"
                      :key="optionIndex"
                      :label="val.label"
                      :disabled="getDisable(val.value, 4)"
                      :value="val.value"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <div v-if="index != formData3.list.length - 1" class="vs_box">
              <el-image
                :src="require('@/assets/images/slices/vs.png')"
              ></el-image>
            </div>
          </div>
          <div
            class="addBox"
            @click="addList(3)"
            v-if="formData3.list.length < 3"
          >
            +
            <span class="gray_box">添加对比客群</span>
          </div>
        </el-form>
        <!-- 城市人群对比end -->
        <div class="sussess_box" v-if="active == 2">
          <div class="count_box">
            <span>{{ msg }}</span>
            <span class="count">{{ count }}</span>
            秒后自动跳转到画像报告列表
          </div>
          <el-button @click="toContrastPortrayal">查看报告</el-button>
        </div>
      </el-card>
      <el-card v-if="active == 1">
        <div class="label">
          <span style="color: #f56d6d; margin-right: 2px; font-weight: 600;">
            *
          </span>
          洞察维度
        </div>
        <checkbox :data="insightList"></checkbox>
      </el-card>
      <el-card v-if="active != 2">
        <div class="btn">
          <el-button v-if="active == 1" @click="prev()">上一步</el-button>
          <el-button
            type="primary"
            @click="next('formData' + active)"
            width="20"
          >
            {{ active == 0 ? '下一步' : '对比分析' }}
          </el-button>
        </div>
      </el-card>
      <add
        :dialog-form-visible.sync="dialogFormVisible"
        :dialogFormData="dialogFormData"
        @dialogFormVisible="closeFrom"
      />
    </el-card>
  </div>
</template>

<script>
import {
  getAllFileCrowdVo,
  getHaveReportCrowdVo,
  getCityList,
} from '@/api/crowdControl'
import {
  getCarSeries,
  getCarBrandData,
  addExistCrowdContrastInsight,
  addCarCrowdContrastInsight,
  addCityCrowdContrastInsight,
} from '@/api/crowdInsight'
import add from './components/addCustomer.vue'
import checkbox from '@/components/button/checkBox'
// import cityData from '/public/testData/cityData.json'
export default {
  components: {
    add,
    checkbox,
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
      rowData: this.$route.query.val,
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      count: '',
      msg: '', //返回接口状态
      active: 0,
      dialogFormVisible: false, //新建客群弹窗
      dialogFormData: {},
      formData0: {
        reportName: '', //报告名称
        brand: 1,
      },
      formData1: {
        list: [
          {
            crowd: '',
            disabled: false,
          },
          {
            crowd: '',
            disabled: false,
          },
        ],
      },
      formData2: {
        list: [
          {
            carSeries: '',
            crowdName: '',
            brandName: '',
            brandType: 1,
            source: [
              {
                name: '安装了品牌车主APP',
                checked: false,
                disabled: true,
              },
              {
                name: '半年内访问过4s店',
                checked: false,
                disabled: true,
              },
            ],
          },
          {
            carSeries: '',
            crowdName: '',
            brandName: '',
            brandType: 1,
            source: [
              {
                name: '安装了品牌车主APP',
                checked: false,
                disabled: true,
              },
              {
                name: '半年内访问过4s店',
                checked: false,
                disabled: true,
              },
            ],
          },
        ],
      },
      formData3: {
        list: [
          {
            prov: '',
            city: '',
          },
          {
            prov: '',
            city: '',
          },
        ],
        citys: [],
      },
      ownCarList: [], //车系列表
      customerList: [], //客群列表
      crowdList: [], //人群列表
      otherCarList: [], //品牌列表
      selectedOptions1: [], //储存选中的客群人群
      selectedOptions2: [], //储存选中的人群名称
      selectedOptions3: [], //储存选中的品牌名称
      selectedOptions4: [], //储存选中的城市
      insightList: [
        {
          name: '基础信息',
          checked: false,
        },
        {
          name: '热力分布',
          checked: false,
        },
        {
          name: '区域分布',
          checked: false,
        },
        {
          name: '人群偏好',
          checked: false,
        },
      ],
      cityData: [], //城市下拉框
      provs: [
        { label: '北京市', value: '北京市', disable: false },
        { label: '天津市', value: '天津市', disable: false },
        { label: '河北省', value: '河北省', disable: false },
        { label: '山西省', value: '山西省', disable: false },
        { label: '内蒙古自治区', value: '内蒙古自治区', disable: false },
        { label: '辽宁省', value: '辽宁省', disable: false },
        { label: '吉林省', value: '吉林省', disable: false },
        { label: '黑龙江省', value: '黑龙江省', disable: false },
        { label: '上海市', value: '上海市', disable: false },
        { label: '江苏省', value: '江苏省', disable: false },
        { label: '浙江省', value: '浙江省', disable: false },
        { label: '安徽省', value: '安徽省', disable: false },
        { label: '福建省', value: '福建省', disable: false },
        { label: '江西省', value: '江西省', disable: false },
        { label: '山东省', value: '山东省', disable: false },
        { label: '河南省', value: '河南省', disable: false },
        { label: '湖北省', value: '湖北省', disable: false },
        { label: '湖南省', value: '湖南省', disable: false },
        { label: '广东省', value: '广东省', disable: false },
        { label: '广西壮族自治区', value: '广西壮族自治区', disable: false },
        { label: '海南省', value: '海南省', disable: false },
        { label: '重庆市', value: '重庆市', disable: false },
        { label: '四川省', value: '四川省', disable: false },
        { label: '贵州省', value: '贵州省', disable: false },
        { label: '云南省', value: '云南省', disable: false },
        { label: '西藏自治区', value: '西藏自治区', disable: false },
        { label: '陕西省', value: '陕西省', disable: false },
        { label: '甘肃省', value: '甘肃省', disable: false },
        { label: '青海省', value: '青海省', disable: false },
        { label: '宁夏回族自治区', value: '宁夏回族自治区', disable: false },
        {
          label: '新疆维吾尔自治区',
          value: '新疆维吾尔自治区',
          disable: false,
        },
        { label: '台湾省', value: '台湾省', disable: false },
        { label: '香港特别行政区', value: '香港特别行政区', disable: false },
        { label: '澳门特别行政区', value: '澳门特别行政区', disable: false },
      ],
      dataList: [],
      rules0: {
        reportName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { validator: validateName },
        ],
        brand: [{ required: true, message: '请选择品牌类型', trigger: 'blur' }],
      },
      rules1: {
        crowd: [{ required: true, message: '请选择人群', trigger: 'blur' }],
      },
      rules2: {
        carSeries: [{ required: true, message: '请选择车系', trigger: 'blur' }],
        crowdName: [{ required: true, message: '请选择人群', trigger: 'blur' }],
        brandName: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        source: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      rules3: {
        prov: [{ required: true, message: '请选择省份', trigger: 'blur' }],
        city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.inputWidth = document.getElementById('inputWidth').offsetWidth - 40
  },
  methods: {
    // 获取列表
    async getList() {
      this.crowdList = []
      this.customerList = []
      this.ownCarList = []
      this.otherCarList = []
      this.cityData = []
      //品牌车型对比人群名称下拉框
      let res1 = await getAllFileCrowdVo({
        userId: sessionStorage.getItem('id'),
      })
      if (res1.code == 200) {
        res1.data.forEach((e) => {
          this.crowdList.push({
            label: e.crowdName,
            value: e.id,
          })
        })
      }
      ///获取已有报告人群包下拉框
      let res2 = await getHaveReportCrowdVo({
        userId: sessionStorage.getItem('id'),
      })
      if (res2.code == 200) {
        res2.data.forEach((e) => {
          this.customerList.push({
            label: e.crowdName,
            value: e.id,
          })
        })
      }
      //自有品牌车系
      let res3 = await getCarSeries({ brand: '东风日产' })
      if (res3.code == 200) {
        res3.data.forEach((e) => {
          this.ownCarList.push({
            label: e.name,
            value: e.value,
          })
        })
      }
      //其他品牌
      let res4 = await getCarBrandData({ brand: '日产' })
      if (res4.code == 200) {
        res4.data.forEach((e) => {
          this.otherCarList.push({
            label: e.name,
            value: e.value,
            is4s: e.is4s,
            isApp: e.isApp,
          })
        })
      }
      //城市下拉框
      let res5 = await getCityList()
      if (res5.code == 200) {
        this.cityData = res5.data
      }
    },
    //上一步
    prev() {
      if (this.active-- > 2) this.active = 0
      //清空
      this.selectedOptions1 = []
      this.selectedOptions2 = []
      this.selectedOptions3 = []
      this.selectedOptions4 = []
      this.insightList = [
        {
          name: '基础信息',
          checked: false,
        },
        {
          name: '热力分布',
          checked: false,
        },
        {
          name: '区域分布',
          checked: false,
        },
        {
          name: '人群偏好',
          checked: false,
        },
      ]
      this.formData1 = {
        list: [
          {
            crowd: '',
            disabled: false,
          },
          {
            crowd: '',
            disabled: false,
          },
        ],
      }
      this.formData2 = {
        list: [
          {
            carSeries: '',
            crowdName: '',
            brandName: '',
            brandType: 1,
            source: [
              {
                name: '安装了品牌车主APP',
                checked: false,
                disabled: true,
              },
              {
                name: '半年内访问过4s店',
                checked: false,
                disabled: true,
              },
            ],
          },
          {
            carSeries: '',
            crowdName: '',
            brandName: '',
            brandType: 1,
            source: [
              {
                name: '安装了品牌车主APP',
                checked: false,
                disabled: true,
              },
              {
                name: '半年内访问过4s店',
                checked: false,
                disabled: true,
              },
            ],
          },
        ],
      }
      this.formData3 = {
        list: [
          {
            prov: '',
            city: '',
          },
          {
            prov: '',
            city: '',
          },
        ],
        citys: [],
      }
    },
    //下一步(对比分析)
    next(formName) {
      if (this.formData0.brand == 1 && this.rowData) {
        if (this.rowData.id) {
          this.formData1.list[0].crowd = this.rowData.id
          this.formData1.list[0].disabled = true
          this.selectedOptions1.push(this.rowData.id)
        }
      } else {
        this.formData1.list[0].disabled = false
      }
      if (this.active == 1 && this.formData0.brand == 2) {
        formName = 'formData' + (this.active + 1)
      }
      if (this.active == 1 && this.formData0.brand == 3) {
        formName = 'formData' + (this.active + 2)
      }
      this.$refs[formName].validate((valid, item) => {
        if (valid) {
          if (this.active == 1) {
            if (this.formData0.brand == 2) {
              let empty = false
              this.formData2.list.forEach((e, i) => {
                if (
                  e.brandType == 2 &&
                  !e.source[0].checked &&
                  !e.source[1].checked
                ) {
                  empty = true
                  setTimeout(() => {
                    this.$message.warning(`请选择客群${i + 1}的受众来源！`)
                  })
                }
              }, 1000)
              if (empty) return
            }
            if (
              !this.insightList[0].checked &&
              !this.insightList[1].checked &&
              !this.insightList[2].checked &&
              !this.insightList[3].checked
            ) {
              setTimeout(() => {
                this.$message.warning('洞察维度至少选择一项！')
              }, 1000)
              return
            }
            if (
              this.formData1.list.length < 2 ||
              this.formData2.list.length < 2 ||
              this.formData3.list.length < 2
            ) {
              setTimeout(() => {
                this.$message.warning('至少创建两组客群！')
              }, 1000)
              return
            }
            let crowdIdList = [] //已有人群
            let carCrowdlist = [] //车型对比
            let cityList = [] //城市
            this.formData1.list.forEach((e) => {
              crowdIdList.push(e.crowd)
            })
            this.formData2.list.forEach((val) => {
              carCrowdlist.push({
                app: val.source[0].checked ? 1 : 0,
                brandType: val.brandType,
                carSeries: val.carSeries,
                carbrand: val.brandName ? [val.brandName] : [],
                crowdId: val.crowdName,
                is4S: val.source[1].checked ? 1 : 0,
              })
            })
            this.formData3.list.forEach((item) => {
              let name = ''
              this.cityData.forEach((el) => {
                if (el.value == item.city) {
                  name = el.label
                }
              })
              cityList.push({
                cityCode: item.city,
                cityName: name,
              })
            })
            let params = {
              carCrowdlist: carCrowdlist,
              cityList: cityList,
              crowdIdList: crowdIdList,
              reportName: this.formData0.reportName, //报告名称
              basicInform: this.insightList[0].checked ? 1 : 0, //是否基础信息
              thermalDistribute: this.insightList[1].checked ? 1 : 0, //是否热力图
              regionDistribute: this.insightList[2].checked ? 1 : 0, //是否区域分布
              crowdPrefer: this.insightList[3].checked ? 1 : 0, //是否人群偏好
            }
            console.log(params, '参数')
            switch (this.formData0.brand) {
              case 1:
                addExistCrowdContrastInsight(params).then((res) => {
                  this.msg = res.msg
                  if (this.active++ > 2) this.active = 0
                  this.countDown()
                })
                break
              case 2:
                addCarCrowdContrastInsight(params).then((res) => {
                  this.msg = res.msg
                  if (this.active++ > 2) this.active = 0
                  this.countDown()
                })
                break
              case 3:
                addCityCrowdContrastInsight(params).then((res) => {
                  console.log(res, '返回数据')
                  this.msg = res.msg
                  if (this.active++ > 2) this.active = 0
                  this.countDown()
                })
                break
            }
          } else {
            if (this.active++ > 2) this.active = 0
          }
        } else {
          console.log(item, '表单校验错误信息')
          this.$message({
            type: 'warning',
            message: '请完善表单...',
          })
          return false
        }
      })
    },
    //选择省份
    getProv(prov, item) {
      item.city = ''
      item.citys = []
      let tempCity = []
      for (var val of this.cityData) {
        if (prov == val.prov) {
          console.log(val)
          tempCity.push({ label: val.label, value: val.value })
        }
      }
      item.citys = tempCity
    },
    //选择事件
    selectChange(type, value, index) {
      switch (type) {
        case 1:
          this.selectedOptions1[index] = value
          break
        case 2:
          this.selectedOptions2[index] = value
          break
        case 3:
          this.selectedOptions3[index] = value
          let app = 0
          let is4s = 0
          if (this.formData2.list[index].brandName) {
            this.otherCarList.forEach((val) => {
              if (this.formData2.list[index].brandName == val.value) {
                if (val.is4s == 1) {
                  is4s++
                }
                if (val.isApp == 1) {
                  app++
                }
              }
            })
          }
          if (app > 0) {
            this.formData2.list[index].source[0].disabled = false
          } else {
            this.formData2.list[index].source[0].disabled = true
            this.formData2.list[index].source[0].checked = false
          }
          if (is4s > 0) {
            this.formData2.list[index].source[1].disabled = false
          } else {
            this.formData2.list[index].source[1].disabled = true
            this.formData2.list[index].source[1].checked = false
          }
          break
        case 4:
          this.selectedOptions4[index] = value
          break
      }
      console.log(this.selectedOptions2, 'selectedOptions2')
    },
    //禁用计算
    getDisable(value, type) {
      switch (type) {
        case 1:
          if (this.selectedOptions1.indexOf(value) >= 0) {
            return true
          } else {
            return false
          }
          break
        case 2:
          if (this.selectedOptions2.indexOf(value) >= 0) {
            return true
          } else {
            return false
          }
          break
        case 3:
          if (this.selectedOptions3.indexOf(value) >= 0) {
            return true
          } else {
            return false
          }
          break
        case 4:
          if (this.selectedOptions4.indexOf(value) >= 0) {
            return true
          } else {
            return false
          }
          break
      }
    },
    //新增客群
    addList(type) {
      //type: 1:已有人群对比 2:品牌/车型对比 3:城市人群对比
      switch (type) {
        case 1:
          this.formData1.list.push({
            crowd: '',
            disabled: false,
          })
          break
        case 2:
          this.formData2.list.push({
            carSeries: '',
            crowdName: '',
            brandName: '',
            brandType: 0,
            source: [
              {
                name: '安装了品牌车主APP',
                checked: false,
                disabled: true,
              },
              {
                name: '半年内访问过4s店',
                checked: false,
                disabled: true,
              },
            ],
          })
          break
        case 3:
          this.formData3.list.push({
            prov: '',
            city: '',
          })
          break
      }
    },
    //删除客群
    deleteList(index, type) {
      switch (type) {
        case 1:
          // 删除时恢复可选
          if (this.formData1.list[index] || this.formData1.list[index] == 0) {
            this.selectedOptions1.splice(index, 1)
          }
          this.formData1.list.splice(index, 1)
          break
        case 2:
          if (this.formData2.list[index] || this.formData2.list[index] == 0) {
            this.selectedOptions2.splice(index, 1)
            this.selectedOptions3.splice(index, 1)
          }
          this.formData2.list.splice(index, 1)
          break
        case 3:
          if (this.formData3.list[index] || this.formData3.list[index] == 0) {
            this.selectedOptions4.splice(index, 1)
          }
          this.formData3.list.splice(index, 1)
          break
      }
    },
    //打开新增弹窗
    addCustomer() {
      this.dialogFormVisible = true
    },
    //关闭新增弹窗
    closeFrom(val) {
      this.dialogFormVisible = val
      this.crowdList = list
    },
    //查看报告按钮
    toContrastPortrayal() {
      clearInterval(this.timer)
      this.$router.push('/contrastPortrayal')
    },
    //定时器
    countDown() {
      const TIME_COUNT = 5
      if (!this.timer) {
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 1 && this.count <= TIME_COUNT) {
            //限制倒计时区间
            this.count--
          } else {
            clearInterval(this.timer) //删除定时器
            this.timer = null
            //跳转的页面写在此处
            this.$router.push('/crowdInsight')
          }
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.label {
  font-weight: 900;
  height: 30px;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.sussess_box {
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
::v-deep .el-button.icon_delete {
  padding: 0;
  font-size: 16px;
  color: #66b1ff;
}
.formData_box {
  max-width: 680px;
  margin-bottom: 20px;
  .title_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 34px;
    line-height: 34px;
    font-weight: 600;
    padding: 0 20px;
    background: linear-gradient(
      65deg,
      rgba(160, 255, 252, 0.11) 0%,
      rgba(102, 184, 255, 0.21) 100%
    );
    border: 1px solid rgba(104, 183, 255, 0.13);
    backdrop-filter: blur(2px);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    i {
      color: #66b1ff;
    }
  }
  .data_box1 {
    min-height: 70px;
    background: #ffffff;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border: 1px solid rgba(51, 51, 51, 0.2);
    padding: 20px;
  }
  .data_box2 {
    min-height: 170px;
    background: #ffffff;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border: 1px solid rgba(51, 51, 51, 0.2);
    padding: 10px;
  }
}
//vs图标
.vs_box {
  margin-top: 20px;
  text-align: center;
}
//添加数组框
.addBox {
  max-width: 680px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border: 1px dashed rgba(28, 143, 254, 0.4);
  border-radius: 3px;
  margin-top: 20px;
  font-size: 18px;
  color: #66b1ff;
}
.addCustomer {
  border-color: #66b1ff;
  color: #66b1ff;
  margin-left: 10px;
}
.gray_box {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  text-align: center;
  margin-left: 5px;
  cursor: pointer;
}
::v-deep .el-upload-dragger {
  width: 400px;
  height: 170px;
}
::v-deep .data_box1 .el-form-item__label {
  width: 60px !important;
}
::v-deep .data_box2 .el-form-item__label {
  width: 90px !important;
}
::v-deep .data_box1 .el-form-item__error {
  left: 65px;
}
::v-deep .data_box2 .el-form-item__error {
  left: 90px;
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
  //   color: #409eff;
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
