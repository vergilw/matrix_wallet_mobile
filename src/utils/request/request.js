/*
 * @Author: 石国庆
 * @Desc: 所有axios的拦截器，默认配置都可以写在这里
 * @Date: 2017.11.14
 * */

import config from '../../profiles/config/index.js';

if (config.setting.customHttpHeader) {
    // 这里面没法用import
    // 添加用户id的请求头
    require('./header.js')
    // import '@/utils/request/header.js'
}


