/*
 * @Author: 布莱恩·奥夫托·杰森张
 * @Desc: axios的请求头，用于添加网关需要的Token以及自定义请求头
 * @Date: 2018.08.27
 * */
import globalConfig from '../../profiles/config/index.js';
import { getCookie } from '../storage/cookie.js';
import axios from 'axios'


// 需要导出去一个方法体让他引用这个拦截器
let func = function (config) {
    if (globalConfig.setting.permission) {
        config.headers['exchange-token'] = getCookie('ex_token') || ''
        config.headers['exchange-language'] = getCookie('lan') || 'zh_CN'
        config.headers['exchange-client'] = 'h5'
    } else {
        // 这里的config包含每次请求的内容
        config.headers['exchange-token'] = 'a2adea51b6028c17583535754047bca94b0e59fd76d844c296ca550b57a6b306'
        config.headers['exchange-language'] = 'zh_CN'
        config.headers['exchange-client'] = 'h5'
    }
    return config
}


axios.interceptors.request.use(func, function (err) {
    return err
})

export default func
