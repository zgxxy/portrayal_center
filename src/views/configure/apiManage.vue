<!--配置管理-接口管理 -->
<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div class="header" style="position: relative;">
        <el-tabs
          v-model="firstTab"
          @tab-click="firstTabClick(firstTab)"
          class="firstTab"
        >
          <el-tab-pane label="应用接口管理" name="first">
            <div class="addBox" @click="openAdd">+新增接口</div>
            <!-- 应用接口分页表格start -->
            <el-table
              :data="applyList"
              style="width: 100%;"
              :header-cell-style="{ background: '#FAFAFA', color: '#606266' }"
              @row-click="gotoOutDetail"
            >
              <el-table-column prop="apiId" label="API ID" />
              <el-table-column
                prop="apiName"
                label="API名称"
                width="150"
                align="left"
              />
              <el-table-column prop="apiUrl" label="接口地址" min-width="190" />
              <el-table-column prop="interfaceFormat" label="接口格式" />
              <el-table-column prop="applySystem" label="应用系统">
                <template slot-scope="scope">
                  <span v-if="scope.row.show">
                    <el-input
                      v-model="scope.row.applySystem"
                      placeholder="请输入内容"
                      @click.native.stop=""
                      style="width: 80%;"
                    />
                  </span>
                  <span v-else>{{ scope.row.applySystem }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="interfaceStatus" label="接口状态">
                <template slot-scope="scope">
                  <i
                    class="dotClass"
                    :style="
                      scope.row.interfaceStatus == 0
                        ? 'backgroundColor:#D9D9D9'
                        : scope.row.interfaceStatus == 1
                        ? 'backgroundColor:#67C23A'
                        : 'backgroundColor:#d9001b'
                    "
                  ></i>
                  {{ scope.row.interfaceStatus | interfaceStatus }}
                </template>
              </el-table-column>
              <el-table-column
                prop="serviceDueDate"
                label="接口有效截止时间"
                width="135"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.show">
                    <el-date-picker
                      v-model="scope.row.serviceDueDate"
                      type="datetime"
                      placeholder="选择日期时间"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="pickerOptions"
                      @click.native.stop=""
                      style="width: 80%;"
                    ></el-date-picker>
                  </span>
                  <span v-else>
                    {{
                      scope.row.serviceDueDate ? scope.row.serviceDueDate : '--'
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="numberCalls" label="服务调用次数">
                <template slot-scope="scope">
                  {{
                    !scope.row.numberCalls || scope.row.numberCalls == 0
                      ? 0
                      : scope.row.numberCalls
                  }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button
                    v-show="!scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click.native.stop="
                      handleEditApply(scope.$index, scope.row)
                    "
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-show="scope.row.show"
                    id="edit"
                    type="primary"
                    size="mini"
                    @click.native.stop="
                      handleSaveApply(scope.$index, scope.row)
                    "
                  >
                    保存
                  </el-button>
                  <el-button
                    v-show="scope.row.show"
                    id="edit"
                    type=""
                    size="mini"
                    @click.native.stop="
                      handleCancelApply(scope.$index, scope.row)
                    "
                  >
                    取消
                  </el-button>
                  <el-button
                    v-show="!scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click="handleDeleteApply(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-if="scope.row.interfaceStatus != 1 && !scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click="handleChangeApply(1, scope.$index, scope.row)"
                  >
                    启用
                  </el-button>
                  <el-button
                    v-if="scope.row.interfaceStatus == 1 && !scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click="handleChangeApply(2, scope.$index, scope.row)"
                  >
                    停用
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <pagination
              v-if="pageshow"
              :total="pageApply.total"
              @pageSizeHandle="handleSizeChange"
              @currentPageHandle="handleCurrentChange"
            />
            <!-- 应用接口分页表格end -->
          </el-tab-pane>
          <el-tab-pane label="数据接口管理" name="second">
            <!-- 数据接口分页表格start -->
            <el-table
              :data="dataList"
              style="width: 100%;"
              :header-cell-style="{ background: '#FAFAFA', color: '#606266' }"
              @row-click="gotoOutDetail"
            >
              <el-table-column prop="apiId" label="API ID" />
              <el-table-column
                prop="apiName"
                label="API名称"
                width="150"
                align="left"
              />
              <el-table-column prop="apiUrl" label="接口地址" min-width="190" />
              <el-table-column prop="dataType" label="数据类型">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.dataType == 0 ? '测试数据' : '投产数据' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="interfaceFormat" label="接口格式" />
              <el-table-column prop="interfaceStatus" label="接口状态">
                <template slot-scope="scope">
                  <i
                    class="dotClass"
                    :style="
                      scope.row.interfaceStatus == 0
                        ? 'backgroundColor:#d9001b'
                        : 'backgroundColor:#67C23A'
                    "
                  ></i>
                  {{ scope.row.interfaceStatus == 0 ? '禁用中' : '已启用' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="apiDueTime"
                label="接口有效截止时间"
                width="135"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.show">
                    <el-date-picker
                      v-model="scope.row.apiDueTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="pickerOptions"
                      @click.native.stop=""
                      style="width: 80%;"
                    ></el-date-picker>
                  </span>
                  <span v-else>{{ scope.row.apiDueTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="callCount" label="数据调用次数">
                <template slot-scope="scope">
                  {{ scope.row.callCount ? scope.row.callCount : 0 }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button
                    v-show="!scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click.native.stop="handleEdit(scope.$index, scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-show="scope.row.show"
                    id="edit"
                    type="primary"
                    size="mini"
                    @click.native.stop="handleSave(scope.$index, scope.row)"
                  >
                    保存
                  </el-button>
                  <el-button
                    v-show="scope.row.show"
                    id="edit"
                    type=""
                    size="mini"
                    @click.native.stop="handleCancel(scope.$index, scope.row)"
                  >
                    取消
                  </el-button>
                  <el-button
                    v-show="!scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-if="scope.row.interfaceStatus == 0 && !scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click="handleChange(1, scope.$index, scope.row)"
                  >
                    启用
                  </el-button>
                  <el-button
                    v-if="scope.row.interfaceStatus == 1 && !scope.row.show"
                    class="btn"
                    :loading="scope.row.loading"
                    type="text"
                    size="mini"
                    @click="handleChange(0, scope.$index, scope.row)"
                  >
                    停用
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <pagination
              v-if="pageshow"
              :total="pageData.total"
              @pageSizeHandle="SizeChange"
              @currentPageHandle="CurrentChange"
            />
            <!-- 数据接口分页表格end -->
          </el-tab-pane>
        </el-tabs>
        <div style="display: flex; position: absolute; right: 10px; top: 0px;">
          <el-tabs
            v-model="secondTab"
            type="card"
            @tab-click="secondTabClick(secondTab)"
          >
            <el-tab-pane label="全部" name="0"></el-tab-pane>
            <el-tab-pane label="使用中" name="1"></el-tab-pane>
            <el-tab-pane label="禁用中" name="2"></el-tab-pane>
            <el-tab-pane
              label="未开始"
              name="3"
              v-if="firstTab == 'first'"
            ></el-tab-pane>
          </el-tabs>
          <span class="handText" style="margin-left: 20px;">
            接口名称：
          </span>
          <el-input
            placeholder="请输入"
            clearable
            v-model="search.apiName"
            suffix-icon="el-icon-search"
            @blur="searchClick(search.apiName)"
            @keyup.enter.native="searchClick(search.apiName)"
          ></el-input>
        </div>
      </div>
      <!-- 新增dialog -->
      <el-dialog
        class="newadd"
        title="新增接口"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        width="60%"
        :before-close="handleClose"
      >
        <el-form
          ref="addForm"
          :model="addForm"
          label-width="110px"
          :rules="rules"
          class="demo-formData"
        >
          <el-form-item label="接口类型：">
            <span>{{ '应用接口' }}</span>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="11" style="white-space: nowrap;">
              <el-form-item label="接口名称：" prop="apiName">
                <el-select
                  v-model="addForm.apiName"
                  placeholder="请选择"
                  style="width: 100%;"
                  clearable
                  @change="apiSelectChange"
                >
                  <el-option
                    v-for="val in apiNameOptions"
                    :key="val.key"
                    :label="val.label"
                    :value="val.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="white-space: nowrap;">
              <el-form-item label="接口ID：" prop="apiId">
                <el-input
                  v-model.trim="addForm.apiId"
                  placeholder="请输入"
                  style="width: 100%;"
                  clearable
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="接口地址：" prop="apiUrl">
            <el-input
              v-model.trim="addForm.apiUrl"
              placeholder="请输入"
              style="width: 90%;"
              clearable
              disabled
            />
          </el-form-item>
          <el-form-item label="应用系统：" prop="applySystem">
            <el-input
              v-model.trim="addForm.applySystem"
              placeholder="请输入"
              style="width: 90%;"
              clearable
            />
          </el-form-item>
          <el-form-item label="接口有效起止时间：" prop="validTime">
            <el-date-picker
              v-model="addForm.validTime"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 90%;"
              :picker-options="pickerOptions"
              @change="changeDate"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="AddOk()">新增</el-button>
          <el-button @click="handleClose()">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 新增dialog -->
    </el-card>
  </div>
</template>

<script>
import {
  getApplicationApiByPage,
  getDataApiByPage,
  updateApplicationInterface,
  updateDataApiStatus,
  updateApplyApiDetail,
  updateDataApiDetail,
  deleteApplicationInterface,
  deleteDataApi,
  getPopUpData,
  addApplicationInterface,
} from '@/api/apiManage'
import pagination from './components/pagination.vue'
import { datePass } from '@/utils/public'
export default {
  components: {
    pagination,
  },
  filters: {
    interfaceStatus(interfaceStatus) {
      let res = '未开始'
      if (interfaceStatus == 0) res = '未开始'
      else if (interfaceStatus == 1) res = '已启用'
      else if (interfaceStatus == 2) res = '禁用中'
      return res
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      firstTab: 'first',
      secondTab: '0', //tab查询
      //导航查询
      search: {
        interfaceStatus: '',
        apiName: '',
        isSearched: false,
      }, //查询条件
      applyList: [], // 应用接口表格数据
      dataList: [], // 数据接口表格数据
      //应用接口-编辑
      editData: {
        applySystem: '',
        serviceDueDate: '',
      },
      apiDueTime: '', //数据接口编辑-有效截止日期
      // 是否在编辑状态
      isEdit: false,
      pageshow: true, //分页显示，解决数据刷新后，分页组件页码不刷新的bug
      //应用接口分页
      pageApply: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      //数据接口分页
      pageData: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      // 新增 dialog
      addDialogVisible: false,
      apiList: [],
      apiNameOptions: [],
      addForm: {
        apiName: '',
        apiId: '',
        apiUrl: '',
        modelId: '',
        applySystem: '',
        validTime: [],
      },
      rules: {
        apiName: [
          { required: true, message: '请选择接口名称', trigger: 'blur' },
        ],
        apiId: [{ required: true, message: '请输入接口ID', trigger: 'blur' }],
        apiUrl: [
          { required: true, message: '请输入接口地址', trigger: 'blur' },
        ],
        applySystem: [
          { required: true, message: '请输入应用系统', trigger: 'blur' },
        ],
        validTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
      },
    }
  },
  async created() {
    this.applyQuery()
  },
  methods: {
    //头部导航切换查询 应用接口or数据接口
    firstTabClick(num) {
      this.secondTab = '0'
      this.isEdit = false
      if (num == 'first') {
        this.applyQuery()
      } else {
        this.dataListQuery()
      }
    },
    secondTabClick() {
      if (this.firstTab == 'first') {
        this.applyQuery()
      } else {
        this.dataListQuery()
      }
    },
    //搜索查询
    async searchClick(name) {
      if (this.firstTab == 'first') {
        this.applyQuery()
      } else {
        this.dataListQuery()
      }
    },
    //应用接口列表查询
    async applyQuery(num) {
      this.$nextTick(() => {
        this.pageshow = true
      })
      //secondTab：0全部 1使用中 2禁用中 3未开始
      //interfaceStatus：0未开始 1使用中 2禁用中
      switch (this.secondTab) {
        case '0':
          this.search.interfaceStatus = ''
          break
        case '1':
          this.search.interfaceStatus = 1
          break
        case '2':
          this.search.interfaceStatus = 2
          break
        case '3':
          this.search.interfaceStatus = 0
          break
      }
      let params = {
        apiName: this.search.apiName,
        interfaceStatus: this.search.interfaceStatus,
        pageNum: this.pageApply.currentPage,
        pageSize: this.pageApply.pageSize,
        searchCount: true,
        orders: [{ asc: false, column: 'update_time' }],
      }
      this.applyList = []
      const res = await getApplicationApiByPage(params)
      this.pageApply.total = res.total
      console.log(res.list, '应用接口信息')
      res.list.map((item) => {
        item.loading = false
      })
      res.list.forEach((el) => {
        el.show = false
      })
      this.applyList = res.list
    },
    //分页
    handleSizeChange(val) {
      this.pageApply.pageSize = val
      this.applyQuery()
    },
    handleCurrentChange(val) {
      this.pageApply.currentPage = val
      this.applyQuery()
    },
    changeDate(val) {
      console.log(val, '选中时间')
    },
    //应用接口--编辑
    handleEditApply(index, row) {
      console.log('编辑状态', this.isEdit)
      console.log(row, '编辑数据')
      if (row.interfaceStatus == 1) {
        this.$message.warning('接口启用中，请禁用后再进行编辑操作!')
        return
      } else if (!this.isEdit) {
        this.editData.applySystem = row.applySystem
        this.editData.serviceDueDate = row.serviceDueDate
        this.applyList[index].show = !this.applyList[index].show
        this.isEdit = true
        return
      }
      this.$message.warning('有文件没有保存,请先保存后再操作!')
    },
    //应用接口--编辑保存
    async handleSaveApply(index, row) {
      console.log(this.editData, 'this.editData')
      console.log('saveDATA', row)
      this.applyList[index].show = !this.applyList[index].show
      // 取消编辑状态
      this.isEdit = false
      if (
        row.applySystem == this.editData.applySystem &&
        row.serviceDueDate == this.editData.serviceDueDate
      ) {
        this.$message.warning('内容未修改')
      } else {
        let params = {
          applySystem:
            row.applySystem == this.editData.applySystem ? '' : row.applySystem,
          id: row.id,
          modelId: row.modelId,
          serviceDueDate:
            row.serviceDueDate == this.editData.serviceDueDate
              ? ''
              : row.serviceDueDate,
        }
        let res = await updateApplyApiDetail(params)
        if (res == null) {
          this.$message.success('编辑成功!')
          this.pageApply.currentPage = 1
          this.pageshow = false
          this.applyQuery()
        } else {
          this.applyQuery()
        }
      }
    },
    //应用接口--编辑取消
    handleCancelApply(index, row) {
      this.$confirm('此操作将不修改该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          this.applyList[index].show = !this.applyList[index].show
          this.applyList[index].applySystem = this.applySystem
          this.applyList[index].serviceDueDate = this.serviceDueDate
          // 取消编辑状态
          this.isEdit = false
          this.$message.success('内容无更改!')
        })
        .catch(() => {})
    },
    //应用接口--停用2 启用1
    handleChangeApply(interfaceStatus, index, row) {
      if (datePass(row.serviceDueDate) == '已过期') {
        this.$message.warning('接口已过期!')
        return
      }
      row.loading = true
      const msg = this.$createElement
      console.log(interfaceStatus, '应用接口启用')
      if (interfaceStatus == 2) {
        this.$confirm('', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
          message: msg('div', null, [
            msg(
              'span',
              { style: 'font-weight: 900;' },
              '是否停用此接口，停用后',
            ),
            msg('span', { style: 'color: red;' }, '该模型外接服务不可用，'),
            msg('p', { style: 'color: gray;' }, '你还要继续吗？'),
          ]),
        })
          .then(() => {
            updateApplicationInterface({
              id: row.id,
              interfaceStatus: interfaceStatus,
            })
              .then(() => {
                row.loading = false
                this.$message.success('接口停用成功!')
                this.pageApply.currentPage = 1
                this.pageshow = false
                this.search.isSearched
                  ? this.applyQuery(this.search)
                  : this.applyQuery({})
              })
              .catch(() => {
                row.loading = false
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      } else {
        updateApplicationInterface({
          id: row.id,
          interfaceStatus: interfaceStatus,
        })
          .then(() => {
            row.loading = false
            this.$message.success('接口启用成功!')
            this.pageApply.currentPage = 1
            this.pageshow = false
            this.search.isSearched
              ? this.applyQuery(this.search)
              : this.applyQuery({})
          })
          .catch(() => {
            row.loading = false
          })
      }
    },
    // 应用接口--删除
    async handleDeleteApply(index, row) {
      console.log(row, '删除')
      if (row.interfaceStatus == 1) {
        this.$message.warning('接口启用中，请禁用后再进行删除操作!')
        return
      }
      const msg = this.$createElement
      // this.$confirm(`是否确认删除接口 ${row.apiName}`, '提示', {
      this.$confirm('', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
        message: msg('div', null, [
          msg(
            'span',
            { style: 'font-weight: 900;' },
            `是否删除接口“${row.apiName}”？删除后，`,
          ),
          msg('span', { style: 'color: red;' }, '该模型服务'),
          msg(
            'span',
            { style: 'color: red;display:inline-block;margin-top:8px;' },
            '不可用，',
          ),
          msg('span', { style: 'color: gray;' }, '你还要继续吗？'),
        ]),
      })
        .then(async () => {
          await deleteApplicationInterface({ id: row.id })
          this.pageApply.currentPage = 1
          this.pageshow = false
          this.search.isSearched
            ? this.applyQuery(this.search)
            : this.applyQuery({})
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //打开新增弹窗
    async openAdd() {
      this.addDialogVisible = true
      let res = await getPopUpData()
      let value = 0
      this.apiList = []
      this.apiNameOptions = []
      console.log(res, '接口名称查询')
      this.apiList = res
      res.map((el) => {
        this.apiNameOptions.push({
          label: el.apiName,
          value: el.apiName,
          key: value++,
        })
      })
      console.log(this.apiNameOptions, 'apiNameOptions')
    },
    //选择apiName联动apiId和apiUrl
    apiSelectChange(val) {
      console.log('选中了' + val)
      if (!val) {
        this.addForm.apiId = ''
        this.addForm.apiUrl = ''
        this.addForm.modelId = ''
      } else {
        this.apiList.forEach((e) => {
          if (e.apiName == val) {
            this.addForm.apiId = e.apiId
            this.addForm.apiUrl = e.apiUrl
            this.addForm.modelId = e.modelId
          }
        })
      }
    },
    // 新增弹窗--新增接口
    async AddOk() {
      let flag = true
      this.$refs.addForm.validate((valid, item) => {
        if (!valid) {
          this.$message({
            type: 'warning',
            message: '请完善表单...',
          })
          flag = false
        }
      })
      if (flag) {
        let params = {
          applySystem: this.addForm.applySystem,
          modelId: this.addForm.modelId,
          serviceStartDate: this.addForm.validTime[0] + ' ' + '00:00:00',
          serviceDueDate: this.addForm.validTime[1] + ' ' + '23:59:59',
        }
        const res = await addApplicationInterface(params)
        const msg = this.$createElement
        if (res == null) {
          this.$alert('', {
            confirmButtonText: '确定',
            message: msg('div', null, [
              msg('i', {
                class: 'el-icon-success',
                style: 'color:#52C41A;font-size:30px;',
              }),
              msg(
                'span',
                {
                  style:
                    'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;',
                },
                '新增接口成功',
              ),
              msg(
                'p',
                { style: 'margin:10px 0 0 40px;color:gray' },
                '新增接口测试调通成功后即时生效',
              ),
            ]),
          })
        }
        console.log(res)
        this.applyQuery({})
        this.handleClose()
      }
    },

    //关闭新增弹窗
    handleClose() {
      this.addDialogVisible = false
      this.$refs.addForm.resetFields()
    },

    ///////////分割线////////////

    //数据接口分页查询
    async dataListQuery() {
      //secondTab：0全部 1使用中 2禁用中
      //interfaceStatus：0禁用中 1使用中
      switch (this.secondTab) {
        case '0':
          this.search.interfaceStatus = ''
          break
        case '1':
          this.search.interfaceStatus = 1
          break
        case '2':
          this.search.interfaceStatus = 0
          break
      }
      let params = {
        apiName: this.search.apiName,
        interfaceStatus: this.search.interfaceStatus,
        pageNum: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        searchCount: true,
        orders: [{ asc: false, column: 'update_time' }],
      }
      this.dataList = []
      let res = await getDataApiByPage(params)
      this.pageData.total = res.total
      console.log(res.list, '数据接口信息')
      res.list.map((item) => {
        item.loading = false
      })
      res.list.forEach((el) => {
        el.show = false
      })
      this.dataList = res.list
    },
    SizeChange(val) {
      console.log('父组件收到分页器pagesize：', val)
      this.pageData.pageSize = val
      this.dataListQuery()
    },
    CurrentChange(val) {
      console.log('父组件收到分页器currentpage：', val)
      this.pageData.pageSize = val
      this.dataListQuery()
    },
    //数据接口--编辑
    handleEdit(index, row) {
      console.log('编辑状态', this.isEdit)
      console.log(row, '编辑数据')
      if (row.interfaceStatus == 1) {
        this.$message.warning('接口启用中，请禁用后再进行编辑操作!')
        return
      } else if (!this.isEdit) {
        this.apiDueTime = row.apiDueTime
        this.dataList[index].show = !this.dataList[index].show
        this.isEdit = true
        return
      }
      this.$message.warning('有文件没有保存,请先保存后再操作!')
    },
    //数据接口--编辑保存
    async handleSave(index, row) {
      console.log('saveDATA', row)
      this.dataList[index].show = !this.dataList[index].show
      // 取消编辑状态
      this.isEdit = false
      if (row.apiDueTime == this.apiDueTime) {
        this.$message.warning('内容未修改')
      } else {
        let params = {
          id: row.id,
          serviceDueDate: row.apiDueTime,
        }
        let res = await updateDataApiDetail(params)
        if (res == null) {
          this.$message.success('编辑成功!')
          this.pageData.currentPage = 1
          this.pageshow = false
          this.dataListQuery()
        }
      }
    },
    //数据接口--编辑取消
    handleCancel(index, row) {
      this.$confirm('此操作将不修改该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          this.dataList[index].show = !this.dataList[index].show
          this.dataList[index].applySystem = this.applySystem
          this.dataList[index].serviceDueDate = this.serviceDueDate
          // 取消编辑状态
          this.isEdit = false
          this.$message.success('内容无更改!')
        })
        .catch(() => {})
    },
    //数据接口--停用0 启用1
    handleChange(status, index, row) {
      if (datePass(row.apiDueTime) == '已过期') {
        this.$message.warning('接口已过期!')
        return
      }
      console.log(status, '数据接口')
      row.loading = true
      const msg = this.$createElement
      if (status == 0) {
        this.$confirm('', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
          message: msg('div', null, [
            msg(
              'span',
              { style: 'font-weight: 900;' },
              '是否停用此接口，停用后',
            ),
            msg('span', { style: 'color: red;' }, '该模型数据连接不可用，'),
            msg('p', { style: 'color: gray;' }, '你还要继续吗？'),
          ]),
        })
          .then(() => {
            updateDataApiStatus({
              Id: row.id,
              status: status,
            })
              .then(() => {
                row.loading = false
                this.$message.success('接口停用成功!')
                this.pageData.currentPage = 1
                this.pageshow = false
                this.search.isSearched
                  ? this.dataListQuery(this.search)
                  : this.dataListQuery({})
              })
              .catch(() => {
                row.loading = false
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      } else {
        updateDataApiStatus({
          Id: row.id,
          status: status,
        })
          .then(() => {
            row.loading = false
            this.$message.success('接口启用成功!')
            this.pageData.currentPage = 1
            this.pageshow = false
            this.search.isSearched
              ? this.dataListQuery(this.search)
              : this.dataListQuery({})
          })
          .catch(() => {
            row.loading = false
          })
      }
    },
    // 数据接口--删除
    async handleDelete(index, row) {
      console.log(row, '删除')
      if (row.interfaceStatus == 1) {
        this.$message.warning('接口启用中，请禁用后再进行删除操作!')
        return
      }
      const msg = this.$createElement
      // this.$confirm(`是否确认删除接口 ${row.apiName}`, '提示', {
      this.$confirm('', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
        message: msg('div', null, [
          msg(
            'span',
            { style: 'font-weight: 900;' },
            `是否删除接口“${row.apiName}”？删除后，`,
          ),
          msg('span', { style: 'color: red;' }, '该模型服务'),
          msg(
            'span',
            { style: 'color: red;display:inline-block;margin-top:8px;' },
            '不可用，',
          ),
          msg('span', { style: 'color: gray;' }, '你还要继续吗？'),
        ]),
      })
        .then(async () => {
          await deleteDataApi({ Id: row.id })
          this.pageData.currentPage = 1
          this.pageshow = false
          this.search.isSearched
            ? this.dataListQuery(this.search)
            : this.dataListQuery({})
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //跳转详情页
    gotoOutDetail(row, event) {
      console.log(this.firstTab, '当前导航')
      let apiType = ''
      this.firstTab == 'first' ? (apiType = 0) : (apiType = 1)
      this.isEdit = false
      event.label !== '操作' &&
        this.$router.push({
          path: '/apiManage/apiInfo',
          query: {
            modelId: row.modelId,
            id: row.id,
            apiName: row.apiName,
            apiType: apiType,
          },
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  white-space: nowrap;
  font-size: 12px;
  // font-weight: 900;
  .handText {
    margin-top: 10px;
  }
  ::v-deep.el-tabs__item {
    font-size: 12px;
    font-weight: normal;
  }
}
.dotClass {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  // margin-left: 10px; //这个用于圆点居中
  margin-top: 5px;
}
::v-deep.el-button span {
  font-size: 12px;
}
::v-deep.el-table td.el-table__cell div {
  text-align: left;
}
.el-input {
  display: inline-block;
  width: 230px;
}
//中部新增客户框
.addBox {
  width: 100%;
  height: 30px;
  border: dashed 1px #999999;
  border-radius: 3px;
  margin-bottom: 10px;
  text-align: center;
  line-height: 30px;
  font-size: 12px;
  color: #999999;
}
.addBox:hover {
  border: dashed 1px #409eff;
  color: #409eff;
}
::v-deep.el-table td.el-table__cell div {
  text-align: center;
}
.error {
  background-color: #fff2f1;
  border: 1px solid #ffa39e;
  border-radius: 5px;
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
  padding: 0 10px;
}
::v-deep .btn {
  padding: 0 !important;
  span {
    font-size: 12px;
  }
}
::v-deep .firstTab .el-tabs__item {
  margin: 5px 0;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 1px;
}
::v-deep .el-tabs__active-bar {
  height: 1px;
}
::v-deep .el-form-item__label {
  // margin-left: -20px;
  width: 150px !important;
}
::v-deep .el-form-item__error {
  left: 40px;
}
</style>
