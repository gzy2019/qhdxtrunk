import axios from '@/libs/api.request'

const api = {
  getCaseLibraryDataList: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryList: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryInfo: (id) => {
    return axios.request({
      url: `/cases/caselibrary/info/${id}`,
      method: 'get'
    })
  },
  validateCaseLibraryCode: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/validate_code',
      data: obj,
      method: 'post'
    })
  },
  handleCaseLibraryUp: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/handle_ups',
      data: obj,
      method: 'post'
    })
  },
  saveCaseLibraryComment: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/save_comment',
      data: obj,
      method: 'post'
    })
  },
  saveCaseLibrary: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseLibrary: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseLibrary: (obj) => {
    return axios.request({
      url: '/cases/caselibrary/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
