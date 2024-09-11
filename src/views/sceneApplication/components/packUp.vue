<template>
  <div class="curr-contents" ref="outerDiv">
    <div class="show-areas" v-show="openflags">
      <!-- 内容插槽 -->
      <slot></slot>
    </div>
    <div
      v-show="disabled == false"
      class="pack-ups"
      ref="packUps"
      @click="handlePack"
    >
      <i class="el-icon-arrow-right foldBtn" v-show="!openflags"></i>
      <i class="el-icon-arrow-left foldBtn" v-show="openflags"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'packup',
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
    //禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    message: String,
  },
  watch: {
    isOpen: {
      deep: true,
      handler(newVal) {
        this.isOpen = newVal
      },
    },
  },
  data() {
    return {
      liConWidth: 0, // 左边容器的宽度
      openflags: this.isOpen,
    }
  },
  mounted() {
    this.liConWidth = this.$refs.outerDiv.clientWidth
  },
  methods: {
    // 点击展开 折叠
    handlePack() {
      if (!this.disabled) {
        this.openflags = !this.openflags
        const liCon = this.$refs.outerDiv
        let packUps = this.$refs.packUps
        if (this.openflags) {
          // 展开
          liCon.style.width = 'auto'
          liCon.style.width = this.liConWidth + 'px'
          packUps.style.position = 'absolute'
          packUps.style.left = 'auto'
          packUps.style.right = '0'
        } else {
          // 收起
          liCon.style.width = 0 + 'px'
          packUps.style.position = 'absolute'
          packUps.style.right = 'auto'
          packUps.style.left = '0'
        }
        this.$emit('change', this.openflags)
      } else {
        if (this.message) this.$message.warning(this.message)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.curr-contents {
  width: 65%;
  height: 100%;
  position: relative;
  transition: all 0.5s ease-in-out;
  padding-right: 10px;
}
.curr-contents .pack-ups {
  height: 100%;
  // height: 20px;
  // width: 20px;
  // border-radius: 10px;
  // background: #91aed6;
  // color: #fff;
  // opacity: 0.2;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  // transition: all 0.5s ease-in-out;
}
//折叠按钮
.foldBtn {
  color: #fff;
  background: #91aed6;
  font-size: 12px;
  padding: 3px;
  border-radius: 15px;
  opacity: 0.2;
}
.curr-contents:hover {
  .foldBtn {
    opacity: 1;
  }
  // opacity: 1;
  // height: 25px;
  // width: 25px;
  // border-radius: 13px;
}
.show-areas {
  transition: all 0.5s ease-in-out;
}
</style>
