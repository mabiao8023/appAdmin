import request from '@/utils/request'
import Qs from 'qs'

export function fetchList(query) {
    return request({
        url: '/admin/match',
        method: 'get',
        params: query
    })
}

export function updateReStatus(data) {
    return request({
        url: '/admin/match/recommend',
        method: 'post',
        data: Qs.stringify(data)
    })
}
