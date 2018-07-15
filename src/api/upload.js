import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/adventure',
    method: 'get',
    params: query
  })
}

export function fetchAdvister() {
  return request({
    url: '/admin/adventure/1',
    method: 'get'
  })
}

export function createAdvister(data) {
  return request({
    url: 'admin/adventure',
    method: 'post',
    data
  })
}

export function updateAdvister(data) {
  return request({
    url: '/admin/upload_image',
    method: 'post',
    data
  })
}

export function deleteAdvister(data) {
  return request({
    url: '/admin/adventure/delete/1',
    method: 'post',
    data
  })
}

