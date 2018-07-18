import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
  return request({
    url: '/admin/notice',
    method: 'get',
    params: query
  })
}

export function fetchNotice() {
  return request({
    url: '/admin/notice/get',
    method: 'get'
  })
}

export function createNotice(data) {
  return request({
    url: '/admin/notice',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function updateNotice(data) {
  return request({
    url: '/admin/notice/update',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function deleteNotice(data) {
  return request({
    url: '/admin/notice/delete',
    method: 'post',
    data: Qs.stringify(data)
  })
}

