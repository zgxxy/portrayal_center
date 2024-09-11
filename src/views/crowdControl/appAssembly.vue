<!-- app组合圈人 -->
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
                    maxlength="30"
                    placeholder="最多不超过30字"
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
                      id="inputWidth2"
                      style="width: 100%;"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <div class="tableBox">
          <el-card class="tableBox_0">
            <div class="selectBox">
              <el-cascader
                class="select"
                v-model="formData.classify"
                :props="{ expandTrigger: 'hover' }"
                :options="classList"
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
                  v-for="item in levelList"
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
              :data="tableList"
              style="width: 100%; margin-top: 16px;"
              height="450"
              border
              stripe
              :row-key="getRowKeys"
              @selection-change="handleSelectionChange"
              :header-cell-style="{
                background: '#eef5ff',
                color: '#606266',
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
          </el-card>
          <el-card class="tableBox_1">
            <div class="app_title">
              APP 组合规则
              <span>至少要4个app以上</span>
            </div>
            <div class="box" v-if="selectList.length > 0">
              <i class="el-icon-circle-close closeBtn" @click="emptySign"></i>
              <el-tag
                class="tagbox"
                v-for="(tag, i) in selectList"
                :key="i"
                closable
                @close="handleDelete(tag)"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <el-empty v-else description="暂无数据" />
          </el-card>
        </div>
      </el-form>
    </el-card>
    <bottom-fixed>
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
    </bottom-fixed>
  </div>
</template>

<script>
import { getAppListByPage, getQueryData, addAppCrowd } from '@/api/crowdControl'
export default {
  components: {},
  filters: {
    className(type) {
      let res = ''
      if (type == 1) res = '汽车出行'
      else if (type == 2) res = '媒体社交'
      else if (type == 3) res = '购物电商'
      else if (type == 4) res = '学习教育'
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
      crowdData: this.$route.query.val,
      inputWidth1: null, //输入框长度--用于判断tooltip是否显示
      inputWidth2: null,
      formData: {
        reportName: '',
        crowdName: '',
        isGenerateReport: 1,
        classify: [],
        level: '',
        name: '',
      },
      page: {
        pageNo: 1,
        pageSize: 100,
      },
      total: 0,
      classList: [], //app选择下拉框
      levelList: [], //人群覆盖量选择框
      tableList: [], //表格数据
      selectList: [], //选中的数据
      rules: {
        reportName: [
          {
            required: false,
            message: '请输入报告名称',
            trigger: 'blur',
          },
          { validator: validateName },
        ],
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' },
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
    // 获取列表
    getList(val) {
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
          this.tableList = res.data.list
          this.total = res.data.total
        }
      })
    },
    getAppClassList() {
      getQueryData().then((res) => {
        this.classList = res.data.typeVOList
        this.levelList = res.data.partList
      })
    },
    //表格选择事件
    handleSelectionChange(row) {
      this.selectList = row
    },
    getRowKeys(row) {
      return row.pkg
    },
    //删除标签
    handleDelete(tag) {
      this.selectList.splice(this.selectList.indexOf(tag), 1)
      //左边表格的数据取消勾选,拿table内存中的值去匹配要取消勾选的数据
      this.$refs.multipleTable.selection.forEach((i) => {
        if (i.pkg === tag.pkg) {
          this.$refs.multipleTable.toggleRowSelection(i, false)
        }
      })
    },
    //清空标签
    emptySign() {
      this.$confirm('是否清空已选标签?', '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          this.selectList = []
          this.$refs.multipleTable.clearSelection()
        })
        .catch(() => {})
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
    //筛选查询
    handleIconClick() {
      this.page.pageNo = 1
      this.getList(this.formData)
    },
    //确定按钮
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.selectList.length < 4) {
          this.$message.warning('至少选择4个app！')
          return
        }
        if (
          this.formData.isGenerateReport == 1 &&
          this.formData.reportName == ''
        ) {
          this.$message.warning('请填写报告名称！')
          return
        }
        if (valid) {
          let appList = []
          let nameList = []
          this.selectList?.forEach((e) => {
            appList.push(e.pkg)
            nameList.push(e.name)
          })
          let params = {
            appList: appList,
            appNameList: nameList,
            crowdName: this.formData.crowdName,
            isGenerateReport: this.formData.isGenerateReport,
            reportName: this.formData.reportName,
            userId: sessionStorage.getItem('id'),
          }
          addAppCrowd(params).then((res) => {
            console.log(res, '确定')
            if (res.code == 200) {
              this.$message.success('添加app人群成功！')
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
::v-deep .el-form-item__label {
  width: 10px !important;
}
.tableBox {
  display: flex;
  .tableBox_0 {
    flex: 2;
  }
  .tableBox_1 {
    margin-left: 10px;
    flex: 1;
    .box {
      max-height: 520px;
      overflow-y: auto;
    }
  }
}
.box {
  border: 1px solid rgba(151, 151, 151, 0.2);
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  position: relative;
  .closeBtn {
    position: absolute;
    right: 5px;
    top: 5px;
    color: #c1c1c1;
    font-size: 14px;
  }
}
.tagbox {
  margin: 5px;
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
.el-button.rulesBtn {
  border-color: #66b1ff;
  color: #66b1ff;
  margin: 16px 0;
  float: right;
}
.app_title {
  font-size: 13px;
  margin-bottom: 16px;
  font-weight: 600;
  span {
    font-size: 12px;
    color: #999999;
    margin-left: 10px;
    font-weight: 400;
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
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
