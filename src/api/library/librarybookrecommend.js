import axios from '@/libs/api.request'

const api = {
  getLibraryBookRecommendDataList: (obj) => {
    return axios.request({
      url: '/library/librarybookrecommend/data/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryBookRecommendList: (obj) => {
    return axios.request({
      url: '/library/librarybookrecommend/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryBookRecommendInfo: (id) => {
    return axios.request({
      url: `/library/librarybookrecommend/info/${id}`,
      method: 'get'
    })
  },
  saveLibraryBookRecommend: (obj) => {
    return axios.request({
      url: '/library/librarybookrecommend/save',
      data: obj,
      method: 'post'
    })
  },
  updateLibraryBookRecommend: (obj) => {
    return axios.request({
      url: '/library/librarybookrecommend/update',
      data: obj,
      method: 'post'
    })
  },
  deleteLibraryBookRecommend: (obj) => {
    return axios.request({
      url: '/library/librarybookrecommend/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
