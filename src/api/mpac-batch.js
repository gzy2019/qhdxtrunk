import axios from '@/libs/api.request'

const api = {
  getMpacbatchList: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatch/list',
      params: obj,
      method: 'get'
    })
  },
  getMpacbatchListAll: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatch/listAll',
      params: obj,
      method: 'get'
    })
  },
  getMpacbatchInfo: (id, obj) => {
    return axios.request({
      url: `/mpa/mpacbatch/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpacbatch: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatch/save',
      data: obj,
      method: 'post'
    })
  },

  updateMpacbatchOpenFlag: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatch/updateOpenFlag',
      data: obj,
      method: 'post'
    })
  },

  updateMpacbatch: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatch/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpacbatch: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatch/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
