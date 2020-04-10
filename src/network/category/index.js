import {
  request
} from '../axios'

export const getCategoryList = (queryObj) => {
  return request({
    url: 'categories',
    params: queryObj
  })
}
export const addCategoryInfo = (addCateForm) => {
  return request({
    url: 'categories',
    data: addCateForm,
    method: 'post'
  })
}
