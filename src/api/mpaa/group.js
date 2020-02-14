import axios from '@/libs/api.request'

const api = {
  getMpaaGroupList: (obj) => {
    return axios.request({
      url: '/mpa/mpaagroup/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaaGroupInfo: (id) => {
    return axios.request({
      url: `/mpa/mpaagroup/info/${id}`,
      method: 'get'
    })
  },
  getMpaaGroupScoreInfo: (obj) => {
    return axios.request({
      url: `/mpa/mpaagroup/score_info`,
      params: obj,
      method: 'get'
    })
  },
  selectStudent: (obj) => {
    return axios.request({
      url: '/mpa/mpaagroup/select_student',
      params: obj,
      method: 'get'
    })
  },
  selectTeacher: (obj) => {
    return axios.request({
      url: '/mpa/mpaagroup/select_teacher',
      params: obj,
      method: 'get'
    })
  },
  saveMpaaGroup: (obj) => {
    return axios.request({
      url: '/mpa/mpaagroup/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaaGroup: (obj) => {
    return axios.request({
      url: '/mpa/mpaagroup/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpaaGroup: (obj) => {
    return axios.request({
      url: '/mpa/mpaagroup/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
