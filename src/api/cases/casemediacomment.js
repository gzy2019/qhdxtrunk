import axios from '@/libs/api.request'

const api = {
  getCaseMediaCommentDataList: (obj) => {
    return axios.request({
      url: '/cases/casemediacomment/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseMediaCommentList: (obj) => {
    return axios.request({
      url: '/cases/casemediacomment/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseMediaCommentInfo: (id) => {
    return axios.request({
      url: `/cases/casemediacomment/info/${id}`,
      method: 'get'
    })
  },
  saveCaseMediaComment: (obj) => {
    return axios.request({
      url: '/cases/casemediacomment/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseMediaComment: (obj) => {
    return axios.request({
      url: '/cases/casemediacomment/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseMediaComment: (obj) => {
    return axios.request({
      url: '/cases/casemediacomment/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
