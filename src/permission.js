import router from './router'
import configure from '@/router/modules/configure'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
router.beforeEach(async(to, from, next) => {
  const url = to.path
  if (url === '/login') {
    next()
    return
  }
  // 页面刷新时，重新赋值路由    
  if (!store.state.user.token&&sessionStorage.getItem('isAdmin')==1) {
    let adminRoutes = [configure]
    //重新赋值，避免陷入死循环
    store.state.user.token = sessionStorage.getItem('token')
    router.options.routes.push(...adminRoutes)
    router.addRoutes(adminRoutes)
    if (to.path) {
      next({ path: to.fullPath })
    } else {
      next()
    }
  }
  const token = sessionStorage.getItem('token')
  // const token = store.state.user.userInfo.token
    // 没有登录，去跳转登录页
  if (!token) {
    next({
      path: '/login',
    })
    return
  }else{
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
