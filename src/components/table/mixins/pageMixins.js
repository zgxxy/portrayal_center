 export default {
  provide() { // 这里定义provide 传递参数
    return {
      data: this.data || {}, // 表格数据
      pagination: this.pagination // 分页属性
    }
  },
  data() {
    return {
      data: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 10
      }
    }
  },
  methods: {
    onGotPageData({ content, totalElements, size, number }) {
      this.data = content
      this.pagination.pageIndex = number + 1
      this.pagination.pageSize = size
      this.pagination.total = totalElements
    },
    onPageChanged({ pageIndex, pageSize }) {
      this.pagination.pageIndex = pageIndex
      this.pagination.pageSize = pageSize
      if (this.getData) {
        this.getData()
      }
    },
    addPageInfo(params = {}) {
      Object.assign(params, {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.pageIndex - 1
      })
      return params
    }
  }
}