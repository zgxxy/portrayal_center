import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import service from './modules/service'
// import customer from './modules/customer'
import loading from './modules/loading'
import persistedState from 'vuex-persistedstate'
import scrollTop from './modules/scrollTop'
// import tag from './modules/tag'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    service,
    // customer,
    loading,
    scrollTop,
    // tag
  },
  getters,
  plugins: [persistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        supplier: val.supplier,
        customer: val.customer,
        tag: val.tag
      }
    }
  })]
})

export default store
