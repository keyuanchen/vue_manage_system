import axios from 'axios'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export const request = config => {
  const instance = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/'
    // timeout: 10000
  })

  // 配置包含Authorization字段的请求头
  // 请求拦截器
  instance.interceptors.request.use(config => {
    // 请求开始前显示nprogress.start()
    NProgress.start()

    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })

  // 响应拦截器

  instance.interceptors.response.use(res => {
    NProgress.done()
    return res
  })

  return instance(config)
}
