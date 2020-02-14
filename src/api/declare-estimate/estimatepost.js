import axios from '@/libs/api.request'

const api = {
  getTeacherByCode: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/teacher_by_code',
      params: obj,
      method: 'get'
    })
  },
  getStudentByCode: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/student_by_code',
      params: obj,
      method: 'get'
    })
  },
  getAllTeacherList: (obj) => {
    return axios.request({
      url: '/sys/allteacher/all',
      params: obj,
      method: 'get'
    })
  },
  getAllStudentList: (obj) => {
    return axios.request({
      url: '/sys/allstudent/all',
      params: obj,
      method: 'get'
    })
  },
  exportEstimatePostAttachment: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/export_attachment',
      params: obj,
      method: 'get'
    })
  },
  getEstimateBatchList: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/batch_list',
      params: obj,
      method: 'get'
    })
  },
  getEstimatePostList: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/list',
      params: obj,
      method: 'get'
    })
  },
  getEstimatePostInfo: (id) => {
    return axios.request({
      url: `/declare/estimatepost/info/${id}`,
      method: 'get'
    })
  },
  saveEstimatePost: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/save',
      data: obj,
      method: 'post'
    })
  },
  updateEstimatePost: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/update',
      data: obj,
      method: 'post'
    })
  },
  deleteEstimatePost: (obj) => {
    return axios.request({
      url: '/declare/estimatepost/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
