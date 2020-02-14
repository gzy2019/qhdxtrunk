import axios from '@/libs/api.request'

const api = {
  getDoctorPostApplicantList: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostapplicant/list',
      params: obj,
      method: 'get'
    })
  },
  getDoctorPostApplicantInfo: (id) => {
    return axios.request({
      url: `/doctorpost/doctorpostapplicant/info/${id}`,
      method: 'get'
    })
  },
  saveDoctorPostApplicant: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostapplicant/save',
      data: obj,
      method: 'post'
    })
  },
  updateDoctorPostApplicant: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostapplicant/update',
      data: obj,
      method: 'post'
    })
  },
  handleDoctorPostApplicant: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostapplicant/handle',
      params: obj,
      method: 'post'
    })
  },
  deleteDoctorPostApplicant: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostapplicant/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
