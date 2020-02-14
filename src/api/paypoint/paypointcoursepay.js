import axios from '@/libs/api.request'

const api = {
  getTeacherList: (obj) => {
    return axios.request({
      url: '/sys/allteacher/all',
      params: obj,
      method: 'get'
    })
  },
  getPaypointCoursePayDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/data/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointCoursePayList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointCoursePayInfo: (id) => {
    return axios.request({
      url: `/paypoint/paypointcoursepay/info/${id}`,
      method: 'get'
    })
  },
  savePaypointCoursePay: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/save',
      data: obj,
      method: 'post'
    })
  },
  updatePaypointCoursePay: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/update',
      data: obj,
      method: 'post'
    })
  },
  send2teacher: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/confirm/send_teacher',
      data: obj,
      method: 'post'
    })
  },
  teacherConfirm: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/confirm/teacher_confirm',
      data: obj,
      method: 'post'
    })
  },
  send2leader: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/confirm/send_leader',
      data: obj,
      method: 'post'
    })
  },
  leaderConfirm: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/confirm/leader_confirm',
      data: obj,
      method: 'post'
    })
  },
  deletePaypointCoursePay: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcoursepay/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
