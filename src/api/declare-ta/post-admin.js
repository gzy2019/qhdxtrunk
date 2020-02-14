import axios from '@/libs/api.request'

const api = {
  getPostAdminList: (obj) => {
    return axios.request({
      url: 'declare/ta/postadmin/list',
      params: obj,
      method: 'get'
    })
  },
  getOwnerPostAdminList: (obj) => {
    return axios.request({
      url: 'declare/ta/postadmin/listByTeacher',
      params: obj,
      method: 'get'
    })
  },
  getPostAdminInfo: (id, obj) => {
    return axios.request({
      url: `declare/ta/postadmin/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  savePostAdmin: (obj) => {
    return axios.request({
      url: 'declare/ta/postadmin/save',
      data: obj,
      method: 'post'
    })
  },

  updatePostAdmin: (obj) => {
    return axios.request({
      url: 'declare/ta/postadmin/update',
      data: obj,
      method: 'post'
    })
  },

  deletePostAdmin: (obj) => {
    return axios.request({
      url: 'declare/ta/postadmin/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
