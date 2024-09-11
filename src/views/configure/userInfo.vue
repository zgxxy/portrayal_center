<!-- 用户信息 -->
<template>
  <div>
    <el-card class="father-card">
      <el-card>
        <headline>个人信息</headline>
        <div class="header">
          <img
            src="@/assets/images/slices/user.svg"
            style="width: 50px; height: 50px; margin-right: 20px;"
            class="user-avatar"
          />
          <div class="fixe_line userInfo">
            <div class="tree_column" v-if="dataList.userName">
              用户昵称：{{ dataList.userName }}
            </div>
            <div class="tree_column edit-input" v-if="dataList.email">
              绑定邮箱：
              <span v-if="!editEmail">{{ dataList.email }}</span>
              <el-input
                v-else
                ref="email"
                placeholder="请输入邮箱"
                v-model="email"
                style="width: 70%; height: 30px; margin: -10px 0 5px 0;"
                @blur="editInput('email')"
                @keyup.enter.native="$event.target.blur"
              />
              <i
                class="el-icon-edit-outline"
                v-show="false"
                @click="editEmail = true"
              ></i>
            </div>
            <div class="tree_column edit-input" v-if="dataList.phone">
              绑定手机：
              <span v-if="!editPhone">{{ dataList.phone }}</span>
              <el-input
                v-else
                ref="phone"
                placeholder="请输入手机号"
                v-model="phone"
                style="width: 70%; height: 30px; margin: -10px 0 5px 0;"
                @blur="editInput"
                @keyup.enter.native="$event.target.blur"
              />
              <i
                class="el-icon-edit-outline"
                v-show="!editPhone"
                @click="editPhone = true"
              ></i>
            </div>
            <div class="tree_column" v-if="dataList.company">
              关联公司：{{ dataList.company }}
            </div>
            <div class="tree_column" v-if="dataList.code">
              授权码：{{ dataList.code }}
            </div>
            <div class="tree_column" v-if="dataList.periodDate">
              有效期至：{{ dataList.periodDate }}
            </div>
          </div>
        </div>
      </el-card>
      <!-- mian-table -->
      <el-card>
        <el-tabs v-model="tabsValue" type="card">
          <el-tab-pane label="服务信息" name="0">
            <el-table
              border
              stripe
              align="center"
              :data="dataList.serviceInfo"
              style="width: 100%;"
              :header-cell-style="{
                background: '#eef5ff',
                color: '#606266',
                borderColor: '#d8e6fe',
                fontSize: '12px',
              }"
              :cell-style="{ borderColor: '#d8e6fe' }"
            >
              <el-table-column
                prop="serviceId"
                label="服务ID"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="serviceContent"
                label="服务内容"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="serviceStatus"
                label="服务状态"
                :show-overflow-tooltip="true"
                width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.serviceStatus | serviceStatus }}
                </template>
              </el-table-column>
              <el-table-column prop="serviceTimes" label="服务次数" width="80">
                <template slot-scope="scope">
                  {{
                    scope.row.serviceTimes | serviceTimes(scope.row.chargeType)
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="validPeriod"
                label="有效期限"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  {{ scope.row.validPeriod || '--' }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="日志信息" name="1">
            <el-table
              border
              stripe
              align="center"
              :data="dataList.logInfo"
              style="width: 100%;"
              :header-cell-style="{
                background: '#eef5ff',
                color: '#606266',
                borderColor: '#d8e6fe',
                fontSize: '12px',
              }"
              :cell-style="{ borderColor: '#d8e6fe' }"
            >
              <el-table-column
                prop="serviceId"
                label="服务ID"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="serviceStatus"
                label="服务状态"
                :show-overflow-tooltip="true"
              />
            </el-table>
          </el-tab-pane>
        </el-tabs>

        <!-- main-table -->
      </el-card>
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
import { thousandFormat } from '@/utils/public'
export default {
  filters: {
    serviceStatus(val) {
      let res = ''
      if (val == 0) res = '未开始'
      else if (val == 1) res = '正常'
      else if (val == 2) res = '过期'
      else if (val == 3) res = '禁用'
      return res
    },
    serviceTimes(serviceTimes, chargeType) {
      let res = ''
      if (chargeType == 1) {
        if (serviceTimes && !isNaN(serviceTimes)) {
          res = thousandFormat(serviceTimes) + '次'
        } else if (!serviceTimes) {
          res = '--'
        }
      } else {
        res = '包年不限次'
      }

      return res
    },
  },
  data() {
    return {
      thousandFormat: thousandFormat,
      tabsValue: '0', //最外层tab
      email: '',
      phone: '',
      editEmail: false,
      editPhone: false,
      dataList: {}, //页面数据
      // 分页
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      currentPage: 1,
    }
  },
  created() {
    this.init()
    // const userInfo = this.$store.dispatch('user/getUserInfo')
    console.log(this.$store.state.user, 'userInfo')
  },
  methods: {
    async init() {
      let res = await getUserInfo({ userId: sessionStorage.getItem('id') })
      if (res.code == 200) {
        this.dataList = res.data
      }
      // this.dataList = {
      //   userName: '汤姆',
      //   email: '826826@163.com',
      //   // phone: '13876789876',
      //   // company: '联友科技',
      //   // code: 'ERWER36DDFG23D',
      //   // periodDate: '2025-09-23',
      //   serviceInfo: [
      //     {
      //       serviceId: 'gfd35vd',
      //       serviceContent: '通用标签查询接口',
      //       serviceStatus: '正常',
      //       serviceTimes: '500000',
      //       availableEquity: '402601',
      //       serviceType: 'API',
      //       validPeriod: '2025-12-31',
      //     },
      //     {
      //       serviceId: 'vxd56dg',
      //       serviceContent: '通用标签查询接口',
      //       serviceStatus: '正常',
      //       serviceTimes: '包年不限次',
      //       availableEquity: '',
      //       serviceType: 'API',
      //       validPeriod: '2025-12-31',
      //     },
      //     {
      //       serviceId: 'kjgf23sd',
      //       serviceContent: '通用标签查询接口',
      //       serviceStatus: '正常',
      //       serviceTimes: '包年不限次',
      //       availableEquity: '',
      //       serviceType: 'API',
      //       validPeriod: '2025-12-31',
      //     },
      //   ],
      //   logInfo: [],
      // }
      this.email = this.dataList.email
      this.phone = this.dataList.phone
    },
    editInput(type) {
      if (type == 'email') {
        let email = JSON.parse(JSON.stringify(this.dataList.email))
        if (
          !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
            this.email,
          )
        ) {
          this.$message.error('邮箱格式有误')
          // this.$refs.email.focus()
          this.editEmail = false
          this.email = email
          return
        }
        this.$confirm('提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          message: '是否确认修改邮箱？',
        })
          .then(() => {
            this.editEmail = false
            this.dataList.email = this.email
          })
          .catch(() => {
            this.email = email
            this.editEmail = false
            this.$message({
              type: 'info',
              message: '已取消修改',
            })
          })
      } else {
        let phone = JSON.parse(JSON.stringify(this.dataList.phone))
        if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone)) {
          this.$message.error('手机号格式有误')
          this.editPhone = false
          this.phone = phone
          return
        }
        this.$confirm('提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          message: '是否确认修改手机号？',
        })
          .then(() => {
            this.editPhone = false
            this.dataList.phone = this.phone
          })
          .catch(() => {
            this.phone = phone
            this.editPhone = false
            this.$message({
              type: 'info',
              message: '已取消修改',
            })
          })
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
  .userInfo {
    flex: 2;
    :nth-child(n) {
      margin-bottom: 0;
    }
    // :nth-child(-n + 3) {
    //   margin-bottom: 12px;
    // }
  }
  .edit-input {
    display: flex;
    i {
      margin-left: 10px;
      color: #409eff;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
::v-deep .el-tabs__item {
  font-size: 12px;
}
</style>
