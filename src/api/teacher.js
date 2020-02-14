import axios from '@/libs/api.request'

const api = {
  getAllTeacher: (obj) => {
    return axios.request({
      url: '/sys/allteacher/all',
      params: obj,
      method: 'get'
    })
  },
  getTeacherList: (obj) => {
    return axios.request({
      url: '/sys/allteacher/list',
      params: obj,
      method: 'get'
    })
  },
  getTeacherInfo: (id, obj) => {
    return axios.request({
      url: `/sys/allteacher/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  validateTeaCode: (obj) => {
    return axios.request({
      url: `/sys/allteacher/validate_code`,
      data: obj,
      method: 'post'
    })
  },
  updateTeacher: (obj) => {
    return axios.request({
      url: '/sys/allteacher/update',
      data: obj,
      method: 'post'
    })
  },
  saveTeacher: (obj) => {
    return axios.request({
      url: '/sys/allteacher/save',
      data: obj,
      method: 'post'
    })
  },
  deleteTeacher: (obj) => {
    return axios.request({
      url: '/sys/allteacher/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
