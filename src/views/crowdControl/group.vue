<!-- 组合规则圈人 -->
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
        <div class="content">
          <el-card class="left_box">
            <el-tabs v-model="activeName">
              <el-tab-pane label="本地上传" name="1">
                <el-form-item prop="uploadFile">
                  <uploadFile
                    ref="uploadFile"
                    :limit="5"
                    :fileSize="100"
                    accept=".xlsx,.xls,.csv,.txt"
                    uploadTitle="人群ID文件上传"
                    :fileList="formData.fileList"
                    :successRes="successRes"
                    :failRes="failRes"
                    downloadUrl="/audience/crowd/crowdPackage/downloadModuleFile"
                    :uploadFile="handleUpload"
                    :disabled="uploadDisabled"
                    @handleChange="handleChange"
                  />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="区域/商圈圈人" name="2">
                <el-card class="mapBox">
                  <div class="mapBox_0">
                    <AMap
                      class="left_box_map"
                      :isSearch="false"
                      :value="formData.searchValue"
                      @searchPoi="searchPoi"
                      ref="child"
                    ></AMap>
                    <div class="right_box_map">
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
                              @click="popshow = !popshow"
                            ></i>
                            <i
                              v-if="!popshow"
                              class="el-icon-zoom-in"
                              slot="reference"
                              @click="popshow = !popshow"
                            ></i>
                            <div
                              style="
                                display: flex;
                                justify-content: space-between;
                              "
                            >
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
                                style="color: #999;"
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
                              <el-empty
                                description="暂无数据"
                                style="height: 50px;"
                              />
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
                              <el-button
                                size="small"
                                type="primary"
                                @click="addMarker"
                              >
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
                      <!-- 记得和本地上传区分字段名 -->
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
                              formData.areaType == 3
                                ? PickerOptions1
                                : PickerOptions2
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
                                    startTimeDisable
                                      ? PickerOptions3
                                      : PickerOptions4
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
                                    endTimeDisable
                                      ? PickerOptions3
                                      : PickerOptions4
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
                            3.
                            如果全选范围分布在1个以上的城市，时间范围需控制在7天内
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="TA标签圈人" name="3">
                <div style="border: 1px solid rgba(51, 51, 51, 0.2);">
                  <tagBox
                    v-if="flag"
                    ref="childData"
                    :dataList="dataList.tagData"
                    :maxTag="18"
                    :checkedList="checkedList"
                    :groupList="groupList"
                    :tabActive="tabActive"
                    @tabClick="tabClick"
                  ></tagBox>
                </div>
              </el-tab-pane>
              <el-tab-pane label="APP组合圈人" name="4">
                <div class="selectBox">
                  <el-cascader
                    class="select"
                    v-model="formData.classify"
                    :props="{ expandTrigger: 'hover' }"
                    :options="dataList.classList"
                    @change="handleIconClick"
                    clearable
                  />
                  <el-select
                    class="select"
                    v-model="formData.level"
                    placeholder="人群覆盖量"
                    @change="handleIconClick"
                    clearable
                  >
                    <el-option
                      v-for="item in dataList.levelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-input
                    placeholder="请输入APP名字"
                    v-model="formData.name"
                    class="input-with-select"
                    @keyup.enter.native="handleIconClick()"
                    clearable
                    style="width: 50%;"
                  >
                    <i
                      class="el-icon-search el-input__icon"
                      slot="suffix"
                      @click="handleIconClick()"
                    ></i>
                  </el-input>
                </div>
                <el-table
                  ref="multipleTable"
                  :data="dataList.tableList"
                  style="width: 100%; margin-top: 16px;"
                  height="450"
                  border
                  stripe
                  :row-key="getRowKeys"
                  @selection-change="handleSelectionChange"
                  :header-cell-style="{
                    background: '#eef5ff',
                    color: '#606266',
                    borderColor: '#d8e6fe',
                  }"
                  :cell-style="{ borderColor: '#d8e6fe' }"
                >
                  <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    width="50"
                  ></el-table-column>
                  <el-table-column type="index" label="序号" width="50" />
                  <el-table-column prop="logo" label="APP图标" align="left">
                    <template slot-scope="scope">
                      <el-image
                        :src="scope.row.logo"
                        style="width: 30px; height: 30px;"
                      >
                        <div slot="error" class="image-slot">
                          <i
                            class="el-icon-menu"
                            style="font-size: 33px; color: #cce0fc;"
                          ></i>
                        </div>
                        <!--
                    <el-image
                      :src="require('@/assets/images/slices/APP.svg')"
                      style="width: 36px; height: 36px;"
                      slot="error"
                    ></el-image>
                    -->
                      </el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="APP名称" />
                  <el-table-column prop="type" label="所属分类" />
                </el-table>
                <div>
                  <el-pagination
                    class="small"
                    :current-page="page.pageNo"
                    :page-sizes="[100, 200, 300]"
                    :page-size="page.pageSize"
                    :pager-count="5"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="addBtn">
              <i v-if="activeName == 3" class="el-icon-info">
                还可选择
                <span>{{ 18 - groupList.length }}</span>
                个标签组合
              </i>
              <i v-if="activeName == 4" class="el-icon-info">
                请至少选择4个app！
              </i>
              <el-button @click="addRule()">
                添加规则
              </el-button>
              <!--
              <el-button @click="addFilter()" v-if="activeName != '1'">
                过滤规则
              </el-button>
              -->
            </div>
          </el-card>
          <el-card class="right_box">
            <div>
              人群圈选规则
            </div>
            <div class="body">
              包含
              <div class="template">
                <div class="title_box">
                  <el-image
                    class="closeBtn"
                    :src="require('@/assets/images/slices/closeBtn@2x.png')"
                    @click="handleclose(1)"
                  ></el-image>
                  本地上传
                </div>
                <div class="data_box">
                  <div
                    class="gray_box"
                    v-if="rightData.successResRight.length == 0"
                  >
                    暂无数据
                  </div>
                  <div
                    class="fileList_box"
                    v-for="(item, index) in rightData.successResRight"
                    :key="'file' + index"
                    v-else
                  >
                    <div class="gray_box">{{ item.fileName }}</div>
                    <i class="el-icon-close" @click="deleteFile(item)"></i>
                  </div>
                </div>
              </div>
              <div class="gray_box">∩并且</div>
              <div class="template">
                <div class="title_box">
                  <el-image
                    class="closeBtn"
                    :src="require('@/assets/images/slices/closeBtn@2x.png')"
                    @click="handleclose(2)"
                  ></el-image>
                  <div>LBS人群</div>
                  <!--  <div class="blue_box">距离：{{ formData.radius }}m</div>-->
                </div>
                <div class="data_box">
                  <div
                    class="gray_box"
                    v-if="rightData.markerListRight.length == 0"
                  >
                    暂无数据
                  </div>
                  <div class="tag_box" v-else>
                    <el-tag
                      v-for="(item, index) in rightData.markerListRight"
                      :key="'lbs' + index"
                      closable
                      :disable-transitions="false"
                      @close="deleteMaker(item)"
                      class="tag"
                    >
                      {{ item.name }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="gray_box">∩并且</div>
              <div class="template">
                <div class="title_box">
                  <el-image
                    class="closeBtn"
                    :src="require('@/assets/images/slices/closeBtn@2x.png')"
                    @click="handleclose(3)"
                  ></el-image>
                  TA标签
                </div>
                <div class="data_box">
                  <div
                    class="gray_box"
                    v-if="rightData.checkedListRight.length == 0"
                  >
                    暂无数据
                  </div>
                  <div class="tag_box" v-else>
                    <el-tag
                      v-for="(tag, i) in rightData.checkedListRight"
                      :key="'tag' + i"
                      closable
                      :disable-transitions="false"
                      @close="deleteTag(tag)"
                      class="tag"
                    >
                      {{ tag.name }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <!--
              <div
                style="border-bottom: 1px solid #dcdfe6; margin: 10px 0;"
              ></div>
              <div>过滤</div>
              <div class="template">
                <div class="title_box">
                  <el-image
                    class="closeBtn"
                    :src="require('@/assets/images/slices/closeBtn@2x.png')"
                    @click="handleclose(0)"
                  ></el-image>
                  TA标签过滤规则
                </div>
                <div class="data_box">
                  <div
                    class="gray_box"
                    v-if="rightData.filterListTA.length == 0"
                  >
                    暂无数据
                  </div>
                  <div class="tag_box" v-else>
                    <el-tag
                      v-for="(tag, i) in rightData.filterListTA"
                      :key="'tag' + i"
                      closable
                      :disable-transitions="false"
                      @close="deleteTag(tag)"
                      class="tag"
                    >
                      {{ tag.name }}
                    </el-tag>
                  </div>
                </div>
              </div>
              -->
              <div class="gray_box">∩并且</div>
              <div class="template">
                <div class="title_box">
                  <el-image
                    class="closeBtn"
                    :src="require('@/assets/images/slices/closeBtn@2x.png')"
                    @click="handleclose(4)"
                  ></el-image>
                  APP组合圈人
                </div>
                <div class="data_box">
                  <div
                    class="gray_box"
                    v-if="rightData.selectListRight.length == 0"
                  >
                    暂无数据
                  </div>
                  <div class="tag_box" v-else>
                    <el-tag
                      v-for="(tag, i) in rightData.selectListRight"
                      :key="'tag' + i"
                      closable
                      :disable-transitions="false"
                      @close="deleteApp(tag)"
                      class="tag"
                    >
                      {{ tag.name }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <!--
              <div
                style="border-bottom: 1px solid #dcdfe6; margin: 10px 0;"
              ></div>
              <div>过滤</div>
              <div class="template">
                <div class="title_box">
                  <el-image
                    class="closeBtn"
                    :src="require('@/assets/images/slices/closeBtn@2x.png')"
                    @click="handleclose(0)"
                  ></el-image>
                  APP组合圈人过滤规则
                </div>
                <div class="data_box">
                  <div
                    class="gray_box"
                    v-if="rightData.selectListRight.length == 0"
                  >
                    暂无数据
                  </div>
                  <div class="tag_box" v-else>
                    <el-tag
                      v-for="(tag, i) in rightData.selectListRight"
                      :key="'tag' + i"
                      closable
                      :disable-transitions="false"
                      @close="deleteApp(tag)"
                      class="tag"
                    >
                      {{ tag.appName }}
                    </el-tag>
                  </div>
                </div>
              </div>
              -->
            </div>
          </el-card>
        </div>
      </el-form>
    </el-card>
    <bottom-fixed>
      <div class="btn">
        <el-button type="">
          <router-link :to="{ name: 'portraitReport' }">
            取消
          </router-link>
        </el-button>
        <el-button type="primary" @click="confirm('formData')">
          确定
        </el-button>
      </div>
    </bottom-fixed>
  </div>
</template>

<script>
import uploadFile from '@/components/uploadFile/uploadFile'
import { uploadCrowdByFile } from '@/api/crowdPackage'
import {
  getTagData,
  getAppListByPage,
  getQueryData,
  combinationCrowd,
} from '@/api/crowdControl'
import { uuid } from '@/utils/file'
import { stopDifference, uniqueArr, AMapTransBMap } from '@/utils/public'
import tagBox from '@/components/tag/tagForm'
import tagEditBtn from '@/components/tag/tagEditBtn'
import AMap from '@/components/MapContainer/AMap'
export default {
  components: {
    uploadFile,
    tagBox,
    tagEditBtn,
    AMap,
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
      activeName: '1',
      tabActive: '0', //TA标签侧边tab
      inputWidth1: null, //输入框长度--用于判断tooltip是否显示
      inputWidth2: null,
      flag: true, //子组件渲染
      //表单数据
      formData: {
        crowdName: '', //人群名称
        isGenerateReport: 1, //是否生成报告
        reportName: '', //报告名称
        //文件上传
        fileList: [], //上传文件
        isMD5: true, //是否使用MD5加密
        folderName: uuid(), //文件名
        //区域圈人
        searchValue: '', //地址搜索
        fileList: [],
        radius: 1, //辐射半径
        areaType: 1, //受众
        startDate: '', //开始日期
        startTime: '', //开始时间
        endDate: '', //结束日期
        endTime: '', //结束时间
        //app组合圈人
        classify: [], //分类
        level: '', //人群覆盖量
        name: '', //app名称
      },
      //文件上传
      uploadDisabled: false,
      successRes: [], //返回成功上传的数据
      failRes: [], //返回失败上传的数据
      //区域圈人
      radio: 1,
      popshow: false, //设置按钮下拉框显示
      poiList: [], //查询到的poi列表
      checkAll: false,
      checkedPoi: [], //每次查询选择的poi
      markerList: [], //标点列表--储存多次查询选中的数据
      isIndeterminate: false,
      //TA标签圈人
      checkedList: [], //选中的标签
      groupList: [], //选中的标签组合
      //app组合圈人
      selectList: [], //表格选中的数据
      page: {
        pageNo: 1,
        pageSize: 100,
      },
      total: 0, //分页
      //后台返回数据
      dataList: {
        tagData: [], //TA标签
        tableList: [], //app分页列表
        classList: [], //app分类下拉框数据
        levelList: [], //app量级下拉框数据
      },
      //右侧数据
      rightData: {
        successResRight: [], //本地上传文件
        markerListRight: [], //区域圈人
        selectListRight: [], //app
        checkedListRight: [], //TA标签圈人
        filterListTA: [],
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
          return time.getTime() - 8.64e7 > Date.now()
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
    }
  },
  created() {
    this.getList()
    this.getAppClassList()
  },
  mounted() {
    this.inputWidth1 = document.getElementById('inputWidth1').offsetWidth - 30
    this.inputWidth2 = document.getElementById('inputWidth2').offsetWidth - 30
  },
  methods: {
    //获取数据
    async getList(val) {
      //TA标签
      let result = await getTagData()
      if (result.code == 200) {
        this.dataList.tagData = result.data
        //第一层数据加上index，作为tab默认选中的index
        this.dataList.tagData.forEach((e, i) => {
          e['index'] = i.toString()
        })
      }
      //app标签
      let params = {
        type: val ? val.classify[0] : '',
        childType: val ? val.classify[1] : '',
        name: val ? val.name : '',
        orders: [
          {
            asc: false,
            column: 'e.id',
          },
        ],
        pageNum: this.page.pageNo,
        pageSize: this.page.pageSize,
        part: val ? val.level : '',
        searchCount: true,
      }
      getAppListByPage(params).then((res) => {
        if (res.code == 200) {
          this.dataList.tableList = res.data.list
          this.total = res.data.total
        }
      })
    },
    //获取app下拉框数据
    getAppClassList() {
      getQueryData().then((res) => {
        this.dataList.classList = res.data.typeVOList
        this.dataList.levelList = res.data.partList
      })
    },
    //上传按钮
    handleUpload() {
      let file = []
      this.fileRes = {}
      this.formData.fileList.forEach((e) => {
        file.push({
          fileName: e.name,
          fileSize: e.size,
        })
      })
      let mutipartFile = new FormData()
      this.formData.fileList.forEach((el) => {
        mutipartFile.append('multipartFile', el.raw)
      })
      mutipartFile.append('fileList', JSON.stringify(file))
      mutipartFile.append('isMD5', this.formData.isMD5)
      mutipartFile.append('folderName', this.formData.folderName)
      if (this.formData.fileList.length > 0) {
        uploadCrowdByFile(mutipartFile).then((res) => {
          this.successRes.push(...res.data.fileUploadSuccessReturnVOList)
          this.failRes.push(...res.data.fileUploadFailReturnVOList)
        })
      } else {
        this.$message.warning('请选择文件！')
      }
      this.formData.fileList = []
    },
    //是否启用MD5加密，给复选框赋值
    //固定写法，子组件的值赋给父组件
    handleChange(index) {
      this.formData.isMD5 = index
    },
    //app组合圈人--app名称查询
    handleIconClick() {
      this.page.pageNo = 1
      this.getList(this.formData)
    },
    //app组合圈人--表格选择事件
    handleSelectionChange(row) {
      this.selectList = row
    },
    getRowKeys(row) {
      return row.pkg
    },
    //分页--改变页面条数
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList(this.formData)
    },
    //分页--改变页码
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getList(this.formData)
    },
    //添加规则
    addRule() {
      switch (this.activeName) {
        case '1':
          if (this.successRes.length == 0)
            return this.$message.warning('请上传文件！')
          this.rightData.successResRight = this.successRes
          console.log('这是上传文件页')
          break
        case '2':
          let cityCode = []
          let startDate = JSON.parse(JSON.stringify(this.formData.startDate))
          let endDate = JSON.parse(JSON.stringify(this.formData.endDate))
          let leads = stopDifference([startDate, endDate])
          let radius = JSON.parse(JSON.stringify(this.formData.radius))
          let dataOrigin = JSON.parse(JSON.stringify(this.formData.areaType))
          let data = [this.formData.radius, this.formData.areaType]
          this.markerList.forEach((e) => {
            cityCode.push(e.citycode)
            e['radius'] = radius
            e['dataOrigin'] = dataOrigin
            e['startDate'] = dataOrigin == 3 ? startDate : ''
            e['endDate'] = dataOrigin == 3 ? endDate : ''
          })
          cityCode = Array.from(new Set(cityCode))
          if (this.markerList.length == 0) {
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
          if (
            this.formData.areaType == 3 &&
            cityCode.length > 1 &&
            leads > 7 * 24 * 60 * 60
          ) {
            this.$message.warning('时间范围需控制在7天内！')
            return
          }
          let list = []
          list = JSON.parse(JSON.stringify(this.markerList))
          list.forEach((e) => {
            this.rightData.markerListRight.push({
              name: e.name,
              location: e.location,
              radius: e.radius,
              dataOrigin: e.dataOrigin,
              startDate: e.startDate,
              endDate: e.endDate,
            })
          })
          this.markerList = []
          // let data1 = JSON.parse(JSON.stringify(data))
          // this.rightData.markerListRight = JSON.parse(
          //   JSON.stringify(this.markerList),
          // )
          // this.rightData.markerListRight.forEach((e) => {
          //   e['radius'] = data1[0]
          //   e['dataOrigin'] = data1[1]
          // })
          console.log('这是区域页')
          break
        case '3':
          this.rightData.checkedListRight = JSON.parse(
            JSON.stringify(this.checkedList),
          )
          // this.rightData.checkedListRight = this.checkedList
          console.log('这是标签圈人页')
          break
        case '4':
          if (this.selectList.length < 4) {
            this.$message.warning('至少选择4个app！')
            return
          }
          this.rightData.selectListRight = this.selectList
          console.log('这是app组合页')
          break
      }
    },
    //添加过滤规则
    addFilter() {
      switch (this.activeName) {
        case '1':
          console.log('这是上传文件页')
          break
        case '2':
          console.log('这是区域页')
          break
        case '3':
          console.log('这是标签圈人页')
          break
        case '4':
          console.log('这是app组合页')
          break
      }
    },
    //关闭按钮
    handleclose(type) {
      switch (type) {
        case 1:
          this.rightData.successResRight = []
          console.log('这是上传文件页')
          break
        case 2:
          console.log('这是区域页')
          break
        case 3:
          this.rightData.checkedListRight = []
          console.log('这是标签圈人页')
          break
        case 4:
          this.rightData.selectListRight = []
          console.log('这是app组合页')
          break
      }
    },
    tabClick(val) {
      this.tabActive = val
      console.log(this.tabActive, '当前标签')
    },
    //右侧编辑栏--删除上传的文件
    deleteFile(item) {
      for (var i = 0; i < this.rightData.successResRight.length; i++) {
        if (this.rightData.successResRight[i].fileName == item.fileName) {
          this.rightData.successResRight.splice(i, 1)
        }
      }
    },
    //右侧编辑栏--删除地址
    deleteMaker(item) {
      this.rightData.markerListRight.splice(
        this.rightData.markerListRight.indexOf(item),
        1,
      )
      console.log(this.rightData.markerListRight, '删除地址')
    },
    //右侧编辑栏--删除TA标签
    deleteTag(tag) {
      tag.checked = !tag.checked
      this.rightData.checkedListRight.splice(
        this.rightData.checkedListRight.indexOf(tag),
        1,
      )
      this.checkedList.forEach((e, i) => {
        if (e.value == tag.value) {
          this.checkedList.splice(i, 1)
        }
      })
      this.groupList.forEach((e) => {
        e.children.forEach((val) => {
          if (tag.name == val.name) {
            val.checked = tag.checked
          }
          if (val.children) {
            val.children.forEach((i) => {
              if (tag.name == i.name) {
                i.checked = tag.checked
              }
            })
          }
        })
      })
      this.dataList.tagData.forEach((item) => {
        item.tagList.forEach((e) => {
          e.children.forEach((val) => {
            if (tag.name == val.name) {
              val.checked = tag.checked
            }
            if (val.children) {
              val.children.forEach((i) => {
                if (tag.name == i.name) {
                  i.checked = tag.checked
                }
              })
            }
          })
        })
      })

      console.log(this.rightData.checkedListRight)
      this.flag = false
      this.tabActive = this.tabActive
      let num = 0
      this.groupList.forEach((value, inx) => {
        value.children.forEach((val, i) => {
          if (value.name == '城市' && val.name == tag.name) {
            val.checked = false
          }
          if (val.checked == true) {
            num++
          }
        })
        if (num == 0) {
          this.groupList.splice(inx, 1)
        }
        num = 0
      })
      this.$nextTick(() => {
        this.flag = true
      })
      console.log(this.groupList, '删除-标签组')
    },
    deleteApp(tag) {
      this.rightData.selectListRight.splice(
        this.rightData.selectListRight.indexOf(tag),
        1,
      )
      this.$refs.multipleTable.selection.forEach((i) => {
        if (i.pkg === tag.pkg) {
          this.$refs.multipleTable.toggleRowSelection(i, false)
        }
      })
    },
    //区域圈人start
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
      // if (this.poiList.length > 0) {
      //   this.popshow = true
      // }
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
    //区域圈人end

    //确定
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (
          this.formData.isGenerateReport == 1 &&
          this.formData.reportName == ''
        ) {
          this.$message.warning('请填写报告名称！')
          return
        }
        if (valid) {
          //区域圈人
          let points = []
          let keyName = []
          let startTime = this.formData.startDate
          let endTime = this.formData.endDate
          this.rightData.markerListRight.forEach((e) => {
            points.push({
              ...AMapTransBMap(e.location[0], e.location[1]),
              radius: e.radius,
              dataOrigin: e.dataOrigin,
              startTime: e.startDate.replace(/-|:|\s*/g, '').substring(0, 10),
              endTime: e.endDate.replace(/-|:|\s*/g, '').substring(0, 10),
            })
            keyName.push(e.name)
          })
          //TA标签数据处理
          var data = JSON.parse(JSON.stringify(this.groupList))
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
          //app数据处理
          let appList = []
          let nameList = []
          this.rightData.selectListRight?.forEach((e) => {
            appList.push(e.pkg)
            nameList.push(e.name)
          })
          if (
            this.rightData.selectListRight.length == 0 &&
            this.rightData.markerListRight.length == 0 &&
            this.rightData.checkedListRight.length == 0 &&
            this.rightData.successResRight.length == 0
          ) {
            this.$message.warning('至少选择一个规则！')
            return
          }
          let params = {
            crowdName: this.formData.crowdName,
            isGenerateReport: this.formData.isGenerateReport,
            name: this.formData.reportName,
            inputPathList: this.rightData.successResRight,
            folderName: this.formData.folderName,
            tags: conformArray,
            tagNameList: nameArray,
            filterTags: [],
            appList: appList,
            appNameList: nameList,
            appFilterList: [],
            regionNameList: keyName,
            drawMode: 'batch',
            // endTime: endTime.replace(/-|:|\s*/g, '').substring(0, 10),
            // startTime: startTime.replace(/-|:|\s*/g, '').substring(0, 10),
            centerList: points,
            filterCenterList: [],
            userId: sessionStorage.getItem('id'),
          }
          console.log(params, '参数')
          combinationCrowd(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('添加组合标签人群成功！')
              this.$router.push('/crowdControl')
            }
          })
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
.bottom_box {
  display: flex;
  align-items: center;
}
.selectBox {
  display: flex;
  .select {
    margin-right: 10px;
    width: 33.3%;
  }
  :last-child {
    margin-right: 0;
  }
}
.content {
  display: flex;
  .left_box {
    flex: 2;
    height: 570px;
    overflow-y: auto;
    .addBtn {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 10px;
      .el-button {
        border-color: #66b1ff;
        color: #66b1ff;
      }
      i {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        margin-right: 5px;
      }
      span {
        color: #418ff6;
      }
    }
  }
  .right_box {
    flex: 1;
    height: 570px;
    overflow-y: auto;
    margin-left: 10px;
    font-size: 12px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 600;
    .gray_box {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      text-align: center;
    }
    .body {
      border: 1px solid rgba(151, 151, 151, 0.2);
      border-radius: 2px;
      height: 100%;
      margin: 10px 0;
      padding: 10px;
    }
    .template {
      margin: 10px 0;
      .title_box {
        position: relative;
        // height: 34px;
        // line-height: 30px;
        padding: 10px 0;
        background: linear-gradient(
          65deg,
          rgba(160, 255, 252, 0.11) 0%,
          rgba(102, 184, 255, 0.21) 100%
        );
        border: 1px solid rgba(104, 183, 255, 0.13);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        color: #333333;
        text-align: center;
        .closeBtn {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .blue_box {
        color: #418ff6;
        font-size: 12px;
        font-weight: 400;
        margin-top: 8px;
      }
      .data_box {
        background: #ffffff;
        // border-radius: 4px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border: 1px solid rgba(51, 51, 51, 0.2);
        padding: 10px;
      }
      .tag_box {
        padding: 0;
        .tag {
          margin: 5px;
          font-weight: 400;
        }
      }
    }

    .fileList_box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      i {
        color: #999999;
        font-size: 10px;
      }
    }
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
    .left_box_map {
      flex: 2;
    }
    .right_box_map {
      height: 555px;
      overflow-y: auto;
      flex: 1;
      padding: 10px;
      .label {
        font-size: 12px;
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
    font-size: 12px;
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
}
.left_box {
  ::v-deep .el-tabs__item {
    font-weight: normal;
    font-size: 12px !important;
  }
  // ::v-deep .el-tabs__nav-wrap::after {
  //   height: 1.5px;
  // }
}
// ::v-deep .left_box .el-tabs__item {
//   font-weight: normal;
//   font-size: 12px;
// }

// .el-tabs__nav-wrap::after .left_box {
//   position: static !important;
// }
::v-deep .small .el-pager li {
  min-width: 20.5px;
}
::v-deep .small .el-pagination__jump {
  margin-left: 5px;
}
::v-deep .el-form-item__label {
  width: 80px !important;
}
::v-deep .el-form-item__error {
  left: 80px;
}
</style>
