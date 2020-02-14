import axios from '@/libs/api.request'

const api = {
  getResearchworkerPublicserviceInfoDataList: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicserviceinfo/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerPublicserviceInfoList: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicserviceinfo/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerPublicserviceInfoInfo: (id) => {
    return axios.request({
      url: `/publicService/researchworkerpublicserviceinfo/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerPublicserviceInfo: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicserviceinfo/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerPublicserviceInfo: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicserviceinfo/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerPublicserviceInfo: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicserviceinfo/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
