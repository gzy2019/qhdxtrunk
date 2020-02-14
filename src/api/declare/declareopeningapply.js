import axios from '@/libs/api.request'

const api = {
  getDeclareOpeningApplyDataList: (obj) => {
    return axios.request({
      url: '/declare/declareopeningapply/data/list',
      params: obj,
      method: 'get'
    })
  },
  getDeclareOpeningApplyList: (obj) => {
    return axios.request({
      url: '/declare/declareopeningapply/list',
      params: obj,
      method: 'get'
    })
  },
  getDeclareOpeningApplyInfo1: (obj) => {
    return axios.request({
      url: '/declare/declareopeningapply/info1',
      params: obj,
      method: 'get'
    })
  },
  getDeclareOpeningApplyInfo: (id) => {
    return axios.request({
      url: `/declare/declareopeningapply/info/${id}`,
      method: 'get'
    })
  },
  saveDeclareOpeningApply: (obj) => {
    return axios.request({
      url: '/declare/declareopeningapply/save',
      data: obj,
      method: 'post'
    })
  },
  updateDeclareOpeningApply1: (obj) => {
    return axios.request({
      url: '/declare/declareopeningapply/updateBatch',
      data: obj,
      method: 'post'
    })
  },
  updateDeclareOpeningApply: (obj) => {
    return axios.request({
      url: '/declare/declareopeningapply/update',
      data: obj,
      method: 'post'
    })
  },
  deleteDeclareOpeningApply: (obj) => {
    return axios.request({
      url: '/declare/declareopeningapply/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
