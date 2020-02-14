import axios from '@/libs/api.request'

const api = {
  getAchievementPaperSourceList: (obj) => {
    return axios.request({
      url: '/achievement/achievementpapersource/list',
      params: obj,
      method: 'get'
    })
  },
  getAchievementPaperSourceInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementpapersource/info/${id}`,
      method: 'get'
    })
  },
  getTeacherInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementpapersource/teacher/${id}`,
      method: 'get'
    })
  },
  saveAchievementPaperSource: (obj) => {
    return axios.request({
      url: '/achievement/achievementpapersource/save',
      data: obj,
      method: 'post'
    })
  },
  updateAchievementPaperSource: (obj) => {
    return axios.request({
      url: '/achievement/achievementpapersource/update',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementPaperSource: (obj) => {
    return axios.request({
      url: '/achievement/achievementpapersource/delete',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementPaperSourceAll: (obj) => {
    return axios.request({
      url: '/achievement/achievementpapersource/delete_all',
      data: obj,
      method: 'post'
    })
  }
}

export default api
