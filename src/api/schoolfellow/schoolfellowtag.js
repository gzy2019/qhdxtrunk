import axios from '@/libs/api.request'

const api = {
  getSchoolfellowTagDataList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowtag/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowTagList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowtag/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowTagInfo: (id) => {
    return axios.request({
      url: `/schoolfellow/schoolfellowtag/info/${id}`,
      method: 'get'
    })
  },
  saveSchoolfellowTag: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowtag/save',
      data: obj,
      method: 'post'
    })
  },
  updateSchoolfellowTag: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowtag/update',
      data: obj,
      method: 'post'
    })
  },
  deleteSchoolfellowTag: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowtag/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
