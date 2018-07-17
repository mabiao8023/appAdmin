import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
  return request({
    url: '/admin/top_line',
    method: 'get',
    params: query
  })
}

export function fetch() {
  return request({
    url: '/admin/top_line/get',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/admin/top_line',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function update(data) {
  return request({
    url: '/admin/top_line/update',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function deleteTop(data) {
  return request({
    url: '/admin/top_line/delete',
    method: 'post',
    data: Qs.stringify(data)
  })
}

