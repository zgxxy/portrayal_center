<template>
  <div ref="myChart" style="width: 100%;" :style="{ height: myheight }" />
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
    //数据
    data: {
      type: Array,
      default: () => [],
    },
    //数据标签
    xAxis: {
      type: Array,
      default: () => [],
    },
    //y轴上方的单位
    yName: {
      type: Array,
      default: () => [],
    },
    //y轴数据单位
    units: String,
    height: {
      type: String,
      default: '200px',
    },
    //标题
    text: String,
    //柱子颜色--渐变色['','']目前只对第一根柱子有效
    color: Array,
    //x轴字符长度，用于字段过长显示省略号判断
    xLength: {
      type: Number,
      default: 5,
    },
    //是否显示legend
    legendShow: {
      type: Boolean,
      default: true,
    },
    //是否柱子堆积
    stack: {
      type: Boolean,
      default: false,
    },
    //最大柱子宽度
    barMaxWidth: Number,
    //数据横向分布
    horizontal: Boolean,
    //数据不处理--默认大于一万的数据/10000
    noDivide: Boolean,
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
      let data1 = this.data[0]?.cdata || this.data[0]?.data
      let data2 = this.data[1]?.cdata || this.data[1]?.data
      let data3 = this.data[2]?.cdata || this.data[2]?.data
      let data4 = this.data[0]?.idata
      let data5 = this.data[1]?.idata
      let data6 = this.data[2]?.idata
      let legend = []
      let color = this.color
      let yName1 = this.yName[0] || ''
      let yName2 = this.yName[1] || ''
      this.data?.forEach((e) => {
        if (e.cname) {
          legend.push(e.cname)
        } else {
          if (this.units && this.units.indexOf('%') != -1) {
            e.cname = '占比'
          } else if (this.units && this.units.indexOf('万') != -1) {
            e.cname = '数量'
          } else if (
            this.yName[0]?.indexOf('个') != -1 ||
            this.yName[0]?.indexOf('万') != -1
          ) {
            e.cname = '数量'
          }
        }
      })
      this.data?.forEach((e) => {
        if (e.iname) {
          legend.push(e.iname)
        }
      })
      //有一根柱子时
      let series1 = [
        {
          name: this.data[0].cname || this.data[0].name,
          type: 'bar',
          barMaxWidth: this.barMaxWidth || 20,
          barGap: 0,
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
                formatter: function (value) {
                  console.log(value, '标签')
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: color ? color[0] : '#AECBFF' },
                { offset: 1, color: color ? color[1] : '#5EA3FF' },
              ]),
            },
          },
          data: data1,
        },
        {
          name: this.data[0].iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'bottom',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
                  fontSize: 10,
                },
              },
              color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
            },
          },
          data: data4,
        },
      ]
      //有两根柱子时
      let series2 = [
        //第一根柱子
        {
          name: this.data[0].cname || this.data[0].name,
          type: 'bar',
          stack: 'one',
          barMaxWidth: this.arMaxWidth || 20,
          barGap: '15%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
                // formatter: '{c}%', //显示百分号
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              // barBorderRadius: [30, 30, 30, 30],
              barBorderRadius: this.stack ? [0, 0, 30, 30] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#AECBFF' },
                { offset: 1, color: '#5EA3FF' },
              ]),
            },
          },
          data: data1,
          z: 1,
        },
        //第二根柱子
        {
          name: this.data[1]?.cname || this.data[1]?.name,
          type: 'bar',
          stack: this.stack ? 'one' : 'two',
          barMaxWidth: this.barMaxWidth || 20,
          barGap: '15%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              // barBorderRadius: [30, 30, 30, 30],
              barBorderRadius: this.stack ? [30, 30, 0, 0] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#FBF676' },
                { offset: 1, color: '#FFD067' },
              ]),
            },
          },
          data: data2,
          z: 1,
        },
        //第一条折线
        {
          name: this.data[0].iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'bottom',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
                  fontSize: 10,
                },
              },
              color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
            },
          },
          data: data4,
        },
        //第二条折线
        {
          name: this.data[1]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#FFB365',
              label: {
                show: false, //标签数据显示
                position: 'bottom',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: '#FFB365',
                  fontSize: 10,
                },
              },
            },
          },
          data: data5,
        },
      ]
      //有三根柱子时
      let series3 = [
        //第一根柱子
        {
          name: this.data[0].cname || this.data[0].name,
          type: 'bar',
          stack: 'one',
          barMaxWidth: this.barMaxWidth || 18,
          barGap: '20%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
                // formatter: '{c}%', //显示百分号
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              // barBorderRadius: [30, 30, 30, 30],
              barBorderRadius: this.stack ? [0, 0, 30, 30] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#AECBFF' },
                { offset: 1, color: '#5EA3FF' },
              ]),
            },
          },
          data: data1,
          z: 1,
        },
        //第二根柱子
        {
          name: this.data[1]?.cname || this.data[1]?.name,
          type: 'bar',
          stack: this.stack ? 'one' : 'two',
          barMaxWidth: this.barMaxWidth || 18,
          barGap: '20%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: this.stack ? [0, 0, 0, 0] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#FBF676' },
                { offset: 1, color: '#FFD067' },
              ]),
            },
          },
          data: data2,
          z: 1,
        },
        //第三根柱子
        {
          name: this.data[2]?.cname || this.data[2]?.name,
          type: 'bar',
          stack: this.stack ? 'one' : 'tree',
          barMaxWidth: this.barMaxWidth || 18,
          barGap: '20%',
          itemStyle: {
            // emphasis: {
            //   barBorderRadius: 30,
            // },
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'top',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              // barBorderRadius: [30, 30, 30, 30],
              barBorderRadius: this.stack ? [30, 30, 0, 0] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#d4f8bf' },
                { offset: 1, color: '#b4e798' },
              ]),
            },
          },
          data: data3,
          z: 1,
        },
        //第一条折线
        {
          name: this.data[0].iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'bottom',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
                  fontSize: 10,
                },
              },
              color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
            },
          },
          data: data4,
        },
        //第二条折线
        {
          name: this.data[1]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#FFB365',
              label: {
                show: false, //标签数据显示
                position: 'bottom',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: '#FFB365',
                  fontSize: 10,
                },
              },
            },
          },
          data: data5,
        },
        // 第三条折线
        {
          name: this.data[2]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#97d376',
              label: {
                show: false, //标签数据显示
                position: 'bottom',
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                  }
                  return res
                },
                textStyle: {
                  color: '#97d376',
                  fontSize: 10,
                },
              },
            },
          },
          data: data6,
        },
      ]
      const option = {
        barWidth: '30%', //柱子宽度
        title: {
          show: true, //false
          text: this.text, //主标题文本
          textStyle: {
            color: '#333', //'red'，字体颜色
            fontSize: 12, //字体大小
            fontWeight: 600,
            lineHeight: 18, //字体行高
          },
          padding: 0, //[5,10] | [ 5,6, 7, 8] ,标题内边距
          right: 'center', //'title 组件离容器右侧的距离
          top: 'top', //title 组件离容器上侧的距离
          // bottom: 'auto', //title 组件离容器下侧的距离
        },
        legend: {
          show: that.legendShow,
          top: 5,
          itemHeight: 10,
          itemWidth: 20,
          textStyle: {
            fontSize: 12,
            color: '#333',
          },
          data: legend,
        },
        // dataZoom: [
        //   {
        //     type: 'inside', // 图表下方的伸缩条
        //     show: true,
        //     // realtime: true,
        //     start: 0,
        //     end: 100,
        //     minSpan: 70,
        //     maxSpan: 70, //maxSpan和minSpan的值设置一样，禁止滚动时滚动条大小改变（缩放和扩大）
        //   },
        // ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          extraCssText: 'z-index:9999',
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
            type: this.horizontal ? 'value' : 'category',
            axisLabel: {
              show: true,
              // 强制显示所有标签
              interval: 0,
              textStyle: {
                fontSize: 9,
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
                      //这里也可以加一个是否是最后一行的判断，但是不加也没有影响
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
        yAxis: [
          //柱形图y轴
          {
            type: this.horizontal ? 'category' : 'value',
            data: this.xAxis,
            splitLine: false, //背景线
            name: yName1,
            axisLabel: {
              interval: 'auto',
              formatter: function (value) {
                var res = value
                if (!that.noDivide && that.units) {
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
                } else if (!that.noDivide && that.yName.length > 0) {
                  if (that.yName[0].indexOf('万') != -1) {
                    res = res / 10000
                  } else if (
                    that.yName[0].indexOf('千') != -1 ||
                    that.yName[0].indexOf('k') != -1
                  ) {
                    res = res / 1000
                  }
                } else {
                  if (!that.noDivide && res > 1000 && res < 10000) {
                    res = res / 1000 + '千'
                  } else if (!that.noDivide && res > 10000) {
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
          //折线图y轴
          {
            type: 'value',
            splitLine: false, //背景线
            name: yName2,
            axisLabel: {
              formatter: function (value) {
                var res = value
                if (!that.noDivide && that.units) {
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
                } else if (!that.noDivide && that.yName.length > 0) {
                  if (that.yName[0].indexOf('万') != -1) {
                    res = res / 10000
                  } else if (
                    that.yName[0].indexOf('千') != -1 ||
                    that.yName[0].indexOf('k') != -1
                  ) {
                    res = res / 1000
                  }
                } else {
                  if (!that.noDivide && res > 1000 && res < 10000) {
                    res = res / 1000 + '千'
                  } else if (!that.noDivide && res > 10000) {
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
        ],
        grid: {
          x: 10,
          x2: 10,
          top: that.legendShow || that.text ? 50 : 28,
          bottom: 10, //距离下边距
          containLabel: true,
        },
        series:
          this.data.length == 1
            ? series1
            : this.data.length == 2
            ? series2
            : series3,
      }
      //两条折线偏移设置
      // if (this.data.length == 2) {
      //   debugger
      //   option.xAxis[1] = {
      //     type: 'value',
      //     max: option.xAxis[0].data.length * 100,
      //     show: false,
      //   }
      //   //第一条折线偏移量
      //   if (option.series[2].data) {
      //     option.series[2].data = option.series[2].data.map((x, i) => [
      //       32 + i * 100,
      //       x,
      //     ])
      //   }
      //   //第二条折线偏移量
      //   if (option.series[3].data) {
      //     option.series[3].data = option.series[3].data.map((x, i) => [
      //       68 + i * 100,
      //       x,
      //     ])
      //   }
      // }
      //三条折线偏移设置
      // if (this.data.length == 3) {
      //   option.xAxis[1] = {
      //     type: 'value',
      //     max: option.xAxis[0].data.length * 100,
      //     show: false,
      //   }
      //   //第一条折线偏移量
      //   if (option.series[3].data) {
      //     option.series[3].data = option.series[3].data.map((x, i) => [
      //       30 + i * 100,
      //       x,
      //     ])
      //   }
      //   //第二条折线偏移量
      //   if (option.series[4].data) {
      //     option.series[4].data = option.series[4].data.map((x, i) => [
      //       50 + i * 100,
      //       x,
      //     ])
      //   }
      //   //第三条折线偏移量
      //   if (option.series[5].data) {
      //     option.series[5].data = option.series[5]?.data.map((x, i) => [
      //       70 + i * 100,
      //       x,
      //     ])
      //   }
      // }

      option && that.myChart.setOption(option, true)
      setTimeout(function () {
        // option && myChart.setOption(option, true)
        window.addEventListener('resize', function () {
          that.myChart.resize()
        })
      }, 200)
    },
  },
}
</script>

<style></style>
