<!-- 人群管理列表 -->
<template>
  <div>
    <el-card class="father-card">
      <div class="header">
        <el-button type="" class="addBtn" @click="openDialog">新建人群</el-button>
        <div class="search">
          <span>人群名称：</span>
          <el-tooltip
            :content="crowdName"
            placement="top"
            effect="light"
            :disabled="crowdName|showTooltip(inputWidth)"
          >
            <el-input
              placeholder="请输入"
              maxlength="30"
              v-model="crowdName"
              id="inputWidth"
              class="searchInput"
              @keyup.enter.native="search"
            >
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="search"
              ></i>
            </el-input>
          </el-tooltip>
        </div>
      </div>
      <div class="body">
        <el-table
          ref="table"
          :data="dataList"
          style="width: 100%;"
          border
          stripe
          :header-cell-style="{
            background: '#eef5ff',
            color: '#606266',
            borderColor: '#d8e6fe',
            fontSize:'12px'
          }"
          :cell-style="{ borderColor: '#d8e6fe' }"
        >
          <el-table-column type="index" label="序号" width="50"/>
          <el-table-column prop="dataSource" label="数据来源" align="left" />
          <el-table-column prop="crowdName" label="人群名称" min-width="100" :show-overflow-tooltip="true"/>
          <!--
          <el-table-column prop="dockMode" label="对接方式">
            <template slot-scope="scope">
              <div>
                {{ scope.row.dockMode | dockMode }}
              </div>
            </template>
          </el-table-column>
          -->
          <el-table-column prop="sampleSize" label="样本规模">
            <template slot-scope="scope">
              <div>
                {{ scope.row.sampleSize?thousandFormat(scope.row.sampleSize):'--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateCycle" label="更新周期" width="100"/>
          <el-table-column prop="updateTime" label="最近更新时间" min-width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div>
                {{ scope.row.updateTime ? scope.row.updateTime : '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="reportNum" label="关联报告" width="100">
            <template slot-scope="scope">
              <u class="toogleExpand" @click="toogleExpand(scope.row)">
                {{ scope.row.child.length }}
              </u>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div class="moreBtn">
                <el-tooltip v-if="reportShow" effect="dark" content="生成洞察报告" placement="top"><el-button type="text" class="operate" icon="el-icon-s-order" @click="btnClick(0,scope.row)"></el-button></el-tooltip>
                <el-tooltip v-if="crowdShow" effect="dark" content="人群对比" placement="top"><el-button :disabled="scope.row.child.length>0?false:true" type="text" class="operate" :class="{disabled:scope.row.child.length==0}" icon="el-icon-s-data" @click="btnClick(1,scope.row)"></el-button></el-tooltip>
                <el-tooltip v-if="generateShow" effect="dark" content="生成人群包" placement="top"><el-button type="text" class="operate" icon="el-icon-s-cooperation" @click="btnClick(2,scope.row)"></el-button></el-tooltip>
                <el-tooltip v-if="deleteShow" effect="dark" content="删除" placement="top"><el-button type="text" class="operate" icon="el-icon-delete" @click="btnClick(3,scope.row)"></el-button></el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <div style="width: 95%; display: flex; margin: auto;">
                <el-table :data="props.row.child" border :header-cell-style="{
                  background: '#eef5ff',
                  color: '#606266',
                  borderColor: '#d8e6fe',
                  }"
                  :cell-style="{ borderColor: '#d8e6fe' }">
                  <el-table-column type="index" label="序号" sortable />
                  <el-table-column
                    prop="portraitReportName"
                    :show-overflow-tooltip="true"
                    label="画像报告名称"
                  />
                  <el-table-column prop="reportLastGeneralTime" label="最近生成时间" />
                  <el-table-column label="报告状态">
                    <template slot-scope="scope">
                      {{ scope.row.isGeneral | isGeneral }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <img v-if="scope.row.isGeneral==1" src="@/assets/images/look.png" @click="gotoReport(scope.row)">
                      <img v-else src="@/assets/images/nolook.png"></img>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page="page.pageNo"
          :page-sizes="[10, 20, 30]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 分页 -->
      <add
        :dialog-form-visible.sync="dialogFormVisible"
        :dialogFormData="dialogFormData"
        @dialogFormVisible="closeFrom"
      />
      <el-dialog
        class="createReport"
        title=""
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="48%"
      >
        <el-form ref="formData" :model="reportForm" :rules="rules">
          <el-form-item prop="reportName">
            <div
              class="demo-input-suffix"
              style="display: flex; align-items: center;"
            >
              <div style="min-width: 70px;">报告名称：</div>
              <el-tooltip
                :content="reportForm.reportName"
                placement="top"
                effect="light"
                :disabled="reportForm.reportName.length < 10"
              >
              <el-input
                v-model.trim="reportForm.reportName"
                placeholder="最多不超过30字"
                style="width: 100%;"
                maxlength="30"
                clearable
              />
              </el-tooltip>
              <span class="dialog-footer" style="display: flex; margin-left: 15px;">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="confirm()">确定</el-button>
              </span>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCrowdByPage,downloadCrowdFile,deleteCrowd,generateCrowdReport } from '@/api/crowdControl'
import { addPortraitReport } from '@/api/crowdInsight'
import { thousandFormat} from '@/utils/public'
import { downloadFile } from '@/utils/file'
import add from './components/addDialog.vue'
export default {
  components: {
    add,
  },
  filters: {
    isGeneral(isGeneral) {
      let res = ''
      if (isGeneral == 0) res = '生成中'
      else if (isGeneral == 1) res = '已生成'
      else if (isGeneral == 2) res = '生成失败'
      return res
    },
    // 1 手动上传  2 APP圈选  3 TA标签圈选  4 区域圈选
    dockMode(dockMode){
      let res = ''
      if (dockMode == 0) res = '接口对接'
      else if (dockMode == 1) res = '手动上传'
      else if (dockMode == 2) res = 'APP圈选'
      else if (dockMode == 3) res = 'TA标签圈选'
      else if (dockMode == 4) res = '区域圈选'
      else if (dockMode == 5) res = '场景标签圈选'
      else if (dockMode == 6) res = '多维组合圈人'
      return res
    }
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
      thousandFormat:thousandFormat,
      inputWidth:null,//输入框长度--用于判断tooltip是否显示
      reportShow:true,//生成洞察报告
      crowdShow:true,//人群对比
      generateShow:true,//生成人群包
      deleteShow:false,//删除
      dialogVisible: false, //生成报告弹窗
      reportForm:{
        reportName:'',
        crowdId:'',
      },
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      crowdName: '',
      operateList: [
        '@/assets/images/update.png',
        '@/assets/images/form.png',
        '@/assets/images/form.png',
        // '@/assets/images/form.png',
        // '@/assets/images/form.png',

      ],
      dataList: [],
      menuList: [
        {
          title : "生成洞察报告",
          url : "",
        },
        {
          title : "生成人群包",
          url : "",
          childer :[
            {
              title : '下载人群包',
              url : 'b1111'
            },
          ]
        },
        {
          title : '人群对比',
          url : ''
        },
        {
          title : '刷新',
          url : ''
        },
        {
          title : '停用',
          url : ''
        },
        {
          title : '删除',
          url : ''
        },
      ],
      dialogFormVisible: false, //数据上传弹窗
      dialogFormData: [],
      rules: {
        reportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' },
          { validator: validateName },
        ],
      },
    }
  },

  created() {
    this.getList()
  },
  mounted(){
    this.inputWidth = document.getElementById('inputWidth').offsetWidth-45
  },
  methods: {
    //输入查询
    search(val) {
      this.getList(val.value)
    },
    // 获取列表
    async getList(modelStatus) {
      const that = this
      this.dataList = []
      let params = {
        orders: [
          {
            asc: false,
            column: 'create_time',
          },
        ],
        crowdName: this.crowdName,
        pageNum: this.page.pageNo,
        pageSize: this.page.pageSize,
        searchCount: true,
        userId:sessionStorage.getItem('id')
      }
      getCrowdByPage(params).then((res) => {
        this.dataList = res.data.list
        this.total = res.data.total
      })
    },
    //展开抽屉表格
    toogleExpand(row) {
      let $table = this.$refs.table
      $table.toggleRowExpansion(row)
    },
    gotoReport(row) {
      this.$router.push({
        path: '/crowdInsight/portrayal',
        query: row,
      })
    },
    //打开新增弹窗
    openDialog() {
      this.dialogFormVisible = true
      this.dialogFormData = [
        {
          label:'自定义人群上传',
          src0:require('@/assets/images/upload_0.svg'),
          src1:require('@/assets/images/upload_1.svg'),
          isSubscription:1,
        },
        {
          label:'区域/商圈圈人',
          src0:require('@/assets/images/coordinate_0.svg'),
          src1:require('@/assets/images/coordinate_1.svg'),
          isSubscription:1,
        },
        {
          label:'APP组合圈人',
          src0:require('@/assets/images/phone_0.svg'),
          src1:require('@/assets/images/phone_1.svg'),
          isSubscription:1,
        },
        {
          label:'TA标签组合圈人',
          src0:require('@/assets/images/label_0.svg'),
          src1:require('@/assets/images/label_1.svg'),
          isSubscription:1,
        },
        {
          label:'多维组合圈人',
          src0:require('@/assets/images/combination_0.svg'),
          src1:require('@/assets/images/combination_1.svg'),
          isSubscription:1,
        },
      ]
    },
    btnClick(num,val){
      //num：0:生成洞察报告 1:人群对比 2:生成人群包(下载) 3:删除
      switch(num){
        case 0:
        // if(val.dockMode==1){
        //   this.$router.push({
        //   path: '/crowdInsight/customInsight',
        //   query: {val},
        // })
        // }else{
          this.reportForm.crowdId = val.id
          this.dialogVisible = true
        // }
        break;
        case 1:
        let isGeneral = false
        val.child.forEach(e=>{
          if(e.isGeneral==1){
            isGeneral = true
          }
        })
        if(isGeneral){
          this.$router.push({
          path: '/crowdInsight/contrastAnalysis',
          query: {val},
          })
        }else{
          this.$message.warning('暂无已生成的关联报告')
        }
        break;
        case 2: 
        // fileDownload('POST',`/crowd/crowdPackage/getCrowdPackageFileById?crowdId=${val.id}`)
        downloadCrowdFile(val.id).then((res) => {
          const resData = res.data
          if (resData.size==0) {
            this.$message.warning('暂无下载文件')
            return
          }
          downloadFile(res).then((e) => {
            if (e.code !== 200) {
              this.$message.error(`${e.msg}`)
            }
          })
        })
        break;
        case 3:
          this.$confirm(`是否确认删除人群包 ${val.crowdName}？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            lockScroll: false,
          })
          .then(async () => {
            let res = await deleteCrowd({crowdId:val.id})
            if(res.code==200){
              this.$message.success('删除成功！')
            }
            this.getList()
          })
        .catch((err) => {
          console.log(err)
        })
        break;
      }
    },
    //生成报告
    confirm(){
      generateCrowdReport(this.reportForm).then(res=>{
        console.log(res,'确认')
        if(res.code==200){
          this.$message.success('生成洞察报告成功！')
          this.getList()
        }
      })
      this.dialogVisible = false
    },
    //关闭生成报告弹窗
    handleClose(){
      this.reportForm.reportName = ''
      this.dialogVisible = false
    },
    //关闭新增弹窗
    closeFrom(val) {
      this.dialogFormVisible = val
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
}
.search {
  font-size:12px;
  display: flex;
  align-items: center;
  :nth-child(2) {
    flex: 1;
    margin-left: 7px;
  }
}
//更多按钮
.moreBtn {
  color: #66b1ff;
  &:hover {
    cursor: pointer !important;
  }
}
.toogleExpand:hover{
  color: #409eff;
  &:hover {
    cursor: pointer !important;
  }
}
.el-button.operate {
  padding:0;
  font-size: 20px;
  color:#66b1ff;
}
.el-button.disabled{
  padding:0;
  font-size: 20px;
  color:#D9D9D9;
}
.el-button.addBtn {
  border-color: #66b1ff;
  color: #66b1ff;
}
.input-with-select{
  ::placeholder{
    font-size:12px;
  }
}
::v-deep .searchInput .el-input__inner {
  border-radius: 35px;
  height:25px;
  background: transparent;

}
::v-deep .searchInput .el-input__icon {
  line-height: 25px;
}
::v-deep .createReport .el-dialog__header {
  border-bottom: 1px solid #ffffff;
}
::v-deep .createReport .el-dialog__body {
  display: flex;
  align-items: normal;
  padding: 10px;
}
::v-deep .el-form-item__error {
    left: 70px;
}
</style>
