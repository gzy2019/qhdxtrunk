import axios from '@/libs/api.request'

const api = {
  getMpacBatchCourseList: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatchcourse/list',
      params: obj,
      method: 'get'
    })
  },
  getMpacBatchCourseInfo: (id, obj) => {
    return axios.request({
      url: `/mpa/mpacbatchcourse/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpacBatchCourse: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatchcourse/save',
      data: obj,
      method: 'post'
    })
  },

  updateMpacBatchCourse: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatchcourse/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpacBatchCourse: (obj) => {
    return axios.request({
      url: '/mpa/mpacbatchcourse/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
