import {
  request
} from '../axios'

export const getRolesList = () => {
  return request({
    url: '/roles'
  })
}
export const removeRightsById = (rightId, role) => {
  return request({
    url: `roles/${role.id}/rights/${
      rightId
    }`,
    method: 'delete'
  })
}
export const getAllRightsTree = () => {
  return request({
    url: 'rights/tree'
  })
}
export const allotRights = (roleId, rids) => {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}
