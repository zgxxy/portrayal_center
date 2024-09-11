<!-- 车型客群洞察 -->
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
            <el-step title="配置基础信息"></el-step>
            <el-step title="选择目标客群"></el-step>
            <el-step title="查看报告"></el-step>
          </el-steps>
        </div>
      </el-card>
      <el-card>
        <el-form
          ref="formData0"
          :model="formData0"
          :rules="rules0"
          v-if="active == 0"
        >
          <el-form-item prop="portraitReportName" label="人群洞察报告名称：">
            <el-tooltip
              :content="formData0.portraitReportName"
              placement="top"
              effect="light"
              :disabled="formData0.portraitReportName | showTooltip(inputWidth)"
            >
              <el-input
                v-model="formData0.portraitReportName"
                placeholder="最多不超过30字"
                maxlength="30"
                id="inputWidth"
                clearable
                style="width: 50%;"
              ></el-input>
            </el-tooltip>
          </el-form-item>
          <div style="margin: 15px;"></div>
          <el-form-item prop="brand" label="品牌类型配置：">
            <el-radio-group v-model="formData0.brand">
              <el-radio :label="1">自有品牌</el-radio>
              <el-radio :label="2">其他品牌</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form
          ref="formData1"
          :model="formData1"
          :rules="rules1"
          v-if="active == 1 && formData0.brand == 1"
        >
          <el-form-item prop="carSeriesId" label="车系名称：">
            <el-select
              v-model="formData1.carSeriesId"
              placeholder="请选择或输入车系"
              clearable
              :filterable="true"
              style="width: 50%;"
            >
              <el-option
                v-for="(item, index) in ownCarList"
                :key="'car' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <div style="margin: 20px;"></div>
          <el-form-item prop="crowdId" label="已有人群：">
            <div style="white-space: nowrap;">
              <el-select
                v-model="formData1.crowdId"
                placeholder="请选择或输入人群"
                clearable
                :filterable="true"
                style="width: 50%;"
              >
                <el-option
                  v-for="(item, index) in crowdList"
                  :key="'crowd' + index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button class="addCustomer" type="" @click="addCustomer">
                新建客群
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-form
          ref="formData2"
          :model="formData2"
          :rules="rules2"
          v-if="active == 1 && formData0.brand == 2"
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
              <span class="gray_box">最多不超过3个车型</span>
            </div>
          </el-form-item>
          <div style="margin: 20px;"></div>
          <el-form-item prop="source" label="受众来源：">
            <div style="white-space: nowrap;">
              <!--
              <el-checkbox-group v-model="formData2.source">
                <el-checkbox label="安装了品牌车主APP" border></el-checkbox>
                <el-checkbox label="半年内访问过4s店" border></el-checkbox>
              </el-checkbox-group>
              -->
              <checkbox :data="formData2.source"></checkbox>
            </div>
          </el-form-item>
        </el-form>
        <div class="sussess_box" v-if="active == 2">
          <div class="count_box">
            <span>{{ msg }}</span>
            <span class="count">{{ count }}</span>
            秒后自动跳转到画像报告列表
          </div>
          <el-button @click="toVehicleType">查看报告</el-button>
        </div>
      </el-card>
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
      <add
        :dialog-form-visible.sync="dialogFormVisible"
        :dialogFormData="dialogFormData"
        @dialogFormVisible="closeFrom"
      />
    </el-card>
  </div>
</template>

<script>
import { getAllFileCrowdVo } from '@/api/crowdControl'
import {
  getCarSeries,
  getCarBrandData,
  addCarSeriesInsight,
} from '@/api/crowdInsight'
import add from './components/addCustomer.vue'
import checkbox from '@/components/button/checkBox'
export default {
  components: {
    add,
    checkbox,
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
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      count: '', //定时跳转
      msg: '', //第三页显示接口返回状态
      dialogFormVisible: false, //新建客群弹窗
      dialogFormData: {},
      formData0: {
        portraitReportName: '', //报告名称
        brand: 1, //品牌
      },
      //自主品牌
      formData1: {
        carSeriesId: '', //车系
        crowdId: '', //人群
      },
      //其他品牌
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
      ownCarList: [], //自有品牌车系列表
      otherCarList: [], //其他品牌车系列表
      crowdList: [], //人群列表
      brandList: [], //品牌列表
      dataList: [],
      rules0: {
        portraitReportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' },
          { validator: validateName },
        ],
        brand: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      rules1: {
        carSeriesId: [
          { required: true, message: '请选择车系', trigger: 'blur' },
        ],
        crowdId: [{ required: true, message: '请选择人群', trigger: 'blur' }],
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
    },
    //上一步
    prev() {
      if (this.active-- > 2) this.active = 0
      this.formData1 = {
        carSeriesId: '',
        crowdId: '',
      }
      this.formData2 = {
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
      }
    },
    //下一步
    next(formName) {
      if (this.active == 1 && this.formData0.brand == 2) {
        formName = 'formData' + (this.active + 1)
      }
      this.$refs[formName].validate((valid, item) => {
        if (valid) {
          if (this.active == 1) {
            if (
              this.formData0.brand == 2 &&
              !this.formData2.source[0].checked &&
              !this.formData2.source[1].checked
            ) {
              this.$message.warning('请选择受众来源！')
              return
            }
            let params = {
              app: this.formData2.source[0].checked ? 1 : 0,
              brandType: this.formData0.brand,
              carSeries: this.formData1.carSeriesId,
              carbrand: this.formData2.brandName,
              crowdId: this.formData1.crowdId,
              is4S: this.formData2.source[1].checked ? 1 : 0,
              name: this.formData0.portraitReportName,
              userId: sessionStorage.getItem('id'),
            }
            console.log(params, '参数')
            addCarSeriesInsight(params).then((res) => {
              this.msg = res.msg
              if (this.active++ > 2) this.active = 0
              this.countDown()
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
    //打开新增弹窗
    addCustomer() {
      this.dialogFormVisible = true
    },
    //关闭新增弹窗
    closeFrom(val, list) {
      this.dialogFormVisible = val
      this.crowdList = list
    },
    toVehicleType() {
      clearInterval(this.timer)
      this.$router.push('/crowdInsight')
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
            this.$router.push('/crowdInsight')
          }
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.label {
  font-weight: 900;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
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

.gray_box {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  text-align: center;
  margin-left: 10px;
}
.addCustomer {
  border-color: #66b1ff;
  color: #66b1ff;
  margin-left: 10px;
}
::v-deep .el-upload-dragger {
  width: 400px;
  height: 170px;
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
  //   color: #409eff;
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
