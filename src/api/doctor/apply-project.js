import axios from '@/libs/api.request'

const api = {
  getProjectData: (obj) => {
    return axios.request({
      url: '/doctor/common/data/project',
      params: obj,
      method: 'get'
    })
  },
  getProjectData4Tutor: (obj) => {
    return axios.request({
      url: '/doctor/common/data/project4Tutor',
      params: obj,
      method: 'get'
    })
  },
  getProjectList: (obj) => {
    return axios.request({
      url: '/doctor/apply/project/list',
      params: obj,
      method: 'get'
    })
  },
  getProjectInfo: (id, obj) => {
    return axios.request({
      url: `/doctor/apply/project/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  validateDuplicated: (obj) => {
    return axios.request({
      url: '/doctor/apply/project/validateDuplicated',
      data: obj,
      method: 'post'
    })
  },
  saveProject: (obj) => {
    return axios.request({
      url: '/doctor/apply/project/save',
      data: obj,
      method: 'post'
    })
  },

  updateProject: (obj) => {
    return axios.request({
      url: '/doctor/apply/project/update',
      data: obj,
      method: 'post'
    })
  },
  deleteProject: (obj) => {
    return axios.request({
      url: '/doctor/apply/project/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
