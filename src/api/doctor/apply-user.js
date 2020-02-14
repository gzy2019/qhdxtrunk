import axios from '@/libs/api.request'
import md5 from 'crypto-js/md5'

const api = {
  getDoctorUserList: (obj) => {
    return axios.request({
      url: 'doctor/apply/user/list',
      params: obj,
      method: 'get'
    })
  },
  getDoctorUserInfo: (id, obj) => {
    return axios.request({
      url: `doctor/apply/user/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveDoctorUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: 'doctor/apply/user/save',
      data: obj,
      method: 'post'
    })
  },
  updateDoctorUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: 'doctor/apply/user/update',
      data: obj,
      method: 'post'
    })
  },
  deleteDoctorUser: (obj) => {
    return axios.request({
      url: 'doctor/apply/user/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
