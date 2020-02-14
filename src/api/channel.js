import axios from '@/libs/api.request'

const api = {
  getCmsChannelTree: (obj) => {
    return axios.request({
      url: '/sys/cmschannel/tree',
      params: obj,
      method: 'get'
    })
  },
  getCmsChannelList: (obj) => {
    return axios.request({
      url: '/sys/cmschannel/list',
      params: obj,
      method: 'get'
    })
  },
  getCmsChannelInfo: (id, obj) => {
    return axios.request({
      url: `/sys/cmschannel/info/${id}`,
      params: {},
      method: 'get'
    })
  },
  saveCmsChannel: (obj) => {
    return axios.request({
      url: '/sys/cmschannel/save',
      data: obj,
      method: 'post'
    })
  },
  updateCmsChannel: (obj) => {
    return axios.request({
      url: '/sys/cmschannel/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCmsChannel: (obj) => {
    return axios.request({
      url: '/sys/cmschannel/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
