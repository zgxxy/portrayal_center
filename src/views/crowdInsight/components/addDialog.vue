<!-- 新建画像报告弹窗 -->
<template>
  <el-dialog
    title="新建画像报告"
    :visible="dialogFormVisible"
    width="40%"
    @close="close"
  >
    <!-- 表单表体 -->
    <div class="card-body">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="demo-formData"
      >
        <el-row :gutter="0">
          <el-col :span="18" style="white-space: nowrap;">
            <el-form-item label="报告名称：" prop="reportName">
              <el-tooltip
                :content="formData.reportName"
                placement="top"
                effect="light"
                :disabled="formData.reportName | showTooltip(inputWidth)"
              >
                <el-input
                  v-model="formData.reportName"
                  placeholder="最多不超过30字"
                  maxlength="30"
                  id="inputWidth"
                  clearable
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="white-space: nowrap;">
            <el-form-item label="面向客群：" prop="crowdId">
              <el-select
                v-model="formData.crowdId"
                placeholder="请选择"
                clearable
                :filterable="true"
                style="width: 100%;"
              >
                <el-option
                  v-for="(item, index) in crowdList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button class="addCustomer" type="" @click="addCustomer">
                新建客群
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="" @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="confirm('formData')">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { generateCrowdReport } from '@/api/crowdControl'
import { downloadFile } from '@/utils/file'
import { mapState, mapMutations } from 'vuex'
import store from '@/store'
export default {
  name: 'addDialog',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    dialogFormData: {
      type: Object,
      default: function () {
        return ''
      },
    },
    crowdList: Array,
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
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      formData: {
        reportName: '',
        crowdId: '',
      },
      rules: {
        reportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' },
          { validator: validateName },
        ],
        crowdId: [{ required: true, message: '请选择客群', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.inputWidth = document.getElementById('inputWidth').offsetWidth - 30
  },
  methods: {
    //新建客群
    addCustomer() {
      this.$router.push({
        path: '/crowdControl/customUpload',
        query: { isCustomln: true },
      })
    },
    //确定
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          generateCrowdReport(this.formData).then((res) => {
            console.log(res, '新建结果')
            if (res.code == 200) {
              this.close()
              this.$message.success('新建成功！')
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
    //关闭弹窗事件
    close() {
      this.$emit('dialogFormVisible', false)
      this.resetForm()
    },
    //重置
    resetForm() {
      this.formData.reportName = ''
      this.formData.crowdId = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  // border: 1px solid #dcdfe6;
  // margin: 0 20px;
  // padding: 20px 0;
}
// ::v-deep .el-dialog__header {
//   border-bottom: none;
// }
::v-deep .el-form-item__label {
  width: 110px !important;
}
//校验提示语样式
::v-deep .el-form-item__error {
  left: 10px !important;
}
::v-deep .el-button.addCustomer {
  border-color: #66b1ff;
  color: #66b1ff;
  margin-left: 10px;
}
</style>
