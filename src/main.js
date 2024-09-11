import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
function RepairProps(cmp) {
  (cmp.mixins || []).forEach(mixin => {
  if (mixin.props && mixin.props.placement) {
  const defaultValue = mixin.props.placement.default
  mixin.data = new Proxy(mixin.data, {
  apply(target, thisArg, argArray) {
  const res = Reflect.apply(target, thisArg, argArray)
  return {
  ...(res || {}),
  placement: defaultValue
  }
  }
  })
  delete mixin.props.placement
  }
  if (mixin.mixins && mixin.mixins.length > 0) {
  RepairProps(mixin)
  }
  })
  }
  
  RepairProps(ElementUI.DatePicker)
  RepairProps(ElementUI.TimePicker)
  RepairProps(ElementUI.TimeSelect)
  
  Vue.use(ElementUI, {
  size: 'medium'
  }) 

// Vue.use(ElementUI)

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import './assets/css/base.css'
// import 'default-passive-events'

//正式环境注释掉
// process.env.NODE_ENV === 'development'  &&  require( './mock/index' )
import './mock/index'

//引入全局方法
import utils from '@/utils/public'
Vue.prototype.$utils = utils

//引入echart
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
//引入高德地图
// import VueAMap from 'vue-amap'
// Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
//   key: 'f87f5ba14740dc79bedcecc6a874e4a5',
//   plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
//   v: '2.0',
//   uiVersion: '1.1'
// })

//引入百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'g36OYKooC96hL3YtOIwNUsvB62jjZwTx'
})

const messages = ['success', 'warning', 'info', 'error']
messages.forEach(type => {
  ElementUI.Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
      // 默认配置
      options.duration = 2000
      // options.showClose = true
    }
    options.type = type
    return ElementUI.Message(options)
  }
})

// 一键置顶组件
import toTopIcon from './components/goTop/goTop'
Vue.use(toTopIcon)

//注册全局组件
import Components from './components'
Vue.use(Components)

// 如果想要中文版 element-ui，按如下方式声明
ElementUI.Dialog.props.lockScroll.default = false // 打开弹窗防止页面抖动
ElementUI.Dialog.props.closeOnClickModal.default = false // 打开弹窗防止误关

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.co

//Tooltip全局过滤器--文本超出设置的宽度添加Tooltip
Vue.filter('showTooltip', (msg, width) => {
  let app = document.querySelector('#app')
  // 这里需要用span，div默认是父盒子的宽度
  let span = document.createElement('span')
  span.innerHTML = msg
  // 必须要添加到DOM树里面才有宽度
  app.appendChild(span)
  let isShow = span.offsetWidth > width
  // 销毁
  app.removeChild(span)
  return !isShow
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


