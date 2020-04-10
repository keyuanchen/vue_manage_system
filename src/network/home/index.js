import {
  request
} from '../axios'

export const getMenus = () => {
  return request({
    url: '/menus'
  })
}
