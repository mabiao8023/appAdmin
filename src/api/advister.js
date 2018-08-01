import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
    return request({
        url: '/admin/adventure',
        method: 'get',
        params: query
    })
}

export function fetchAdvister() {
    return request({
        url: '/admin/adventure/get',
        method: 'get'
    })
}

export function createAdvister(data) {
    return request({
        url: 'admin/adventure',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function updateAdvister(data) {
    return request({
        url: '/admin/adventure/update',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function deleteAdvister(data) {
    return request({
        url: '/admin/adventure/delete',
        method: 'post',
        data: Qs.stringify(data)
    })
}

