import axios from 'axios'

export const request = (config) => {
  const instance = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/'
    // timeout: 10000
  })

  // 配置包含Authorization字段的请求头
  // 请求拦截器
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })

  return instance(config)
}
