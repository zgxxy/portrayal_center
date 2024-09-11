<template>
  <div class="block">
    <el-pagination
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentPage: 1,
      pagesizes: 10,
    }
  },
  methods: {
    // 分页器事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesizes = val
      this.$emit('pageSizeHandle', this.pagesizes)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.$emit('currentPageHandle', this.currentPage)
    },
  },
}
</script>
