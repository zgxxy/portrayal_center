<template>
  <div ref="myChart" id="myChart" style="height: 200px; width: 100%;" />
</template>

<script>
import * as echarts from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GaugeChart, CanvasRenderer])

export default {
  props: {
    //数据
    data: {
      type: Array,
      default: [],
    },
    //是否显示标签
    labelShow: {
      type: Boolean,
      default: true,
    },
    //标签位置--里：inner 外：outside/outer
    labelPosition: {
      type: String,
      default: 'inner',
    },
    //色系 [{c1: '#AECBFF', c2: '#418FF6'}]
    color: Array,
    //中部数据（一般用于总数显示） 换行：'总数量\n2230'
    text: String,
    labelColor: {
      type: String,
      default: '#fff',
    },
    //legend位置：top、bottom、right、left
    legendPosition: String,
    //是否多环
    multiple: Boolean,
    //多环状态下，圆环宽度
    borderWidth: {
      type: [String, Number],
      default: 10,
    },
  },
  watch: {
    data: {
      deep: true,
      handler(newVal) {
        this.data = newVal
        this.init()
      },
    },
  },
  data() {
    return {
      myChart: null,
      legendSite: this.legendPosition,
    }
  },
  mounted() {
    this.$nextTick(() => {
      // setTimeout(() => {
      this.init()
      // }, 1000)
    })
  },
  methods: {
    init() {
      this.myChart && this.myChart.dispose()
      const that = this
      this.myChart = echarts.init(this.$refs.myChart)
      var chooseIndex = 0
      var legendList = []
      //默认色系
      var colors = [
        {
          c1: '#AECBFF', //蓝色
          c2: '#418FF6',
        },
        {
          c1: '#CFAEFF', //紫色
          c2: '#9E5EFF',
        },
        {
          c1: '#ffddaa', //黄色
          c2: '#ecb867',
        },
        {
          c1: '#FFD064', //橙色
          c2: '#EA6B67',
        },
        {
          c1: '#c2c7f1', //黄色
          c2: '#6b7ee4',
        },
        {
          c1: '#d4f8bf', //绿色
          c2: '#b4e798',
        },
        {
          c1: '#ffb2c4', //红色
          c2: '#e47c91',
        },
      ]
      //自定义色系
      let color = this.color
      var data = this.data
      var labelShow = this.labelShow
      this.data.forEach((e) => {
        e.value = Number(e.value).toFixed(2)
        legendList.push(e.name)
      })
      /************legend位置设置start************/
      //默认为右侧的样式
      var center = ['40%', '50%'] //图形整体位置:例如['50%','50%']为中间位置
      var orient = 'vertical' //legend图例朝向--横向horizontal or 纵向vertical
      //legend的位置
      var position = {
        left: '70%',
        bottom: '15%',
      }
      // //当为多环且没设置legend位置时，legend位置默认为左侧
      if (this.multiple && !this.legendSite) {
        this.legendSite = 'left'
      }
      switch (this.legendSite) {
        case 'right':
          center = ['40%', '50%']
          orient = 'vertical'
          position = {
            left: '70%',
            top: '15%',
          }
          break
        case 'left':
          center = ['63%', '50%']
          orient = 'vertical'
          position = {
            right: '70%',
            top: '15%',
          }
          break
        case 'top':
          center = ['50%', '50%']
          orient = 'horizontal'
          position = {
            left: 'center',
            top: 0,
          }
          break
        case 'bottom':
          center = ['50%', '45%']
          orient = 'horizontal'
          position = {
            left: 'center',
            bottom: 0,
          }
          break
      }
      /************legend位置设置end************/
      var optionData = getData(data)
      //单环-即常规饼图
      let series1 = [
        {
          name: '',
          type: 'pie',
          minAngle: 10, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
          radius: ['35%', '70%'],
          center: center,
          label: {
            show: this.labelShow,
            position: this.labelPosition, //outside  inner
            // alignTo: 'labelLine', //该属性只有position为outer的时候生效，避免label过多显示不全
            // formatter: '{c}%', // 这里的设置就是饼图的标签内容及其格式
            formatter: function (param) {
              let text = param.data.value
              if (text.length < 15) {
                // return '{name|{b}}\n{value|{d}%( {c})}'
                return text + '%'
              } else {
                return text.substring(0, 15) + '...' + '%'
              }
            },
            // rich: {
            //   value: { 'min-width': '150px' },
            // },
            color:
              this.labelPosition == 'outside'
                ? '#333'
                : this.labelPosition == 'outer'
                ? '#333'
                : this.labelColor,
            fontSize: '10',
            rich: {
              c: {
                align: 'center',
                'min-width': '150px',
              },
            },
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            normal: {
              color: function (params) {
                return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                    offset: 0,
                    color: color
                      ? color[params.dataIndex].c1
                      : colors[params.dataIndex].c1,
                  },
                  {
                    offset: 1,
                    color: color
                      ? color[params.dataIndex].c2
                      : colors[params.dataIndex].c2,
                  },
                ])
              },
            },
          },
          data: this.data,
        },
      ]
      //多环
      function getData(data) {
        var res = {
          series: [],
          yAxis: [],
        }
        for (let i = 0; i < data.length; i++) {
          //每个圆环由两部分组成，数据部分和剩余部分（100%-数据=剩余），分别设置
          //显示数据部分
          res.series.push({
            name: data[i].name,
            type: 'pie',
            clockWise: true, //饼图的扇区是否是顺时针排布
            hoverAnimation: false, //hover放大动画效果
            radius: [80 - i * 25 + '%', 63 - i * 25 + '%'], //圆环半径的半径
            center: center,
            label: {
              show: false,
              position: that.labelPosition, //outside  inner
              // position: 'outside',
              formatter: '{c}%', // 这里的设置就是饼图的标签内容及其格式
              color: '#333',
            },
            labelLine: {
              show: true,
              length: 50,
              smooth: 0,
            },
            itemStyle: {
              //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: color ? color[i].c1 : colors[i].c1,
                },
                {
                  offset: 1,
                  color: color ? color[i].c2 : colors[i].c2,
                },
              ]),
              borderRadius: 20,
              borderColor: '#fff',
              borderWidth: 2,
            },
            data: [
              //数据
              {
                value: data[i].value,
                name: data[i].name,
              },
              //剩余
              {
                value: 100 - data[i].value,
                name: '',
                label: {
                  show: false,
                },
                itemStyle: {
                  color: 'transparent', //透明，避免挡住y轴值
                  borderWidth: 0,
                },
                tooltip: {
                  show: false,
                },
                hoverAnimation: false,
              },
            ],
          })
          //剩余部分
          // res.series.push({
          //   name: data[i].name,
          //   type: 'pie',
          //   silent: true,
          //   z: 1,
          //   clockWise: false, //顺时加载
          //   hoverAnimation: false, //鼠标移入变大
          //   radius: [80 - i * 22 + '%', 65 - i * 22 + '%'],
          //   center: center,
          //   label: {
          //     show: false,
          //   },
          //   itemStyle: {
          //     label: {
          //       show: false,
          //     },
          //     labelLine: {
          //       show: false,
          //     },
          //     borderWidth: 5,
          //   },
          //   data: [
          //     {
          //       //灰色饼图默认值
          //       value: 7.5,
          //       itemStyle: {
          //         color: '#fff',
          //         borderWidth: 0,
          //       },
          //       tooltip: {
          //         show: false,
          //       },
          //       hoverAnimation: false,
          //     },
          //     {
          //       //灰色饼图显示4/3，使其剩余部分隐藏
          //       value: 2.5,
          //       name: '',
          //       itemStyle: {
          //         color: 'rgba(0,0,0,0)', //饼图颜色透明，隐藏4/1部分
          //         borderWidth: 0,
          //       },
          //       tooltip: {
          //         show: false,
          //       },
          //       hoverAnimation: false,
          //     },
          //   ],
          // })
          res.yAxis.push({ value: data[i].value + '%' })
        }
        res.yAxis.reverse()
        return res
      }
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}%',
        },
        title: {
          text: this.text,
          left: '39%',
          top: '37%',
          textAlign: 'center',
          textStyle: {
            color: '#333',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 20,
          },
        },
        legend: {
          orient: orient, //horizontal vertical
          icon: 'circle',
          type: 'scroll',
          itemHeight: 10,
          itemWidth: 10, //图例宽度
          itemGap: 10, //每个图例之间的距离
          // left: 'center',
          // top: '15%',
          // bottom: '3%',
          padding: [0, 0],
          ...position, //图例位置
          textStyle: {
            color: '#333',
            // color: function (params) {
            //   let dataIndex = null
            //   data.forEach((e, index) => {
            //     if (params.indexOf(e.value) != -1) {
            //       dataIndex = index
            //     }
            //   })
            //   return colors[dataIndex].c2
            // },
            fontSize: 12,
          },
          data: legendList,
          formatter(name) {
            var val
            var TGI
            var relVal = name
            for (var i = 0; i < data.length; i++) {
              if (data[i].name == name) {
                val = data[i].value
                TGI = data[i].TGI
              }
            }
            if (!labelShow) {
              if (TGI !== undefined) {
                relVal += '  |' + val + '%' + '   TGI：' + TGI
              } else {
                relVal += '  |' + val + '%'
              }
            }
            if (that.multiple) {
              relVal += '：' + val + '%'
            }
            return relVal
          },
        },
        grid: {
          // top: data.length > 2 ? '3%' : '5%',
          // bottom: data.length > 2 ? '60%' : '72%',
          top: data.length > 2 ? '10%' : '10%',
          bottom: data.length > 2 ? '56%' : '68%',
          left: '50%',
          containLabel: false,
        },
        yAxis: [
          {
            show: true,
            type: 'category',
            //刻度线
            axisLine: {
              show: false,
            },
            //轴刻度
            axisTick: {
              show: false,
            },
            //刻度标签
            axisLabel: {
              interval: 0,
              inside: true,
              textStyle: {
                color: function (params) {
                  let dataIndex = null
                  data.forEach((e, index) => {
                    if (params.indexOf(e.value) != -1) {
                      dataIndex = index
                    }
                  })
                  return colors[dataIndex].c2
                },
                fontSize: 12,
              },
              show: false,
            },
            data: this.multiple ? optionData.yAxis : [],
          },
        ],
        xAxis: [
          {
            show: false,
          },
        ],
        // color: ['#AECBFF', '#9E5EFF', '#F0BD66', '#EA6B67'], // 自定义颜色
        series: this.multiple ? optionData.series : series1,
      }
      //防止多次点击
      that.myChart.off('click')
      //判断点击是否处于图形范围
      that.myChart.getZr().on('click', function (param) {
        //点击图形时出发高亮
        if (param.target) {
          that.myChart.on('click', pieClick)
        } else {
          //点击画布空白处取消高亮
          that.myChart.dispatchAction({
            type: 'downplay',
            dataIndex: chooseIndex,
          })
        }
      })
      //点击高亮
      function pieClick(param) {
        // console.log(
        //   // option.series[param.seriesIndex].data[param.dataIndex].value,
        //   param,
        //   'pie点击事件',
        // )
        //激活点击区域高亮
        that.myChart.dispatchAction({
          type: 'highlight',
          dataIndex: param.dataIndex,
        })
        if (param.dataIndex !== chooseIndex) {
          // 当鼠标点击的时候 消除上一个扇区的高亮
          that.myChart.dispatchAction({
            type: 'downplay',
            dataIndex: chooseIndex,
          })
        }
        chooseIndex = param.dataIndex //记录当前扇区的dataIndex
        that.$emit('click', param.data)
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

<style lang="scss" scoped></style>
