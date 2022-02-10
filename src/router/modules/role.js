/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const roleRouter = {
  path: '/role',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, //一直显示根路由
  name: 'role',
  meta: {
    title: '角色管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/admin/role/list'),
      name: 'index',
      meta: { title: '角色列表', noCache: true }
    }
  ]
}

export default roleRouter;
