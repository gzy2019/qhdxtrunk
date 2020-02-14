import axios from '@/libs/api.request'

const api = {
  getCaseMediaDataList: (obj) => {
    return axios.request({
      url: '/cases/casemedia/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseMediaList: (obj) => {
    return axios.request({
      url: '/cases/casemedia/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseMediaInfo: (id) => {
    return axios.request({
      url: `/cases/casemedia/info/${id}`,
      method: 'get'
    })
  },
  validateCaseLibraryCode: (obj) => {
    return axios.request({
      url: '/cases/casemedia/validate_code',
      data: obj,
      method: 'post'
    })
  },
  handleCaseLibraryUp: (obj) => {
    return axios.request({
      url: '/cases/casemedia/handle_ups',
      data: obj,
      method: 'post'
    })
  },
  saveCaseMedia: (obj) => {
    return axios.request({
      url: '/cases/casemedia/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseMedia: (obj) => {
    return axios.request({
      url: '/cases/casemedia/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseMedia: (obj) => {
    return axios.request({
      url: '/cases/casemedia/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
