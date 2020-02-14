import axios from '@/libs/api.request'

const api = {
  getDoctorPostTeacherList: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostteacher/list',
      params: obj,
      method: 'get'
    })
  },
  getDoctorPostTeacherInfo: (id) => {
    return axios.request({
      url: `/doctorpost/doctorpostteacher/info/${id}`,
      method: 'get'
    })
  },
  saveDoctorPostTeacher: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostteacher/save',
      data: obj,
      method: 'post'
    })
  },
  updateDoctorPostTeacher: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostteacher/update',
      data: obj,
      method: 'post'
    })
  },
  deleteDoctorPostTeacher: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostteacher/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
