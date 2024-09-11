<!-- table组件测试页 -->
<template>
  <div>
    <el-card class="father-card">
      <div class="header">
        <el-button type="" class="addBtn">
          新建人群
        </el-button>
        <div class="search">
          <span>人群名称：</span>
          <el-tooltip
            :content="crowdName"
            placement="top"
            effect="light"
            :disabled="crowdName | showTooltip(inputWidth)"
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
        <os-table
          :tableData="tableData"
          :tableCols="tableCols"
          :tableOptions="tableOptions"
          :cellStyle="cellStyle"
          :page="page"
          :callbackObj="callbackObj"
          @handleFilterChange="handleFilterChange"
          @handleButton="handleButton"
          @pageChanged="pageChanged"
        />
        <!--
          <template #enable="scope">
            <el-switch
              active-color="#239656"
              inactive-color="#e86161"
              v-model="scope.row.enable"
              @change="changeSwitch(scope.row, 'enable')"
            ></el-switch>
          </template>
          -->
      </div>
    </el-card>
  </div>
</template>

<script>
import { thousandFormat } from '@/utils/public'
import add from './components/addDialog.vue'
import axios from 'axios'
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
    dockMode(dockMode) {
      let res = ''
      if (dockMode == 0) res = '接口对接'
      else if (dockMode == 1) res = '手动上传'
      else if (dockMode == 2) res = 'APP圈选'
      else if (dockMode == 3) res = 'TA标签圈选'
      else if (dockMode == 4) res = '区域圈选'
      else if (dockMode == 5) res = '场景标签圈选'
      else if (dockMode == 6) res = '多维组合圈人'
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
      thousandFormat: thousandFormat,
      inputWidth: null, //输入框长度--用于判断tooltip是否显示
      reportForm: {
        reportName: '',
        crowdId: '',
      },
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        // pageSizes: [5, 10, 15],
        // layout: 'total, sizes, prev, pager',
        // pagerCount: 7,
      },
      tableOptions: {
        // isNumber: false,
        multipleSelect: true,
        // rowClick: 'rowClick({})',
      },
      callbackObj: {
        onRowClick: (rowData) => {
          console.log(rowData, '单击行')
        },
        onRowDbClick: (rowData) => {
          console.log(rowData, '双击行')
        },
        onCheckSelectChange: (rowData) => {
          console.log(rowData, '多选行')
        },
      },
      crowdName: '',
      tableCols: [
        { prop: 'dataSource', label: '数据来源' },
        { prop: 'crowdName', label: '人群名称' },
        { prop: 'sampleSize', label: '样本规模' },
        {
          hidden: false,
          label: '操作',
          comps: [
            {
              type: 'link',
              prop: 'save',
              labelName: '保存',
              disabled: false,
              click: 'save({})',
              dataOptions: {
                deleteName: '保存',
                deleteKey: 'dataSource',
                deleteVal: ['别常这'],
                deleteKey1: 'crowdName',
                deleteVal1: ['组合人群测试', '场景人群测试'],
              },
            },
            {
              type: 'link',
              prop: 'delete',
              labelName: '删除',
              disabled: false,
              click: 'delete({})',
              dataOptions: {
                deleteName: '删除',
                // deleteKey: 'dataSource',
                // deleteVal: ['生态共享'],
                deleteKey1: 'crowdName',
                deleteVal1: ['号百各。'],
              },
            },
          ],
        },
        {
          prop: 'price',
          label: '单价',
          comps: [
            {
              type: 'inputTxt',
              disabled: false,
              clearable: true,
              size: 'small',
              blur: 'priceChange({})',
              dataOptions: {
                minlength: 1,
                maxlength: 3,
                // suffixIcon: 'el-icon-edit',
              },
            },
          ],
        },
        { prop: 'priceRange', label: '价格范围' },
        { prop: 'hiddenO', label: '隐藏的字段' },
        {
          prop: 'scale',
          label: '系数',
          comps: [
            {
              type: 'inputNum',
              disabled: false,
              clearable: true,
              focus: 'scaleChange({})',
              dataOptions: {
                prefixIcon: 'el-icon-delete',
              },
            },
          ],
        },
        {
          prop: 'startDate',
          label: '开始日期',
          width: 150,
          comps: [
            {
              type: 'inputDate',
              disabled: false,
              clearable: true,
              focus: 'startDateChange({})',
              // dateType: 'week',
              dataOptions: {
                isTooltip: true,
                format: 'yyyy-MM-dd hh:mm:ss',
              },
            },
          ],
        },
        {
          prop: 'remark',
          label: '备注',
          width: 120,
          comps: [
            {
              type: 'inputTxtArea',
              disabled: false,
              readonly: false,
              change: 'remarkChange({})',
              dataOptions: {
                // autosize: { minRows: 2, maxRows: 4 },
                maxlength: 10,
                showWord: true,
              },
            },
          ],
        },
      ],
      tableData: [], //表格数据
      softwareLable: ['软件'],
      softwareFiltersList: [],
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
  mounted() {
    this.inputWidth = document.getElementById('inputWidth').offsetWidth - 45
  },
  methods: {
    //输入查询
    search() {
      this.getList()
    },
    // 获取列表
    async getList() {
      const that = this
      axios
        .post('/api/testData/list')
        .then((res) => {
          const { code, data } = res.data
          if (code === 200 && data) {
            this.tableData = data
            this.tableData.map((e) => (e.hiddenO = null))
            this.page.total = data.length
            console.log(this.tableData, '查询')
          }
        })
        .catch((err) => {
          console.log(`调用失败：${err}`)
        })
      // testData().then((res) => {
      //   this.tableData = res.data.list
      //   this.page.total = res.data.total
      // })
    },
    //确定按钮
    save({ val }) {
      console.log(val, '确定')
      this.$message.success('点击了保存')
    },
    priceChange() {
      this.$message.success('单价blur')
    },
    scaleChange() {
      this.$message.success('系数focus')
    },
    startDateChange() {
      this.$message.success('开始日期Change')
    },
    remarkChange() {
      this.$message.success('备注change')
    },
    rowClick(val) {
      console.log(val, '单击')
    },
    //展开抽屉表格
    toogleExpand(row) {
      let $table = this.$refs.table
      $table.toggleRowExpansion(row)
    },
    pageChanged(val) {
      this.page.pageIndex = val.pageIndex
      this.page.pageSize = val.pageSize
      this.getList()
    },
    getTableData() {
      // 接口数据信息获取
    },
    cellStyle() {
      // 表格行内样式
    },
    handleFilterChange() {
      // 表格筛选方法
    },
    handleButton() {
      // 表格操作方法
    },
    changeSwitch() {
      // Switch 操作方法
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
  font-size: 12px;
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
.toogleExpand:hover {
  color: #409eff;
  &:hover {
    cursor: pointer !important;
  }
}
.el-button.operate {
  padding: 0;
  font-size: 20px;
  color: #66b1ff;
}
.el-button.disabled {
  padding: 0;
  font-size: 20px;
  color: #d9d9d9;
}
.el-button.addBtn {
  border-color: #66b1ff;
  color: #66b1ff;
}
.input-with-select {
  ::placeholder {
    font-size: 12px;
  }
}
::v-deep .searchInput .el-input__inner {
  border-radius: 35px;
  height: 25px;
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
