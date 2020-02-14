import axios from '@/libs/api.request'
const qs = require('qs')
const api = {
  getOfficeForumInfoDataList: (obj) => {
    return axios.request({
      url: '/forum/officeforuminfo/data/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeForumInfoList: (obj) => {
    return axios.request({
      url: '/forum/officeforuminfo/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getOfficeForumInfoInfo: (id) => {
    return axios.request({
      url: `/forum/officeforuminfo/info/${id}`,
      method: 'get'
    })
  },
  saveOfficeForumInfo: (obj) => {
    return axios.request({
      url: '/forum/officeforuminfo/save',
      data: obj,
      method: 'post'
    })
  },
  updateOfficeForumInfo: (obj) => {
    return axios.request({
      url: '/forum/officeforuminfo/update',
      data: obj,
      method: 'post'
    })
  },
  deleteOfficeForumInfo: (obj) => {
    return axios.request({
      url: '/forum/officeforuminfo/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
