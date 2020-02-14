import axios from '@/libs/api.request'

const api = {
  getOfficeActivityApplyDataList: (obj) => {
    return axios.request({
      url: '/activity/officeactivityapply/data/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeActivityApplyList: (obj) => {
    return axios.request({
      url: '/activity/officeactivityapply/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeActivityApplyInfo: (id) => {
    return axios.request({
      url: `/activity/officeactivityapply/info/${id}`,
      method: 'get'
    })
  },
  saveOfficeActivityApply: (obj) => {
    return axios.request({
      url: '/activity/officeactivityapply/save',
      data: obj,
      method: 'post'
    })
  },
  updateOfficeActivityApply: (obj) => {
    return axios.request({
      url: '/activity/officeactivityapply/update',
      data: obj,
      method: 'post'
    })
  },
  deleteOfficeActivityApply: (obj) => {
    return axios.request({
      url: '/activity/officeactivityapply/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
