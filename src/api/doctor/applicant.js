import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  exportApplicant2Excel: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/export_excel',
      params: obj,
      method: 'post',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getDoctorRecommendList: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/recommend_list',
      params: obj,
      method: 'get'
    })
  },
  getDoctorReviewList: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/review_list',
      params: obj,
      method: 'get'
    })
  },
  getDoctorApplicantList: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getDoctorApplicantlist4Tutor: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/list4Tutor',
      params: obj,
      method: 'get'
    })
  },

  getDoctorApplicantInfo: (id, obj) => {
    return axios.request({
      url: `/doctor/apply/applicant/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  getDoctorApplicantScoreInfo: (id, obj) => {
    return axios.request({
      url: `/doctor/apply/applicant/score_info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveDoctorApplicant: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaApplicant: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/update',
      data: obj,
      method: 'post'
    })
  },
  saveApplicantRecomment4Tutor: (obj) => {
    return axios.request({
      url: '/doctor/apply/tutor/recommend/saveBatch',
      data: obj,
      method: 'post'
    })
  },
  getApplicantRecommentTutorList: (obj) => {
    return axios.request({
      url: '/doctor/apply/tutor/recommend/list',
      params: obj,
      method: 'get'
    })
  },
  updateMpaApplicantBatch: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/updateBatch',
      data: obj,
      method: 'post'
    })
  },
  deleteDoctorApplicant: (obj) => {
    return axios.request({
      url: '/doctor/apply/applicant/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
