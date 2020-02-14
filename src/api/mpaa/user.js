import axios from '@/libs/api.request'
import md5 from 'crypto-js/md5'

const api = {
  getMpaUserList: (obj) => {
    return axios.request({
      url: '/mpa/user/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaUserInfo: (id, obj) => {
    return axios.request({
      url: `/mpa/user/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpaUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: '/mpa/user/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: '/mpa/user/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMpaUser: (obj) => {
    return axios.request({
      url: '/mpa/user/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
