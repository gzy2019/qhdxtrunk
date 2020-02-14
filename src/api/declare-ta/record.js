import axios from '@/libs/api.request'

const api = {
  getRecordList: (obj) => {
    return axios.request({
      url: 'declare/ta/record/list',
      params: obj,
      method: 'get'
    })
  },
  getRecordInfo: (id, obj) => {
    return axios.request({
      url: `declare/ta/record/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveRecord: (obj) => {
    return axios.request({
      url: 'declare/ta/record/save',
      data: obj,
      method: 'post'
    })
  },

  updateRecord: (obj) => {
    return axios.request({
      url: 'declare/ta/record/update',
      data: obj,
      method: 'post'
    })
  },
  updateBatchRecord: (obj) => {
    return axios.request({
      url: 'declare/ta/record/batchUpdate',
      data: obj,
      method: 'post'
    })
  },

  deleteRecord: (obj) => {
    return axios.request({
      url: 'declare/ta/record/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
