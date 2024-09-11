import Layout from '@/layout'

export default {
  path: '/crowdInsight',
  component: Layout,
  name: 'crowdInsight',
  meta: {
    title: '人群洞察',
    icon: 'icon-chakanbaogao'
  },
  children: [
    {
      path: '',
      component: () => import('@/views/crowdInsight/portraitReport'),
      name: 'portraitReport',
      meta: {
        title: '我的画像报告'
      }
    },
    {
      path: 'customInsight',
      component: () => import('@/views/crowdInsight/customInsight'),
      name: 'customInsight',
      meta: {
        title: '自定义人群洞察'
      }
    },
    {
      path: 'portrayal',
      component: () => import('@/views/portrayal/portrayal'),
      name: 'portrayal',
      meta: {
        title: '人群画像'
      },
      hidden:true
    },
    {
      path: 'vehicleType',
      component: () => import('@/views/portrayal/vehicleType'),
      name: 'vehicleType',
      meta: {
        title: '车型画像'
      },
      hidden:true
    },
    {
      path: 'contrastPortrayal',
      component: () => import('@/views/portrayal/contrastPortrayal'),
      name: 'contrastPortrayal',
      meta: {
        title: '客群对比画像'
      },
      hidden:true
    },
    {
      path: 'carInsight',
      component: () => import('@/views/crowdInsight/carInsight'),
      name: 'carInsight',
      meta: {
        title: '车型客群洞察'
      },
    },
    {
      path: 'crowdHeat',
      component: () => import('@/views/crowdInsight/crowdHeat'),
      name: 'crowdHeat',
      meta: {
        title: '人群热力分布'
      }
    },
    {
      path: 'contrastAnalysis',
      component: () => import('@/views/crowdInsight/contrastAnalysis'),
      name: 'contrastAnalysis',
      meta: {
        title: '多客群对比分析'
      },
    },
  ]
}
