import axios from '@/libs/api.request'

const api = {
  getSchoolfellowCommunicationDataList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowcommunication/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowCommunicationList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowcommunication/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowCommunicationInfo: (id) => {
    return axios.request({
      url: `/schoolfellow/schoolfellowcommunication/info/${id}`,
      method: 'get'
    })
  },
  saveSchoolfellowCommunication: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowcommunication/save',
      data: obj,
      method: 'post'
    })
  },
  updateSchoolfellowCommunication: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowcommunication/update',
      data: obj,
      method: 'post'
    })
  },
  deleteSchoolfellowCommunication: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowcommunication/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
