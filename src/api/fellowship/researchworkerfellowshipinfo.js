import axios from '@/libs/api.request'

const api = {
  getResearchworkerFellowshipInfoDataList: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipinfo/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerFellowshipInfoList: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipinfo/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerFellowshipInfoInfo: (id) => {
    return axios.request({
      url: `/fellowship/researchworkerfellowshipinfo/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerFellowshipInfo: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipinfo/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerFellowshipInfo: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipinfo/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerFellowshipInfo: (obj) => {
    return axios.request({
      url: '/fellowship/researchworkerfellowshipinfo/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
