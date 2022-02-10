/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, //一直显示根路由
  name: 'admin',
  meta: {
    title: '管理员管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/admin/admin/list'),
      name: 'index',
      meta: { title: '管理员列表', noCache: true }
    }
  ]
}

export default adminRouter;
