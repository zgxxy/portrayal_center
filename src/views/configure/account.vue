<!-- 用户管理 -->
<template>
  <div>
    <el-card class="father-card">
      <div class="header">
        <el-button type="primary" @click="addDialogVisible = true">
          + 新增
        </el-button>
        <div class="nameBox">
          <div>账号名称：</div>
          <el-input
            v-model="search.username"
            placeholder="请输入"
            clearable
            size="small"
          />
        </div>
        <div class="nameBox">
          <div>状态：</div>
          <el-select
            v-model="search.state"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="使用中" value="1" />
            <el-option label="已停用" value="0" />
          </el-select>
        </div>
        <el-button id="search" type="primary" @click="searchClick()">
          搜索
        </el-button>
        <el-button class="editBtn" id="search" @click="batchChange(1)">
          批量启用
        </el-button>
        <el-button class="editBtn" id="search" @click="batchChange(0)">
          批量停用
        </el-button>
      </div>

      <!-- mian-table -->
      <el-table
        border
        stripe
        ref="infotable"
        align="center"
        :data="tableList"
        style="width: 100%;"
        :header-cell-style="{
          background: '#eef5ff',
          color: '#606266',
          borderColor: '#d8e6fe',
          fontSize: '12px',
        }"
        :cell-style="{ borderColor: '#d8e6fe' }"
        @select="tableSelect"
        @select-all="tableSelect"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column
          prop="company"
          label="公司"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="id" label="id" :show-overflow-tooltip="true" />
        <el-table-column
          prop="userName"
          label="账号"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="state" label="使用状态" width="70">
          <template slot-scope="scope">
            <div
              :style="scope.row.state === 1 ? 'color:#409eff' : 'color:#ea1b29'"
            >
              {{ scope.row.state === 1 ? '使用中' : '已停用' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="账号类型" width="70">
          <template slot-scope="scope">
            {{ scope.row.userType | userType }}
          </template>
        </el-table-column>
        <el-table-column prop="roleType" label="账号角色" width="70">
          <template slot-scope="scope">
            {{ scope.row.roleType == 0 ? '普通用户' : '管理员' }}
          </template>
        </el-table-column>
        <el-table-column prop="user" label="使用人" width="80" />
        <el-table-column
          prop="validityPeriod"
          label="有效期至"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="email"
          label="关联邮箱"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="phone" label="关联手机">
          <template slot-scope="scope">
            <div>
              {{ scope.row.phone | phoneHide }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="145"
          :key="'operate' + Math.random()"
        >
          <template
            v-if="scope.row.userName === 'admin' ? false : true"
            slot-scope="scope"
          >
            <div class="moreBtn">
              <el-tooltip effect="dark" content="启用" placement="top">
                <el-button
                  v-if="scope.row.state !== 1"
                  type="text"
                  class="btn"
                  icon="el-icon-video-pause"
                  :loading="scope.row.loading"
                  @click="handleChange(1, scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="停用" placement="top">
                <el-button
                  v-if="scope.row.state === 1"
                  type="text"
                  class="btn"
                  icon="el-icon-video-play"
                  :loading="scope.row.loading"
                  @click="handleChange(0, scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <el-button
                  v-if="scope.row.state === 1"
                  type="text"
                  class="btn"
                  icon="el-icon-edit-outline"
                  :loading="scope.row.loading"
                  @click="handlePermission(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  v-if="scope.row.state === 0"
                  type="text"
                  class="btn"
                  icon="el-icon-delete"
                  :loading="scope.row.loading"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="注销" placement="top">
                <el-button
                  v-if="scope.row.state === 0"
                  type="text"
                  class="btn"
                  icon="el-icon-switch-button"
                  :loading="scope.row.loading"
                  @click="passwordReset(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="重置密码" placement="top">
                <el-button
                  v-if="scope.row.state === 1"
                  type="text"
                  class="btn"
                  icon="el-icon-key"
                  :loading="scope.row.loading"
                  @click="passwordReset(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="日志" placement="top">
                <el-button
                  type="text"
                  class="btn"
                  icon="el-icon-tickets"
                  :loading="scope.row.loading"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- main-table -->

      <!-- 权限编辑dialog-start -->
      <el-dialog
        title="权限编辑"
        :visible.sync="PermissionDialogVisible"
        :close-on-click-modal="false"
        width="30%"
        :before-close="permissionClose"
      >
        <el-form
          ref="PermissionForm"
          :model="PermissionForm"
          size="small"
          label-width="100px"
        >
          <el-form-item
            :label="PermissionUser"
            prop="roleId"
            :rules="{
              required: true,
              message: '请选择权限',
              trigger: 'change',
            }"
          >
            <el-radio-group v-model="PermissionForm.roleId">
              <el-radio-button :label="1">管理员</el-radio-button>
              <el-radio-button :label="2">普通用户</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="permissionClose()">取 消</el-button>
          <el-button type="primary" @click="PermissionOk()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 权限编辑dialog-end -->

      <!-- 新增dialog-start -->
      <el-dialog
        class="newadd"
        title="新增用户"
        :visible.sync="addDialogVisible"
        :close-on-click-modal="false"
        width="35%"
        :before-close="handleClose"
      >
        <div v-if="errorMessage" class="error">
          <i class="el-icon-circle-close" style="color: #f1473b;" />
          {{ errorMessage }}
        </div>
        <el-form
          ref="addForm"
          :model="addForm"
          size="small"
          label-width="120px"
        >
          <el-form-item
            label="邮箱："
            prop="email"
            :rules="{
              required: true,
              validator: validateEmail,
              trigger: 'blur',
            }"
          >
            <el-input
              v-model.trim="addForm.email"
              placeholder="请输入"
              style="width: 80%;"
            />
          </el-form-item>
          <el-form-item
            label="账号名称："
            prop="username"
            :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
          >
            <el-input
              v-model.trim="addForm.username"
              placeholder="请输入"
              style="width: 80%;"
            />
          </el-form-item>
          <el-form-item
            label="初始密码："
            prop="password"
            :rules="{
              required: true,
              validator: validatePassword,
              trigger: 'blur',
            }"
          >
            <div class="loginPwd">
              <el-input
                v-model.trim="addForm.password"
                placeholder="请输入"
                style="width: 80%;"
              />
              <el-tooltip
                content="点击自动生成密钥"
                placement="bottom"
                effect="light"
                style="margin-left: 10px;"
              >
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-key"
                  circle
                  @click="autoPassword()"
                />
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item
            label="使用人："
            prop="userUse"
            :rules="{ required: false, trigger: 'blur' }"
          >
            <el-input
              v-model.trim="addForm.userUse"
              placeholder="请输入"
              style="width: 80%;"
            />
          </el-form-item>
          <el-form-item
            label="电话："
            prop="phone"
            :rules="{ required: false, trigger: 'blur' }"
          >
            <el-input
              v-model.trim="addForm.phone"
              placeholder="请输入"
              style="width: 80%;"
            />
          </el-form-item>
          <el-form-item
            label="权限："
            prop="roleId"
            :rules="{
              required: true,
              message: '请选择权限',
              trigger: 'change',
            }"
          >
            <el-radio-group v-model="addForm.roleId">
              <el-radio-button :label="1">管理员</el-radio-button>
              <el-radio-button :label="2">普通用户</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="AddOk()">立即创建</el-button>
        </span>
      </el-dialog>
      <!-- 新增dialog-end -->

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getUserInfo,
  updatePassword,
  addSysUser,
  delectSysUser,
  updateSysUser,
  autoPwd,
} from '@/api/account'
export default {
  filters: {
    phoneHide(val) {
      val = val.split('')
      val.splice(3, 4, '****')
      return val.join('')
    },
    userType(val) {
      let res = ''
      if (val == '0') res = '临时-子'
      else if (val == '1') res = '正式-总'
      else if (val == '2') res = '正式-子'
      return res
    },
  },
  data() {
    return {
      search: {
        username: '',
        state: '',
        isSearched: false,
      },
      tableSelectData: [],
      // 用户数据
      tableList: [],
      // 分页
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      currentPage: 1,
      // 权限编辑 dialog
      PermissionUserId: '',
      PermissionUser: '',
      PermissionDialogVisible: false,
      PermissionForm: {
        roleId: 0,
      },
      // 新增 dialog
      addDialogVisible: false,
      errorMessage: '',
      addForm: {
        email: '',
        roleId: '',
        phone: '',
        password: '',
        userUse: '',
        username: '',
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      let params = {
        orders: [
          {
            asc: true,
            column: '',
          },
        ],
        pageNum: this.page.pageNo,
        pageSize: this.page.pageSize,
        searchCount: false,
        userName: '',
      }
      // let res = await getUserInfo(params)
      // if (res.code == 200) {
      //   this.total = res.data.total
      //   res.data.list.map((item) => {
      //     item.loading = false
      //   })
      //   this.tableList = res.data.list
      // }
      this.tableList = [
        {
          company: '东风启辰',
          id: 'QC01_0002',
          userName: 'zhangs@szlanyou.com',
          state: 1,
          userType: '2',
          roleType: '1',
          user: '张三',
          validityPeriod: '2025-12-31 23:59',
          email: 'zhangs@szlanyou.com',
          phone: '13056455632',
        },
        {
          company: '东风英菲尼迪',
          id: 'YFND02_0001',
          userName: 'lis@szlanyou.com',
          state: 1,
          userType: '1',
          roleType: '1',
          user: '李四',
          validityPeriod: '2025-12-31 23:59',
          email: 'lis@szlanyou.com',
          phone: '13067545678',
        },
        {
          company: '东风日产',
          id: 'DFN01_005',
          userName: 'wangw@szlanyou.com',
          state: 1,
          userType: '2',
          roleType: '0',
          user: '王五',
          validityPeriod: '2025-12-31 23:59',
          email: 'wangw@szlanyou.com',
          phone: '13056324642',
        },
        {
          company: '东风日产',
          id: 'DFN01_001',
          userName: 'zhaol@szlanyou.com',
          state: 1,
          userType: '1',
          roleType: '0',
          user: '赵六',
          validityPeriod: '2025-12-31 23:59',
          email: 'zhaol@szlanyou.com',
          phone: '13090342389',
        },
        {
          company: '东风日产数据公司',
          id: 'SJ03_0002',
          userName: 'sunq@szlanyou.com',
          state: 0,
          userType: '0',
          roleType: '0',
          user: '孙七',
          validityPeriod: '2025-12-31 23:59',
          email: 'sunq@szlanyou.com',
          phone: '13523429867',
        },
      ]
      this.$nextTick(() => {
        this.$refs['infotable'].doLayout()
      })
    },
    searchClick() {
      this.search.isSearched = true
      this.init(this.search)
    },
    // 停用0 启用1
    handleChange(state, index, row) {
      row.loading = true
      updateSysUser({
        userId: row.userId,
        state,
      })
        .then(() => {
          row.loading = false
          this.search.isSearched ? this.init(this.search) : this.init({})
        })
        .catch(() => {
          row.loading = false
        })
    },
    // 新增账号自动生成密码
    async autoPassword() {
      const password = await autoPwd()
      this.addForm.password = password
    },
    // 重置密码
    passwordReset(index, row) {
      row.loading = true
      console.log(row.userId)
      updatePassword({ userId: row.userId })
        .then((res) => {
          row.loading = false
          this.$message({
            type: 'success',
            message: `请牢记! 密码重置为: ${res}`,
            duration: 5000,
          })
          this.search.isSearched ? this.init(this.search) : this.init({})
        })
        .catch(() => {
          row.loading = false
        })
    },
    // 删除用户
    async handleDelete(index, row) {
      this.$confirm(`是否确认删除用户 ${row.userName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(async () => {
          await delectSysUser(row.userId)
          this.search.isSearched ? this.init(this.search) : this.init({})
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        })
        .catch((err) => {
          console.log(err)
        })
      console.log(row.userId)
    },
    // 编辑权限
    handlePermission(index, row) {
      this.PermissionForm.roleId = row.roleId
      this.PermissionUserId = row.userId
      this.PermissionUser = row.userName
      this.PermissionDialogVisible = true
    },
    PermissionOk() {
      updateSysUser({
        userId: this.PermissionUserId,
        roleId: this.PermissionForm.roleId,
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '权限修改成功,下次登录生效',
          })
          this.search.isSearched ? this.init(this.search) : this.init({})
        })
        .catch(() => {})
      this.permissionClose()
    },
    // 新增dialog
    async AddOk() {
      let flag = true
      this.$refs.addForm.validate((valid) => {
        if (!valid) {
          this.errorMessage = '表单未完成'
          flag = false
        }
      })
      if (flag) {
        const res = await addSysUser(this.addForm)
        console.log(res)
        this.init({})
        this.handleClose()
      }
    },
    // 表格勾选
    tableSelect(selection, row) {
      this.tableSelectData = selection
    },
    // 批量 启用1 停用0
    batchChange(state) {
      const change = state === 1 ? '启用' : '停用'
      if (!this.tableSelectData.length) {
        this.$message.error('尚未选择用户,请勾选左侧选择框')
        return
      } else {
        const flag = this.tableSelectData.every((item) => {
          return item.state === state
        })
        if (flag) {
          this.$message.error(`所选用户状态均为${change}`)
          return
        }
      }
      this.$confirm(
        `是否${change}所选的${this.tableSelectData.length}个用户`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          lockScroll: false,
        },
      )
        .then(async () => {
          Promise.all(this.batchChange1(state))
            .then(() => {
              this.search.isSearched ? this.init(this.search) : this.init({})
              this.tableSelectData = []
              this.$message({
                type: 'success',
                message: '批量操作成功',
              })
            })
            .catch((err) => {
              this.$message.error(`批量操作失败,${err}`)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 返回Pormission对象数组,用于Promise.all
    batchChange1(state) {
      const arr = this.tableSelectData.map((item) => {
        if (item.state !== state) {
          return new Promise((resolve, reject) => {
            // 更改用户状态
            updateSysUser({
              userId: item.userId,
              state,
            })
              .then((res) => {
                resolve(res)
              })
              .catch((err) => {
                reject(err)
              })
          })
        }
      })
      return arr
    },
    // 添加表单关闭
    handleClose() {
      this.errorMessage = ''
      this.addDialogVisible = false
      this.$refs.addForm.resetFields()
    },
    permissionClose() {
      this.PermissionDialogVisible = false
      this.$refs.PermissionForm.resetFields()
    },
    // 分页
    handleSizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.init(this.search)
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.init(this.search)
    },
    validateEmail(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入邮箱地址'))
      }
      if (
        !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)
      ) {
        callback(new Error('输入格式有误'))
      } else {
        callback()
      }
    },
    validatePassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value)) {
        callback(new Error('密码应为8-16位的字母+数字组合'))
      } else {
        callback()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: 10px;
  :first-child {
    margin-right: auto;
    margin-left: 0;
  }
  .nameBox {
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-right: 10px;
  }
}
//更多按钮
.moreBtn {
  color: #66b1ff;
  &:hover {
    cursor: pointer !important;
  }
}
::v-deep .el-button.btn {
  padding: 0;
  margin: 0 5px;
  font-size: 18px;
  color: #66b1ff;
}
::v-deep .el-button.editBtn {
  border-color: #66b1ff;
  color: #66b1ff;
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
//新增用户弹窗-设置密码
.loginPwd {
  white-space: nowrap; //强制不换行
}
::v-deep .newadd .el-form-item__label {
  width: 120px !important;
  font-weight: 400;
}
// .el-dialog {
//   margin-top: 9vh !important;
//   margin-bottom: 8vh !important;
//   overflow: auto;
// }
</style>
