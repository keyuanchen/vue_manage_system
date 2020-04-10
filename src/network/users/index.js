import {
  request
} from '../axios'

export const getUsersList = (userInfo) => {
  return request({
    url: '/users',
    params: userInfo
  })
}
export const addUserInfo = (userInfo) => {
  return request({
    url: '/users',
    data: userInfo,
    method: 'post'
  })
}
export const getUserInfoById = (userId) => {
  return request({
    url: '/users/' + userId
  })
}
export const editUserInfo = (userObj) => {
  return request({
    url: '/users/' + userObj.id,
    method: 'put',
    params: {
      email: userObj.email,
      mobile: userObj.mobile
    }
  })
}
export const removeUserById = (userId) => {
  return request({
    url: '/users/' + userId,
    method: 'delete'
  })
}
