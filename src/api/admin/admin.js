import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: query
  })
}

export function updateInfo(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data: data
  })
}

export function createInfo(data) {
  return request({
    url: '/admin/create',
    method: 'post',
    data : data
  })
}
