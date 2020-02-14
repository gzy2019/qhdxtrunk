import axios from '@/libs/api.request'

const api = {
  getQaFormDataList: (obj) => {
    return axios.request({
      url: '/qa/qaform/data/list',
      params: obj,
      method: 'get'
    })
  },
  getQaFormList: (obj) => {
    return axios.request({
      url: '/qa/qaform/list',
      params: obj,
      method: 'get'
    })
  },
  getQaFormInfo: (id) => {
    return axios.request({
      url: `/qa/qaform/info/${id}`,
      method: 'get'
    })
  },
  exportQaFormStats: (obj) => {
    return axios.request({
      url: '/qa/qaform/stats/export_excel',
      params: obj,
      method: 'get'
    })
  },
  saveQaForm: (obj) => {
    return axios.request({
      url: '/qa/qaform/save',
      data: obj,
      method: 'post'
    })
  },
  updateQaForm: (obj) => {
    return axios.request({
      url: '/qa/qaform/update',
      data: obj,
      method: 'post'
    })
  },
  publishaForm: (obj) => {
    return axios.request({
      url: '/qa/qaform/publish',
      data: obj,
      method: 'post'
    })
  },
  getQaFormDesignInfo: (id) => {
    return axios.request({
      url: `/qa/qaform/design_info/${id}`,
      method: 'get'
    })
  },
  saveQaDesignForm: (obj) => {
    return axios.request({
      url: '/qa/qaform/save_design',
      data: obj,
      method: 'post'
    })
  },
  updateQaDesignForm: (obj) => {
    return axios.request({
      url: '/qa/qaform/update_design',
      data: obj,
      method: 'post'
    })
  },
  deleteQaForm: (obj) => {
    return axios.request({
      url: '/qa/qaform/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
