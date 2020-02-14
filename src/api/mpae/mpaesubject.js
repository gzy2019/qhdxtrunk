import axios from '@/libs/api.request'

const api = {
  getMpaeSubjectList: (obj) => {
    return axios.request({
      url: '/mpa/mpaesubject/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaeSubjectInfo: (id) => {
    return axios.request({
      url: `/mpa/mpaesubject/info/${id}`,
      method: 'get'
    })
  },
  saveMpaeSubject: (obj) => {
    return axios.request({
      url: '/mpa/mpaesubject/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaeSubject: (obj) => {
    return axios.request({
      url: '/mpa/mpaesubject/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMpaeSubject: (obj) => {
    return axios.request({
      url: '/mpa/mpaesubject/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
