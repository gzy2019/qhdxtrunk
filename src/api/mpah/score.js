import axios from '@/libs/api.request'

const api = {
  getMpaaScoreList: (obj) => {
    return axios.request({
      url: '/mpah/mpaascore/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaaScoreInfo: (id, obj) => {
    return axios.request({
      url: `/mpah/mpaascore/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpaaScore: (obj) => {
    return axios.request({
      url: '/mpah/mpaascore/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaaScore: (obj) => {
    return axios.request({
      url: '/mpah/mpaascore/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpaaScore: (obj) => {
    return axios.request({
      url: '/mpah/mpaascore/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
