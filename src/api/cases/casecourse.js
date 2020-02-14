import axios from '@/libs/api.request'

const api = {
  getCaseCourseDataList: (obj) => {
    return axios.request({
      url: '/cases/casecourse/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseCourseList: (obj) => {
    return axios.request({
      url: '/cases/casecourse/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseCourseInfo: (id) => {
    return axios.request({
      url: `/cases/casecourse/info/${id}`,
      method: 'get'
    })
  },
  saveCaseCourse: (obj) => {
    return axios.request({
      url: '/cases/casecourse/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseCourse: (obj) => {
    return axios.request({
      url: '/cases/casecourse/update',
      data: obj,
      method: 'post'
    })
  },
  validateCourseName: (obj) => {
    return axios.request({
      url: '/cases/casecourse/validate_courseName',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseCourse: (obj) => {
    return axios.request({
      url: '/cases/casecourse/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
