import {
  request
} from '../axios'

export const getAllRights = () => {
  return request({
    url: 'rights/list'
  })
}
