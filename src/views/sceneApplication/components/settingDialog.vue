<!-- 配置弹窗 -->
<template>
  <el-dialog
    title="活动选址推荐规则配置"
    :visible="dialogFormVisible"
    width="60%"
    @close="close"
  >
    <!-- 表单表体 -->
    <div class="card-body">
      <el-form
        ref="formData"
        :model="formData"
        label-width="55px"
        class="demo-formData"
      >
        <div
          class="formData_box"
          v-for="(item, index) in formData.list"
          :key="'formData' + index"
        >
          <el-row :gutter="35">
            <el-col :span="8" style="white-space: nowrap;">
              <el-form-item
                :label="'规则' + (index + 1) + '：'"
                :prop="'list.' + index + '.rule'"
                :rules="rules.rule"
              >
                <el-select
                  v-model="item.rule"
                  placeholder="请选择或输入规则"
                  clearable
                  :filterable="true"
                  @change="selectChange(item.rule, index)"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(value, optionIndex) in dialogFormData.selectData"
                    :key="'selectData' + optionIndex"
                    :label="value.label"
                    :disabled="getDisable(value.value, 0)"
                    :value="value.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="white-space: nowrap;">
              <el-form-item
                label="权重："
                :prop="'list.' + index + '.weight'"
                :rules="rules.weight"
              >
                <el-input
                  v-model="item.weight"
                  oninput="if(value.length>3)value=value.slice(0,3)"
                  type="number"
                  clearable
                  style="width: 100%;"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="white-space: nowrap;">
              <el-form-item
                label="优先级："
                :prop="'list.' + index + '.priority'"
                :rules="rules.priority"
              >
                <el-select
                  v-model="item.priority"
                  placeholder=""
                  clearable
                  :filterable="true"
                  style="width: 100%;"
                  @change="priorityChange(item.priority, index)"
                >
                  <el-option
                    v-for="(val, inx) in formData.list.length"
                    :key="'priority' + inx"
                    :label="val"
                    :value="val"
                    :disabled="getDisable(val, 1)"
                  ></el-option>
                </el-select>
                <i
                  class="el-icon-remove-outline"
                  style="margin-left: 10px; cursor: pointer;"
                  @click="deleteList(index)"
                ></i>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-col :span="22" style="white-space: nowrap;">
          <div class="addBox" @click="addList(1)">
            <span class="gray_box">
              <i class="el-icon-plus" />
              新增规则
            </span>
          </div>
        </el-col>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <span style="margin-right: 20px;">
        当前权重总和：
        <span style="color: red;">
          {{ weightNum() }}
        </span>
      </span>
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
      selectedOptions: [0, 1, 2, 3], //储存选中的状态
      priorityOptions: [],
      formData: {
        list: [
          {
            rule: 0,
            weight: null,
            priority: null,
          },
          {
            rule: 1,
            weight: null,
            priority: null,
          },
          {
            rule: 2,
            weight: null,
            priority: null,
          },
          {
            rule: 3,
            weight: null,
            priority: null,
          },
        ],
      },
      rules: {
        rule: [{ required: true, message: '请选择规则', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入权重', trigger: 'blur' }],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    addList() {
      this.formData.list.push({
        rule: null,
        weight: null,
        priority: null,
      })
    },
    selectChange(value, index) {
      this.selectedOptions[index] = value
    },
    priorityChange(value, index) {
      this.priorityOptions[index] = value
    },
    //禁用计算
    getDisable(value, type) {
      switch (type) {
        case 0:
          if (this.selectedOptions.indexOf(value) >= 0) {
            return true
          } else {
            return false
          }
          break
        case 1:
          if (this.priorityOptions.indexOf(value) >= 0) {
            return true
          } else {
            return false
          }
          break
      }
    },
    weightNum() {
      let num = 0
      this.formData.list.forEach((e) => {
        num += Number(e.weight)
      })
      return num
    },
    //删除
    deleteList(index) {
      this.formData.list.splice(index, 1)
      //释放禁用选项
      this.selectedOptions.splice(index, 1)
      this.priorityOptions.splice(index, 1)
      console.log(this.priorityOptions, 'priorityOptions')
      //删除数组，优先级数大于数组数量时重新选择优先级
      this.formData.list.forEach((e) => {
        if (e.priority > this.formData.list.length) {
          e.priority = null
          //释放被删除的选项
          this.priorityOptions.splice(
            this.priorityOptions.indexOf(this.formData.list.length + 1),
            1,
          )
        }
      })
    },
    //确定
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let num = this.weightNum()
          if (num !== 100) {
            this.$message.warning('权重总和必须等于100！')
            return
          }
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
  height: 285px;
  overflow-y: auto;
  overflow-x: hidden;
}
.formData_box {
  max-width: 680px;
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
  margin-left: 35px;
  // margin-right: 15px;
  .gray_box {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    text-align: center;
    margin-left: 5px;
    cursor: pointer;
  }
}
::v-deep .el-form-item__label {
  width: 100px !important;
}
//校验提示语样式
::v-deep .el-form-item__error {
  left: 45px !important;
}
::v-deep .el-button.addCustomer {
  border-color: #66b1ff;
  color: #66b1ff;
  margin-left: 10px;
}
</style>
