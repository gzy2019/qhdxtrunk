import axios from '@/libs/api.request'

const api = {
  getProjectData: (obj) => {
    return axios.request({
      url: '/mpah/common/data/project',
      params: obj,
      method: 'get'
    })
  },
  getProjectList: (obj) => {
    return axios.request({
      url: '/mpah/project/list',
      params: obj,
      method: 'get'
    })
  },
  getProjectInfo: (id, obj) => {
    return axios.request({
      url: `/mpah/project/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  validateDuplicated: (obj) => {
    return axios.request({
      url: '/mpah/project/validateDuplicated',
      data: obj,
      method: 'post'
    })
  },
  saveProject: (obj) => {
    return axios.request({
      url: '/mpah/project/save',
      data: obj,
      method: 'post'
    })
  },
  updateProject: (obj) => {
    return axios.request({
      url: '/mpah/project/update',
      data: obj,
      method: 'post'
    })
  },
  deleteProject: (obj) => {
    return axios.request({
      url: '/mpah/project/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
