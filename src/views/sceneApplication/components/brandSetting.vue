<!-- 配置弹窗 -->
<template>
  <el-dialog
    title="品牌配置"
    :visible="dialogFormVisible"
    width="40%"
    @close="close"
  >
    <!-- 表单表体 -->
    <div class="card-body">
      <el-form
        ref="formData"
        :model="formData"
        label-width="100px"
        :rules="rules"
        inline
        class="demo-formData"
      >
        <el-form-item label="竞品传统品牌：" prop="traditionalBrand">
          <el-select
            v-model="formData.traditionalBrand"
            placeholder="请选择品牌"
            clearable
            filterable
            multiple
            collapse-tags
            @change="selectChange()"
            style="width: 120%;"
          >
            <el-option
              v-for="(item, index) in dialogFormData.traditional"
              :key="'traditional' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新势力品牌：" prop="newPowerBrand">
          <el-select
            v-model="formData.newPowerBrand"
            placeholder="请选择品牌"
            clearable
            filterable
            multiple
            collapse-tags
            @change="selectChange()"
            style="width: 120%;"
          >
            <el-option
              v-for="(item, index) in dialogFormData.newPower"
              :key="'newPower' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="本/协同品牌：" prop="synergyBrand">
          <el-select
            v-model="formData.synergyBrand"
            placeholder="请选择品牌"
            clearable
            filterable
            multiple
            collapse-tags
            @change="selectChange()"
            style="width: 120%;"
          >
            <el-option
              v-for="(item, index) in dialogFormData.synergy"
              :key="'synergy' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <!--
      <el-button type="" @click="close">
        取消
      </el-button>
      -->
      <el-button type="" @click="resetForm">
        清空
      </el-button>
      <el-button type="primary" @click="confirm('formData')">
        生成数据
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
  name: 'brandSetting',
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
        traditionalBrand: [],
        newPowerBrand: [],
        synergyBrand: [],
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
    selectChange(value, index) {
      this.selectedOptions[index] = value
    },
    //确定
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
      this.formData = {}
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
  overflow-y: auto;
  overflow-x: hidden;
}
.formData_box {
  max-width: 680px;
}

::v-deep .el-form-item__label {
  // width: 90px !important;
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
