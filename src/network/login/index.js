import {request} from '../axios'

export const signIn = (loginInfo) => {
  return request({
    url: '/login',
    method: 'post',
    data: loginInfo
  })
}