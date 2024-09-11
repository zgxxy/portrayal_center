<!-- 自定义人群上传 -->
<template>
  <div>
    <el-card class="father-card">
      <el-form ref="formData" :model="formData" :rules="rules">
        <el-card>
          <el-form-item prop="crowdName" label="人群名称：">
            <el-tooltip
              :content="formData.crowdName"
              placement="top"
              effect="light"
              :disabled="formData.crowdName | showTooltip(inputWidth)"
            >
              <el-input
                v-model="formData.crowdName"
                placeholder="最多不超过30字"
                maxlength="30"
                id="inputWidth"
                style="width: 60%;"
              ></el-input>
            </el-tooltip>
          </el-form-item>
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
              @handleChange="handleChange"
            />
          </el-form-item>
          <el-divider></el-divider>
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
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { uploadCrowdByFile } from '@/api/crowdPackage'
import { downloadModuleFile, crowdConfirm } from '@/api/crowdControl'
import uploadFile from '@/components/uploadFile/uploadFile'
import { matchFileType, uuid } from '@/utils/file'
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
      isCustomln: this.$route.query.isCustomln,
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      formData: {
        crowdName: '', //人群名称
        fileList: [], //上传后的文件列表
        isMD5: true, //是否使用MD5加密
        folderName: uuid(),
      },
      successRes: [], //返回成功上传的数据
      failRes: [], //返回失败上传的数据
      operateList: [
        '@/assets/images/update.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
      ],
      rules: {
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' },
          { validator: validateName },
        ],
        // uploadFile: [{ required: true, message: ' ', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.inputWidth = document.getElementById('inputWidth').offsetWidth - 20
  },
  methods: {
    // 获取列表
    async getList(modelStatus) {
      const that = this
    },
    //上传按钮
    handleUpload() {
      let file = []
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
          this.failRes = res.data.fileUploadFailReturnVOList
          this.successRes.push(...res.data.fileUploadSuccessReturnVOList)
          // this.failRes.push(...res.data.fileUploadFailReturnVOList)
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
    //确定按钮
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.successRes.length == 0) {
          this.$message.warning('请上传文件！')
          return
        }
        if (valid) {
          let list = []
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
          })
          let params = {
            crowdName: this.formData.crowdName,
            fileList: list,
            folderName: this.formData.folderName,
            isGenerateReport: 0,
            reportName: '',
            userId: sessionStorage.getItem('id'),
          }
          crowdConfirm(params).then((res) => {
            console.log(res, '确定')
            if (res.code == 200) {
              this.$message.success('添加人群成功')
              if (this.isCustomln) {
                this.$router.push('/crowdInsight')
              } else {
                this.$router.push('/crowdControl')
              }
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
}
.operation .el-button {
  padding: 0;
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
