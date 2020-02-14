import axios from '@/libs/api.request'

const api = {
  getBudgetSpendingDataList: (obj) => {
    return axios.request({
      url: '/budget/budgetspending/data/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetSpendingList: (obj) => {
    return axios.request({
      url: '/budget/budgetspending/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetSpendingInfo: (id) => {
    return axios.request({
      url: `/budget/budgetspending/info/${id}`,
      method: 'get'
    })
  },
  saveBudgetSpending: (obj) => {
    return axios.request({
      url: '/budget/budgetspending/save',
      data: obj,
      method: 'post'
    })
  },
  updateBudgetSpending: (obj) => {
    return axios.request({
      url: '/budget/budgetspending/update',
      data: obj,
      method: 'post'
    })
  },
  deleteBudgetSpending: (obj) => {
    return axios.request({
      url: '/budget/budgetspending/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
