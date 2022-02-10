import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function updateInfo(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data: data
  })
}

export function createInfo(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data : data
  })
}
