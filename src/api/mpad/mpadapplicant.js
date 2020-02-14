import axios from '@/libs/api.request'

const api = {
  getMpadApplicantList: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicant/list',
      params: obj,
      method: 'get'
    })
  },
  getMpadApplicantInfo: (id) => {
    return axios.request({
      url: `/mpa/mpadapplicant/info/${id}`,
      method: 'get'
    })
  },
  saveMpadApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicant/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpadApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicant/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMpadApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpadapplicant/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
