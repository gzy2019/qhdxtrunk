import axios from '@/libs/api.request'

const api = {
  getOfficeActivityNoticeDataList: (obj) => {
    return axios.request({
      url: '/activity/officeactivitynotice/data/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeActivityNoticeList: (obj) => {
    return axios.request({
      url: '/activity/officeactivitynotice/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeActivityNoticeInfo: (id) => {
    return axios.request({
      url: `/activity/officeactivitynotice/info/${id}`,
      method: 'get'
    })
  },
  saveOfficeActivityNotice: (obj) => {
    return axios.request({
      url: '/activity/officeactivitynotice/save',
      data: obj,
      method: 'post'
    })
  },
  updateOfficeActivityNotice: (obj) => {
    return axios.request({
      url: '/activity/officeactivitynotice/update',
      data: obj,
      method: 'post'
    })
  },
  deleteOfficeActivityNotice: (obj) => {
    return axios.request({
      url: '/activity/officeactivitynotice/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
