import axios from '@/libs/api.request'

const api = {
  getTeacherList: (obj) => {
    return axios.request({
      url: '/sys/allteacher/all',
      params: obj,
      method: 'get'
    })
  },
  getPaypointPubServiceDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/data/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointPubServiceList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointPubServiceInfo: (id) => {
    return axios.request({
      url: `/paypoint/paypointpubservice/info/${id}`,
      method: 'get'
    })
  },
  batchSavePaypointPubService: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/batch_save',
      data: obj,
      method: 'post'
    })
  },
  savePaypointPubService: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/save',
      data: obj,
      method: 'post'
    })
  },
  updatePaypointPubService: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/update',
      data: obj,
      method: 'post'
    })
  },
  send2teacher: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/confirm/send_teacher',
      data: obj,
      method: 'post'
    })
  },
  teacherConfirm: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/confirm/teacher_confirm',
      data: obj,
      method: 'post'
    })
  },
  send2leader: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/confirm/send_leader',
      data: obj,
      method: 'post'
    })
  },
  leaderConfirm: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/confirm/leader_confirm',
      data: obj,
      method: 'post'
    })
  },
  deletePaypointPubService: (obj) => {
    return axios.request({
      url: '/paypoint/paypointpubservice/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
