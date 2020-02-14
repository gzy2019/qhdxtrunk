import axios from '@/libs/api.request'

const api = {
  getTeacherList: (obj) => {
    return axios.request({
      url: '/sys/allteacher/all',
      params: obj,
      method: 'get'
    })
  },
  getPaypointOtherDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/data/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointOtherList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointOtherInfo: (id) => {
    return axios.request({
      url: `/paypoint/paypointother/info/${id}`,
      method: 'get'
    })
  },
  savePaypointOther: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/save',
      data: obj,
      method: 'post'
    })
  },
  updatePaypointOther: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/update',
      data: obj,
      method: 'post'
    })
  },
  send2teacher: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/confirm/send_teacher',
      data: obj,
      method: 'post'
    })
  },
  teacherConfirm: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/confirm/teacher_confirm',
      data: obj,
      method: 'post'
    })
  },
  send2leader: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/confirm/send_leader',
      data: obj,
      method: 'post'
    })
  },
  leaderConfirm: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/confirm/leader_confirm',
      data: obj,
      method: 'post'
    })
  },
  deletePaypointOther: (obj) => {
    return axios.request({
      url: '/paypoint/paypointother/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
