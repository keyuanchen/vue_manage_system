import {
  request
} from '../axios'

export const getOrdersList = (queryinfo) => {
  return request({
    url: '/orders',
    params: queryinfo
  })
}
