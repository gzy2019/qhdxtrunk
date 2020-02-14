import axios from '@/libs/api.request'

const api = {
  getPaypointBatchDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointbatch/data/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointBatchList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointbatch/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointBatchInfo: (id) => {
    return axios.request({
      url: `/paypoint/paypointbatch/info/${id}`,
      method: 'get'
    })
  },
  validateCode: (obj) => {
    return axios.request({
      url: '/paypoint/paypointbatch/validate_code',
      data: obj,
      method: 'post'
    })
  },
  savePaypointBatch: (obj) => {
    return axios.request({
      url: '/paypoint/paypointbatch/save',
      data: obj,
      method: 'post'
    })
  },
  updatePaypointBatch: (obj) => {
    return axios.request({
      url: '/paypoint/paypointbatch/update',
      data: obj,
      method: 'post'
    })
  },
  deletePaypointBatch: (obj) => {
    return axios.request({
      url: '/paypoint/paypointbatch/delete',
      data: obj,
      method: 'post'
    })
  },
  copyPaypointBatch: (obj) => {
    return axios.request({
      url: '/paypoint/paypointbatch/copy',
      data: obj,
      method: 'post'
    })
  }
}

export default api
