import axios from '@/libs/api.request'

const api = {
  getSchoolfellowJobupdateDataList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowjobupdate/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowJobupdateList: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowjobupdate/list',
      params: obj,
      method: 'get'
    })
  },
  getSchoolfellowJobupdateInfo: (id) => {
    return axios.request({
      url: `/schoolfellow/schoolfellowjobupdate/info/${id}`,
      method: 'get'
    })
  },
  saveSchoolfellowJobupdate: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowjobupdate/save',
      data: obj,
      method: 'post'
    })
  },
  updateSchoolfellowJobupdate: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowjobupdate/update',
      data: obj,
      method: 'post'
    })
  },
  deleteSchoolfellowJobupdate: (obj) => {
    return axios.request({
      url: '/schoolfellow/schoolfellowjobupdate/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
