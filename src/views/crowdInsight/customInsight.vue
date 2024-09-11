<!-- 自定义人群洞察 -->
<template>
  <div>
    <el-card class="father-card">
      <el-form ref="formData" :model="formData" :rules="rules">
        <el-card>
          <el-row :gutter="150">
            <el-col :span="11" style="white-space: nowrap;">
              <el-form-item prop="portraitReportName" label="任务名称：">
                <el-tooltip
                  :content="formData.portraitReportName"
                  placement="top"
                  effect="light"
                  :disabled="
                    formData.portraitReportName | showTooltip(inputWidth1)
                  "
                >
                  <el-input
                    v-model="formData.portraitReportName"
                    placeholder="最多不超过30字"
                    maxlength="30"
                    id="inputWidth1"
                    clearable
                    style="width: 100%;"
                  ></el-input>
                </el-tooltip>
                <!--
                <el-checkbox
                  style="margin-left: 10px;"
                  v-model="formData.isSave"
                >
                  保存人群
                </el-checkbox>
                -->
              </el-form-item>
            </el-col>
            <el-col :span="11" style="white-space: nowrap;">
              <el-form-item prop="crowdName" label="人群名称：">
                <el-tooltip
                  :content="formData.crowdName"
                  placement="top"
                  effect="light"
                  :disabled="formData.crowdName | showTooltip(inputWidth2)"
                >
                  <el-input
                    v-model="formData.crowdName"
                    :disabled="uploadDisabled"
                    placeholder="最多不超过30字"
                    maxlength="30"
                    id="inputWidth2"
                    clearable
                    style="width: 100%;"
                  ></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <div class="label">
            <span style="color: #f56d6d; margin-right: 2px; font-weight: 600;">
              *
            </span>
            洞察维度
          </div>
          <div style="margin-top: 10px;">
            <el-checkbox
              v-model="formData.basicInform"
              true-label="1"
              false-label="0"
            >
              基础信息
            </el-checkbox>
            <el-checkbox
              v-model="formData.thermalDistribute"
              true-label="1"
              false-label="0"
            >
              热力分布
            </el-checkbox>
            <el-checkbox
              v-model="formData.regionDistribute"
              true-label="1"
              false-label="0"
            >
              区域分布
            </el-checkbox>
            <el-checkbox
              v-model="formData.crowdPrefer"
              true-label="1"
              false-label="0"
            >
              人群偏好
            </el-checkbox>
          </div>
        </el-card>
        <el-card>
          <el-form-item prop="uploadFile">
            <uploadFile
              ref="uploadFile"
              :limit="5"
              :fileSize="100"
              accept=".xlsx,.xls,.csv,.txt"
              uploadTitle="人群ID文件上传"
              :fileList="formData.fileList"
              :successRes="successRes"
              :failRes="failRes"
              downloadUrl="/audience/crowd/crowdPackage/downloadModuleFile"
              :uploadFile="handleUpload"
              :disabled="uploadDisabled"
              @handleChange="handleChange"
            />
          </el-form-item>
          <el-divider></el-divider>
          <div class="btn">
            <el-button type="">
              <router-link :to="{ name: 'portraitReport' }">
                取消
              </router-link>
            </el-button>
            <el-button type="primary" @click="confirm('formData')">
              确定
            </el-button>
          </div>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { uploadCrowdByFile } from '@/api/crowdPackage'
import { crowdConfirm, getCrowdPackageFileById } from '@/api/crowdControl'
import { addPortraitReport } from '@/api/crowdInsight'
import uploadFile from '@/components/uploadFile/uploadFile'
import { matchFileType, computeFileZise, uuid } from '@/utils/file'
export default {
  components: {
    uploadFile,
  },
  filters: {
    status(status) {
      let res = ''
      if (status == 'fail') res = '上传成功'
      else if (status == 'ready') res = '待上传'
      else if (status == 'error') res = '上传失败'
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
      matchFileType: matchFileType,
      computeFileZise: computeFileZise,
      inputWidth1: null, //输入框长度--用于判断tooltip是否显示
      inputWidth2: null,
      // crowdData: this.$route.query.val,
      formData: {
        portraitReportName: '',
        crowdName: '',
        basicInform: '1', //基础信息
        thermalDistribute: '0', //热力图
        regionDistribute: '0', //区域分布
        crowdPrefer: '0', //人群偏好
        fileList: [], //上传后的文件列表
        isMD5: true, //是否使用MD5加密
        folderName: uuid(),
      },
      uploadDisabled: false,
      successRes: [], //返回成功上传的数据
      failRes: [], //返回失败上传的数据
      operateList: [
        '@/assets/images/update.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
      ],
      dataList: [],
      rules: {
        portraitReportName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
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
  },
  mounted() {
    this.inputWidth1 = document.getElementById('inputWidth1').offsetWidth - 40
    this.inputWidth2 = document.getElementById('inputWidth2').offsetWidth - 40
  },
  methods: {
    // 获取列表
    getList() {
      if (this.crowdData) {
        this.formData.crowdName = this.crowdData.crowdName
        this.uploadDisabled = true
        getCrowdPackageFileById(this.crowdData.id).then((res) => {
          console.log(res, '列表')
          this.successRes = res.data.crowdPackageFileListVOList
        })
      }
    },
    //上传按钮
    handleUpload() {
      let file = []
      this.fileRes = {}
      this.formData.fileList.forEach((e) => {
        file.push({
          fileName: e.name,
          fileSize: e.size,
        })
      })
      let mutipartFile = new FormData()
      this.formData.fileList.forEach((el) => {
        mutipartFile.append('multipartFile', el.raw)
      })
      mutipartFile.append('fileList', JSON.stringify(file))
      mutipartFile.append('isMD5', this.formData.isMD5)
      mutipartFile.append('folderName', this.formData.folderName)
      if (this.formData.fileList.length > 0) {
        uploadCrowdByFile(mutipartFile).then((res) => {
          // this.successRes = res.data.fileUploadSuccessReturnVOList
          // this.failRes = res.data.fileUploadFailReturnVOList
          this.successRes.push(...res.data.fileUploadSuccessReturnVOList)
          this.failRes.push(...res.data.fileUploadFailReturnVOList)
        })
      } else {
        this.$message.warning('请选择文件！')
      }
      this.formData.fileList = []
    },
    //是否启用MD5加密，给复选框赋值
    //固定写法，子组件的值赋给父组件
    handleChange(index) {
      this.formData.isMD5 = index
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.successRes.length == 0) {
          this.$message.warning('请上传文件！')
          return
        }
        if (valid) {
          let list = []
          let fileDataTypeDTOList = []
          this.successRes.forEach((e) => {
            list.push({
              dataType: e.dataType,
              fileName: e.fileName,
              fileType: matchFileType(e.fileName),
              sampleSize: e.sampleSize,
              fileSize: e.fileSize,
              geTuiPath: e.geTuiPath,
              fileId: e.fileId,
              isMD5: e.isMD5,
            })
            fileDataTypeDTOList.push({
              dataType: e.dataType,
              fileName: e.fileName,
            })
          })
          let params = {
            crowdName: this.formData.crowdName,
            fileList: list,
            folderName: this.formData.folderName,
            isGenerateReport: 1,
            reportName: this.formData.portraitReportName,
            basicInform: this.formData.basicInform, //基础信息
            thermalDistribute: this.formData.thermalDistribute, //热力分布
            regionDistribute: this.formData.regionDistribute, //区域分布
            crowdPrefer: this.formData.crowdPrefer, //人群偏好
            userId: sessionStorage.getItem('id'),
          }
          if (
            this.formData.basicInform == 0 &&
            this.formData.thermalDistribute == 0 &&
            this.formData.regionDistribute == 0 &&
            this.formData.crowdPrefer == 0
          ) {
            this.$message.warning('洞察维度至少选择一项！')
            return
          }
          crowdConfirm(params).then((res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$router.push('/crowdInsight')
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
.uploadBox {
  display: flex;
  :nth-child(2) {
    align-self: flex-end;
    margin: -15px 0 0 10px;
  }
}
.label {
  font-weight: 900;
  font-size: 12px;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
::v-deep .el-upload-dragger {
  width: 400px;
  height: 170px;
}
::v-deep .el-form-item__label {
  width: 80px !important;
}
::v-deep .el-form-item__error {
  left: 80px;
}
</style>
