import axios from '@/libs/api.request'

const api = {
  getMpaaScoreList: (obj) => {
    return axios.request({
      url: '/mpa/mpaascore/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaaScoreInfo: (id, obj) => {
    return axios.request({
      url: `/mpa/mpaascore/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpaaScore: (obj) => {
    return axios.request({
      url: '/mpa/mpaascore/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaaScore: (obj) => {
    return axios.request({
      url: '/mpa/mpaascore/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpaaScore: (obj) => {
    return axios.request({
      url: '/mpa/mpaascore/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
