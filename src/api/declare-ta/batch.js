import axios from '@/libs/api.request'

const api = {
  getBatchList: (obj) => {
    return axios.request({
      url: 'declare/ta/batch/list',
      params: obj,
      method: 'get'
    })
  },
  getBatchListAll: (obj) => {
    return axios.request({
      url: 'declare/ta/batch/listAll',
      params: obj,
      method: 'get'
    })
  },
  getBatchInfo: (id, obj) => {
    return axios.request({
      url: `declare/ta/batch/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveBatch: (obj) => {
    return axios.request({
      url: 'declare/ta/batch/save',
      data: obj,
      method: 'post'
    })
  },

  updateBatch: (obj) => {
    return axios.request({
      url: 'declare/ta/batch/update',
      data: obj,
      method: 'post'
    })
  },

  deleteBatch: (obj) => {
    return axios.request({
      url: 'declare/ta/batch/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
