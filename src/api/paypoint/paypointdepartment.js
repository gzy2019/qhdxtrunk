import axios from '@/libs/api.request'

const api = {
  getTeacherDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/data/teacher_list',
      params: obj,
      method: 'get'
    })
  },
  getBatchByCode: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/batch_by_code',
      params: obj,
      method: 'get'
    })
  },
  getRuleByCode: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/rule_by_code',
      params: obj,
      method: 'get'
    })
  },
  getTeacherByCode: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/teacher_by_code',
      params: obj,
      method: 'get'
    })
  },
  getPaypointDepartmentDataList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/data/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointDepartmentList: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/list',
      params: obj,
      method: 'get'
    })
  },
  getPaypointDepartmentInfo: (id) => {
    return axios.request({
      url: `/paypoint/paypointdepartment/info/${id}`,
      method: 'get'
    })
  },
  validateName: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/validate_name',
      data: obj,
      method: 'post'
    })
  },
  savePaypointDepartment: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/save',
      data: obj,
      method: 'post'
    })
  },
  updatePaypointDepartment: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/update',
      data: obj,
      method: 'post'
    })
  },
  deletePaypointDepartment: (obj) => {
    return axios.request({
      url: '/paypoint/paypointdepartment/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
