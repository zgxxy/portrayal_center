<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loading: '',
      scrollTop: 0,
    }
  },
  watch: {
    '$store.state.loading.isShowLoading': {
      handler(val) {
        if (val) {
          this.loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)',
          })
        } else {
          this.loading && this.loading.close()
        }
      },
    },
  },
  beforeDestroy() {
    localStorage.clear()
    sessionStorage.clear()
  },
}
</script>
<style lang="scss">
/* 防止el-table页面切换后换行 */
body .el-table th.gutter {
  display: table-cell !important;
}
body .el-table colgroup.gutter {
  display: table-cell !important;
}
/* 滚动条样式修改 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/* 滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #aaa;
}
</style>
