import axios from '@/libs/api.request'
import md5 from 'crypto-js/md5'

export const login = (formData) => {
  formData = Object.assign({}, formData)
  formData.userPsd = md5(formData.userPsd).toString()
  return axios.request({
    url: '/sys/login',
    data: formData,
    method: 'post'
  })
}

export const loginSign = (formData) => {
  return axios.request({
    url: '/sys/loginSign',
    data: formData,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/sys/user/info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/sys/logout',
    method: 'post'
  })
}

// 个人密码修改
export const updateUserPsd = (formData) => {
  formData = Object.assign({}, formData)
  formData.userPsd = md5(formData.userPsd).toString()
  formData.newUserPsd = md5(formData.newUserPsd).toString()
  formData.newUserPsd2 = md5(formData.newUserPsd2).toString()
  return axios.request({
    url: '/sys/user/password',
    data: formData,
    method: 'post'
  })
}
