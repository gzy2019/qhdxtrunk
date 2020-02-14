import axios from '@/libs/api.request'

const api = {
  getApplyScoreList: (obj) => {
    return axios.request({
      url: '/doctor/apply/score/list',
      params: obj,
      method: 'get'
    })
  },
  getApplyScoreInfo: (id, obj) => {
    return axios.request({
      url: `/doctor/apply/score/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveApplyScore: (obj) => {
    return axios.request({
      url: '/doctor/apply/score/save',
      data: obj,
      method: 'post'
    })
  },
  updateApplyScore: (obj) => {
    return axios.request({
      url: '/doctor/apply/score/update',
      data: obj,
      method: 'post'
    })
  },

  deleteApplyScore: (obj) => {
    return axios.request({
      url: '/doctor/apply/score/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
