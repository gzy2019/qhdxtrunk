import axios from '@/libs/api.request'

const api = {
  getBudgetBatchDataList: (obj) => {
    return axios.request({
      url: '/budget/budgetbatch/data/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetBatchList: (obj) => {
    return axios.request({
      url: '/budget/budgetbatch/list',
      params: obj,
      method: 'get'
    })
  },
  getBudgetBatchInfo: (id) => {
    return axios.request({
      url: `/budget/budgetbatch/info/${id}`,
      method: 'get'
    })
  },
  saveBudgetBatch: (obj) => {
    return axios.request({
      url: '/budget/budgetbatch/save',
      data: obj,
      method: 'post'
    })
  },
  updateBudgetBatch: (obj) => {
    return axios.request({
      url: '/budget/budgetbatch/update',
      data: obj,
      method: 'post'
    })
  },
  deleteBudgetBatch: (obj) => {
    return axios.request({
      url: '/budget/budgetbatch/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
