// 分析师申请
import request from '@/utils/request'
import Qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/admin/video',
    method: 'get',
    params: query
  })
}

export function fetchVideo() {
  return request({
    url: '/admin/video/get',
    method: 'get'
  })
}

export function createVideo(data) {
  return request({
    url: '/admin/video',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function updateVideo(data) {
  return request({
    url: '/admin/video/update',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function deleteVideo(data) {
  return request({
    url: '/admin/video/delete',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function getVideoCate(query) {
  return request({
    url: '/admin/video_cate',
    method: 'get',
    params: query
  })
}

export function addVideoCate(data) {
  return request({
    url: '/admin/video_cate',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function updateVideoCate(data) {
  return request({
    url: '/admin/video_cate/update',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function deleteVideoCate(data) {
  return request({
    url: '/admin/video_cate/delete',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function getCateVideo(query) {
  return request({
    url: '/admin/video_cate/video',
    method: 'get',
    params: query
  })
}

export function addCateVideo(data) {
  return request({
    url: '/admin/video_cate',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function updateCateVideo(data) {
  return request({
    url: '/admin/video_cate/update',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function deleteCateVideo(data) {
  return request({
    url: '/admin/video_cate/delete',
    method: 'post',
    data: Qs.stringify(data)
  })
}

