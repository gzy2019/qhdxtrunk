import axios from '@/libs/api.request'

const api = {
  getMpaaScoreDetailList2: (obj) => {
    return axios.request({
      url: '/mpah/mpaascoredetail/list2',
      params: obj,
      method: 'get'
    })
  },
  getMpaaScoreDetailList: (obj) => {
    return axios.request({
      url: '/mpah/mpaascoredetail/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaaScoreDetailInfo: (id, obj) => {
    return axios.request({
      url: `/mpah/mpaascoredetail/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpaaScoreDetail: (obj) => {
    return axios.request({
      url: '/mpah/mpaascoredetail/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaaScoreDetail: (obj) => {
    return axios.request({
      url: '/mpah/mpaascoredetail/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpaaScoreDetail: (obj) => {
    return axios.request({
      url: '/mpah/mpaascoredetail/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
