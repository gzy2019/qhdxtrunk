import axios from '@/libs/api.request'

const api = {
  getResearchworkerActivityDataList: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkeractivity/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerActivityList: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkeractivity/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerActivityInfo: (id) => {
    return axios.request({
      url: `/pukactivity/researchworkeractivity/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerActivity: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkeractivity/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerActivity: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkeractivity/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerActivity: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkeractivity/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
