import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/role_node/list',
    method: 'get',
    params: query
  })
}

export function createInfo(data) {
  return request({
    url: '/role_node/create',
    method: 'post',
    data : data
  })
}
