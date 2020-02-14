import axios from '@/libs/api.request'

const api = {
  getCaseMediaCourseDataList: (obj) => {
    return axios.request({
      url: '/cases/casemediacourse/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseMediaCourseList: (obj) => {
    return axios.request({
      url: '/cases/casemediacourse/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseMediaCourseInfo: (id) => {
    return axios.request({
      url: `/cases/casemediacourse/info/${id}`,
      method: 'get'
    })
  },
  saveCaseMediaCourse: (obj) => {
    return axios.request({
      url: '/cases/casemediacourse/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseMediaCourse: (obj) => {
    return axios.request({
      url: '/cases/casemediacourse/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseMediaCourse: (obj) => {
    return axios.request({
      url: '/cases/casemediacourse/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
