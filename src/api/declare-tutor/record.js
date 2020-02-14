import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  getRecordList: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrecord/list',
      params: obj,
      method: 'get'
    })
  },
  getRecordListByTeacher: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrecord/listByTeacher',
      params: obj,
      method: 'get'
    })
  },
  getRecordResultListByTeacher: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrecord/listResultByTeacher',
      data: obj,
      // paramsSerializer: function (params) {
      //   return qs.stringify(params, {arrayFormat: 'repeat'})
      // },
      method: 'post'
    })
  },
  getRecordInfo: (id, obj) => {
    return axios.request({
      url: `declare/declaretutorrecord/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveRecord: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrecord/save',
      data: obj,
      method: 'post'
    })
  },

  updateRecord: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrecord/update',
      data: obj,
      method: 'post'
    })
  },
  updateBatch: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrecord/updateBatch',
      data: obj,
      method: 'post'
    })
  },
  deleteRecord: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrecord/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
