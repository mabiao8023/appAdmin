// 分析师申请
import request from '@/utils/request'
import Qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/admin/analyst',
    method: 'get',
    params: query
  })
}
