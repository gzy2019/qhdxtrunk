import axios from '@/libs/api.request'
import md5 from 'crypto-js/md5'

const api = {
  getMasterUserList: (obj) => {
    return axios.request({
      url: 'master/apply/user/list',
      params: obj,
      method: 'get'
    })
  },
  getMasterUserInfo: (id, obj) => {
    return axios.request({
      url: `master/apply/user/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMasterUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: 'master/apply/user/save',
      data: obj,
      method: 'post'
    })
  },
  updateMasterUser: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.userPsd2) {
      obj.userPsd2 = md5(obj.userPsd2).toString()
    }
    return axios.request({
      url: 'master/apply/user/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMasterUser: (obj) => {
    return axios.request({
      url: 'master/apply/user/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
