import axios from '@/libs/api.request'

const api = {
  getDeclareOpeningInfoDataList: (obj) => {
    return axios.request({
      url: '/declare/declareopeninginfo/data/list',
      params: obj,
      method: 'get'
    })
  },
  getDeclareOpeningInfoList: (obj) => {
    return axios.request({
      url: '/declare/declareopeninginfo/list',
      params: obj,
      method: 'get'
    })
  },
  getDeclareOpeningInfoList2: (obj) => {
    return axios.request({
      url: '/declare/declareopeninginfo/list2',
      params: obj,
      method: 'get'
    })
  },
  getDeclareOpeningInfoInfo: (id) => {
    return axios.request({
      url: `/declare/declareopeninginfo/info/${id}`,
      method: 'get'
    })
  },
  saveDeclareOpeningInfo: (obj) => {
    return axios.request({
      url: '/declare/declareopeninginfo/save',
      data: obj,
      method: 'post'
    })
  },
  updateDeclareOpeningInfo: (obj) => {
    return axios.request({
      url: '/declare/declareopeninginfo/update',
      data: obj,
      method: 'post'
    })
  },
  deleteDeclareOpeningInfo: (obj) => {
    return axios.request({
      url: '/declare/declareopeninginfo/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
