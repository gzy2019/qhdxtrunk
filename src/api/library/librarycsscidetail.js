import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  getLibraryCssciDetailDataList: (obj) => {
    return axios.request({
      url: '/library/librarycsscidetail/data/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryCssciDetailList: (obj) => {
    return axios.request({
      url: '/library/librarycsscidetail/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getLibraryCssciDetailInfo: (id) => {
    return axios.request({
      url: `/library/librarycsscidetail/info/${id}`,
      method: 'get'
    })
  },
  saveLibraryCssciDetail: (obj) => {
    return axios.request({
      url: '/library/librarycsscidetail/save',
      data: obj,
      method: 'post'
    })
  },
  
  updateLibraryCssciDetail: (obj) => {
    return axios.request({
      url: '/library/librarycsscidetail/update',
      data: obj,
      method: 'post'
    })
  },
  deleteLibraryCssciDetail: (obj) => {
    return axios.request({
      url: '/library/librarycsscidetail/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
