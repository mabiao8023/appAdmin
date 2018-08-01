// 分析师申请
import request from '@/utils/request'
import Qs from 'qs'

export function fetchList(query) {
    return request({
        url: '/admin/analyst',
        method: 'get',
        params: query
    })
}
export function creatAnalysts(data) {
    return request({
        url: '/admin/analyst',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function editAnalysts(data) {
    return request({
        url: '/admin/analyst/update',
        method: 'post',
        data: Qs.stringify(data)
    })
}

