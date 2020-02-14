import axios from '@/libs/api.request'

const api = {
  getAllDepartmentTeacherTree: (obj) => {
    return axios.request({
      url: '/sys/alldepartment/treeTeacher',
      params: obj,
      method: 'get'
    })
  },
  getAllDepartmentTree: (obj) => {
    return axios.request({
      url: '/sys/alldepartment/tree',
      params: obj,
      method: 'get'
    })
  },
  getAllDepartmentList: (obj) => {
    return axios.request({
      url: '/sys/alldepartment/list',
      params: obj,
      method: 'get'
    })
  },
  getAllDepartmentInfo: (id, obj) => {
    return axios.request({
      url: `/sys/alldepartment/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveAllDepartment: (obj) => {
    return axios.request({
      url: '/sys/alldepartment/save',
      data: obj,
      method: 'post'
    })
  },
  updateAllDepartment: (obj) => {
    return axios.request({
      url: '/sys/alldepartment/update',
      data: obj,
      method: 'post'
    })
  },
  deleteAllDepartment: (obj) => {
    return axios.request({
      url: '/sys/alldepartment/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
