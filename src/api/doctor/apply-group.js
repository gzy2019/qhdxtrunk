import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  getScoreTeacherList: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/scored_teacher',
      params: obj,
      method: 'post',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getRecommendedTeacherList: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/recommended_teacher',
      params: obj,
      method: 'post',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getScoreApplicantList: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/scored_applicant',
      params: obj,
      method: 'post',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getRecommendedApplicantList: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/recommended_applicant',
      params: obj,
      method: 'post',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getApplyGroupList: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/list',
      params: obj,
      method: 'get'
    })
  },
  getApplyGroupInfo: (id) => {
    return axios.request({
      url: `/doctor/apply/group/info/${id}`,
      method: 'get'
    })
  },
  getApplyGroupScoreInfo: (obj) => {
    return axios.request({
      url: `/doctor/apply/group/score_info`,
      params: obj,
      method: 'get'
    })
  },
  selectStudent: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/select_student',
      params: obj,
      method: 'get'
    })
  },
  selectTeacher: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/select_teacher',
      params: obj,
      method: 'get'
    })
  },
  saveApplyGroup: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/save',
      data: obj,
      method: 'post'
    })
  },
  updateApplyGroup: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/update',
      data: obj,
      method: 'post'
    })
  },

  deleteApplyGroup: (obj) => {
    return axios.request({
      url: '/doctor/apply/group/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
