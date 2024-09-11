<template>
  <div class="content">
    <div class="custom">
      <slot name="top" class="top"></slot>
    </div>
    <div v-if="(type == 'double')">
      <el-progress
        :show-text="showText"
        :percentage="data"
        :stroke-width="height"
        class="double"
      ></el-progress>
      <div class="data_bottom" v-if="name !== undefined && value !== undefined">
        <span>{{ name }}</span>
        <span>{{ value }}</span>
      </div>
    </div>
    <div v-else>
      <el-progress
        :show-text="showText"
        :percentage="data"
        :stroke-width="height"
        :class="color | showProgressColor"
      ></el-progress>
      <div class="data_bottom" v-if="name !== undefined && value !== undefined">
        <span>{{ name }}</span>
        <span>{{ value }}</span>
      </div>
    </div>
    <div class="custom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dataBar',
  props: {
    //数据
    data: Number,
    //底部左侧数据
    name: [String, Number],
    //底部右侧数据
    value: [String, Number],
    //颜色-默认蓝色（blue、yellow、red）
    color: String,
    //高度-传数字类型
    height: {
      type: Number,
      default: 6,
    },
    //类型：默认但数据，传double为双数据（蓝红双色）
    type: {
      type: String,
      default: 'single',
    },
    //数据右侧label
    showText: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    showProgressColor(val) {
      if (val == 'blue' || val == undefined) {
        return (val = 'el-bg-inner-blue')
      } else if (val == 'yellow') {
        return (val = 'el-bg-inner-yellow')
      } else if (val == 'red') {
        return (val = 'el-bg-inner-red')
      }
    },
  },
  data() {
    return {}
  },
  methods: {
    getGradientColor() {
      if (this.type === 'circle' || this.type === 'dashboard') {
        return `url(#${this.svgGradientId})`
      }
      // type === 'line'
      const direction = 'to right' // 文本方向 LTR
      const linearGradients = this.gradientColor
        .map(({ color, percentage }) => `${color} ${percentage}`)
        .join(', ')
      return `linear-gradient(${direction}, ${linearGradients})`
    },
    barStyle() {
      const style = {}
      style.width = this.percentage + '%'
      style.background = this.getCurrentColor(this.percentage)
      return style
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  margin: 15px 0;
  .custom {
    margin: 8px 0;
  }
  .data_bottom {
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
  }
}
//进度条颜色--蓝色
::v-deep .double .el-progress-bar__inner {
  background: linear-gradient(90deg, #aecbff 0%, #5ea3ff 100%);
  box-shadow: 0px 0px 7px 0px rgba(96, 164, 255, 0.41);
}
//进度条底色--粉色
::v-deep .double .el-progress-bar__outer {
  background: linear-gradient(64deg, #ffb2c4 0%, #e47c91 100%);
  box-shadow: 0px 0px 7px 0px rgba(222, 119, 138, 0.35);
}
::v-deep .el-progress-bar__outer {
  background-color: #f3f3f3 !important;
}
::v-deep .el-bg-inner-blue .el-progress-bar__inner {
  background: linear-gradient(90deg, #aecbff 0%, #5ea3ff 100%);
  box-shadow: 0px 0px 7px 0px rgba(96, 164, 255, 0.41);
}
::v-deep .el-bg-inner-yellow .el-progress-bar__inner {
  background: linear-gradient(90deg, #fbf676 0%, #ffd067 100%);
  box-shadow: 0px 0px 7px 0px rgba(96, 164, 255, 0.41);
}
::v-deep .el-bg-inner-red .el-progress-bar__inner {
  background: linear-gradient(90deg, #ffb2c4 0%, #e47c91 100%);
  box-shadow: 0px 0px 7px 0px rgba(96, 164, 255, 0.41);
}
//组件旁边的
.el-progress__text {
  font-size: 12px !important;
}
</style>
