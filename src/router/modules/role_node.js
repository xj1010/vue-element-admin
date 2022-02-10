/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const roleNodeRouter = {
  path: '/role_node',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, //一直显示根路由
  name: 'role_node',
  meta: {
    title: '角色节点管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/admin/role_node/list'),
      name: 'index',
      meta: { title: '角色节点列表', noCache: true }
    },
    {
      path: 'user',
      component: () => import('@/views/admin/role_user/list'),
      name: 'index',
      meta: { title: '角色用户列表', noCache: true }
    },
  ]
}

export default roleNodeRouter;
