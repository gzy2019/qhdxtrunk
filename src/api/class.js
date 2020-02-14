import axios from '@/libs/api.request'

const api = {
  getAllClass: (obj) => {
    return axios.request({
      url: '/sys/allclass/all',
      params: obj,
      method: 'get'
    })
  },
  getClassList: (obj) => {
    return axios.request({
      url: '/sys/allclass/list',
      params: obj,
      method: 'get'
    })
  },
  getClassInfo: (id, obj) => {
    return axios.request({
      url: `/sys/allclass//info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveClassData: (obj) => {
    return axios.request({
      url: '/sys/allclass/save',
      data: obj,
      method: 'post'
    })
  },
  updateClassData: (obj) => {
    return axios.request({
      url: '/sys/allclass/update',
      data: obj,
      method: 'post'
    })
  },
  updateGraduatingBatch: (obj) => {
    return axios.request({
      url: '/sys/allclass/updateGraduatingBatch',
      data: obj,
      method: 'post'
    })
  },
  deleteClassData: (obj) => {
    return axios.request({
      url: '/sys/allclass/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
