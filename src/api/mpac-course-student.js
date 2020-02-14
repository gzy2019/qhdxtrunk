import axios from '@/libs/api.request'

const api = {
  getMpacCourseStudentList: (obj) => {
    return axios.request({
      url: '/mpa/mpaccoursestudent/list',
      params: obj,
      method: 'get'
    })
  },
  getMpacSelectedCourseList: (obj) => {
    return axios.request({
      url: '/mpa/mpaccoursestudent/listSelectedCourse',
      params: obj,
      method: 'get'
    })
  },
  getMpacCourseStudentInfo: (id, obj) => {
    return axios.request({
      url: `/mpa/mpaccoursestudent/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpacCourseStudent: (obj) => {
    return axios.request({
      url: '/mpa/mpaccoursestudent/save',
      data: obj,
      method: 'post'
    })
  },

  updateMpacCourseStudent: (obj) => {
    return axios.request({
      url: '/mpa/mpaccoursestudent/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpacCourseStudent: (obj) => {
    return axios.request({
      url: '/mpa/mpaccoursestudent/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
