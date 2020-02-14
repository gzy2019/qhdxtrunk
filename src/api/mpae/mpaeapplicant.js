import axios from '@/libs/api.request'

const api = {
  getMpaeSubjectList: (obj) => {
    return axios.request({
      url: '/mpa/mpaeapplicant/subject_list',
      params: obj,
      method: 'get'
    })
  },
  getMpaeApplicantList: (obj) => {
    return axios.request({
      url: '/mpa/mpaeapplicant/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaeApplicantInfo: (id) => {
    return axios.request({
      url: `/mpa/mpaeapplicant/info/${id}`,
      method: 'get'
    })
  },
  saveMpaeApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpaeapplicant/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaeApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpaeapplicant/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMpaeApplicant: (obj) => {
    return axios.request({
      url: '/mpa/mpaeapplicant/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
