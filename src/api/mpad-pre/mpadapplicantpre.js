import axios from '@/libs/api.request'

const api = {
  getMpadApplicantList: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicantpre/list',
      params: obj,
      method: 'get'
    })
  },
  getMpadApplicantInfo: (id) => {
    return axios.request({
      url: `/mpa/mpadapplicantpre/info/${id}`,
      method: 'get'
    })
  },
  saveMpadApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicantpre/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpadApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicantpre/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMpadApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicantpre/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
