import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  getStatsByCategory: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/stats_by_category',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getStatsByDepartment: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/stats_by_department',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getStatsBySummary: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/stats_by_summary',
      params: obj,
      method: 'get'
    })
  },
  getBudgetDepartmentMainDataList: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/data/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetDepartmentMainList: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/list',
      params: obj,
      method: 'get'
    })
  },
  exportBudgetDepartmentMain: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/export_excel',
      params: obj,
      method: 'get'
    })
  },
  getBudgetDepartmentMainInfoByDept: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/info_by_dept',
      params: obj,
      method: 'get'
    })
  },
  copyFromLastYear: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/copy_from_last',
      params: obj,
      method: 'get'
    })
  },
  getBudgetDepartmentMainInfo: (id) => {
    return axios.request({
      url: `/budget/budgetdepartmentmain/info/${id}`,
      method: 'get'
    })
  },
  saveBudgetDepartmentMain: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/save',
      data: obj,
      method: 'post'
    })
  },
  updateBudgetDepartmentMain: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/update',
      data: obj,
      method: 'post'
    })
  },
  deleteBudgetDepartmentMain: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartmentmain/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
