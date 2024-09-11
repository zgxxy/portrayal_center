<template>
  <el-pagination
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :current-page="currentPage"
    :page-size="currentSize"
    :page-sizes="pageSizes"
    :total="total"
    :layout="layout"
    :pager-count="pagerCount"
  ></el-pagination>
</template>
<script>
import { pageMixins } from './mixins/pageMixins.js'
export default {
  name: 'Pagination', // 组件名
  inject: ['pagination'], // 接收后面mixins中provider的提供的参数
  props: {
    // 总页数
    total: { type: Number, default: 0 },
    // 当前页
    pageIndex: { type: Number, default: 1 },
    // 每页显示条数
    pageSize: { type: Number, default: 10 },
    // 几条每页
    pageSizes: { type: Array, default: () => [10, 20, 30] },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    // 显示多少个页码按钮数量，必须为单数且>5
    pagerCount: { type: Number, default: 5 },
  },
  watch: {
    pagination: {
      deep: true,
      immediate: true,
      handler(v) {
        if (!v) {
          return
        }
        const { pageSize, pageIndex } = v
        this.currentSize = pageSize
        this.currentPage = pageIndex
      },
    },
  },
  data() {
    return {
      currentSize: this.pageSize,
      currentPage: this.pageIndex,
    }
  },
  methods: {
    paginationChangeInfo() {
      // 触发父组件中特定的pageChanged函数
      const pageInfo = {
        pageSize: this.currentSize,
        pageIndex: this.currentPage,
      }
      this.$emit('pageChanged', pageInfo)
    },
    handleSizeChange(pageSize) {
      // 每页条数改变函数
      this.currentSize = pageSize
      // 可能会造成页码改变发生，这时候不发送事件，因为可能造成事件死循环
      if (!willMakePageChange) {
        this.paginationChangeInfo()
      }
    },
    handleCurrentChange(pageIndex) {
      // 页码改变函数
      this.currentPage = pageIndex
      this.paginationChangeInfo()
    },
  },
}
</script>
