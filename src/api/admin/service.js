import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/service/list',
    method: 'get',
    params: query
  })
}

export function update(query) {
  return request({
    url: '/service/update',
    method: 'get',
    params: query
  })
}
