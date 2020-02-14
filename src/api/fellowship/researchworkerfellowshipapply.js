import axios from '@/libs/api.request'

const api = {
  getResearchworkerFellowshipApplyDataList: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipapply/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerFellowshipApplyList: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipapply/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerFellowshipApplyInfo: (id) => {
    return axios.request({
      url: `/fellowship/researchworkerfellowshipapply/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerFellowshipApply: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipapply/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerFellowshipApply: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipapply/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerFellowshipApply: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipapply/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
