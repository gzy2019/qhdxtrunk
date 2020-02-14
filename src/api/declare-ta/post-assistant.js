import axios from '@/libs/api.request'

const api = {
  getPostAssistantList: (obj) => {
    return axios.request({
      url: 'declare/ta/postassistant/list',
      params: obj,
      method: 'get'
    })
  },
  getOwnerPostAssistantList: (obj) => {
    return axios.request({
      url: 'declare/ta/postassistant/listByTeacher',
      params: obj,
      method: 'get'
    })
  },
  getPostAssistantInfo: (id, obj) => {
    return axios.request({
      url: `declare/ta/postassistant/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  savePostAssistant: (obj) => {
    return axios.request({
      url: 'declare/ta/postassistant/save',
      data: obj,
      method: 'post'
    })
  },

  updatePostAssistant: (obj) => {
    return axios.request({
      url: 'declare/ta/postassistant/update',
      data: obj,
      method: 'post'
    })
  },

  deletePostAssistant: (obj) => {
    return axios.request({
      url: 'declare/ta/postassistant/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
