import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import Qs from 'qs'

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000, // request timeout
    // #这时候我们通过Qs.stringify转换为表单查询参数
    // transformRequest: [function (data,headers) {
    //     console.log(  headers )
    //
    //     data = Qs.stringify(data);
    //     return data;
    // }],
    // #设置Content-Type
    // headers:{'Content-Type':'application/x-www-form-urlencoded'}
})

// request interceptor
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (store.getters.token) {
        config.headers['Authorization'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => {
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
        const res = response.data
        if (res.code !== 1) {
            Message({
                message: res.msg,
                type: 'error',
                duration: 2 * 1000
            })
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error)// for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    })

export default service
