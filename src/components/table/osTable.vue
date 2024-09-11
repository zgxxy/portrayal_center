<template>
  <section>
    <el-table
      ref="filterTable"
      :row-class-name="tableRowClassName"
      border
      v-loading="tLoading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      element-loading-text="数据正在加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      :show-header="showHeader"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      :default-sort="{ prop: 'id', order: null }"
      :row-key="rowKey"
      @row-click="handleTableRowChange"
      @row-dblclick="handleDbclick"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      @filter-change="handleFilterChange"
      style="width: 100%;"
    >
      <el-table-column v-if="tableOptions.multipleSelect" type="selection" />
      <el-table-column
        v-if="tableOptions.isNumber !== false"
        type="index"
        label="序号"
        width="50"
      />
      <template v-for="(cols, index) in tableCols">
        <!-- 普通列表，只需要传字段prop，不需要特殊处理 -->
        <el-table-column
          :show-overflow-tooltip="true"
          v-if="
            !cols.hidden &&
            cols.type !== 'slot' &&
            cols.comps == undefined &&
            tableData[index][cols.prop] !== null
          "
          :key="'table' + index"
          :sortable="cols.sortable"
          :prop="cols.prop"
          :label="cols.label"
          :align="cols.align ? cols.align : 'center'"
          :width="cols.width"
          :callbackObj="callbackObj"
        ></el-table-column>
        <!-- operate 操作栏-->
        <template v-if="!cols.hidden && cols.comps && cols.comps.length > 0">
          <el-table-column
            :key="'operate' + index"
            :width="cols.width || 93"
            :label="cols.label"
          >
            <template slot-scope="{ row }">
              <div class="operateBox">
                <div v-for="(col, inx) in cols.comps">
                  <!-- 链接按钮 -->
                  <el-link
                    v-if="col.type === 'link'"
                    :key="`link_${inx}`"
                    :icon="col.icon"
                    v-show="showKey(row, col)"
                    :disabled="col.disabled"
                    class="osInput"
                    style="color: #409eff;"
                    @click="
                      doChildEvent(
                        col.click || col.clickEvent,
                        { row: row, cols: cols, comp: col },
                        'click',
                      )
                    "
                  >
                    {{ col.labelName }}
                  </el-link>
                  <!-- 文本输入框 -->
                  <el-input
                    v-else-if="col.type === 'inputTxt'"
                    :key="`input_${inx}`"
                    v-model="row[cols.prop]"
                    :disabled="col.disabled"
                    :readonly="col.readonly"
                    :minlength="col.dataOptions.minlength"
                    :maxlength="col.dataOptions.maxlength"
                    :clearable="col.clearable || false"
                    :show-word-limit="col.dataOptions.showWord || false"
                    :prefix-icon="col.dataOptions.prefixIcon"
                    :suffix-icon="col.dataOptions.suffixIcon"
                    :size="col.size"
                    :placeholder="col.placeholder || '请输入'"
                    style="font-size: 12px; color: #409eff;"
                    @focus="
                      doChildEvent(
                        col.focus,
                        { row: row, cols: cols, comp: col },
                        'focus',
                      )
                    "
                    @blur="
                      doChildEvent(
                        col.blur,
                        { row: row, cols: cols, comp: col },
                        'blur',
                      )
                    "
                    @input="
                      doChildEvent(
                        col.input,
                        { row: row, cols: cols, comp: col },
                        'input',
                      )
                    "
                    @change="
                      doChildEvent(
                        col.change,
                        { row: row, cols: cols, comp: col },
                        'change',
                      )
                    "
                  />
                  <!-- 文本域输入框 -->
                  <el-input
                    v-else-if="col.type === 'inputTxtArea'"
                    :key="`inputTxtArea_${inx}`"
                    v-model="row[cols.prop]"
                    :disabled="col.disabled"
                    :readonly="col.readonly"
                    :minlength="col.dataOptions.minlength"
                    :maxlength="col.dataOptions.maxlength"
                    :show-word-limit="col.dataOptions.showWord || false"
                    :size="col.size"
                    :placeholder="col.placeholder || '请输入'"
                    :autosize="col.dataOptions.autosize"
                    :rows="col.dataOptions.rows || 1"
                    type="textarea"
                    class="osInput"
                    @focus="
                      doChildEvent(
                        col.focus,
                        { row: row, cols: cols, comp: col },
                        'focus',
                      )
                    "
                    @blur="
                      doChildEvent(
                        col.blur,
                        { row: row, cols: cols, comp: col },
                        'blur',
                      )
                    "
                    @input="
                      doChildEvent(
                        col.input,
                        { row: row, cols: cols, comp: col },
                        'input',
                      )
                    "
                    @change="
                      doChildEvent(
                        col.change,
                        { row: row, cols: cols, comp: col },
                        'change',
                      )
                    "
                  />
                  <!-- 数字输入框 -->
                  <el-input
                    v-else-if="col.type === 'inputNum'"
                    :key="`inputTxtNum_${inx}`"
                    v-model="row[cols.prop]"
                    :disabled="col.disabled"
                    :readonly="col.readonly"
                    :minlength="col.dataOptions.minlength"
                    :maxlength="col.dataOptions.maxlength"
                    :prefix-icon="col.dataOptions.prefixIcon"
                    :suffix-icon="col.dataOptions.suffixIcon"
                    :clearable="col.clearable || false"
                    :size="col.size"
                    :placeholder="col.placeholder || '请输入'"
                    type="number"
                    class="osInput"
                    @focus="
                      doChildEvent(
                        col.focus,
                        { row: row, cols: cols, comp: col },
                        'focus',
                      )
                    "
                    @blur="
                      doChildEvent(
                        col.blur,
                        { row: row, cols: cols, comp: col },
                        'blur',
                      )
                    "
                    @input="
                      doChildEvent(
                        col.input,
                        { row: row, cols: cols, comp: col },
                        'input',
                      )
                    "
                    @change="
                      doChildEvent(
                        col.change,
                        { row: row, cols: cols, comp: col },
                        'change',
                      )
                    "
                  />
                  <!-- 日期输入框-->
                  <el-tooltip
                    v-else-if="col.type === 'inputDate'"
                    placement="top"
                    :content="row[cols.prop]"
                    :disabled="col.dataOptions.isTooltip"
                    :key="`inputDate_${inx}`"
                  >
                    <el-date-picker
                      v-model="row[cols.prop]"
                      :type="col.dateType"
                      :picker-options="col.datePickerOptions"
                      :disabled="col.disabled"
                      :clearable="col.clearable || false"
                      class="osInput dateInput"
                      placeholder="选择日期"
                      :format="col.dataOptions.format || 'yyyy-MM-dd'"
                      :value-format="
                        col.dataOptions.valueFormat || 'yyyy-MM-dd'
                      "
                      @change="
                        doChildEvent(
                          col.change,
                          { row: row, cols: cols, comp: col },
                          'change',
                        )
                      "
                    />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <pagination
      v-show="page.isPage === false ? false : true"
      :pageIndex="page.pageIndex"
      :pageSize="page.pageSize"
      :pageSizes="page.pageSizes"
      :layout="page.layout"
      :total="page.total"
      :pagerCount="page.pagerCount"
      @pageChanged="pageChanged"
    />
  </section>
</template>
<script>
import { utilsMixins } from './mixins/utilsMixins'
import pagination from './pagination'
export default {
  name: 'osTable',
  components: {
    pagination,
  },
  provide() {
    // 这里定义provide 传递参数
    return {
      pagination: this.pages, // 分页属性
    }
  },
  mixins: [utilsMixins],
  props: {
    //网格字段内容
    tableCols: Array,
    //网格数据
    tableData: Array,
    filterColums: Array,
    //是否显示表头
    showHeader: {
      type: Boolean,
      default: true,
    },
    //网格行设置css方法，用法参考官网
    tableRowClassName: Function,
    loading: Boolean,
    filtersList: { type: Array, default: () => [] },
    filtersRoleList: { type: Array, default: () => [] },
    columnLabel: { type: Array, default: () => [] },
    filterMethod: Function,
    rowKey: String,
    //网格行样式
    cellStyle: {
      type: Function,
      default: () => {
        return { borderColor: '#d8e6fe' }
      },
    },
    //表头样式
    headerCellStyle: {
      type: Object,
      default: () => {
        return {
          background: '#eef5ff',
          color: '#606266',
          borderColor: '#d8e6fe',
          fontSize: '12px',
        }
      },
    },
    refTable: String,
    tableHeight: Number, //网格内容高度
    tableMaxHeight: Number, //网格最大高度
    multiple: {
      type: Boolean,
      default: false,
    },
    //分页
    page: {
      type: Object,
      default: () => ({}),
    },
    tableOptions: {
      type: Object,
      default: () => {
        return {
          isNumber: true,
          multipleSelect: false,
        }
      },
    },
    callbackObj: {
      type: Object,
      default: function () {
        return {}
      },
    },
    // tableOptions: {
    //   type: Object,
    //   default: () => ({}),
    // },
  },
  watch: {
    //分页组件
    page: {
      handler(newValue, oldValue) {
        // this.$nextTick(() => {
        setTimeout(() => {
          this.pages.isPage = newValue.isPage || true //是否启用分页组件
          this.pages.pageIndex = newValue.pageIndex || 1 //当前页码
          this.pages.pageSize = newValue.pageSize || 10 //每页几条
          this.pages.pageSizes = newValue.pageSizes || [10, 20, 30] //每页可显示条数
          this.pages.layout =
            newValue.layout || 'total, sizes, prev, pager, next, jumper' //分页组件显示内容
          this.pages.disabled = newValue.pageDisabled || false //是否禁用
          this.pages.total = newValue.total || 0 //数据总条数
          this.pages.pagerCount = newValue.pagerCount || 5 //显示的页码按钮个数（>5且单数）
        }, 500)
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      //分页配置
      pages: {
        isPage: true,
        pageIndex: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        layout: 'total, sizes, prev, pager, next, jumper',
        disabled: false,
        pagerCount: 5,
      },
      tLoading: this.loading,
      currentRow: [],
      // 单选行数据
      clickRow: {},
      //选中行下标
      rowIndex: -1,
    }
  },
  methods: {
    showKey(row, col) {
      if (
        (col.dataOptions.deleteKey &&
          (row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[0] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[1] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[2] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[3] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[4] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[5] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[6] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[7] ||
            row[col.dataOptions.deleteKey] == col.dataOptions.deleteVal[8]) &&
          col.labelName == col.dataOptions.deleteName) ||
        (col.dataOptions.deleteKey1 &&
          (row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[0] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[1] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[2] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[3] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[4] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[5] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[6] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[7] ||
            row[col.dataOptions.deleteKey1] == col.dataOptions.deleteVal1[8]) &&
          col.labelName == col.dataOptions.deleteName) ||
        (col.dataOptions.deleteKey2 &&
          (row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[0] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[1] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[2] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[3] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[4] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[5] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[6] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[7] ||
            row[col.dataOptions.deleteKey2] == col.dataOptions.deleteVal2[8]) &&
          col.labelName == col.dataOptions.deleteName) ||
        (col.dataOptions.deleteKey3 &&
          (row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[0] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[1] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[2] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[3] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[4] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[5] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[6] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[7] ||
            row[col.dataOptions.deleteKey3] == col.dataOptions.deleteVal3[8]) &&
          col.labelName == col.dataOptions.deleteName)
      ) {
        return false
      } else {
        return true
      }
    },
    //表格行单击事件
    handleTableRowChange(row, index) {
      // this.clickRow = row
      // // console.log(this.clickRow, '单击行')
      // this.rowIndex = index
      // // 回调传入行点击事件
      // if (this.tableOptions.rowClick) {
      //   this.doChildEvent(
      //     this.tableOptions.rowClick,
      //     { row: row, comp: { labelName: '单击行' }, index: index },
      //     'rowClick',
      //   )
      // }
      // this.checkLinkBtns()
      // 网格单击后返回钩子
      this.execCallBack('onRowClick', row, index)
    },
    //表格行双击事件
    handleDbclick(row, column, event) {
      // this.handleTableRowChange(row, column)
      // if (this.tableOptions.dblClick) {
      //   this.doChildEvent(
      //     this.tableOptions.dblClick,
      //     { row: row, comp: { labelName: '双击行' }, cols: column },
      //     'dblRowClick',
      //   )
      // }
      // 网格双击后返回钩子
      this.execCallBack('onRowDbClick', row, column, event)
    },
    handleSelectionChange(rows) {
      this.currentRow = rows
      // this.checkLinkBtns()
      // select change事件返回钩子
      this.execCallBack('onCheckSelectChange', rows)
    },
    doChildEvent(clickEvent, args, eventType, execTrigger) {
      const { row, cols, comp, index } = args
      if (eventType === 'click') {
        row ? (this.clickRow = row) : false
      }
      if (eventType === 'change') {
        // 文本字段赋值
        if (comp && comp.textField && row[comp.prop]) {
          const options =
            row[comp.prop + 'Opt'] || comp.dataOptions?.dataSource?.options
          if (options?.length > 0) {
            const curOption = options.filter(
              (o) => o.value === row[comp.prop],
            )[0]
            if (curOption) {
              row[comp.textField] = curOption.label
            }
          }
        }
      }
      if (comp) {
        // 执行事件
        this.eventAdapter
          ? this.eventAdapter(
              clickEvent,
              { configObj: comp, row: row },
              // function () {
              //   // [执行前]事件埋点
              //   if (window.__TRACK_) {
              //     window.__TRACK_.btnStart(
              //       (comp.labelName || comp.text || comp.prop) +
              //         (comp?.type !== 'link' ? '(col)' : '(lnk)'),
              //     )
              //   }
              // },
              // function () {
              //   // [执行后]事件埋点
              //   if (window.__TRACK_) {
              //     window.__TRACK_.btnSave()
              //   }
              // },
            )
          : false
        // 执行联动
        if (eventType === 'change') {
          if (execTrigger !== false) {
            // 下拉框值联动
            this.doChangeEventByColAndRow(row, comp)
          }
          // 显隐联动
          this.setShowAndDisable(row, comp, 'showParams', 'isShow')
          // 是否可用联动
          this.setShowAndDisable(row, comp, 'disabledParams', 'disabled')
          // 赋值其它字段(非自定义组件)
          if (!comp.isComponent) {
            comp.dataOptions?.otherFields?.forEach((o) => {
              this.setOtherFields(comp, o, row)
            })
          }
        }
      }
    },
    // 执行某组件值改变后的事件
    doChangeEventByColAndRow(paramRow, paramComp) {
      let that = this
      that.tableCols
        .filter((o) => o.isComponent === true)
        .forEach((col) => {
          col.comps
            ?.filter((o) => o.dataOptions?.triggerParams?.length > 0)
            .forEach((comp) => {
              if (
                comp.dataOptions.triggerParams.some(
                  (o) =>
                    (!o.split('-')[1] &&
                      o.split('-')[0] === paramComp.codeField) ||
                    (o.split('-')[1] &&
                      o.split('-')[1] === paramComp.codeField),
                )
              ) {
                paramRow[comp.codeField] = ''
                if (comp.textField) {
                  paramRow[comp.textField] = ''
                }
                that.handleDropdownOptions(comp, paramRow, null, true)
                that.doChildEvent(
                  comp.change,
                  { row: paramRow, cols: col, comp: comp },
                  'change',
                  false,
                )
              }
            })
        })
      that = null
    },
    // 网格中组件下拉项查询事件(comp：列中组件, row：行数据, cb: callback函数, isEnForce:不检查是否下拉查询)
    handleDropdownOptions(comp, row, cb, isEnForce) {
      if (!isEnForce && comp.isAsync === true) {
        // 下拉查询模式时创建单项
        this.setDefaultOpiton(comp, row)
      } else {
        // 只有含有请求的查询才执行
        if (comp?.dataOptions?.dataSource?.apiUrl) {
          this.dropdownOptionsAdapter(
            {
              _this: this,
              current: comp,
              queryObj: null,
              dataObj: row,
              optinosObj: row,
              optionsName: comp.codeField + 'Opt',
              randStr: new Date().getTime() + Math.random(),
              cb: cb,
            },
            this,
          )
        }
      }
    },
    // 设置默认选项
    setDefaultOpiton(comp, row) {
      let options = null
      if (comp.dataOptions?.triggerParams?.length > 0) {
        if (!row[comp.codeField + 'Opt']) {
          this.$set(row, comp.codeField + 'Opt', [])
        }
        options = row[comp.codeField + 'Opt']
      } else {
        if (!comp.dataOptions?.dataSource?.options) {
          if (!comp.dataOptions) {
            this.$set(comp, 'dataOptions', {})
          }
          if (!comp.dataOptions.dataSource) {
            this.$set(comp.dataOptions, 'dataSource', {})
          }
          if (!comp.dataOptions.dataSource.options) {
            this.$set(comp.dataOptions.dataSource, 'options', [])
          }
          this.$set(row, comp.codeField + 'Opt', [])
        }
        options = comp.dataOptions.dataSource.options
      }
      if (
        options &&
        options.length === 0 &&
        comp.dataOptions?.dataSource?.optionsConfig
      ) {
        const valField = comp.dataOptions.dataSource.optionsConfig.value
        const txtField = comp.dataOptions.dataSource.optionsConfig.label
        if (valField && comp.codeField && txtField) {
          const option = {}
          if (comp.isMul !== true) {
            option[valField] = row[comp.codeField || valField]
            option[txtField] = row[comp.textField || txtField]
            options.push(option)
          } else {
            for (
              let oi = 0;
              oi < row[comp.codeField || valField].split(',').length;
              oi++
            ) {
              option[valField] = row[comp.codeField || valField].split(',')[oi]
              option[txtField] = row[comp.textField || txtField].split(',')[oi]
              options.push(option)
            }
          }
        }
      }
    },
    handleButton(methods, row, event) {
      this.$emit('handleButton', { methods: methods, row: row })
    },
    filterChange(row) {
      this.$emit('filterChange', row)
    },
    filterRoleChange(row) {
      this.$emit('filterRoleChange', row)
    },
    handleFilterChange(filters) {
      this.$emit('handleFilterChange', filters)
    },
    sortChange(filters) {
      this.$emit('sortChange', filters)
    },
    switchChange(row) {
      this.$emit('switchChange', row)
    },
    rowClick(type, value) {
      this.$emit('rowClick', type, value)
    },
    // 执行回调事件
    execCallBack(fun, row, index) {
      if (arguments && arguments.length > 0) {
        const funcName = arguments[0]
        if (typeof this.callbackObj[funcName] === 'function') {
          const args = []
          if (arguments.length > 1) {
            for (let i = 1; i < arguments.length; i++) {
              args.push(arguments[i])
            }
          }
          return this.callbackObj[funcName](...args)
        }
      }
      return 'null'
    },
    pageChanged(val) {
      // console.log(this.$parent, 'pageChanged')
      // this.getList({ pageNum: val.pageIndex, pageSize: val.pageSize })
      this.$emit('pageChanged', val)
    },
    //获取上一级组件
    getParent() {
      var parent = this.$parent
      while (!parent.$refs[this.tableOptions.key]) {
        parent = parent.$parent
        if (!parent || parent.$refs?.refRouterView) {
          break
        }
      }
      return parent
    },
  },
}
</script>
<style lang="scss" scoped>
.osInput {
  font-size: 12px;
  width: 100%;
}
::v-deep .el-input__inner {
  height: 24px !important;
  line-height: 24px !important;
}
::v-deep .el-input__icon {
  line-height: 33px;
}
.operateBox {
  padding: 0 5px;
  display: flex;
  justify-content: center;
  .el-link {
    margin-right: 5px;
  }
}
</style>
