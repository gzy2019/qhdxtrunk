import axios from '@/libs/api.request'

const api = {
  getBudgetIncomeDataList: (obj) => {
    return axios.request({
      url: '/budget/budgetincome/data/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetIncomeList: (obj) => {
    return axios.request({
      url: '/budget/budgetincome/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetIncomeInfo: (id) => {
    return axios.request({
      url: `/budget/budgetincome/info/${id}`,
      method: 'get'
    })
  },
  saveBudgetIncome: (obj) => {
    return axios.request({
      url: '/budget/budgetincome/save',
      data: obj,
      method: 'post'
    })
  },
  updateBudgetIncome: (obj) => {
    return axios.request({
      url: '/budget/budgetincome/update',
      data: obj,
      method: 'post'
    })
  },
  deleteBudgetIncome: (obj) => {
    return axios.request({
      url: '/budget/budgetincome/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
