<!-- 新建客群弹窗 -->
<template>
  <el-dialog
    title="新建客群"
    :visible="dialogFormVisible"
    width="70%"
    @close="close"
  >
    <div class="body">
      <el-form ref="formData" :model="formData" :rules="rules">
        <div class="chartsCard">
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
        </div>
        <div class="chartsCard">
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
          <div class="btn">
            <el-button type="" @click="close">
              取消
            </el-button>
            <el-button type="primary" @click="confirm('formData')">
              确定
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { uploadCrowdByFile } from '@/api/crowdPackage'
import {
  crowdConfirm,
  getCrowdPackageFileById,
  getAllFileCrowdVo,
} from '@/api/crowdControl'
import { addPortraitReport } from '@/api/crowdInsight'
import uploadFile from '@/components/uploadFile/uploadFile'
import { matchFileType, computeFileZise, uuid } from '@/utils/file'
export default {
  components: {
    uploadFile,
  },
  name: 'addCustomer',
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
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      // crowdData: this.$route.query.val,
      formData: {
        crowdName: '',
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
    this.inputWidth = document.getElementById('inputWidth').offsetWidth - 43
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
    //关闭弹窗事件
    close() {
      let list = []
      getAllFileCrowdVo({ userId: sessionStorage.getItem('id') }).then(
        (res) => {
          if (res.code == 200) {
            res.data.forEach((e) => {
              list.push({
                label: e.crowdName,
                value: e.id,
              })
            })
          }
        },
      )
      this.$emit('dialogFormVisible', false, list)
      this.resetForm()
    },
    resetForm() {
      this.formData.crowdName = ''
      this.formData.fileList = []
      this.successRes = []
      this.failRes = []
    },
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
              this.close()
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
.body {
  position: relative;
  //   height: 330px;
  //   overflow: scroll;
}
//卡片样式
.chartsCard {
  //   width: 100%;
  overflow: visible;
  margin: 10px 0;
  padding: 20px;
  border-radius: 3px;
  border: 1px solid #e4e4e4;
}
::v-deep .el-form-item__label {
  width: 80px !important;
}
//校验提示语样式
::v-deep .el-form-item__error {
  left: 80px !important;
}
::v-deep .el-button.addCustomer {
  border-color: #66b1ff;
  color: #66b1ff;
  margin-left: 10px;
}
</style>
