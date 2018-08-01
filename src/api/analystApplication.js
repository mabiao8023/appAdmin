// 分析师申请
import request from '@/utils/request'
import Qs from 'qs'

export function fetchList(query) {
    return request({
        url: '/admin/application',
        method: 'get',
        params: query
    })
}

export function fetchApplication() {
    return request({
        url: '/admin/application/get',
        method: 'get'
    })
}

export function passApplication(data) {
    return request({
        url: '/admin/application/pass',
        method: 'post',
        data: Qs.stringify(data)
    })
}

export function refuseApplication(data) {
    return request({
        url: '/admin/application/refuse',
        method: 'post',
        data: Qs.stringify(data)
    })
}
