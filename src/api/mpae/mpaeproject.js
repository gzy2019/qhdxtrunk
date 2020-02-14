import axios from '@/libs/api.request'

const api = {
  getClassList: (obj) => {
    return axios.request({
      url: '/mpa/common/data/class',
      params: obj,
      method: 'get'
    })
  },
  getMpaeProjectList4Student: (obj) => {
    return axios.request({
      url: '/mpa/mpaeproject/student_list',
      params: obj,
      method: 'get'
    })
  },
  getMpaeProjectSelectList: (obj) => {
    return axios.request({
      url: '/mpa/mpaeproject/select_list',
      params: obj,
      method: 'get'
    })
  },
  getMpaeProjectList: (obj) => {
    return axios.request({
      url: '/mpa/mpaeproject/list',
      params: obj,
      method: 'get'
    })
  },
  getMpaeProjectInfo: (id) => {
    return axios.request({
      url: `/mpa/mpaeproject/info/${id}`,
      method: 'get'
    })
  },
  saveMpaeProject: (obj) => {
    return axios.request({
      url: '/mpa/mpaeproject/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaeProject: (obj) => {
    return axios.request({
      url: '/mpa/mpaeproject/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMpaeProject: (obj) => {
    return axios.request({
      url: '/mpa/mpaeproject/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
