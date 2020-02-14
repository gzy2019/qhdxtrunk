import axios from '@/libs/api.request'

const api = {
  getRuleList: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrule/list',
      params: obj,
      method: 'get'
    })
  },
  getRuleInfo: (id, obj) => {
    return axios.request({
      url: `declare/declaretutorrule/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  validateDuplicated: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrule/validateDuplicated',
      data: obj,
      method: 'post'
    })
  },
  saveRule: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrule/save',
      data: obj,
      method: 'post'
    })
  },

  updateRule: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrule/update',
      data: obj,
      method: 'post'
    })
  },

  deleteRule: (obj) => {
    return axios.request({
      url: 'declare/declaretutorrule/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
