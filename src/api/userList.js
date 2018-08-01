import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
    return request({
        url: '/admin/user',
        method: 'get',
        params: query
    })
}
