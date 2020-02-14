import axios from '@/libs/api.request'

const api = {
  getSchoolfellowInfoDataList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowinfo/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowInfoList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowinfo/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowInfoInfo: (id) => {
    return axios.request({
      url: `/schoolfellow/schoolfellowinfo/info/${id}`,
      method: 'get'
    })
  },
  saveSchoolfellowInfo: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowinfo/save',
      data: obj,
      method: 'post'
    })
  },
  updateSchoolfellowInfo: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowinfo/update',
      data: obj,
      method: 'post'
    })
  },
  updatetagSchoolfellowInfo: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowinfo/updatetag',
      data: obj,
      method: 'post'
    })
  },
  deleteSchoolfellowInfo: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowinfo/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
