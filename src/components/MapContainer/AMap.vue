<!-- 高德地图 -->
<template>
  <div>
    <div
      class="container"
      :style="{ height: myheight, width: mywidth }"
      :id="mapId"
    >
      <div v-if="isFullScreen">
        <img
          @click="enlarge"
          class="iconBox"
          :src="
            fullScreen
              ? require('@/assets/images/slices/amplifier_0.svg')
              : require('@/assets/images/slices/amplifier_1.svg')
          "
          :title="fullScreen ? '点击还原' : '点击全屏'"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import remoteLoad from '@/utils/remoteLoad.js'
import { thousandFormat } from '@/utils/public'
// import capitals from './capitals.json'
import poiData from '/public/testData/poiData.json'
// import heatmapData from './heatmapData.json'
// window._AMapSecurityConfig = {
//   securityJsCode: 'e8b2d57e693b50576072e537e169b8a2', //安全密钥
// }
export default {
  props: {
    //地图风格--默认标准normal
    mapStyle: {
      type: String,
      default: 'normal',
    },
    //地图等级
    zoom: {
      type: Number,
      default: 5,
    },
    //热力数据
    heatmapData: {
      type: Array,
      default: () => [],
    },
    //关键字查询传入的关键字
    value: {
      type: String,
      default: '',
    },
    //是否显示全屏按钮
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    //矢量圆半径
    radius: {
      type: Number,
      default: 150,
    },
    //容器id，避免一个页面多次引入不生效问题，页面单次引入可不传
    mapId: {
      type: String,
      default: 'container',
    },
    //地图高度
    height: {
      type: String,
      default: '555px',
    },
    //地图宽度
    width: {
      type: String,
      default: '100%',
    },
  },
  watch: {
    heatmapData: {
      deep: true,
      handler(newVal) {
        this.heatmapData = newVal
        // this.initMap()
        this.addHeat()
      },
    },
    value: {
      deep: true,
      handler(newVal) {
        this.value = newVal
        this.searchAddress()
      },
    },
  },
  data() {
    return {
      //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
      map: null,
      fullScreen: false,
      lnglat: [],
      positionVal: '',
      pointList: [
        {
          address: '郑州市收到货爽肤水1',
          local: [113.651398, 34.767445],
        },
        {
          address: '郑州市收到货爽肤水2',
          local: [113.851398, 34.767445],
        },
        {
          address: '郑州市收到货爽肤水3',
          local: [113.751398, 34.667445],
        },
        {
          address: '郑州市收到货爽肤水4',
          local: [113.641398, 34.747445],
        },
      ],
      searchValue: '',
      pois: [],
      mapZoom: this.zoom,
      infoWindow: null,
      heatMao: null, //热力图实例
      polygons: [],
      myheight: this.height,
      mywidth: this.width,
    }
  },
  mounted() {
    // 延迟加载，防止出现AMap not defined
    // setTimeout(() => {
    //   this.initMap()
    // }, 1000)
    //解决刷新后地图空白问题
    if (window.AMap && window.AMapUI) {
      this.initMap()
      this.addHeat()
      // 未载入高德地图API，则先载入API再初始化
    } else {
      // 载入高德地图和UI组件
      // eslint-disable-next-line no-undef
      Promise.all([
        remoteLoad(
          `http://webapi.amap.com/maps?v=2.0&key=[f87f5ba14740dc79bedcecc6a874e4a5]`,
        ),
        remoteLoad('http://webapi.amap.com/ui/1.1/main.js'),
      ]).then(() => {
        this.initMap()
        this.addHeat()
      })
    }

    //监听是否为全屏状态，改变按钮状态
    window.onresize = () => {
      if (!this.checkFull()) {
        this.fullScreen = false
      }
    }
  },
  destroyed() {
    if (!!this.map) {
      this.map.destroy()
    }
  },
  methods: {
    initMap() {
      const that = this
      const map = new AMap.Map(this.mapId, {
        //设置地图容器id
        resizeEnable: true, //是否监控地图容器尺寸变化，默认值为false
        viewMode: '2D', //是否为3D地图模式
        zoom: this.mapZoom, //初始化地图级别
        zooms: [4, 18], //设置地图缩放范围
        center: [105.602725, 37.076636], //初始化地图中心点位置
        mapStyle: `amap://styles/${this.mapStyle}`,
        WebGLParams: {
          preserveDrawingBuffer: true,
        }, //解决html2canvas截图空白问题
      })
      if (!this.isSupportCanvas()) {
        return this.$msg.error(
          '热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试。',
        )
      }
      this.map = map
      map.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
        map.addControl(new AMap.ToolBar()) //等级大小控制按钮
        map.addControl(new AMap.Scale()) //尺子
      })

      //设置光标样式--crosshair 十字光标 pointer--手指 move--方向标
      map.setDefaultCursor('move')
      // 鼠标点击获取经纬度
      this.map.on('click', function (e) {
        this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()]
        console.log('经纬度', this.lnglat)
        //   console.log('经度', e.lnglat.getLng())
        //   console.log('纬度', e.lnglat.getLat())
      })
      //回去缩放等级
      map.on('zoomend', function (e) {
        this.mapZoom = map.getZoom()
        console.log(this.mapZoom, '当前地图等级')
      })
    },
    //判断浏览区是否支持canvas
    isSupportCanvas() {
      let elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
    },
    //全屏显示
    enlarge() {
      let element = document.getElementById(this.mapId) //需要全屏容器的id
      // 浏览器兼容
      if (this.fullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }
      this.fullScreen = !this.fullScreen
    },
    //判断是否为全屏
    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      var isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    //热力图
    addHeat() {
      console.log(this.heatmapData, '热力图')
      //热力图
      const that = this
      // that.heatmapData = heatmapData
      that.map.plugin(['AMap.HeatMap'], function () {
        that.heatMao = new AMap.HeatMap(that.map, {
          visible: false,
          radius: 10, // 每个点的覆盖范围半径，单位是像素
          opacity: [0, 0.8], //最小透明度和最大透明度，最小透明度越小，数值小的点就越不明显；最大透明度越大，数值大的点就越明显
          blur: 1, //值越大，外圈占的比例就越大；值越小，内圈占的比例就越大
          //自定义热力点颜色
          gradient: {
            // 0.5: '#ba7cd3',
            // 0.65: 'rgb(117,211,248)',
            // 0.7: 'rgb(0, 255, 0)',
            // 0.9: '#ffea00',
            // 1: 'red',

            0.3: '#ba7cd3',
            0.5: 'rgb(117,211,248)',
            0.7: '#93f8e1',
            0.95: '#ffea00',
            1: 'red',
          },
        })

        that.heatMao.setDataSet({
          data: that.heatmapData, //热力数据
          // max: 100, // 见gradient的例子
        })
      })
      //当地图放大缩小时，调整热力点的大小，保证显示效果的一致
      // this.map.on('zoomchange', function (e) {
      //   let newRadius
      //   let zoomLevel = that.map.getZoom() //获取当前最新的地图层级
      //   if (zoomLevel <= 12) {
      //     newRadius = 5
      //   } else if (zoomLevel == 13) {
      //     newRadius = 6
      //   } else if (zoomLevel == 14) {
      //     newRadius = 7
      //   } else if (zoomLevel == 15) {
      //     newRadius = 8
      //   } else if (zoomLevel == 16) {
      //     newRadius = 10
      //   } else {
      //     newRadius = 15
      //   }
      //   that.heatMao.setOptions({
      //     radius: newRadius,
      //   })
      // })
    },
    //搜索完自动打点
    searchPoint(img) {
      this.searchValue = this.value
      if (this.searchValue != '') {
        this.map.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
          let placeSearch = new AMap.PlaceSearch()
          let that = this
          placeSearch.search(this.searchValue, function (status, result) {
            // 查询成功时，result即对应匹配的POI信息
            console.log(result, '搜索返回值')
            that.pois = result?.poiList?.pois || []
            for (var i = 0; i < that.pois.length; i++) {
              var poi = that.pois[i]
              var marker = []
              marker[i] = new AMap.Marker({
                map: that.map,
                position: poi.location, // 经纬度对象，或者经纬度数组[116.39, 39.9]
                title: poi.name,
                offset: new AMap.Pixel(0, 0),
                icon: img || '',
                anchor: 'bottom-center',
              })
              // 将创建的点标记添加到已有的地图实例：
              that.map.add(marker[i])
            }
            that.map.setFitView()
          })
        })
      }
    },
    //关键字搜索--外部搜索框（搜索后不打点，保存搜索到的poi数据）
    searchAddress() {
      this.searchValue = this.value
      if (this.searchValue != '') {
        var autoOptions = {
          input: 'searchValue',
        }
        this.map.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
          let placeSearch = new AMap.PlaceSearch({
            // map: this.map,//查询后自动打点
          })
          let that = this
          // var auto = new AMap.AutoComplete(autoOptions)
          // auto.on('select', select) //注册监听，当选中某条记录时会触发
          // function select(e) {
          //   placeSearch.setCity(e.poi.adcode)
          //   placeSearch.search(e.poi.name) //关键字查询查询
          // }
          placeSearch.search(this.searchValue, function (status, result) {
            // 查询成功时，result即对应匹配的POI信息
            console.log(result, '搜索返回值')
            that.pois = result?.poiList?.pois || []
          })
        })
      }
      // this.pois = this.poi
      this.$emit('searchPoi', this.pois)
    },
    //地图标点--包括点和矢量圆
    pointMarker(pois, radius) {
      //清除地图上的覆盖物
      this.map.clearMap()
      for (var i = 0; i < pois.length; i++) {
        var poi = pois[i]
        var marker = [] //标点
        var circle = [] //矢量圆
        marker[i] = new AMap.Marker({
          map: this.map,
          position: poi.location, // 经纬度对象，或者经纬度数组[116.39, 39.9]
          title: poi.name,
          offset: new AMap.Pixel(0, 0),
          anchor: 'bottom-center',
        })
        circle[i] = new AMap.Circle({
          center: poi.location, // 圆心位置
          radius: radius || this.radius, //半径
          strokeColor: '#59a4ef', //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 2, //线粗细度
          fillColor: '#4b9def', //填充颜色
          fillOpacity: 0.35, //填充透明度
        })
        // 将创建的点标记添加到已有的地图实例：
        // this.map.add(marker[i])
        this.map.add([marker[i], circle[i]])
      }
      this.map.setFitView()
    },
    //行政区搜索
    regionSearch(region) {
      //region:行政区码或行政区名
      const that = this
      that.map.plugin(['AMap.DistrictSearch'], function () {
        var district = null
        if (!district) {
          //实例化DistrictSearch
          var opts = {
            subdistrict: 0, //获取边界不需要返回下级行政区
            extensions: 'all', //返回行政区边界坐标组等具体信息
            level: 'district', //查询行政级别为 市
          }
          district = new AMap.DistrictSearch(opts)
        }
        //行政区查询
        // district.setLevel('district')
        if (region) {
          district.search(region, function (status, result) {
            that.map.remove(that.polygons) //清除上次结果
            that.polygons = []
            var bounds = result.districtList[0].boundaries
            if (bounds) {
              for (var i = 0, l = bounds.length; i < l; i++) {
                //生成行政区划polygon
                var polygon = new AMap.Polygon({
                  strokeWeight: 1,
                  path: bounds[i],
                  fillOpacity: 0.5,
                  fillColor: '#e3efff',
                  strokeColor: '#a3c4f1',
                })
                that.polygons.push(polygon)
              }
            }
            that.map.add(that.polygons)
            that.map.setFitView(that.polygons) //视口自适应
          })
        }
      })
    },
    //自定义带参打点
    //poi:点位数组数据、url:自定义图标url、color:点颜色、content:是否info弹窗 circleData:矢量圆数据，包括圆心标点
    //isCircle:是否每个点添加矢量圆  zoom:控制地图缩放等级
    addMarker({
      poi,
      url,
      color = 'blue',
      content,
      circleData,
      isCircle,
      zoom,
    }) {
      let that = this
      this.map.clearMap()
      //外层大圆，只有一个不加入循环
      if (circleData) {
        var centerCircle = new AMap.Circle({
          center: circleData.circleLocation, // 圆心位置
          radius: circleData.circleRadius || 0, //半径
          strokeColor: '#59a4ef', //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 2, //线粗细度
          fillColor: '#4b9def', //填充颜色
          fillOpacity: 0.35, //填充透明度
        })
        var MarkrtPoint = new AMap.Marker({
          // map: this.map,
          position: circleData.circleLocation, // 经纬度对象，或者经纬度数组[116.39, 39.9]
          offset: new AMap.Pixel(0, 0),
          icon: require('@/assets/images/slices/map0_green.png'),
          anchor: 'bottom-center',
          extData: { id: 'p' + i },
        })
        MarkrtPoint.setLabel({
          direction: 'right',
          offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
          content:
            '<div style="color:#67C23A;cursor: pointer;">' +
            circleData.name +
            ' </div>',
        })
      }
      for (var i = 0; i < poi.length; i++) {
        //点实例
        var marker = new AMap.Marker({
          // map: this.map,
          position: poi[i].location, // 经纬度对象，或者经纬度数组[116.39, 39.9]
          // title: poi[i].name,//地址信息框
          offset: new AMap.Pixel(0, 0),
          icon: new AMap.Icon({
            image: poi[i].url
              ? poi[i].url
              : url
              ? url
              : require('@/assets/images/slices/map0_blue.png'),
            // size: new AMap.Size(52, 52), //图标大小
            // imageSize: new AMap.Size(26, 26),
            imageSize: poi[i].imageSize
              ? new AMap.Size(poi[i].imageSize[0], poi[i].imageSize[1])
              : new AMap.Size(26, 26),
          }),
          anchor: 'bottom-center',
          extData: { id: i },
        })
        var circle = new AMap.Circle({
          center: poi[i].location, // 圆心位置
          radius: 3000, //半径
          strokeColor: '#59a4ef', //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 2, //线粗细度
          fillColor: '#4b9def', //填充颜色
          fillOpacity: 0.35, //填充透明度
        })
        //判断当前标点颜色--文字颜色
        let blueContent =
          '<div id="point" style="color:#418BFF;cursor: pointer;">' +
          poi[i].name +
          ' </div>'
        let redContent =
          '<div style="color:#dd6572;cursor: pointer;">' +
          poi[i].name +
          ' </div>'
        let orgContent =
          '<div style="color:#ea986c;cursor: pointer;">' +
          poi[i].name +
          ' </div>'
        //label文字标注
        marker.setLabel({
          direction: 'right',
          offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
          content:
            poi[i].color == 'org' || color == 'org'
              ? orgContent
              : poi[i].color == 'red' || color == 'red'
              ? redContent
              : blueContent, //文本内容
        })
        //info弹窗
        if (content) {
          // 信息窗体内容及点击事件
          marker.content = `
            <div style="width:160px;font-weight:900;margin-bottom:10px;display:flex;">
              <div style="width:100px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                ${poi[i].name}
              </div>
              <button id="detailBtn" style="border:none;color:#418BFF;background-color:#fff;margin-left:5px;cursor: pointer;">商场详情</button>
            </div>
            <div style="color:#999999;margin-bottom:5px;">
              开业时间：${poi[i].date ? poi[i].date : '--'}
            </div>
            <div style="color:#999999;margin-bottom:5px;">
              商铺数量：${poi[i].shopNum ? poi[i].shopNum : 0}家
            </div>
            <div style="color:#999999;margin-bottom:5px;">
              商铺面积：${poi[i].area ? poi[i].area : 0}万㎡
            </div>
            <div style="color:#999999;">
              日均客流：${
                poi[i].dayPassingFlow
                  ? thousandFormat(poi[i].dayPassingFlow)
                  : 0
              }人次
            </div>
          `
          //鼠标滑过事件
          marker.on('mouseover', (e) => {
            this.markerClick(e)
          })
          //鼠标移出事件
          // marker.on('mouseout', this.closeInfo)
        }
        //创建自定义参数
        marker.data = poi[i]
        //点击事件传参
        marker.on('click', function (e) {
          let data = {
            detailShow: !e.target.data.packUpDisabled,
            data: e.target.data,
          }
          that.$emit('click', data)
        })
        //在地图上添加
        //isCircle是全部点加上，poi[i].isCircle是各点分别设置
        if (poi[i].isCircle || isCircle) {
          this.map.add([marker, circle])
        }
        {
          this.map.add(marker)
        }
        this.map.setFitView() //窗口自适应
      }
      //放在marker的循环外面，否则两个marker冲突
      if (circleData) {
        this.map.add([centerCircle, MarkrtPoint])
        this.map.setFitView() //窗口自适应
        //控制地图缩放等级
        if (zoom) {
          this.map.setZoom(this.map.getZoom() + zoom)
        }
      }
    },
    //点标记info弹窗
    markerClick(e) {
      var infoWindow = new AMap.InfoWindow({
        // anchor: 'top-center',
        autoMove: true,
        // isCustom: true,//启用自定义弹窗
        offset: new AMap.Pixel(0, -30),
      })
      infoWindow.setContent(e.target.content)
      infoWindow.open(this.map, e.target.getPosition())
      setTimeout(() => {
        this.bindWindowClick(e)
      }, 500)
    },
    bindWindowClick(e) {
      const that = this
      /**********************infoWindow的点击事件***********************/
      //因为只有点击了Marker之后才会生成infoWindow,所以才进行绑定
      document.getElementById('detailBtn').onclick = function () {
        console.log(e, '点击事件')
        if (e.target.data.packUpDisabled) {
          that.$message.warning('暂无数据！')
          return
        } else {
          // that.$router.push({
          //   path: '/sceneApplication/marketDetail',
          //   query: e.target.data,
          // })
          //打开新页签
          let { href } = that.$router.resolve({
            name: 'marketDetail',
            query: e.target.data,
          })
          window.open(href, '_blank')
        }
      }
    },
    //关闭info弹窗
    closeInfo() {
      this.map.clearInfoWindow()
    },
    //圆点标记--带参
    addCircle(val) {
      for (var i = 0; i < val.length; i += 1) {
        var center = val[i].center
        var circleMarker = new AMap.CircleMarker({
          center: center,
          radius: 10 + Math.random() * 10, //3D视图下，CircleMarker半径不要超过64px
          // radius: val[i].value / 15,
          strokeColor: 'white',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          // fillColor: '#4794e6',//圆点填充色-浅蓝
          fillColor: `rgb(${[
            Math.round(Math.random() * 200 + 55),
            Math.round(Math.random() * 200 + 55),
            Math.round(Math.random() * 200 + 55),
          ].join(',')})`,
          fillOpacity: 0.5,
          zIndex: 10,
          bubble: true,
          cursor: 'pointer',
          clickable: true,
        })
        if (val[i].name == undefined) {
          circleMarker.content = ''
        } else {
          //信息窗体内容及点击事件
          circleMarker.content =
            '<div style="font-weight:900;">' + val[i].value + '</div>'
        }
        //圆点标记的鼠标滑过事件
        circleMarker.on('mouseover', this.circleMarkerClick)
        circleMarker.emit('mouseover', { target: circleMarker })
        circleMarker.setMap(this.map)
      }
    },
    //圆点标记info弹窗
    circleMarkerClick(e) {
      var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -20) })
      infoWindow.setContent(e.target.content)
      infoWindow.open(this.map, e.target.getCenter())
    },
    //添加矩形标记--点形成面
    addPolygon(path) {
      path = [
        [116.403322, 39.920255],
        [116.410703, 39.897555],
        [116.402292, 39.892353],
        [116.389846, 39.891365],
      ]
      var polygon = new AMap.Polygon({
        path: path,
        strokeColor: 'rgba(255, 255, 255, 0.0)', //外边框颜色
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc', //面积颜色
        zIndex: 50,
      })
      this.map.add(polygon)
      // 缩放地图到合适的视野级别
      this.map.setFitView([polygon])
    },
  },
}
</script>
<style lang="scss" scoped>
//地图容器
.container {
  padding: 0px;
  margin: 0px;
  // width: 100%;
  // height: 555px;
}
//全屏按钮
.iconBox {
  position: relative;
  cursor: pointer;
  top: 10px;
  right: 10px;
  float: right;
  font-size: 20px;
  z-index: 999;
}
.btn {
  position: relative;
  width: 12rem;
  left: 3.6rem;
  margin: 10px 0 0 0;
}
//点标记标签样式
::v-deep .amap-marker-label {
  padding: 7px 10px 7px 30px;
  margin-left: -40px;
  text-align: center;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 0px 8px 0px rgba(39, 85, 145, 0.12);
  z-index: -1;
}
//info弹窗
::v-deep .amap-info-content {
  padding: 10px 20px;
  border-radius: 4px;
}
.dialog_gray {
  color: #999999;
  margin-bottom: 5px;
}

//删掉底部logo和文字
::v-deep .amap-logo {
  display: none;
  opacity: 0 !important;
}
::v-deep .amap-copyright {
  opacity: 0;
}
</style>
