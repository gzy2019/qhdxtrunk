import axios from '@/libs/api.request'

const api = {
  getResearchworkerGatherDataList: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkergather/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerGatherList: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkergather/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerGatherInfo: (id) => {
    return axios.request({
      url: `/pukactivity/researchworkergather/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerGather: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkergather/save',
      data: obj,
      method: 'post'
    })
  },
  saveResearchworkerGather1: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkergather/savebatch',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerGather: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkergather/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerGather: (obj) => {
    return axios.request({
      url: '/pukactivity/researchworkergather/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
