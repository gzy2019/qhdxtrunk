import axios from '@/libs/api.request'

const api = {
  getResearchworkerFellowshipResultDataList: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipresult/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerFellowshipResultList: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipresult/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerFellowshipResultInfo: (id) => {
    return axios.request({
      url: `/fellowship/researchworkerfellowshipresult/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerFellowshipResult: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipresult/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerFellowshipResult: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipresult/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerFellowshipResult: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipresult/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
