import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login/index',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}



export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function generateRoutes() {
  return request({
    url: '/admin/node',
    method: 'get',
  })
}
