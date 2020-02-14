import axios from '@/libs/api.request'

const api = {
  getCaseClueDataList: (obj) => {
    return axios.request({
      url: '/cases/caseclue/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseClueList: (obj) => {
    return axios.request({
      url: '/cases/caseclue/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseClueInfo: (id) => {
    return axios.request({
      url: `/cases/caseclue/info/${id}`,
      method: 'get'
    })
  },
  saveCaseClueComment: (obj) => {
    return axios.request({
      url: '/cases/caseclue/save_comment',
      data: obj,
      method: 'post'
    })
  },
  saveCaseClue: (obj) => {
    return axios.request({
      url: '/cases/caseclue/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseClue: (obj) => {
    return axios.request({
      url: '/cases/caseclue/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseClue: (obj) => {
    return axios.request({
      url: '/cases/caseclue/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
