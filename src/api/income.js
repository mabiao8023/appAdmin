import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
  return request({
    url: '/admin/income_static',
    method: 'get',
    params: query
  })
}
