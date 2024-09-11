import Layout from '@/layout'

export default {
  path: '/sceneApplication',
  component: Layout,
  name: 'sceneApplication',
  alwaysShow: true,//解决只有一个菜单时父级菜单不显示问题
  meta: {
    title: '场景应用',
    icon: 'icon-yingyongguanli'
  },
  children: [
    {
      path: '',
      component: () => import('@/views/sceneApplication/analysisReport'),
      name: 'analysisReport',
      meta: {
        title: '项目分析报告'
      }
    },
    {
      path: 'eventSite',
      component: () => import('@/views/sceneApplication/eventSite'),
      name: 'eventSite',
      meta: {
        title: '活动选址'
      }
    },
    {
      path: 'addressInfoReport',
      component: () => import('@/views/portrayal/addressInfoReport'),
      name: 'addressInfoReport',
      meta: {
        title: '地址信息报告'
      },
      hidden:true
    },
    {
      path: 'shoppingAnalysis',
      component: () => import('@/views/sceneApplication/shoppingAnalysis'),
      name: 'shoppingAnalysis',
      meta: {
        title: '商场分析'
      }
    },
    {
      path: 'shopContrastPortrayal',
      component: () => import('@/views/portrayal/shopContrastPortrayal'),
      name: 'shopContrastPortrayal',
      meta: {
        title: '商场对比分析'
      },
      hidden:true
    },
    {
      path: 'houseAnalysis',
      component: () => import('@/views/sceneApplication/houseAnalysis'),
      name: 'houseAnalysis',
      meta: {
        title: '住宅分析'
      }
    },
    {
      path: 'marketDetail',
      component: () => import('@/views/sceneApplication/marketDetail'),
      name: 'marketDetail',
      meta: {
        title: '商场详情'
      },
      hidden:true
    },
    {
      path: 'storeSite',
      component: () => import('@/views/sceneApplication/storeSite'),
      name: 'storeSite',
      meta: {
        title: '门店选址'
      },
      // hidden:true
    },
    {
      path: 'storeInfoReport',
      component: () => import('@/views/portrayal/storeInfoReport'),
      name: 'storeInfoReport',
      meta: {
        title: '门店选址信息'
      },
      // hidden:true
    },
  ]
}
