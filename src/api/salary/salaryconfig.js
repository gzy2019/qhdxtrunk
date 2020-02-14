import axios from '@/libs/api.request'

const api = {
  getSalaryConfigDataList: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryDepartmentDataList: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/data/department_list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryConfigList: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryConfigInfo: (id) => {
    return axios.request({
      url: `/salary/salaryconfig/info/${id}`,
      method: 'get'
    })
  },
  saveSalaryConfig: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/save',
      data: obj,
      method: 'post'
    })
  },
  validateSalaryConfig: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/validate',
      data: obj,
      method: 'post'
    })
  },
  updateSalaryConfig: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/update',
      data: obj,
      method: 'post'
    })
  },
  deleteSalaryConfig: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
