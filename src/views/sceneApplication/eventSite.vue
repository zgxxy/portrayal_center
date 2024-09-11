<!-- 活动选址 -->
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
            <el-step title="选定选址城市及方式"></el-step>
            <el-step title="配置选址条件"></el-step>
            <el-step title="查看选址信息"></el-step>
          </el-steps>
        </div>
      </el-card>
      <el-card v-if="active != 2">
        <el-form
          ref="formData0"
          :model="formData0"
          :rules="rules0"
          v-if="active == 0"
        >
          <el-row :gutter="160">
            <el-col :span="14" style="white-space: nowrap;">
              <el-form-item prop="portraitReportName" label="项目名称：">
                <el-tooltip
                  :content="formData0.portraitReportName"
                  placement="top"
                  effect="light"
                  :disabled="
                    formData0.portraitReportName | showTooltip(inputWidth)
                  "
                >
                  <el-input
                    v-model="formData0.portraitReportName"
                    placeholder="最多不超过30字"
                    maxlength="30"
                    id="inputWidth"
                    clearable
                    style="width: 100%;"
                  ></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="white-space: nowrap;">
              <el-form-item prop="isGenerateReport">
                <el-checkbox
                  style="margin-left: 10px;"
                  v-model="formData0.isGenerateReport"
                  :true-label="1"
                  :false-label="0"
                >
                  生成报告
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="margin: 20px;"></div>
          <el-row :gutter="160">
            <el-col :span="14" style="white-space: nowrap;">
              <el-form-item prop="selectCity" label="选址城市：">
                <el-select
                  v-model="formData0.selectCity"
                  filterable
                  clearable
                  placeholder="请选择或输入城市"
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
              <el-col :span="14" style="white-space: nowrap;"></el-col>
            </el-col>
          </el-row>
          <div style="margin: 20px;"></div>
          <el-form-item prop="selectType" label="选址方式：">
            <el-radio-group v-model="formData0.selectType">
              <el-radio :label="1">目标人群特征匹配</el-radio>
              <el-radio :label="2">竞品人群匹配</el-radio>
              <el-radio :label="3">位置特征</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form
          ref="formData1"
          class="form1"
          :model="formData1"
          v-if="active == 1 && formData0.selectType == 1"
        >
          <el-form-item prop="sourceType">
            <el-radio-group v-model="formData1.sourceType" class="offset">
              <el-radio :label="1">自定义标签特征</el-radio>
              <el-radio :label="2">通过种子人群分析特征</el-radio>
            </el-radio-group>
          </el-form-item>
          <div
            style="
              border: 1px solid rgba(51, 51, 51, 0.2);
              padding-bottom: 30px;
            "
            v-if="formData1.sourceType == 1"
          >
            <List
              v-if="flag"
              :list="dataList.customTagList"
              :maxTag="18"
              :checkedList="formData1.checkedList"
              :groupList="formData1.groupList"
              :tabActive="tabActive"
            ></List>
          </div>
          <div class="upload_box" v-else>
            <!--<span class="offset">至少选择以下任一种方式圈定种子人群</span>
            <div style="margin: 20px;"></div>
            <el-form-item prop="crowdId">
              <div style="white-space: nowrap;">
                <span class="crowdId">已有种子人群：</span>
                <el-select
                  v-model="formData1.crowdId"
                  placeholder="请选择或输入人群"
                  clearable
                  style="width: 50%;"
                >
                  <el-option
                    v-for="(item, index) in crowdList"
                    :key="'crowd' + index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <div style="margin: 20px;"></div>
            <el-form-item prop="uploadFile" class="offset">
              <uploadFile
                ref="uploadFile"
                :limit="5"
                :fileSize="100"
                accept=".xlsx,.xls,.csv,.txt"
                uploadTitle="上传新人群"
                :fileList="formData1.fileList"
                :successRes="successRes"
                :failRes="failRes"
                downloadUrl="/audience/crowd/crowdPackage/downloadModuleFile"
                :uploadFile="handleUpload"
                @handleChange="handleChange"
              />
            </el-form-item>
            -->
            <el-radio-group class="offset" v-model="formData1.crowdType">
              <el-radio-button :label="1">已有种子人群</el-radio-button>
              <el-radio-button :label="2">上传新人群</el-radio-button>
            </el-radio-group>
            <div style="margin: 20px;"></div>
            <el-form-item prop="crowdId" v-show="formData1.crowdType == 1">
              <div style="white-space: nowrap;">
                <span class="crowdId">已有种子人群：</span>
                <el-select
                  v-model="formData1.crowdId"
                  placeholder="请选择或输入人群"
                  clearable
                  style="width: 50%;"
                >
                  <el-option
                    v-for="(item, index) in crowdList"
                    :key="'crowd' + index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <div style="margin: 20px;"></div>
            <el-form-item
              prop="uploadFile"
              class="offset"
              v-show="formData1.crowdType == 2"
            >
              <uploadFile
                ref="uploadFile"
                :limit="5"
                :fileSize="100"
                accept=".xlsx,.xls,.csv,.txt"
                uploadTitle="上传新人群"
                :fileList="formData1.fileList"
                :successRes="successRes"
                :failRes="failRes"
                downloadUrl="/audience/crowd/crowdPackage/downloadModuleFile"
                :uploadFile="handleUpload"
                @handleChange="handleChange"
              />
            </el-form-item>
          </div>
        </el-form>
        <el-form
          ref="formData2"
          :model="formData2"
          :rules="rules2"
          v-if="active == 1 && formData0.selectType == 2"
        >
          <el-form-item prop="brandName" label="品牌名称：">
            <div style="white-space: nowrap;">
              <el-select
                v-model="formData2.brandName"
                placeholder="请选择或输入品牌"
                multiple
                clearable
                :filterable="true"
                @change="brandNameSelect"
                style="width: 50%;"
              >
                <el-option
                  v-for="(item, index) in otherCarList"
                  :key="'car' + index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <div style="margin: 20px;"></div>
          <el-form-item prop="source" label="受众来源：">
            <div style="white-space: nowrap;">
              <checkbox :data="formData2.source"></checkbox>
            </div>
          </el-form-item>
        </el-form>
        <el-form
          ref="formData3"
          class="form1"
          :model="formData3"
          v-if="active == 1 && formData0.selectType == 3"
        >
          <el-form-item prop="condition">
            <el-radio-group v-model="formData3.condition" class="offset">
              <!--<el-radio :label="1">商圈条件</el-radio>-->
              <el-radio :label="2">商场条件</el-radio>
            </el-radio-group>
          </el-form-item>
          <div style="padding-bottom: 30px;" v-if="formData3.condition == 2">
            <List
              v-if="flag"
              :list="dataList.marketTagList"
              :maxTag="18"
              :checkedList="formData3.checkedList"
              :groupList="formData3.groupList"
              :tabActive="tabActive"
            ></List>
          </div>
        </el-form>
      </el-card>
      <div v-if="active == 2">
        <div class="sussess_box" v-if="active == 2">
          <div class="count_box">
            <span>{{ msg }}</span>
            <span class="count">{{ count }}</span>
            秒后自动跳转到项目分析报告列表
          </div>
          <el-button @click="toVehicleType">查看选址信息</el-button>
        </div>
        <el-form
          ref="formData4"
          class="sussess_box"
          :model="formData4"
          v-show="false"
        >
          <el-card>
            <el-row :gutter="90">
              <el-col :span="16" style="white-space: nowrap;">
                <el-form-item prop="city" label="城市：">
                  <el-select
                    v-model="formData4.city"
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
              <el-col :span="8" style="white-space: nowrap;" v-show="false">
                <el-form-item prop="region">
                  <el-radio-group v-model="formData4.tabPosition">
                    <el-radio-button label="行政区">行政区</el-radio-button>
                    <el-radio-button label="商圈">商圈</el-radio-button>
                  </el-radio-group>
                  <span style="margin-left: 10px;">
                    <el-select
                      v-if="formData4.tabPosition == '行政区'"
                      v-model="formData4.region"
                      filterable
                      clearable
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
                    <el-select
                      v-else
                      v-model="formData4.business"
                      filterable
                      clearable
                      placeholder="请选择或输入商圈"
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="item in businesses"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                  "
                >
                  <i class="el-icon-setting setting" @click="settingDialog"></i>
                  <el-image
                    style="cursor: pointer;"
                    :src="require('@/assets/images/slices/download.svg')"
                    @click="downloadReportFile"
                  ></el-image>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="mapBox">
            <div class="mapBox_0">
              <AMap
                class="left_box"
                ref="child"
                :value="formData4.searchValue"
              ></AMap>
              <div class="right_box">
                <div class="setting_box">
                  <div class="label">{{ cityCompute(formData4.city) }}</div>
                  <div class="data_box">
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
                  <div class="data_box dataBox2">
                    <div
                      v-for="(item, index) in dataList.data"
                      :key="'data' + index"
                    >
                      <div>
                        <span>{{ item.value }}</span>
                        个
                      </div>
                      <div>{{ item.name }}</div>
                    </div>
                  </div>
                  <el-tabs
                    v-model="activeName"
                    class="tabs"
                    @tab-click="tabClick"
                  >
                    <el-tab-pane label="热门商圈" name="first">
                      <div v-if="activeName == 'first'">
                        <div class="label">Top 5 热门商圈</div>
                        <Column
                          :data="dataList.columnData.business1.dataList"
                          :xAxis="dataList.columnData.business1.xaxis"
                          :yName="['万人/天']"
                          text="全市日均客流量top 5 商圈"
                          height="160px"
                          style="margin-bottom: 20px;"
                        />
                        <Column
                          :data="dataList.columnData.business2.dataList"
                          :xAxis="dataList.columnData.business2.xaxis"
                          :yName="['占比', 'TGI']"
                          text="目标客群热门分布top 5 商圈"
                          height="160px"
                          style="margin-bottom: 20px;"
                        />
                        <div class="label">Top 5 热门商圈客流趋势</div>
                        <myLine
                          :data="dataList.passingFlowVO.dataList"
                          :xAxis="dataList.passingFlowVO.xaxis"
                          height="160px"
                        />
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="热门商场" name="second">
                      <div v-if="activeName == 'second'">
                        <div class="label">客流top 5 商场</div>
                        <Column
                          :data="dataList.columnData.business1.dataList"
                          :xAxis="dataList.columnData.business1.xaxis"
                          :yName="['万人/天']"
                          text="全市日均客流量top 5 商场"
                          height="160px"
                          style="margin-bottom: 20px;"
                        />
                        <Column
                          :data="dataList.TargetCustomer.dataList"
                          :xAxis="dataList.TargetCustomer.xaxis"
                          :yName="['占比']"
                          text="目标客群热门分布top 5 商场"
                          height="160px"
                          style="margin-bottom: 20px;"
                        />
                        <div class="label">客流top 5 商场月客流量趋势</div>
                        <myLine
                          :data="dataList.passingFlowVO.dataList"
                          :xAxis="dataList.passingFlowVO.xaxis"
                          height="160px"
                        />
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="热门小区" name="third">
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
        </el-form>
      </div>
      <el-card v-if="active != 2">
        <div class="btn">
          <el-button v-if="active == 1" @click="prev()">上一步</el-button>
          <el-button
            type="primary"
            @click="next('formData' + active)"
            width="20"
          >
            {{ active == 0 ? '下一步' : '确定' }}
          </el-button>
        </div>
      </el-card>
      <setting
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
  getAdministrativeRegionsCodeByCityName,
  addTagCrowd,
  crowdConfirm,
  generateCrowdReport,
  getActiveLocalTagData,
} from '@/api/crowdControl'
import { uploadCrowdByFile } from '@/api/crowdPackage'
import {
  getCarSeries,
  getCarBrandData,
  addCarSeriesInsight,
} from '@/api/crowdInsight'
import {
  active,
  addActiveLocalProject,
  getActiveLocalCity,
} from '@/api/sceneApplication'
import checkbox from '@/components/button/checkBox'
import List from '@/components/tag/List'
import tagList from '/public/testData/tagList.json'
import uploadFile from '@/components/uploadFile/uploadFile'
import { matchFileType, uuid } from '@/utils/file'
import AMap from '@/components/MapContainer/AMap'
import Column from '@/components/echarts/ColumnLine.vue'
import myLine from '@/components/echarts/Line.vue'
import columnData from '/public/testData/portrayalData.json'
import setting from './components/settingDialog.vue'
import poiData from '/public/testData/poiData.json'
export default {
  components: {
    checkbox,
    List,
    uploadFile,
    AMap,
    Column,
    myLine,
    setting,
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
      active: 0, //当前步骤数
      activeName: 'first', //tab
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      dialogFormVisible: false, //规则配置弹窗
      dialogFormData: {},
      count: '', //定时跳转
      msg: '', //第三页显示接口返回状态
      mapUrl: [
        require('@/assets/images/slices/map1_blue.png'),
        require('@/assets/images/slices/map1_red.png'),
      ],
      mapIndex: 0,
      //首页
      formData0: {
        portraitReportName: '', //报告名称
        isGenerateReport: 1,
        selectCity: '', //选址城市
        selectType: 1, //选址方式
      },
      //目标人群匹配
      formData1: {
        sourceType: 1, //来源类型
        crowdType: 1, //人群类型--已有or新增
        crowdId: '', //人群
        fileList: [], //上传文件列表
        isMD5: true,
        folderName: uuid(),
        groupList: [],
        checkedList: [], //选中的标签
      },
      //竞品人群匹配
      formData2: {
        brandName: [],
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
      //位置特征
      formData3: {
        condition: 2,
        groupList: [],
        checkedList: [], //选中的标签
      },
      //选址信息页
      formData4: {
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
      ownCarList: [], //自有品牌车系列表
      otherCarList: [], //其他品牌车系列表
      crowdList: [], //人群列表
      brandList: [], //品牌列表
      tabActive: '0',
      flag: true, //子组件渲染
      successRes: [], //返回成功上传的数据
      failRes: [], //返回失败上传的数据
      dataList: {
        customTagList: [], //自定义标签特征数据
        marketTagList: tagList.data2, //商场标签数据
        peopleData: [
          { value: 1881.06, name: '常住人口' },
          { value: 880, name: '户籍人口' },
          { value: 1011.53, name: '流动人口' },
        ],
        data: [
          { value: 20, name: '商圈数量' },
          { value: 1621, name: '商场/购物中心' },
          { value: 5000, name: '楼盘数量' },
        ],
        columnData: columnData,
        TargetCustomer: columnData.business2,
        passingFlowVO: columnData.lineData,
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
            peopleNum: '3',
            floorArea: '21',
          },
          {
            businessName: '碧桂园凤凰城',
            peopleNum: '50',
            floorArea: '6000',
          },
          {
            businessName: '金碧花园',
            peopleNum: '5',
            floorArea: '52',
          },
          {
            businessName: '光大花园',
            peopleNum: '4.5',
            floorArea: '43',
          },
          {
            businessName: '逸景翠园',
            peopleNum: '4',
            floorArea: '40',
          },
        ],
      },
      rules0: {
        portraitReportName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { validator: validateName },
        ],
        selectCity: [
          { required: true, message: '请选择城市', trigger: 'blur' },
        ],
        selectType: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      rules2: {
        brandName: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        source: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.inputWidth = document.getElementById('inputWidth').offsetWidth - 45
  },
  methods: {
    // 获取列表
    getList() {
      this.crowdList = []
      this.ownCarList = []
      this.otherCarList = []
      this.citys = []
      //清除标签选中状态
      this.dataList.customTagList.forEach((e) => {
        e.children.map((item, index) => {
          if (item.checked) {
            e.children.splice(index, 1)
          }
        })
      })
      //获取城市列表
      getActiveLocalCity().then((res) => {
        if (res.code == 200) {
          res.data.forEach((e) => {
            //目前只添加武汉市和广州市
            this.citys.push({
              label: e.city,
              value: e.cityCode,
              provinceCode: e.provinceCode,
            })
          })
        }
      })
      getAllFileCrowdVo({ userId: sessionStorage.getItem('id') }).then(
        (res) => {
          if (res.code == 200) {
            res.data.forEach((e) => {
              this.crowdList.push({
                label: e.crowdName,
                value: e.id,
              })
            })
          }
        },
      )
      getCarSeries({ brand: '东风日产' }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((e) => {
            this.ownCarList.push({
              label: e.name,
              value: e.value,
            })
          })
        }
      })
      getCarBrandData({ brand: '日产' }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((e) => {
            this.otherCarList.push({
              label: e.name,
              value: e.value,
              is4s: e.is4s,
              isApp: e.isApp,
            })
          })
        }
      })
      getActiveLocalTagData().then((res) => {
        if (res.code == 200) {
          this.dataList.customTagList = res.data
        }
      })
    },
    //获取行政区
    getRegions(val) {
      this.regions = []
      this.formData4.region = ''
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
    cityCompute(val) {
      let city = ''
      this.citys.forEach((e) => {
        if (val == e.value) {
          city = e.label
        }
      })
      // let city = this.citys.find((e) => e.value == val).label
      return city
    },
    //上一步
    prev() {
      if (this.active-- > 2) this.active = 0
      this.formData1 = {
        sourceType: 1, //来源类型
        crowdType: 1,
        crowdId: '', //人群
        fileList: [], //上传文件列表
        isMD5: true,
        folderName: this.formData1.folderName,
        groupList: [],
        checkedList: [], //选中的标签
      }
      //清除标签选中状态
      this.dataList.customTagList.forEach((e) => {
        e.children.map((item, index) => {
          if (item.checked) {
            delete item.checked
          }
        })
      })
      this.formData2 = {
        brandName: [],
        source: [
          {
            name: '安装了品牌车主APP',
            checked: false,
          },
          {
            name: '半年4s店访问记录',
            checked: false,
          },
        ],
      }
    },
    //下一步
    next(formName) {
      const that = this
      if (this.active == 1 && this.formData0.selectType == 2) {
        formName = 'formData' + (this.active + 1)
      }
      if (this.active == 1 && this.formData0.selectType == 3) {
        formName = 'formData' + (this.active + 2)
      }
      this.$refs[formName].validate((valid, item) => {
        if (valid) {
          if (this.active == 1 && this.formData0.selectType == 1) {
            if (
              this.formData1.sourceType == 1 &&
              this.formData1.checkedList.length == 0
            ) {
              this.$message.warning('请选择标签！')
              return
            }
            if (
              this.formData1.sourceType == 2 &&
              !this.formData1.crowdId &&
              this.successRes.length == 0
            ) {
              this.$message.warning('至少选择任一种方式圈定种子人群！')
              return
            }
          }
          if (this.active == 1 && this.formData0.selectType == 2) {
            if (
              !this.formData2.source[0].checked &&
              !this.formData2.source[1].checked
            ) {
              this.$message.warning('请选择受众来源！')
              return
            }
          }
          if (this.active == 1 && this.formData0.selectType == 3) {
            if (
              this.formData3.condition == 2 &&
              this.formData3.checkedList.length == 0
            ) {
              this.$message.warning('请选择标签！')
              return
            }
          }
          // if (this.active == 1) {
          //   let url = require('@/assets/images/slices/map0_blue.png')
          //   this.$refs.child.addMarker({ poi: poiData, url: url })
          // }
          let list = []
          this.successRes.forEach((e) => {
            list.push({
              dataType: e.dataType,
              fileName: e.fileName,
              fileType: matchFileType(e.fileName),
              sampleSize: e.sampleSize,
              fileSize: e.fileSize,
              geTuiPath: e.geTuiPath,
              fileId: e.fileId,
              isMD5: e.isMD5,
            })
          })
          var data = JSON.parse(JSON.stringify(this.formData1.groupList))
          let newArray = [] //只包含checked==true的数据
          let conformArray = [] //选中的value字符串拼接
          let nameArray = [] //选中的name字符串拼接
          data.forEach((now, index) => {
            newArray[index] = now
            newArray[index].children = now.children.filter((item) => {
              return item.checked == true
            })
          })
          newArray.forEach((e) => {
            e['valStr'] = ''
            e['nameStr'] = ''
            e.children.forEach((val) => {
              e.valStr += val.value + ','
              e.nameStr += val.name + ','
            })
            e.valStr = e.valStr.substr(0, e.valStr.length - 1)
            conformArray.push(e.valStr)
            e.nameStr = e.nameStr.substr(0, e.nameStr.length - 1)
            nameArray.push(e.nameStr)
          })
          if (this.active == 1 && this.formData0.selectType !== 3) {
            let params = {
              selectType: this.formData0.selectType,
              name: this.formData0.portraitReportName,
              isGenerateReport: this.formData0.isGenerateReport,
              city: this.formData0.selectCity,
              tagList: this.formData1.sourceType == 1 ? conformArray : [],
              crowdId:
                this.formData1.sourceType == 2 ? this.formData1.crowdId : '',
              fileList: this.formData1.sourceType == 2 ? list : [],
              isMD5: this.formData1.isMD5,
              carbrand: this.formData2.brandName,
              app: this.formData2.source[0].checked ? 1 : 0,
              is4S: this.formData2.source[1].checked ? 1 : 0,
            }
            console.log(params, '参数')
            //选择自定义标签
            if (
              this.formData0.selectType == 1 &&
              this.formData1.sourceType == 1
            ) {
              let tagParams = {
                crowdName: this.formData0.portraitReportName + '-人群包',
                isGenerateReport: this.formData0.isGenerateReport,
                reportName: this.formData0.portraitReportName + '-报告',
                tagsCode: conformArray,
                tagNameList: nameArray,
                userId: sessionStorage.getItem('id'),
              }
              console.log(tagParams, '标签参数')
              addTagCrowd(tagParams).then((res) => {
                if (res.code == 200) {
                  this.addActive(res.data)
                } else {
                  this.$message.error('操作失败！')
                }
              })
            }
            //已有种子人群
            if (
              this.formData0.selectType == 1 &&
              this.formData1.sourceType == 2 &&
              this.formData1.crowdType == 1
            ) {
              generateCrowdReport({
                reportName: this.formData0.portraitReportName + '-报告',
                crowdId: this.formData1.crowdId,
              }).then((res) => {
                if (res.code == 200) {
                  this.addActive(res.data)
                } else {
                  this.$message.error('操作失败！')
                }
              })
            }
            //上传人群包
            if (
              this.formData0.selectType == 1 &&
              this.formData1.sourceType == 2 &&
              this.formData1.crowdType == 2
            ) {
              let fileParams = {
                crowdName: this.formData0.portraitReportName + '-人群包',
                fileList: list,
                folderName: this.formData1.folderName,
                isGenerateReport: this.formData0.isGenerateReport,
                reportName:
                  this.formData0.isGenerateReport == 1
                    ? this.formData0.portraitReportName + '-报告'
                    : '',
                userId: sessionStorage.getItem('id'),
              }
              console.log(fileParams, '文件参数')
              crowdConfirm(fileParams).then((res) => {
                if (res.code == 200) {
                  this.addActive(res.data.reportId)
                } else {
                  this.$message.error('操作失败！')
                }
              })
            }
            //竞品人群
            if (this.formData0.selectType == 2) {
              let brandParams = {
                app: this.formData2.source[0].checked ? 1 : 0,
                is4S: this.formData2.source[1].checked ? 1 : 0,
                brandType: 2,
                carSeries: '',
                carbrand: this.formData2.brandName,
                crowdId: 0,
                name: this.formData0.portraitReportName,
                userId: sessionStorage.getItem('id'),
              }
              console.log(brandParams, '竞品人群参数')
              addCarSeriesInsight(brandParams).then((res) => {
                if (res.code == 200) {
                  this.addActive(res.data)
                } else {
                  this.$message.error('操作失败！')
                }
              })
            }
          } else if (this.formData0.selectType == 3) {
            let cityName = this.citys.find(
              (e) => e.value == this.formData0.selectCity,
            ).label
            this.$router.push({
              // path: '/sceneApplication/shoppingAnalysis',
              // query: { city: cityName },
              name: 'shoppingAnalysis',
              params: { city: cityName },
            })
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
    async addActive(val) {
      let city = this.citys.find((e) => e.value == this.formData0.selectCity)
        .label
      let provinceCode = this.citys.find(
        (e) => e.value == this.formData0.selectCity,
      ).provinceCode
      let params = {
        city: city,
        cityCode: this.formData0.selectCity,
        provinceCode: provinceCode,
        projectName: this.formData0.portraitReportName,
        reportId: val,
      }
      let res = await addActiveLocalProject(params)
      if (res.code == 200) {
        if (this.active++ > 2) this.active = 0
        this.countDown()
        this.$message.success('添加活动选址项目成功！')
      }
    },
    toVehicleType() {
      clearInterval(this.timer)
      this.$router.push('/sceneApplication')
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
            this.$router.push('/sceneApplication')
          }
        }, 1000)
      }
    },
    //品牌选择
    brandNameSelect() {
      if (this.formData2.brandName.length > 3) {
        this.$message.warning('选择的车型不能超过3个！')
        this.formData2.brandName.pop()
      }
      let app = 0
      let is4s = 0
      if (this.formData2.brandName.length > 0) {
        this.formData2.brandName.forEach((e) => {
          this.otherCarList.forEach((val) => {
            if (e == val.value) {
              if (val.is4s == 1) {
                is4s++
              }
              if (val.isApp == 1) {
                app++
              }
            }
          })
        })
      }
      if (app > 0) {
        this.formData2.source[0].disabled = false
      } else {
        this.formData2.source[0].disabled = true
        this.formData2.source[0].checked = false
      }
      if (is4s > 0) {
        this.formData2.source[1].disabled = false
      } else {
        this.formData2.source[1].disabled = true
        this.formData2.source[1].checked = false
      }
    },
    //上传按钮
    handleUpload() {
      let file = []
      this.formData1.fileList.forEach((e) => {
        file.push({
          fileName: e.name,
          fileSize: e.size,
        })
      })
      let mutipartFile = new FormData()
      this.formData1.fileList.forEach((el) => {
        mutipartFile.append('multipartFile', el.raw)
      })
      mutipartFile.append('fileList', JSON.stringify(file))
      mutipartFile.append('isMD5', this.formData1.isMD5)
      mutipartFile.append('folderName', this.formData1.folderName)
      if (this.formData1.fileList.length > 0) {
        uploadCrowdByFile(mutipartFile).then((res) => {
          this.failRes = res.data.fileUploadFailReturnVOList
          this.successRes.push(...res.data.fileUploadSuccessReturnVOList)
        })
      } else {
        this.$message.warning('请选择文件！')
      }
      this.formData1.fileList = []
    },
    //上传文件组件传值
    handleChange(index) {
      this.formData1.isMD5 = index
    },
    iconChange(item, index) {
      this.mapIndex = index
    },
    //地址查询
    search() {
      this.$refs.child.searchPoint(this.mapUrl[this.mapIndex])
      // this.$refs.child.searchPoint()
    },
    tabClick() {},
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
.el-form-item {
  margin-bottom: 0;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.form1 {
  .upload_box {
    margin: 20px 0;
    span {
      color: red;
      font-size: 12px;
    }
    .crowdId {
      color: #303133;
      font-weight: 600;
      font-size: 12px;
      margin-left: 40px;
    }
  }
  .offset {
    margin-left: 40px;
  }
}
.gray_box {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  text-align: center;
  margin-left: 10px;
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
    flex: 2;
  }
  .right_box {
    height: 555px;
    overflow-y: auto;
    flex: 1;
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
  font-size: 12px;
  color: #666666;
  :nth-child(n + 1) {
    margin-right: 10px;
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
    width: 102px;
    height: 68px;
    background: linear-gradient(
      65deg,
      rgba(160, 255, 252, 0.11) 0%,
      rgba(102, 184, 255, 0.21) 100%
    );
    border: 1px solid rgba(104, 183, 255, 0.13);
    border-radius: 5px;
    margin-bottom: 20px;
    padding: 0 10px;
    :nth-child(n + 1) {
      margin-bottom: 5px;
    }
    span {
      font-size: 12px;
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
::v-deep .tabs .el-tabs__item {
  font-size: 12px;
  font-weight: 600;
  font-size: 12px;
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
