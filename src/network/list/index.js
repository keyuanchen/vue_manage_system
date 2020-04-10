import {
  request
} from '../axios'

export const getGoodsList = (querinfo) => {
  return request({
    url: '/goods',
    params: querinfo
  })
}
export const removeGoodById = (id) => {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  })
}
