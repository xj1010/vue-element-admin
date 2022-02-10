/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const nodeRouter = {
  path: '/menu',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, //一直显示根路由
  name: 'admin',
  meta: {
    title: '节点管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/admin/node/list'),
      name: 'index',
      meta: { title: '节点列表', noCache: true }
    }
  ]
}

export default nodeRouter;
