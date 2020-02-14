import axios from '@/libs/api.request'

const api = {
  getProjectData: (obj) => {
    return axios.request({
      url: '/master/common/data/project',
      params: obj,
      method: 'get'
    })
  },
  getProjectList: (obj) => {
    return axios.request({
      url: '/master/apply/project/list',
      params: obj,
      method: 'get'
    })
  },
  getProjectInfo: (id, obj) => {
    return axios.request({
      url: `/master/apply/project/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveProject: (obj) => {
    return axios.request({
      url: '/master/apply/project/save',
      data: obj,
      method: 'post'
    })
  },

  updateProject: (obj) => {
    return axios.request({
      url: '/master/apply/project/update',
      data: obj,
      method: 'post'
    })
  },
  deleteProject: (obj) => {
    return axios.request({
      url: '/master/apply/project/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
