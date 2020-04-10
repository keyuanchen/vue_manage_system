import {
  request
} from '../axios'

export const getCategoryList = () => {
  return request({
    url: 'categories'
  })
}
// 获取商品参数数据
export const getManyData = (cateId) => {
  return request({
    url: `categories/${cateId}/attributes`,
    params: {
      sel: 'many'
    }
  })
}
// 获取商品属性数据
export const getOnlyData = (cateId) => {
  return request({
    url: `categories/${cateId}/attributes`,
    params: {
      sel: 'only'
    }
  })
}
// 添加商品
export const addGoodsRequest = obj => {
  return request({
    url: 'goods',
    method: 'post',
    data: obj
  })
}
