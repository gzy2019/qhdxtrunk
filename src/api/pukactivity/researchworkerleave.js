import axios from '@/libs/api.request'

const api = {
  getResearchworkerLeaveDataList: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkerleave/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerLeaveList: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkerleave/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerLeaveInfo: (id) => {
    return axios.request({
      url: `/pukactivity/researchworkerleave/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerLeave: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkerleave/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerLeave: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkerleave/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerLeave: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkerleave/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
