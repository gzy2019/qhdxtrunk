import axios from '@/libs/api.request'

const api = {
  getResearchworkerSocialactivityInfoDataList: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityinfo/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerSocialactivityInfoList: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityinfo/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerSocialactivityInfoInfo: (id) => {
    return axios.request({
      url: `/socialActivity/researchworkersocialactivityinfo/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerSocialactivityInfo: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityinfo/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerSocialactivityInfo: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityinfo/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerSocialactivityInfo: (obj) => {
    return axios.request({
      url: '/socialActivity/researchworkersocialactivityinfo/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
