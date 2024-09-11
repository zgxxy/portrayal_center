<!-- 我的画像报告 -->
<template>
  <div>
    <el-card class="father-card">
      <div class="header">
        <el-button class="addBtn" type="" @click="openDialog">新建</el-button>
        <div class="search">
          <span>报告名称：</span>
          <el-tooltip
            :content="reportName"
            placement="top"
            effect="light"
            :disabled="reportName | showTooltip(inputWidth)"
          >
            <el-input
              placeholder="请输入"
              v-model="reportName"
              id="inputWidth"
              class="searchInput"
              @keyup.enter.native="search"
            >
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="search"
              ></i>
            </el-input>
          </el-tooltip>
        </div>
      </div>
      <div class="body">
        <el-table
          ref="table"
          :data="dataList"
          style="width: 100%;"
          border
          stripe
          @row-click="gotoDetail"
          :header-cell-style="{
            background: '#eef5ff',
            color: '#606266',
            borderColor: '#d8e6fe',
            fontSize: '12px',
          }"
          :cell-style="{ borderColor: '#d8e6fe' }"
        >
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column
            prop="portraitReportName"
            label="画像报告名称"
            align="left"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="sampleSize" label="样本规模" width="100">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.sampleSize
                    ? thousandFormat(scope.row.sampleSize)
                    : '--'
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="90"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.createTime || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="reportUpdateTime"
            label="更新时间"
            min-width="90"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.reportUpdateTime || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="reportLastGeneralTime"
            label="报告最后生成时间"
            min-width="90"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.reportLastGeneralTime || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="isGeneral" label="状态" width="80">
            <template slot-scope="scope">
              <div>
                {{ scope.row.isGeneral | isGeneral }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div class="moreBtn">
                <el-tooltip
                  v-if="reportShow"
                  effect="dark"
                  content="查看报告"
                  placement="top"
                >
                  <el-button
                    type="text"
                    :class="scope.row.isGeneral == 1 ? 'operate' : 'disabled'"
                    :disabled="scope.row.isGeneral != 1"
                    icon="el-icon-s-order"
                    @click="gotoReport(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  v-if="updateShow"
                  effect="dark"
                  content="更新报告"
                  placement="top"
                >
                  <el-button
                    type="text"
                    :class="scope.row.isGeneral == 1 ? 'operate' : 'disabled'"
                    :disabled="scope.row.isGeneral != 1"
                    icon="el-icon-refresh"
                    @click="updateReport(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  v-if="downloadShow"
                  effect="dark"
                  content="下载报告"
                  placement="top"
                >
                  <el-button
                    type="text"
                    :class="scope.row.isGeneral == 1 ? 'operate' : 'disabled'"
                    :disabled="scope.row.isGeneral != 1"
                    icon="el-icon-download"
                    @click="downloadReportFile(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  v-if="shareShow"
                  effect="dark"
                  content="分享报告"
                  placement="top"
                >
                  <el-button
                    type="text"
                    :class="scope.row.isGeneral == 1 ? 'operate' : 'disabled'"
                    :disabled="scope.row.isGeneral != 1"
                    icon="el-icon-share"
                    @click="shareDialog(scope.row)"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page="page.pageNo"
          :page-sizes="[10, 20, 30]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 分页 -->
      <add
        :dialog-form-visible.sync="dialogFormVisible"
        :dialogFormData="dialogFormData"
        :crowdList="crowdList"
        @dialogFormVisible="closeFrom"
      />
      <el-dialog
        class="shareDialog"
        title=""
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="60%"
      >
        <el-form ref="formData" :model="emailForm" :rules="rules">
          <el-form-item prop="email">
            <div
              class="demo-input-suffix"
              style="display: flex; align-items: center;"
            >
              <div style="min-width: 90px;">发送至邮箱：</div>
              <el-input
                class="sendEmail"
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
import {
  getPortraitReportByPage,
  updateReport,
  updateContrastReport,
  shareReportByEmail,
  shareContrastReportByMail,
} from '@/api/crowdInsight'
import { getAllVO } from '@/api/crowdControl'
import { downloadReportFile, downloadContrastReportFile } from '@/api/report'
import { downloadFile } from '@/utils/file'
import { thousandFormat } from '@/utils/public'
import add from './components/addDialog.vue'
export default {
  components: {
    add,
  },
  filters: {
    isGeneral(isGeneral) {
      let res = ''
      if (isGeneral == 0) res = '生成中'
      else if (isGeneral == 1) res = '已生成'
      else if (isGeneral == 2) res = '生成失败'
      return res
    },
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
      thousandFormat: thousandFormat,
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      reportShow: true, //查看报告
      updateShow: true, //更新画像
      downloadShow: true, //下载报告
      shareShow: true, //分享报告
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      reportName: '',
      operateList: [
        '@/assets/images/update.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
        // '@/assets/images/form.png',
        // '@/assets/images/form.png',
      ],
      dataList: [],
      dialogVisible: false, //发送邮件弹窗
      emailForm: {
        reportId: '',
        email: '', //邮箱
      }, //分享报告--发送邮箱
      dialogFormVisible: false, //数据上传弹窗
      dialogFormData: {}, //新建弹窗数据
      crowdList: [], //新建弹窗--人群包列表
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail },
        ],
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
    async getList() {
      this.dataList = []
      let params = {
        orders: [
          {
            asc: false,
            column: 'update_time',
          },
        ],
        reportName: this.reportName,
        pageNum: this.page.pageNo,
        pageSize: this.page.pageSize,
        searchCount: true,
        userId: sessionStorage.getItem('id'),
      }
      getPortraitReportByPage(params).then((res) => {
        this.dataList = res.data.list
        this.total = res.data.total
      })
    },
    //输入查询
    search(val) {
      this.page.pageNo = 1
      this.getList(val.value)
    },
    //跳转至画像页面
    gotoDetail(row, event) {
      if (event.label !== '操作' && row.isGeneral == 1) {
        switch (row.reportType) {
          case 1:
            this.$router.push({
              path: '/crowdInsight/portrayal',
              query: row,
            })
            break
          case 2:
            this.$router.push({
              path: '/crowdInsight/vehicleType',
              query: row,
            })
            break
          case 3:
            this.$router.push({
              path: '/crowdInsight/contrastPortrayal',
              query: row,
            })
            break
        }
      }
    },
    //更新报告
    updateReport(row) {
      if (row.reportType == 3) {
        updateContrastReport({ reportId: row.id }).then((res) => {
          if (res.code == 200) {
            this.$message.success('更新成功！')
            this.getList()
          }
        })
      } else {
        updateReport({ reportId: row.id }).then((res) => {
          if (res.code == 200) {
            this.$message.success('更新成功！')
            this.getList()
          }
        })
      }
    },
    //跳转至报告页面
    gotoReport(row) {
      if (row.isGeneral == 1) {
        switch (row.reportType) {
          case 1:
            this.$router.push({
              path: '/crowdInsight/portrayal',
              query: row,
            })
            break
          case 2:
            this.$router.push({
              path: '/crowdInsight/vehicleType',
              query: row,
            })
            break
          case 3:
            this.$router.push({
              path: '/crowdInsight/contrastPortrayal',
              query: row,
            })
            break
        }
      } else {
        this.$message.warning('暂无报告！')
      }
    },
    //跳转至客群对比页面
    gotoPortrayal() {},
    //下载报告
    async downloadReportFile(row) {
      let res = null
      //reportType:3对比报告
      if (row.reportType == 3) {
        res = await downloadContrastReportFile(row.id)
      } else {
        res = await downloadReportFile(row.id)
      }
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
    },
    //发送邮件
    sendEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogFormData.reportType == 3) {
            shareContrastReportByMail(this.emailForm).then((res) => {
              if (res.code == 200) {
                this.$message.success('分享成功！')
              }
            })
          } else {
            shareReportByEmail(this.emailForm).then((res) => {
              if (res.code == 200) {
                this.$message.success('分享成功！')
              }
            })
          }

          this.handleClose()
        }
      })
    },
    shareDialog(row) {
      this.dialogVisible = true
      this.emailForm.reportId = row.id
      this.dialogFormData = row
    },
    //关闭邮箱弹窗
    handleClose() {
      // setTimeout(function () {
      // this.$refs['formData'].clearValidate() //消除校验,这里的setTimeOut不能去掉,去掉之后会不生效
      // }, 30)
      this.emailForm.email = ''
      this.dialogVisible = false
    },
    //打开新增弹窗
    openDialog() {
      this.dialogFormVisible = true
      getAllVO().then((res) => {
        console.log(res.data, '人群列表')
        res.data.forEach((e) => {
          this.crowdList.push({
            label: e.crowdName,
            value: e.id,
          })
        })
      })
    },
    //关闭新增弹窗
    closeFrom(val) {
      this.dialogFormVisible = val
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
}
.search {
  font-size: 12px;
  display: flex;
  align-items: center;
  :nth-child(2) {
    flex: 1;
    margin-left: 7px;
  }
}
.toogleExpand:hover {
  color: #409eff;
}
// .operate {
//   margin-right: 10px;
// }
.el-button.addBtn {
  border-color: #66b1ff;
  color: #66b1ff;
}
.popoverBox {
  display: flex;
  align-items: center;
  :nth-child(n + 2) {
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
.el-button.operate {
  padding: 0;
  margin: 0 3px;
  font-size: 18px;
  color: #66b1ff;
}
.el-button.disabled {
  padding: 0;
  margin: 0 3px;
  font-size: 18px;
  color: #d9d9d9;
}
.input-with-select {
  ::placeholder {
    font-size: 12px;
  }
}
::v-deep .el-form-item__error {
  left: 90px;
}
::v-deep .searchInput .el-input__inner {
  border-radius: 35px;
  height: 25px;
  background: transparent;
}
::v-deep .searchInput .el-input__icon {
  line-height: 25px;
}
::v-deep .shareDialog .el-dialog__header {
  border-bottom: 1px solid #ffffff;
}
::v-deep .shareDialog .el-dialog__body {
  display: flex;
  align-items: normal;
  padding: 10px;
}
</style>
