<template>
  <div ref="myChart" style="height: 100%; width: 100%;" />
</template>

<script>
import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts/lib/component/dataZoom'
echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
])

export default {
  props: {
    time: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Object,
      default() {
        return {
          color: [
            '#a9bbf8',
            '#8deadd',
            '#fbd437',
            '#54ced0',
            '#ba90e6',
            '#c5b5e5',
            '#e6a23c',
            '#ecb4a4',
            '#e0e276',
            '#3a90c2',
            '#9ec0f2',
            '#a2bdda',
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '25%',
            top: 10,
            containLabel: true,
          },
          legend: {
            data: this.legend,
            bottom: 45,
            padding: 20,
          },
          xAxis: [
            {
              type: 'category',
              // boundaryGap: false,
              data: this.time,
              interval: 5, // 步长
              axisLabel: {
                // interval: 0,
                // rotate: 30, //标签名倾斜
              },
            },
          ],
          yAxis: {
            type: 'value',
          },
          series: this.data,
          dataZoom: [
            {
              type: 'slider', // 图表下方的伸缩条
              show: true,
              // realtime: true,
              start: 0,
              end: 20,
              minSpan: 100,
              maxSpan: 100, //maxSpan和minSpan的值设置一样，禁止滚动时滚动条大小改变（缩放和扩大）
            },
            {
              type: 'inside',
              // realtime: true,
              minSpan: 2,
              maxSpan: 100,
            },
          ],
        }
      },
    },
  },
  data() {
    return {
      // chart: '',
      legend: [],
    }
  },
  watch: {
    // option: {
    //   handler(newVal, oldVal) {
    //     if (this.chart) {
    //       if (newVal) {
    //         this.chart.setOption(newVal)
    //       } else {
    //         this.chart.setOption(oldVal)
    //       }
    //     } else {
    //       this.init()
    //     }
    //   },
    //   deep: true, // 对象内部属性的监听，关键。
    // },
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.option.series = val
      },
    },
    time: {
      deep: true,
      immediate: true,
      handler(val) {
        this.option.xAxis.data = val
        // this.time = val
      },
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$refs.myChart)
      this.chart.clear()
      this.chart.setOption(this.option, true)
      console.log(this.data, '折线图data')
      console.log(this.time, '折线图time')
      this.legend = []
      this.data.forEach((e) => {
        this.legend.push(e)
      })
    },
  },
}
</script>

<style></style>
