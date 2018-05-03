/*
 * @Author: LFZ
 * @Date: 2017-12-13 09:17:15
 * @Last Modified by: LFZ
 * @Last Modified time: 2018-04-12 14:30:13
 */

import Axios from 'axios'
import util from './util.js'
import { errorMap, getErrorMsg } from './error-map.js'

let axios = (vue, router) => {
  // 创建axios实例
  const service = Axios.create({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'json', // 服务器返回json格式数据
    timeout: 10000, // 超时时间设置为10秒；
    withCredentials: true // 跨域发送cookie
  })

  // api接口全局拦截器， 用于发送ajax时格式化空参数
  service.interceptors.request.use(function (config) {
    // get请求时格式化发送参数
    if (config.method === 'get') {
      config.params = util.formatParams(config.params)
    // post格式化发送参数
    }
    // else if (config.method === 'post') {
    //   config.data = util.formatParams(config.data)
    // }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  // api接口全局拦截器，用于转换错误提示信息
  service.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    // console.error(error)
    let msg = getErrorMsg(error)
    // 将错误的英文信息转换到中文
    let errorMsg = errorMap(msg)
    console.error(msg)
    // 其它全局提示或特殊处理
    if (/NoLogin/.test(msg)) {
    } else {
    }
    // 将错误信息留到上层代码catch处理
    if (error.response) {
      error.response.statusText = errorMsg
    }
    return Promise.reject(error)
  })

  vue.prototype.$axios = service
  vue.$axios = service
}

export default axios
