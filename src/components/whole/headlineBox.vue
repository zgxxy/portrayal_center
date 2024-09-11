<!-- 标题盒子，带色块 -->
<template>
  <div class="headline-box">
    <div id="color-lump" :style="{ background: color }"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    //颜色
    color: {
      type: String,
      default: '#aecbff',
    },
  },
}
</script>
<style lang="scss" scoped>
.headline-box {
  // font-size: 13px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  #color-lump {
    max-width: 7px;
    width: 7px;
    padding: 5px 0;
    margin-right: 5px;
  }
}
</style>
