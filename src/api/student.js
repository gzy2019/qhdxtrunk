import axios from '@/libs/api.request'

const api = {
  getStudentTree: (obj) => {
    return axios.request({
      url: '/sys/allstudent/studentTree',
      params: obj,
      method: 'get'
    })
  },
  getAllStudentList: (obj) => {
    return axios.request({
      url: '/sys/allstudent/all',
      params: obj,
      method: 'get'
    })
  },
  getStudentList: (obj) => {
    return axios.request({
      url: '/sys/allstudent/list',
      params: obj,
      method: 'get'
    })
  },
  getStudentInfo: (id, obj) => {
    return axios.request({
      url: `/sys/allstudent//info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  validateStuCode: (obj) => {
    return axios.request({
      url: `/sys/allstudent/validate_code`,
      data: obj,
      method: 'post'
    })
  },

  saveStudent: (obj) => {
    return axios.request({
      url: '/sys/allstudent/save',
      data: obj,
      method: 'post'
    })
  },

  updateStudent: (obj) => {
    return axios.request({
      url: '/sys/allstudent/update',
      data: obj,
      method: 'post'
    })
  },

  deleteStudent: (obj) => {
    return axios.request({
      url: '/sys/allstudent/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
