import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
    return request({
        url: '/admin/level',
        method: 'get',
        params: query
    })
}

export function updateLevel(data) {
    return request({
        url: '/admin/level/update',
        method: 'post',
        data: Qs.stringify(data)
    })
}


