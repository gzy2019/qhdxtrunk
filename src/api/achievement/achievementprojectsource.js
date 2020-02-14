import axios from '@/libs/api.request'

const api = {
  getAchievementProjectSourceList: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectsource/list',
      params: obj,
      method: 'get'
    })
  },
  getAchievementProjectSourceInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementprojectsource/info/${id}`,
      method: 'get'
    })
  },
  saveAchievementProjectSource: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectsource/save',
      data: obj,
      method: 'post'
    })
  },
  updateAchievementProjectSource: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectsource/update',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementProjectSource: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectsource/delete',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementProjectSourceAll: (obj) => {
    return axios.request({
      url: '/achievement/achievementprojectsource/delete_all',
      data: obj,
      method: 'post'
    })
  }
}

export default api
