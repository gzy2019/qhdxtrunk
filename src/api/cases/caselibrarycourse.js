import axios from '@/libs/api.request'

const api = {
  getCaseLibraryCourseDataList: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycourse/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryCourseList: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycourse/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryCourseInfo: (id) => {
    return axios.request({
      url: `/cases/caselibrarycourse/info/${id}`,
      method: 'get'
    })
  },
  saveCaseLibraryCourse: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycourse/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseLibraryCourse: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycourse/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseLibraryCourse: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycourse/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
