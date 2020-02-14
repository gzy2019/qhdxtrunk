import axios from '@/libs/api.request'

const api = {
  getMpaaGroupList: (obj) => {
    return axios.request({
      url: '/mpah/mpaagroup/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaaGroupInfo: (id) => {
    return axios.request({
      url: `/mpah/mpaagroup/info/${id}`,
      method: 'get'
    })
  },
  getMpaaGroupScoreInfo: (obj) => {
    return axios.request({
      url: `/mpah/mpaagroup/score_info`,
      params: obj,
      method: 'get'
    })
  },
  selectStudent: (obj) => {
    return axios.request({
      url: '/mpah/mpaagroup/select_student',
      params: obj,
      method: 'get'
    })
  },
  selectTeacher: (obj) => {
    return axios.request({
      url: '/mpah/mpaagroup/select_teacher',
      params: obj,
      method: 'get'
    })
  },
  saveMpaaGroup: (obj) => {
    return axios.request({
      url: '/mpah/mpaagroup/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaaGroup: (obj) => {
    return axios.request({
      url: '/mpah/mpaagroup/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpaaGroup: (obj) => {
    return axios.request({
      url: '/mpah/mpaagroup/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
