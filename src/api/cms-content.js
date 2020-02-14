import axios from '@/libs/api.request'

const api = {
  getCmsChannelTree: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/channel_tree',
      params: obj,
      method: 'get'
    })
  },
  getCmsContentList: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/list',
      params: obj,
      method: 'get'
    })
  },
  getCmsContentInfo: (id, obj) => {
    return axios.request({
      url: `/sys/cmscontent/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveCmsContent: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/save',
      data: obj,
      method: 'post'
    })
  },
  updateCmsContent: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/update',
      data: obj,
      method: 'post'
    })
  },
  copyCmsContent: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/copy',
      data: obj,
      method: 'post'
    })
  },
  setTopContent: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/set_top',
      data: obj,
      method: 'post'
    })
  },
  cancelTopContent: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/cancel_top',
      data: obj,
      method: 'post'
    })
  },
  deleteCmsContent: (obj) => {
    return axios.request({
      url: '/sys/cmscontent/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
