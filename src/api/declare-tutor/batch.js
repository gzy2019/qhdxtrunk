import axios from '@/libs/api.request'

const api = {
  getBatchList: (obj) => {
    return axios.request({
      url: 'declare/declaretutorbatch/list',
      params: obj,
      method: 'get'
    })
  },
  getBatchListAll: (obj) => {
    return axios.request({
      url: 'declare/declaretutorbatch/listAll',
      params: obj,
      method: 'get'
    })
  },
  getBatchRuleList: (obj) => {
    return axios.request({
      url: 'declare/declaretutorbatchrule/list',
      params: obj,
      method: 'get'
    })
  },
  getBatchInfo: (id, obj) => {
    return axios.request({
      url: `declare/declaretutorbatch/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveBatch: (obj) => {
    return axios.request({
      url: 'declare/declaretutorbatch/save',
      data: obj,
      method: 'post'
    })
  },

  updateBatch: (obj) => {
    return axios.request({
      url: 'declare/declaretutorbatch/update',
      data: obj,
      method: 'post'
    })
  },
  updateOpenFlag: (obj) => {
    return axios.request({
      url: 'declare/declaretutorbatch/updateOpenFlag',
      data: obj,
      method: 'post'
    })
  },

  deleteBatch: (obj) => {
    return axios.request({
      url: 'declare/declaretutorbatch/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
