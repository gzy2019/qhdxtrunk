import axios from '@/libs/api.request'

const api = {
  getTutorList: (obj) => {
    return axios.request({
      url: 'declare/declaretutordesc/list',
      params: obj,
      method: 'get'
    })
  },
  getTutorListAll: (obj) => {
    return axios.request({
      url: 'declare/declaretutordesc/listAll',
      params: obj,
      method: 'get'
    })
  },
  getTutorInfo: (id, obj) => {
    return axios.request({
      url: `declare/declaretutordesc/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  getTutorInfoByTeacher: (id, obj) => {
    return axios.request({
      url: `declare/declaretutordesc/infoByTeacher/${id}`,
      params: obj,
      method: 'get'
    })
  },
  validateDuplicated: (obj) => {
    return axios.request({
      url: `declare/declaretutordesc/validateDuplicated`,
      data: obj,
      method: 'post'
    })
  },
  saveTutor: (obj) => {
    return axios.request({
      url: 'declare/declaretutordesc/save',
      data: obj,
      method: 'post'
    })
  },
  updateTutor: (obj) => {
    return axios.request({
      url: 'declare/declaretutordesc/update',
      data: obj,
      method: 'post'
    })
  },
  deleteTutor: (obj) => {
    return axios.request({
      url: 'declare/declaretutordesc/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
