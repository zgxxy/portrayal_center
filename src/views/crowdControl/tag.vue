<!-- ta标签圈人 -->
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
        <el-card class="tagBox">
          <tagBox
            v-if="flag"
            :dataList="tagData"
            :maxTag="19"
            :checkedList="checkedList"
            :groupList="groupList"
            :tabActive="tabActive"
          ></tagBox>
        </el-card>
      </el-form>
    </el-card>
    <bottom-fixed class="bottom">
      <div class="bottom_box">
        <tagEditBtn
          :checkedList="checkedList"
          :groupList="groupList"
          type="button"
          @change="tagChange"
        ></tagEditBtn>
        <div class="remark_0">
          <div>点击可编辑已选择的标签</div>
          <div class="remark_1">
            还可选择
            <span>{{ 19 - groupList.length }}</span>
            个标签组合
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
import { getTagData, addTagCrowd } from '@/api/crowdControl'
import tagBox from '@/components/tag/tagForm'
import tagEditBtn from '@/components/tag/tagEditBtn'
export default {
  components: {
    tagBox,
    tagEditBtn,
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
      tabActive: '0',
      flag: true, //子组件渲染
      crowdData: this.$route.query.val,
      inputWidth1: null, //输入框长度--用于判断tooltip是否显示
      inputWidth2: null,
      formData: {
        crowdName: '',
        isGenerateReport: 1,
        reportName: '',
      },
      tagData: [], //标签数据
      checkedList: [], //选中的标签
      groupList: [], //选中的标签组合
      rules: {
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' },
          { validator: validateName },
        ],
        reportName: [
          {
            required: false,
            message: '请输入报告名称',
            trigger: 'blur',
          },
          { validator: validateName },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.inputWidth1 = document.getElementById('inputWidth1').offsetWidth - 30
    this.inputWidth2 = document.getElementById('inputWidth2').offsetWidth - 30
  },
  methods: {
    // 获取标签数据
    async getList() {
      let res = await getTagData()
      if (res.code == 200) {
        this.tagData = res.data
        //第一层数据加上index，作为tab默认选中的index
        this.tagData.forEach((e, i) => {
          e['index'] = i.toString()
        })
      }
    },
    //底部按钮标签修改
    tagChange(index) {
      this.flag = index
    },
    //确定
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
          let newArray = [] //只包含checked==true的数据
          let conformArray = [] //选中的value字符串拼接
          let nameArray = [] //选中的name字符串拼接
          data.forEach((now, index) => {
            newArray[index] = now
            newArray[index].children = now.children.filter((item) => {
              return item.checked == true
            })
          })
          newArray.forEach((e) => {
            e['valStr'] = ''
            e['nameStr'] = ''
            e.children.forEach((val) => {
              e.valStr += val.value + ','
              e.nameStr += val.name + ','
            })
            e.valStr = e.valStr.substr(0, e.valStr.length - 1)
            conformArray.push(e.valStr)
            e.nameStr = e.nameStr.substr(0, e.nameStr.length - 1)
            nameArray.push(e.nameStr)
          })
          let params = {
            crowdName: this.formData.crowdName,
            isGenerateReport: this.formData.isGenerateReport,
            reportName: this.formData.reportName,
            tagsCode: conformArray,
            tagNameList: nameArray,
            unTagsCode: [],
            userId: sessionStorage.getItem('id'),
          }
          console.log(params, '参数')
          addTagCrowd(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('添加TA标签人群成功！')
              this.$router.push('/crowdControl')
            }
          })
          // console.log(this.checkedList, '确定-标签')
          // console.log(this.groupList, '确定-标签组')
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
::v-deep .tagBox .el-card__body {
  padding: 0;
  // height: 821px;
  // overflow: scroll;
}
.label {
  font-weight: 900;
  font-size: 12px;
}
// .bottom {
//   position: fixed;
//   bottom: 0;
//   width: 90%;
//   background-color: #f5f7fc;
//   padding: 20px;
//   z-index: 999;
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
  // display: flex;
  // justify-content: flex-end;
  margin-right: 0;
  margin-left: auto;
  margin-top: 10px;
}
.tag_box {
  padding: 0 20px;
  .tag {
    // padding: 10px;
    margin: 5px;
  }
}
::v-deep .el-form-item__label {
  width: 80px !important;
}
::v-deep .el-form-item__error {
  left: 80px;
}
</style>
