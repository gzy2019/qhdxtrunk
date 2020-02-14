import axios from '@/libs/api.request'

const api = {
  getAchievementProjectMoneyList: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectmoney/list',
      params: obj,
      method: 'get'
    })
  },
  getAchievementProjectMoneyInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementprojectmoney/info/${id}`,
      method: 'get'
    })
  },
  saveAchievementProjectMoney: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectmoney/save',
      data: obj,
      method: 'post'
    })
  },
  updateAchievementProjectMoney: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectmoney/update',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementProjectMoney: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectmoney/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
