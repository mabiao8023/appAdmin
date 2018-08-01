import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
    return request({
        url: '/admin/banner',
        method: 'get',
        params: query
    })
}

export function fetchBanner() {
    return request({
        url: '/admin/adventure/get',
        method: 'get'
    })
}

export function createBanner(data) {
    return request({
        url: '/admin/banner',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function updateBanner(data) {
    return request({
        url: '/admin/banner/update',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function deleteBanner(data) {
    return request({
        url: '/admin/banner/delete',
        method: 'post',
        data: Qs.stringify(data)
    })
}

