import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/hot/list',
    method: 'get',
    params: query
  })
}

