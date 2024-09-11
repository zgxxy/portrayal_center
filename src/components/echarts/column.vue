<template>
  <div ref="myChart" id="myChart" style="height: 180px; width: 100%;" />
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
import { thousandFormat } from '@/utils/public'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
])
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    //标题
    text: String,
    //x轴字符长度，用于字段过长显示省略号判断
    xLength: {
      type: Number,
      default: 5,
    },
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
    //是否显示legend
    legendShow: {
      type: Boolean,
      default: true,
    },
    //数据横向分布
    horizontal: Boolean,
    //显示数据标签
    labelShow: {
      type: Boolean,
      default: false,
    },
    //数据标签位置
    labelPosition: {
      type: String,
      default: 'top',
    },
    //x轴标签显示,隔几个显示
    interval: {
      type: Number,
      default: 0,
    },
    //数据不处理--默认大于一万的数据/10000
    noDivide: Boolean,
    //图形整体位置 [x,x2,y,y2]
    grid: {
      type: Array,
      default: () => [],
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
      myChart: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const that = this
      this.myChart && this.myChart.dispose()
      // console.log(thousandFormat(123456))
      this.myChart = echarts.init(this.$refs.myChart)
      // this.data.forEach(e)
      let data = this.data
      let data1 = this.data[0].cdata || this.data[0]?.data
      let data2 = this.data[1]?.cdata || this.data[1]?.data
      let data3 = this.data[2]?.cdata || this.data[2]?.data
      let data4 = this.data[0].idata
      let data5 = this.data[1]?.idata
      let data6 = this.data[2]?.idata
      let legend = []
      let yName1 = this.yName[0] || ''
      let yName2 = this.yName[1] || ''
      this.data?.forEach((e) => {
        if (e.cname) {
          legend.push(e.cname)
        }
      })
      this.data?.forEach((e) => {
        if (e.iname) {
          legend.push(e.iname)
        }
      })
      //渐变蓝
      const color_blue = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#AECBFF' },
        { offset: 1, color: '#5EA3FF' },
      ])
      //渐变黄
      const color_yellow = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#FBF676' },
        { offset: 1, color: '#FFD067' },
      ])
      //渐变绿
      const color_green = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#d4f8bf' },
        { offset: 1, color: '#b4e798' },
      ])
      let colors = [color_blue, color_yellow, color_green]
      //横向
      let series1 = [
        {
          name: this.data[0].cname || this.data[0].name,
          type: 'bar',
          stack: 'one',
          barMaxWidth: 20,
          itemStyle: {
            normal: {
              label: {
                show: that.labelShow, //标签数据显示
                position: that.labelPosition,
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                    return res
                  } else {
                    if (that.data[0].percentage) {
                      return (
                        thousandFormat(res) +
                        '人 / ' +
                        (that.data[0].percentage[value.dataIndex]
                          ? that.data[0].percentage[value.dataIndex]
                          : '0%')
                      )
                    } else {
                      return thousandFormat(res)
                    }
                  }
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              color: function (params) {
                return colors[params.dataIndex]
              },
            },
          },
          barGap: '0%',
          data: data1,
        },
      ]
      //纵向
      let series2 = [
        {
          name: this.data[0].cname || this.data[0].name,
          type: 'bar',
          stack: 'one',
          barMaxWidth: 20,
          itemStyle: {
            normal: {
              label: {
                show: that.labelShow, //标签数据显示
                position: that.labelPosition,
                formatter: function (value) {
                  var res = value.value
                  if (
                    value.seriesName == '占比' ||
                    value.seriesName.indexOf('率') != -1
                  ) {
                    res = res + '%'
                    return res
                  } else {
                    return thousandFormat(res)
                  }
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              // barBorderRadius:
              //   this.data.length > 1 ? [0, 0, 30, 30] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#AECBFF' },
                { offset: 1, color: '#5EA3FF' },
              ]),
            },
          },
          barGap: '0%',
          data: data1,
        },
        {
          name: this.data[1]?.cname || this.data[1]?.name,
          type: 'bar',
          stack: 'one',
          barWidth: 15,
          itemStyle: {
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
                    return res
                  } else {
                    return thousandFormat(res)
                  }
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              // barBorderRadius:
              //   this.data.length > 1 ? [30, 30, 0, 0] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#FBF676' },
                { offset: 1, color: '#FFD067' },
              ]),
            },
          },
          barGap: '0%',
          data: data2,
        },
        {
          name: this.data[2]?.cname || this.data[2]?.name,
          type: 'bar',
          stack: 'one',
          barWidth: 15,
          itemStyle: {
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
                    return res
                  } else {
                    return thousandFormat(res)
                  }
                },
                textStyle: {
                  color: 'black',
                  fontSize: 10,
                },
              },
              barBorderRadius: [30, 30, 30, 30],
              // barBorderRadius:
              //   this.data.length > 1 ? [30, 30, 0, 0] : [30, 30, 30, 30],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#d4f8bf' },
                { offset: 1, color: '#b4e798' },
              ]),
            },
          },
          barGap: '0%',
          data: data3,
        },
        {
          name: this.data[0].iname,
          type: 'line',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              label: {
                show: false, //标签数据显示
                position: 'bottom',
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
                  color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
                  fontSize: 10,
                },
              },
              color: this.data.length > 1 ? '#79D3FF' : '#FFB365',
            },
          },
          data: data4,
        },
        {
          name: this.data[1]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#FFB365',
            },
          },
          data: data5,
        },
        {
          name: this.data[2]?.iname,
          type: 'line',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#97d376',
            },
          },
          data: data6,
        },
      ]
      const option = {
        barWidth: this.horizontal ? '50%' : '30%', //柱子宽度
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
          show: this.legendShow,
          itemHeight: 10,
          itemWidth: 20,
          textStyle: {
            fontSize: 12,
            color: '#333',
            // padding: [0, 0, 0, -8], // 修改文字和图标距离
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
            //横坐标为value时，会多一组数组，删掉
            if (that.horizontal) {
              params.pop()
            }
            for (var i = 0; i < params.length; i++) {
              if (params[i].data != '' || params[i].data > 0) {
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
            }
            return relVal
          },
        },
        xAxis: {
          data: this.xAxis,
          name: this.horizontal ? yName1 : '',
          type: this.horizontal ? 'value' : 'category',
          splitLine: {
            //去除网格线
            show: false,
          },
          axisLabel: {
            show: true,
            // 强制显示所有标签
            interval: this.interval,
            textStyle: {
              fontSize: 9,
            },
            formatter: function (value) {
              var res = value
              // 长度超过的以省略号显示
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
        yAxis: [
          {
            type: this.horizontal ? 'category' : 'value',
            data: this.xAxis,
            splitLine: false, //背景线
            name: this.horizontal ? '' : yName1,
            //y标签值
            axisLabel: {
              show: true,
              interval: this.interval,
              formatter: function (value) {
                var res = value
                if (!isNaN(res) && !that.noDivide && that.units) {
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
                } else if (
                  !isNaN(res) &&
                  !that.noDivide &&
                  that.yName.length > 0
                ) {
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
            //刻度线
            axisTick: {
              show: false,
            },
          },
          {
            type: 'value',
            show: this.horizontal ? false : true,
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
          x: that.grid[0] || 10,
          x2: that.grid[1] || 15,
          top: that.legendShow || that.text ? 50 : 28,
          bottom: 10, //距离下边距
          containLabel: true,
        },
        series: this.horizontal ? series1 : series2,
      }
      // option && myChart.setOption(option, true)
      setTimeout(function () {
        option && that.myChart.setOption(option, true)
        window.addEventListener('resize', function () {
          that.myChart.resize()
        })
      }, 200)
    },
  },
}
</script>

<style></style>
