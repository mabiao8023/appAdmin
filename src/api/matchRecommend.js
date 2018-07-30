import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
  return request({
    url: '/admin/recommend/odd',
    method: 'get',
    params: query
  })
}

export function fetchReList(query) {
  return request({
    url: '/admin/recommend/list',
    method: 'get',
    params: query
  })
}
