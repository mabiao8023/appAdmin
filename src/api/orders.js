import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
  return request({
    url: '/admin/order',
    method: 'get',
    params: query
  })
}

