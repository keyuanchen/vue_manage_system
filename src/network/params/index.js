import { request } from '../axios'

export const getCategoryList = obj => {
  return request({
    url: 'categories',
    params: obj
  })
}
export const getParamsData = (categoryId, sel) => {
  return request({
    url: `categories/${categoryId}/attributes`,
    params: {
      sel
    }
  })
}
export const removeParamsById = (cateId, attrId) => {
  return request({
    url: `categories/${cateId}/attributes/${attrId}`,
    method: 'delete'
  })
}
export const addParamsInfo = (cateId, addObj) => {
  return request({
    url: `categories/${cateId}/attributes`,
    method: 'post',
    data: addObj
  })
}
export const getParamsInfoByCateId = (cateId, attrId, attr_sel) => {
  return request({
    url: `categories/${cateId}/attributes/${attrId}`,
    params: {
      attr_sel
    }
  })
}
export const editParams = (cateId, attrId, obj) => {
  return request({
    url: `categories/${cateId}/attributes/${attrId}`,
    data: {
      attr_sel: obj.attr_sel,
      attr_name: obj.attr_name
    },
    method: 'put'
  })
}
export const removeParamsRequest = (cateId, attrId) => {
  return request({
    url: `categories/${cateId}/attributes/${attrId}`,
    method: 'delete'
  })
}

export const saveParams = (cateId, attrId, obj) => {
  return request({
    url: `categories/${cateId}/attributes/${attrId}`,
    data: {
      attr_sel: obj.attr_sel,
      attr_name: obj.attr_name,
      attr_vals: obj.attr_vals.join(',')
    },
    method: 'put'
  })
}
