import axios from '@/libs/api.request'

const api = {
  getAchievementBatchList: (obj) => {
    return axios.request({
      url: '/achievement/achievementinfo/batch_list',
      params: obj,
      method: 'get'
    })
  },
  getMyAchievementInfoList: (obj) => {
    return axios.request({
      url: '/achievement/achievementinfo/my_list',
      params: obj,
      method: 'get'
    })
  },
  getAchievementInfoList: (obj) => {
    return axios.request({
      url: '/achievement/achievementinfo/list',
      params: obj,
      method: 'get'
    })
  },
  getPaperSourceInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementinfo/paper_info/${id}`,
      method: 'get'
    })
  },
  getProjectSourceInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementinfo/project_info/${id}`,
      method: 'get'
    })
  },
  getAchievementInfoInfo: (id) => {
    return axios.request({
      url: `/achievement/achievementinfo/info/${id}`,
      method: 'get'
    })
  },
  saveAchievementInfo: (obj) => {
    return axios.request({
      url: '/achievement/achievementinfo/save',
      data: obj,
      method: 'post'
    })
  },
  updateAchievementInfo: (obj) => {
    return axios.request({
      url: '/achievement/achievementinfo/update',
      data: obj,
      method: 'post'
    })
  },
  deleteAchievementInfo: (obj) => {
    return axios.request({
      url: '/achievement/achievementinfo/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
