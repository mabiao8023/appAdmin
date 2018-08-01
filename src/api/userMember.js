import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
    return request({
        url: '/admin/user_level',
        method: 'get',
        params: query
    })
}

export function updateUserMember(data) {
    return request({
        url: '/admin/user_level/update',
        method: 'post',
        data: Qs.stringify(data)
    })
}


