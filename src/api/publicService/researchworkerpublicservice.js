import axios from '@/libs/api.request'

const api = {
  getResearchworkerPublicserviceDataList: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservice/data/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerPublicserviceList: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservice/list',
      params: obj,
      method: 'get'
    })
  },
  getResearchworkerPublicserviceInfo: (id) => {
    return axios.request({
      url: `/publicService/researchworkerpublicservice/info/${id}`,
      method: 'get'
    })
  },
  saveResearchworkerPublicservice: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservice/save',
      data: obj,
      method: 'post'
    })
  },
  updateResearchworkerPublicservice: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservice/update',
      data: obj,
      method: 'post'
    })
  },
  deleteResearchworkerPublicservice: (obj) => {
    return axios.request({
      url: '/publicService/researchworkerpublicservice/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
