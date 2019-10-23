import axios from 'axios'
import qs from 'qs'
import config from '@/config/index.js'
let server = config.server
let baseUrl = server.baseUrl

export default (type = 'GET', url, data, progress) => {
    // 大写
    type = type.toUpperCase();
    let requestConfig = {
        url: url,
        method: type,
        withCredentials: false
    }
    switch (type) {
        case 'GET':
            Object.assign(requestConfig, {
                paramsSerializer: function(params) {
                    return qs.stringify(params)
                },
                params: data
            });
            break;
        case 'POST':
//      	requestConfig.headers = {
//		        'Content-type': 'application/x-www-form-urlencoded'
//		    }
//          Object.assign(requestConfig, {
//              data: qs.stringify(data)
//          });
            Object.assign(requestConfig, {
                data: data
            });
            break;
        case 'PUT':
            Object.assign(requestConfig, {
                data: data
            });
            break;
        case 'DELETE':
            Object.assign(requestConfig, {
                data: data
            });
            break;
        // 自定义请求类型，为了修改 headers 头
        case 'UPLOAD':
            Object.assign(requestConfig, {
                url: url,
                method: 'POST',
                data: data,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: false
            });
            if (progress && typeof progress == 'function') {
                Object.assign(requestConfig, {
                    onUploadProgress: progressEvent => {
                        // 进度
                        progress(progressEvent)
                    }
                })
            }
            break;
        default:
            break;
    }
    return axios(requestConfig);
}
