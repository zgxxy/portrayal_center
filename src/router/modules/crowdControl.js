import Layout from '@/layout'

export default {
  path: '/crowdControl',
  component: Layout,
  name: 'crowdControl',
  meta: {
    title: '人群管理',
    icon: 'icon-renqun'
  },
  children: [
    {
      path: '',
      component: () => import('@/views/crowdControl/crowdList'),
      name: 'crowdList',
      meta: {
        title: '人群管理列表'
      }
    },
    {
      path: 'test',
      component: () => import('@/views/crowdControl/test'),
      name: 'test',
      meta: {
        title: '组件测试页'
      }
    },
    {
      path: 'customUpload',
      component: () => import('@/views/crowdControl/customUpload'),
      name: 'customUpload',
      meta: {
        title: '自定义人群上传'
      }
    },
    {
      path: 'district',
      component: () => import('@/views/crowdControl/district'),
      name: 'district',
      meta: {
        title: '区域圈人'
      },
      // hidden:true
    },
    {
      path: 'appAssembly',
      component: () => import('@/views/crowdControl/appAssembly'),
      name: 'appAssembly',
      meta: {
        title: 'APP组合圈人'
      },
    },
    {
      path: 'tag',
      component: () => import('@/views/crowdControl/tag'),
      name: 'tag',
      meta: {
        title: '标签圈人'
      },
    },
    {
      path: 'site',
      component: () => import('@/views/crowdControl/site'),
      name: 'site',
      meta: {
        title: '到访场所圈人'
      },
    },
    {
      path: 'group',
      component: () => import('@/views/crowdControl/group'),
      name: 'group',
      meta: {
        title: '组合规则圈人'
      },
    },
  ]
}
