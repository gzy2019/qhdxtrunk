import axios from '@/libs/api.request'
import md5 from 'crypto-js/md5'

const api = {
  getDoctorPostUserList: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostuser/list',
      params: obj,
      method: 'get'
    })
  },
  getDoctorPostUserInfo: (id) => {
    return axios.request({
      url: `/doctorpost/doctorpostuser/info/${id}`,
      method: 'get'
    })
  },
  saveDoctorPostUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: '/doctorpost/doctorpostuser/save',
      data: obj,
      method: 'post'
    })
  },
  updateDoctorPostUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: '/doctorpost/doctorpostuser/update',
      data: obj,
      method: 'post'
    })
  },
  deleteDoctorPostUser: (obj) => {
    return axios.request({
      url: '/doctorpost/doctorpostuser/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
