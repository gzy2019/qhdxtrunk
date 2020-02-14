import axios from '@/libs/api.request'

const api = {
  getEstimateBatchList: (obj) => {
    return axios.request({
      url: '/declare/estimatebatch/list',
      params: obj,
      method: 'get'
    })
  },
  getEstimateBatchInfo: (id) => {
    return axios.request({
      url: `/declare/estimatebatch/info/${id}`,
      method: 'get'
    })
  },
  saveEstimateBatch: (obj) => {
    return axios.request({
      url: '/declare/estimatebatch/save',
      data: obj,
      method: 'post'
    })
  },
  updateEstimateBatch: (obj) => {
    return axios.request({
      url: '/declare/estimatebatch/update',
      data: obj,
      method: 'post'
    })
  },
  deleteEstimateBatch: (obj) => {
    return axios.request({
      url: '/declare/estimatebatch/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
