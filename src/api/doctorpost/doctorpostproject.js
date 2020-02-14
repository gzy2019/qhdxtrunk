import axios from '@/libs/api.request'

const api = {
  getDoctorPostProjectList: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostproject/list',
      params: obj,
      method: 'get'
    })
  },
  getDoctorPostProjectInfo: (id) => {
    return axios.request({
      url: `/doctorpost/doctorpostproject/info/${id}`,
      method: 'get'
    })
  },
  saveDoctorPostProject: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostproject/save',
      data: obj,
      method: 'post'
    })
  },
  updateDoctorPostProject: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostproject/update',
      data: obj,
      method: 'post'
    })
  },
  deleteDoctorPostProject: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostproject/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
