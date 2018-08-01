import request from '@/utils/request'

export function uploadImage(data) {
    return request({
        url: '/admin/upload_image',
        method: 'post',
        data
    })
}

export function uploadVideo(data) {
    return request({
        url: '/admin/upload_video',
        method: 'post',
        data
    })
}
