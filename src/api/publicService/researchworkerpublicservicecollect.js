import axios from '@/libs/api.request'

const api = {
  getResearchworkerPublicserviceCollectDataList: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservicecollect/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerPublicserviceCollectList: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservicecollect/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerPublicserviceCollectInfo: (id) => {
    return axios.request({
      url: `/publicService/researchworkerpublicservicecollect/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerPublicserviceCollect: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservicecollect/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerPublicserviceCollect: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservicecollect/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerPublicserviceCollect: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservicecollect/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
