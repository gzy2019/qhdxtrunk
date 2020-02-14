import axios from '@/libs/api.request'

const api = {
  getCaseTagDataList: (obj) => {
    return axios.request({
      url: '/cases/casetag/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseTagList: (obj) => {
    return axios.request({
      url: '/cases/casetag/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseTagInfo: (id) => {
    return axios.request({
      url: `/cases/casetag/info/${id}`,
      method: 'get'
    })
  },
  saveCaseTag: (obj) => {
    return axios.request({
      url: '/cases/casetag/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseTag: (obj) => {
    return axios.request({
      url: '/cases/casetag/update',
      data: obj,
      method: 'post'
    })
  },
  validateTagName: (obj) => {
    return axios.request({
      url: '/cases/casetag/validate_tagName',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseTag: (obj) => {
    return axios.request({
      url: '/cases/casetag/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
