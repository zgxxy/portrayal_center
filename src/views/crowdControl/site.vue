<!-- 到访场所圈人 -->
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
        <el-card>
          <el-row :gutter="90">
            <el-col :span="8" style="white-space: nowrap;">
              <el-form-item prop="city" label="城市：">
                <el-select
                  v-model="formData.city"
                  filterable
                  clearable
                  :filterable="true"
                  placeholder="请选择或输入城市"
                  @change="getRegions"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in citys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="white-space: nowrap;">
              <el-form-item prop="region" label="行政区：">
                <el-select
                  v-model="formData.region"
                  filterable
                  clearable
                  :filterable="true"
                  placeholder="请选择或输入行政区"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in regions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!--
          <el-radio-group v-model="formData.coverage">
            <el-radio-button label="行政区"></el-radio-button>
            <el-radio-button label="商圈"></el-radio-button>
          </el-radio-group>
          -->
        </el-card>
        <el-card>
          <div class="label">请勾选目标人群近期到访场景</div>
          <!--
          <treeSelect
            v-if="tagList.length > 0"
            :dataList="tagList"
            :maxTag="100"
            :nowTag="checkedList.length"
            @change="tagChange"
          ></treeSelect>
          -->
          <tree
            v-if="tagList.length > 0"
            :dataList="tagList"
            :maxTag="100"
            :nowTag="checkedList.length"
            @change="tagChange"
          ></tree>
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-form>
    </el-card>
    <bottom-fixed class="bottom">
      <div class="bottom_box">
        <tagEditBtn
          :checkedList="checkedList"
          :groupList="groupList"
          type="checkbox"
        ></tagEditBtn>
        <div class="remark_0">
          <div>点击可编辑已选择的标签</div>
          <div class="remark_1">
            还可选择
            <span>{{ 100 - checkedList.length }}</span>
            个关键词
          </div>
        </div>
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
      </div>
    </bottom-fixed>
  </div>
</template>

<script>
import {
  getRegionTag,
  getAllCityCode,
  getAdministrativeRegionsCodeByCityName,
  addRegionTagCrowd,
} from '@/api/crowdControl'
import treeSelect from '@/components/tag/treeSelect'
import tree from '@/components/tag/tree'
import tagEditBtn from '@/components/tag/tagEditBtn'
export default {
  components: {
    treeSelect,
    tagEditBtn,
    tree,
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
      inputWidth1: null, //输入框长度--用于判断tooltip是否显示
      inputWidth2: null,
      formData: {
        crowdName: '',
        isGenerateReport: 1, //生成报告
        reportName: '',
        city: '', //选择城市
        region: '', //行政区
        coverage: '行政区',
      },
      citys: [], //选择城市下拉框
      regions: [], //行政区下拉框
      checkedList: [],
      groupList: [],
      tagList: [], //标签数据
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
    this.getDropDownList()
  },
  mounted() {
    this.inputWidth1 = document.getElementById('inputWidth1').offsetWidth - 30
    this.inputWidth2 = document.getElementById('inputWidth2').offsetWidth - 30
  },
  methods: {
    // 获取tag数据
    async getList() {
      let res = await getRegionTag()
      if (res.code == 200) {
        this.tagList = res.data
      }
      console.log(this.tagList, '到访场所标签')
    },
    //获取下拉框数据
    getDropDownList() {
      this.citys = []
      //城市下拉框
      getAllCityCode().then((res) => {
        if (res.code == 200) {
          res.data.forEach((e) => {
            //目前只添加北上广深
            if (
              e.name == '北京市' ||
              e.name == '上海市' ||
              e.name == '广州市' ||
              e.name == '深圳市'
            ) {
              this.citys.push({
                label: e.name,
                value: e.value,
              })
            }
          })
        }
      })
    },
    getRegions(val) {
      this.regions = []
      this.formData.region = ''
      if (val) {
        getAdministrativeRegionsCodeByCityName({ cityCode: val }).then(
          (res) => {
            if (res.code == 200) {
              res.data.forEach((e) => {
                if (e.name) {
                  this.regions.push({
                    label: e.name,
                    value: e.value,
                  })
                }
              })
            }
          },
        )
      }
    },
    tagChange(val) {
      this.checkedList = []
      this.groupList = val
      this.groupList.forEach((e) => {
        if (e.children) {
          e.children.forEach((item) => {
            if (item.checked == true && item.value) {
              this.checkedList.push({
                name: item.name,
                value: item.value,
                checked: item.checked,
              })
            }
            if (item.children) {
              item.children.forEach((i) => {
                if (i.checked == true && i.value) {
                  this.checkedList.push({
                    name: i.name,
                    value: i.value,
                    checked: i.checked,
                  })
                }
              })
            }
          })
        }
      })
      console.log(this.checkedList, '标签选择')
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (
          this.formData.isGenerateReport == 1 &&
          this.formData.reportName == ''
        ) {
          this.$message.warning('请填写报告名称！')
          return
        }
        if (this.checkedList.length == 0) {
          this.$message.warning('请选择标签！')
          return
        }
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.groupList))
          let conformArray = [] //选中的标签value
          let nameArray = [] //选中的标签namae
          for (let i = 0; i < data.length; i++) {
            data[i].children.forEach((e) => {
              if (e.children.length > 0) {
                e.children.forEach((item) => {
                  if (item.checked) {
                    conformArray.push(item.value)
                    nameArray.push(item.name)
                  }
                })
              } else {
                if (e.checked) {
                  conformArray.push(e.value)
                  nameArray.push(e.name)
                }
              }
            })
          }
          //tagsNameCode添加城市和行政区
          let cityName = ''
          let regionName = ''
          this.citys.forEach((e) => {
            if (e.value == this.formData.city) {
              cityName = e.label
            }
          })
          this.regions.forEach((e) => {
            if (e.value == this.formData.region) {
              regionName = e.label
            }
          })
          if (cityName) nameArray.push(cityName)
          if (regionName) nameArray.push(regionName)
          let params = {
            crowdName: this.formData.crowdName,
            isGenerateReport: this.formData.isGenerateReport,
            reportName: this.formData.reportName,
            administrativeRegionsTag: this.formData.region
              ? [this.formData.region]
              : [this.formData.city],
            tagsCode: conformArray,
            tagsNameCode: nameArray,
            userId: sessionStorage.getItem('id'),
          }
          addRegionTagCrowd(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('添加场景标签人群成功！')
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
.label {
  font-weight: 900;
  font-size: 12px;
  padding: 0 8px;
}
// .bottom {
//   position: fixed;
//   bottom: 0;
//   width: 95%;
//   background-color: #fff;
//   z-index: 999;
//   flex-shrink: 0;
// }
.bottom_box {
  display: flex;
  align-items: center;
  .remark_0 {
    margin-left: 20px;
    font-size: 12px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 600;
    color: #333333;
  }
  .remark_1 {
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    margin-top: 8px;
    span {
      color: #418ff6;
    }
  }
}
.btn {
  margin-right: 0;
  margin-left: auto;
  margin-top: 10px;
}
::v-deep .el-form-item__label {
  width: 80px !important;
}
::v-deep .el-form-item__error {
  left: 80px;
}
</style>
