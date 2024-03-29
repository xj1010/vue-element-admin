import { asyncRoutes, constantRoutes, asyncMenus } from '@/router'
import { generateRoutes } from '@/api/user'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      /*let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
     // commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)*/

      generateRoutes().then(response => {
        if (!response.data.node) {
          let accessedRoutes =  []
          resolve(accessedRoutes);
          return false;
        }

        let accessedRoutes = menuAsyncRoutes(response.data.node);
         //console.log(accessedRoutes);
        commit('SET_ROUTES', accessedRoutes);
        resolve(accessedRoutes);
      })
    });

  }
}

export function menuAsyncRoutes(routes) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    tmp.component = asyncMenus[tmp.component];
    if (tmp.children) {
      tmp.children = menuAsyncRoutes(tmp.children)
    }

    res.push(tmp)
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
