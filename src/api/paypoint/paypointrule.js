import axios from '@/libs/api.request'

const api = {
  getPaypointRuleDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointrule/data/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointRuleList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointrule/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointRuleInfo: (id) => {
    return axios.request({
      url: `/paypoint/paypointrule/info/${id}`,
      method: 'get'
    })
  },
  validateCode: (obj) => {
    return axios.request({
      url: '/paypoint/paypointrule/validate_code',
      data: obj,
      method: 'post'
    })
  },
  savePaypointRule: (obj) => {
    return axios.request({
      url: '/paypoint/paypointrule/save',
      data: obj,
      method: 'post'
    })
  },
  updatePaypointRule: (obj) => {
    return axios.request({
      url: '/paypoint/paypointrule/update',
      data: obj,
      method: 'post'
    })
  },
  deletePaypointRule: (obj) => {
    return axios.request({
      url: '/paypoint/paypointrule/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
