<template>
  <div
    id="myChart"
    ref="myChart"
    style="width: 100%;"
    :style="{ height: myheight }"
  ></div>
</template>

<script>
import * as echarts from 'echarts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
])
export default {
  props: {
    //折线数据
    data: {
      type: Array,
      default: () => [],
    },
    //x轴数据
    xAxis: {
      type: Array,
      default: () => [],
    },
    //y轴单位
    yName: String,
    //y轴数据单位
    units: String,
    //图形高度
    height: {
      type: String,
      default: '200px',
    },
    //标题--位置在顶部居中
    text: {
      type: String,
      default: '',
    },
    //折线是否平滑型
    smooth: {
      type: Boolean,
      default: false,
    },
    //折线点形状--默认圆点，隐藏传none
    symbol: {
      type: String,
      default: 'circle',
    },
    //是否显示面积阴影
    areaStyle: {
      type: Boolean,
      default: false,
    },
    //x轴字符长度，用于字段过长显示省略号判断
    xLength: {
      type: Number,
      default: 5,
    },
    //interval显示x轴标签的个数，0：显示所有，1：隔一个显示一个，以此类推
    interval: {
      type: Number,
      default: 0,
    },
    //x轴换行，几个字占一行
    lineFeed: Number,
  },
  watch: {
    data: {
      deep: true,
      handler(newVal) {
        this.data = newVal
        this.init()
      },
    },
    xAxis: {
      deep: true,
      handler(newVal) {
        this.xAxis = newVal
        this.init()
      },
    },
  },
  data() {
    return {
      myheight: this.height,
      myChart: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.myChart && this.myChart.dispose()
      const that = this
      const xLength = this.xLength
      this.myChart = echarts.init(this.$refs.myChart)
      let legend = []
      this.data?.forEach((e) => {
        e['type'] = 'line'
        // e['stack'] = 'Total'
        e['symbol'] = this.symbol
        e['smooth'] = this.smooth
        if (this.areaStyle) {
          e['areaStyle'] = {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(102,184,255,0.21)',
              },
              {
                offset: 1,
                color: 'rgba(160,255,252,0.11)',
              },
            ]),
          }
        }
      })
      this.data?.forEach((e) => {
        if (e.name) {
          legend.push(e.name)
        }
      })
      const option = {
        barWidth: '30%', //柱子宽度
        title: {
          show: true, //false
          text: this.text, //主标题文本
          textStyle: {
            color: '#333', //'red'，字体颜色
            fontSize: 12, //字体大小
            fontWeight: 400,
            lineHeight: 18, //字体行高
          },
          padding: 0, //[5,10] | [ 5,6, 7, 8] ,标题内边距
          right: 'center', //'title 组件离容器右侧的距离
          // top: 'auto', //title 组件离容器上侧的距离
          // bottom: 'auto', //title 组件离容器下侧的距离
        },
        color: [
          '#79D3FF',
          '#FFD067',
          '#b4e798',
          '#ba90e6',
          '#fe9e61',
          '#ba90e6',
          '#a2bdda',
          '#c5b5e5',
          '#e0e276',
          '#3a90c2',
          '#9ec0f2',
        ],
        legend: {
          itemHeight: 10,
          itemWidth: 8,
          textStyle: {
            fontSize: 10,
            color: '#333',
          },
          data: legend,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter(params) {
            var relVal = params[0].name
            for (var i = 0; i < params.length; i++) {
              if (
                params[i].seriesName == '占比' ||
                params[i].seriesName.indexOf('率') != -1
              ) {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  '<span style="font-weight:900;margin-left:10px;float: right;">' +
                  Number(params[i].value).toFixed(2) +
                  '%' +
                  '</span>'
              } else {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  '<span style="font-weight:900;margin-left:10px;float: right;">' +
                  Number(params[i].value).toFixed(2) +
                  '</span>'
              }
            }
            return relVal
          },
        },
        xAxis: [
          {
            data: this.xAxis,
            type: 'category',
            sampling: 'lttb',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#79D3FF',
                },
                {
                  offset: 1,
                  color: '#ffffff',
                },
              ]),
            },
            axisLabel: {
              show: true,
              // 强制显示所有标签
              interval: this.interval,
              textStyle: {
                fontSize: 9,
                // padding: [5, 0],
              },
              formatter: function (value) {
                var res = value
                // 长度超过以省略号显示
                if (!that.lineFeed) {
                  if (res && res.length > that.xLength) {
                    res = res.substring(0, that.xLength) + '..'
                  }
                  return res
                } else {
                  //字符过长换行
                  var ret = '' //拼接加\n返回的类目项
                  var maxLength = that.lineFeed //每项显示文字个数
                  var valLength = res.length //X轴类目项的文字个数
                  // console.log(valLength);
                  var rowN = Math.ceil(valLength / maxLength) //类目项需要换行的行数
                  if (rowN > 1) {
                    //如果类目项的文字大于lineFeed,
                    for (var i = 0; i < rowN; i++) {
                      var temp = '' //每次截取的字符串
                      var start = i * maxLength //开始截取的位置
                      var end = start + maxLength //结束截取的位置
                      //这里也可以加一个是否是最后一行的判断
                      temp = res.substring(start, end) + '\n'
                      ret += temp //拼接最终的字符串
                    }
                    return ret
                  } else {
                    return res
                  }
                }
              },
            },
          },
        ],
        grid: {
          x: 10,
          x2: 0,
          top: 50,
          bottom: 0, //距离下边距
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          splitLine: false, //背景线
          name: this.yName,
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: function (value) {
              var res = value
              if (that.units) {
                if (that.units.indexOf('万') != -1) {
                  res = res / 10000 + that.units
                } else if (
                  that.units.indexOf('千') != -1 ||
                  that.units.indexOf('k') != -1
                ) {
                  res = res / 1000 + that.units
                } else {
                  res = res + that.units
                }
              } else if (that.yName) {
                if (that.yName.indexOf('万') != -1) {
                  res = res / 10000
                } else if (
                  that.yName.indexOf('千') != -1 ||
                  that.yName.indexOf('k') != -1
                ) {
                  res = res / 1000
                }
              } else {
                if (res > 1000 && res < 10000) {
                  res = res / 1000 + '千'
                } else if (res > 10000) {
                  res = res / 10000 + '万'
                }
              }
              return res
            },
            textStyle: {
              fontSize: 10,
            },
          },
        },
        series: this.data,
      }
      setTimeout(function () {
        option && that.myChart.setOption(option, true)
        // myChart.resize()
        window.addEventListener('resize', function () {
          that.myChart.resize()
        })
      }, 200)
    },
  },
}
</script>

<style></style>
