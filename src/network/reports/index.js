import {
  request
} from '../axios'

export const getReportsData = () => {
  return request({
    url: 'reports/type/1'
  })
}
