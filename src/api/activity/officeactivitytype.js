import axios from '@/libs/api.request'

const api = {
  getOfficeActivityTypeDataList: (obj) => {
    return axios.request({
      url: '/activity/officeactivitytype/data/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeActivityTypeList: (obj) => {
    return axios.request({
      url: '/activity/officeactivitytype/list',
      params: obj,
      method: 'get'
    })
  },
  getOfficeActivityTypeInfo: (id) => {
    return axios.request({
      url: `/activity/officeactivitytype/info/${id}`,
      method: 'get'
    })
  },
  saveOfficeActivityType: (obj) => {
    return axios.request({
      url: '/activity/officeactivitytype/save',
      data: obj,
      method: 'post'
    })
  },
  updateOfficeActivityType: (obj) => {
    return axios.request({
      url: '/activity/officeactivitytype/update',
      data: obj,
      method: 'post'
    })
  },
  deleteOfficeActivityType: (obj) => {
    return axios.request({
      url: '/activity/officeactivitytype/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
