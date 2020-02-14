import axios from '@/libs/api.request'

const api = {
  getLibraryCssciTitleDataList: (obj) => {
    return axios.request({
      url: '/library/librarycsscititle/data/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryCssciTitleList: (obj) => {
    return axios.request({
      url: '/library/librarycsscititle/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryCssciTitleInfo: (id) => {
    return axios.request({
      url: `/library/librarycsscititle/info/${id}`,
      method: 'get'
    })
  },
  importLibraryCssciDetail: (obj) => {
    return axios.request({
      url: 'library/librarycsscidetail/import',
      data: obj,
      method: 'post'
    })
  },
  saveLibraryCssciTitle: (obj) => {
    return axios.request({
      url: '/library/librarycsscititle/save',
      data: obj,
      method: 'post'
    })
  },
  updateLibraryCssciTitle: (obj) => {
    return axios.request({
      url: '/library/librarycsscititle/update',
      data: obj,
      method: 'post'
    })
  },
  deleteLibraryCssciTitle: (obj) => {
    return axios.request({
      url: '/library/librarycsscititle/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
