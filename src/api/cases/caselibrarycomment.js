import axios from '@/libs/api.request'

const api = {
  getCaseLibraryCommentDataList: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycomment/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryCommentList: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycomment/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryCommentInfo: (id) => {
    return axios.request({
      url: `/cases/caselibrarycomment/info/${id}`,
      method: 'get'
    })
  },
  saveCaseLibraryComment: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycomment/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseLibraryComment: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycomment/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseLibraryComment: (obj) => {
    return axios.request({
      url: '/cases/caselibrarycomment/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
