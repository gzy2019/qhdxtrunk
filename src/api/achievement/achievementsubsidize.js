import axios from '@/libs/api.request'

const api = {
  getAchievementSubsidizeDataList: (obj) => {
    return axios.request({
      url: '/achievement/achievementsubsidize/data/list',
      params: obj,
      method: 'get'
    })
  },
  getAchievementSubsidizeList: (obj) => {
    return axios.request({
      url: '/achievement/achievementsubsidize/list',
      params: obj,
      method: 'get'
    })
  },
  getAchievementSubsidizeInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementsubsidize/info/${id}`,
      method: 'get'
    })
  },
  saveAchievementSubsidize: (obj) => {
    return axios.request({
      url: '/achievement/achievementsubsidize/save',
      data: obj,
      method: 'post'
    })
  },
  updateAchievementSubsidize: (obj) => {
    return axios.request({
      url: '/achievement/achievementsubsidize/update',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementSubsidize: (obj) => {
    return axios.request({
      url: '/achievement/achievementsubsidize/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
