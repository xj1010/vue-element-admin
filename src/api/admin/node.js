import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/node/list',
    method: 'get',
    params: query
  })
}

export function createMenu(data) {
  return request({
    url: '/node/create',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/node/update',
    method: 'post',
    data
  })
}

export function deleteMenu(id,level) {
  return request({
    url: '/node/delete',
    method: 'get',
    params:{id:id,level:level}
  })
}
