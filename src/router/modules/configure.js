import Layout from '@/layout'

export default {
  path: '/configure',
  component: Layout,
  name: 'configure',
  meta: {
    title: '配置管理',
    icon: 'icon-shezhi',
  },
  hidden:true,
  children: [
    {
      path: '',
      component: () => import('@/views/configure/account'),
      name: 'account',
      meta: {
        title: '账号管理'
      }
    }
  ]
}
