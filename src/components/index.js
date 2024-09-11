// 引入
import osTable from './table/osTable.vue'
import headlineBox from './whole/headlineBox.vue'
import bottomFixed from './whole/bottomFixed'
export default {
  install(Vue) {
    //全局表格组件
    Vue.component('osTable', osTable)
    //全局标题盒子
    Vue.component('headline', headlineBox)
    // 底部抽屉弹窗
    Vue.component('bottomFixed', bottomFixed)
  }
}