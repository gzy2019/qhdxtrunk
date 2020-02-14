import axios from '@/libs/api.request'

const api = {
  getPaypointCategoryDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcategory/data/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointCategoryTree: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcategory/tree',
      params: obj,
      method: 'get'
    })
  },
  getPaypointCategoryList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcategory/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointCategoryInfo: (id) => {
    return axios.request({
      url: `/paypoint/paypointcategory/info/${id}`,
      method: 'get'
    })
  },
  savePaypointCategory: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcategory/save',
      data: obj,
      method: 'post'
    })
  },
  updatePaypointCategory: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcategory/update',
      data: obj,
      method: 'post'
    })
  },
  deletePaypointCategory: (obj) => {
    return axios.request({
      url: '/paypoint/paypointcategory/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
