import axios from '@/libs/api.request'

const api = {
  getOfficeForumApplyDataList: (obj) => {
    return axios.request({
      url: '/forum/officeforumapply/data/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeForumApplyList: (obj) => {
    return axios.request({
      url: '/forum/officeforumapply/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeForumApplyInfo: (id) => {
    return axios.request({
      url: `/forum/officeforumapply/info/${id}`,
      method: 'get'
    })
  },
  saveOfficeForumApply: (obj) => {
    return axios.request({
      url: '/forum/officeforumapply/save',
      data: obj,
      method: 'post'
    })
  },
  updateOfficeForumApply: (obj) => {
    return axios.request({
      url: '/forum/officeforumapply/update',
      data: obj,
      method: 'post'
    })
  },
  deleteOfficeForumApply: (obj) => {
    return axios.request({
      url: '/forum/officeforumapply/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
