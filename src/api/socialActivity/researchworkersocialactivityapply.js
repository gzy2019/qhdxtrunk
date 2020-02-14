import axios from '@/libs/api.request'

const api = {
  getResearchworkerSocialactivityApplyDataList: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityapply/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerSocialactivityApplyList: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityapply/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerSocialactivityApplyInfo: (id) => {
    return axios.request({
      url: `/socialActivity/researchworkersocialactivityapply/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerSocialactivityApply: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityapply/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerSocialactivityApply: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityapply/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerSocialactivityApply: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityapply/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
