import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
    return request({
        url: '/admin/analyst_level',
        method: 'get',
        params: query
    })
}

export function updateAnalystMember(data) {
    return request({
        url: '/admin/analyst_level/update',
        method: 'post',
        data: Qs.stringify(data)
    })
}
