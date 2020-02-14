import axios from '@/libs/api.request'

const api = {
  getTeacherDataList: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartment/data/teacher_list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetDepartmentDataList: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartment/data/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetDepartmentList: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartment/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetDepartmentInfo: (id) => {
    return axios.request({
      url: `/budget/budgetdepartment/info/${id}`,
      method: 'get'
    })
  },
  saveBudgetDepartment: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartment/save',
      data: obj,
      method: 'post'
    })
  },
  updateBudgetDepartment: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartment/update',
      data: obj,
      method: 'post'
    })
  },
  deleteBudgetDepartment: (obj) => {
    return axios.request({
      url: '/budget/budgetdepartment/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
