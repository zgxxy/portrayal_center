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
  },
  watch: {
    data: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.data = val
        this.init()
      },
    },
    time: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.time = val
        this.init()
      },
    },
  },
  data() {
    return {
      chart: '',
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    init() {
      const myChart = echarts.init(this.$refs.myChart)
      console.log(this.data, '折线图data')
      console.log(this.time, '折线图time')
      let legend = []
      let spanLength = 100
      this.data.forEach((e) => {
        legend.push(e.name)
      })
      if (this.time.length > 50) {
        spanLength = 7
      } else if (this.time.length > 20 && this.time.length < 35) {
        spanLength = 20
      } else if (this.time.length > 15 && this.time.length < 20) {
        spanLength = 35
      } else if (this.time.length > 7) {
        spanLength = 50
      }
      console.log(spanLength, 'spanLength')
      const option = {
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
        legend: {
          data: legend,
          bottom: 45,
          padding: 20,
        },
        // toolbox: {
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: 'none',
        //     },
        //     restore: {},
        //     saveAsImage: {},
        //   },
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '25%',
          top: 10,
          containLabel: true,
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
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: this.data,
        // series: [
        //   {
        //     name: 'D10001',
        //     type: 'line',
        //     areaStyle: {},
        //     smooth: true,
        //     data: [0.12, 0.132, 0.567, 0.134, 0.932, 0, 0],
        //   },
        //   {
        //     name: 'D10002',
        //     type: 'line',
        //     areaStyle: {},
        //     smooth: true,
        //     data: [0.654, 0.882, 0.665, 0.234, 0.343, 0, 0],
        //   },
        // ],
        dataZoom: [
          {
            type: 'slider', // 图表下方的伸缩条
            show: true,
            // realtime: true,
            start: 0,
            end: 100,
            minSpan: 0,
            maxSpan: 100,
            // minSpan: spanLength,
            // maxSpan: spanLength, //maxSpan和minSpan的值设置一样，禁止滚动时滚动条大小改变（缩放和扩大）
          },
          {
            type: 'inside',
            // realtime: true,
            minSpan: 2,
            maxSpan: 100,
          },
        ],
      }
      // myChart.clear()
      option && myChart.setOption(option, true)
      setTimeout(function () {
        window.onresize = function () {
          myChart.resize()
        }
      }, 200)
    },
  },
}
</script>

<style></style>
