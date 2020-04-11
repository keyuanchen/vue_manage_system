import {
  request
} from '../axios'

export const getOrdersList = (queryinfo) => {
  return request({
    url: '/orders',
    params: queryinfo
  })
}

// 获取物流信息
export const getLogisticsInfo = (id) => {
  return request({
    url: `/kuaidi/${id}`
  })
}
