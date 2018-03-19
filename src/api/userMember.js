import request from '@/utils/request'

export function getUserMemberList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

// export function fetchArticle() {
//   return request({
//     url: '/article/detail',
//     method: 'get'
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/article/create',
//     method: 'post',
//     data
//   })
// }

export function updateUserMember(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}