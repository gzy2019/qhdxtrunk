import axios from '@/libs/api.request'

const api = {
  getQaFormInstDataList: (obj) => {
    return axios.request({
      url: '/qa/qaforminst/data/list',
      params: obj,
      method: 'get'
    })
  },
  getQaFormInstList: (obj) => {
    return axios.request({
      url: '/qa/qaforminst/list',
      params: obj,
      method: 'get'
    })
  },
  getQaFormInstInfo: (id) => {
    return axios.request({
      url: `/qa/qaforminst/info/${id}`,
      method: 'get'
    })
  },
  getQaFormInstByUser: (obj) => {
    return axios.request({
      url: '/qa/qaforminst/get_by_user',
      params: obj,
      method: 'get'
    })
  },
  saveQaFormInst: (obj) => {
    return axios.request({
      url: '/qa/qaforminst/save',
      data: obj,
      method: 'post'
    })
  },
  updateQaFormInst: (obj) => {
    return axios.request({
      url: '/qa/qaforminst/update',
      data: obj,
      method: 'post'
    })
  },
  deleteQaFormInst: (obj) => {
    return axios.request({
      url: '/qa/qaforminst/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
