import axios from '@/libs/api.request'

const api = {
  getClassList: (obj) => {
    return axios.request({
      url: '/mpa/common/data/class',
      params: obj,
      method: 'get'
    })
  },
  getMpadProjectList4Student: (obj) => {
    return axios.request({
      url: '/mpa/mpadprojectpre/student_list',
      params: obj,
      method: 'get'
    })
  },
  getMpadProjectSelectList: (obj) => {
    return axios.request({
      url: '/mpa/mpadprojectpre/select_list',
      params: obj,
      method: 'get'
    })
  },
  getMpadProjectList: (obj) => {
    return axios.request({
      url: '/mpa/mpadprojectpre/list',
      params: obj,
      method: 'get'
    })
  },
  getMpadProjectInfo: (id) => {
    return axios.request({
      url: `/mpa/mpadprojectpre/info/${id}`,
      method: 'get'
    })
  },
  saveMpadProject: (obj) => {
    return axios.request({
      url: '/mpa/mpadprojectpre/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpadProject: (obj) => {
    return axios.request({
      url: '/mpa/mpadprojectpre/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMpadProject: (obj) => {
    return axios.request({
      url: '/mpa/mpadprojectpre/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
