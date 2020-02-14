import axios from '@/libs/api.request'

const api = {
  getSalaryWorkDays: (obj) => {
    return axios.request({
      url: '/salary/salarypay/data/work_days',
      params: obj,
      method: 'get'
    })
  },
  updateSalaryWorkDays: (obj) => {
    return axios.request({
      url: '/salary/salarypay/update/work_days',
      params: obj,
      method: 'post'
    })
  },
  getSalaryDepartmentDataList: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/data/department_list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryConfigInfo: (obj) => {
    return axios.request({
      url: '/salary/salarypay/config_info',
      params: obj,
      method: 'get'
    })
  },
  getSalaryPayDataList: (obj) => {
    return axios.request({
      url: '/salary/salarypay/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryPayList: (obj) => {
    return axios.request({
      url: '/salary/salarypay/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryPayInfo: (id) => {
    return axios.request({
      url: `/salary/salarypay/info/${id}`,
      method: 'get'
    })
  },
  generateSalaryPay: (obj) => {
    return axios.request({
      url: '/salary/salarypay/generate',
      params: obj,
      method: 'post'
    })
  },
  saveSalaryPay: (obj) => {
    return axios.request({
      url: '/salary/salarypay/save',
      data: obj,
      method: 'post'
    })
  },
  updateSalaryPay: (obj) => {
    return axios.request({
      url: '/salary/salarypay/update',
      data: obj,
      method: 'post'
    })
  },
  batchUpdateStatus1: (obj) => {
    return axios.request({
      url: '/salary/salarypay/batch_status1',
      data: obj,
      method: 'post'
    })
  },
  batchUpdateStatus2: (obj) => {
    return axios.request({
      url: '/salary/salarypay/batch_status2',
      data: obj,
      method: 'post'
    })
  },
  deleteSalaryPay: (obj) => {
    return axios.request({
      url: '/salary/salarypay/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
