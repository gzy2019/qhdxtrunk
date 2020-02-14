import axios from '@/libs/api.request'

const api = {
  getAchievementBatchList: (obj) => {
    return axios.request({
      url: '/achievement/achievementbatch/list',
      params: obj,
      method: 'get'
    })
  },
  getAchievementBatchInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementbatch/info/${id}`,
      method: 'get'
    })
  },
  saveAchievementBatch: (obj) => {
    return axios.request({
      url: '/achievement/achievementbatch/save',
      data: obj,
      method: 'post'
    })
  },
  updateAchievementBatch: (obj) => {
    return axios.request({
      url: '/achievement/achievementbatch/update',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementBatch: (obj) => {
    return axios.request({
      url: '/achievement/achievementbatch/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
