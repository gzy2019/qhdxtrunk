import axios from '@/libs/api.request'

const api = {
  getTeacherDataList: (obj) => {
    return axios.request({
      url: '/salary/salarydepartment/data/teacher_list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryDepartmentDataList: (obj) => {
    return axios.request({
      url: '/salary/salarydepartment/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryDepartmentList: (obj) => {
    return axios.request({
      url: '/salary/salarydepartment/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryDepartmentInfo: (id) => {
    return axios.request({
      url: `/salary/salarydepartment/info/${id}`,
      method: 'get'
    })
  },
  saveSalaryDepartment: (obj) => {
    return axios.request({
      url: '/salary/salarydepartment/save',
      data: obj,
      method: 'post'
    })
  },
  updateSalaryDepartment: (obj) => {
    return axios.request({
      url: '/salary/salarydepartment/update',
      data: obj,
      method: 'post'
    })
  },
  deleteSalaryDepartment: (obj) => {
    return axios.request({
      url: '/salary/salarydepartment/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
