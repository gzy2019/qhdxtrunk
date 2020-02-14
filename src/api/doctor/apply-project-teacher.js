import axios from '@/libs/api.request'

const api = {
  getProjectTeacherList: (obj) => {
    return axios.request({
      url: '/doctor/apply/projectteacher/list',
      params: obj,
      method: 'get'
    })
  },
  getProjectTeacherInfo: (id, obj) => {
    return axios.request({
      url: `/doctor/apply/projectteacher/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveProjectTeacher: (obj) => {
    return axios.request({
      url: '/doctor/apply/projectteacher/save',
      data: obj,
      method: 'post'
    })
  },

  updateProjectTeacher: (obj) => {
    return axios.request({
      url: '/doctor/apply/projectteacher/update',
      data: obj,
      method: 'post'
    })
  },

  deleteProjectTeacher: (obj) => {
    return axios.request({
      url: '/doctor/apply/projectteacher/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
