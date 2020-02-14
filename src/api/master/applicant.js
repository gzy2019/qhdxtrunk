import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  exportApplicant2Excel: (obj) => {
    return axios.request({
      url: '/master/apply/applicant/export_excel',
      params: obj,
      method: 'post',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getMasterRecommendList: (obj) => {
    return axios.request({
      url: '/master/apply/applicant/recommend_list',
      params: obj,
      method: 'get'
    })
  },
  getMasterReviewList: (obj) => {
    return axios.request({
      url: '/master/apply/applicant/review_list',
      params: obj,
      method: 'get'
    })
  },
  getMasterApplicantList: (obj) => {
    return axios.request({
      url: '/master/apply/applicant/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getMasterApplicantInfo: (id, obj) => {
    return axios.request({
      url: `/master/apply/applicant/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  getMasterApplicantScoreInfo: (id, obj) => {
    return axios.request({
      url: `/master/apply/applicant/score_info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMasterApplicant: (obj) => {
    return axios.request({
      url: '/master/apply/applicant/save',
      data: obj,
      method: 'post'
    })
  },
  updateMpaApplicant: (obj) => {
    return axios.request({
      url: '/master/apply/applicant/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMasterApplicant: (obj) => {
    return axios.request({
      url: '/master/apply/applicant/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
