<!-- 底部固定栏 -->
<template>
  <div style="height: 50px;">
    <el-card
      id="content-footer"
      :style="{ 'min-width': isCollapse, 'max-width': isCollapse1 }"
    >
      <slot></slot>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'bottomFixed',
  computed: {
    ...mapGetters(['sidebar']),
    //左侧导航栏伸缩和展开宽度不一样
    isCollapse() {
      if (this.sidebar.opened) {
        return 'calc(100% - 245px)'
      } else {
        return 'calc(100% - 90px)'
      }
    },
    isCollapse1() {
      if (this.sidebar.opened) {
        return 'calc(100% - 255px)'
      } else {
        return 'calc(100% - 94px)'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#content-footer {
  position: fixed;
  bottom: -10px;
  border-radius: 0;
  z-index: 9999;
  // background: linear-gradient(90deg, #f8faff, #f7ffff);
}
</style>
