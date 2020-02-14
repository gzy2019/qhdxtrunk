import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  exportApplicant2Excel: (obj) => {
    return axios.request({
      url: '/mpa/applicant/export_excel',
      params: obj,
      method: 'post',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getMpaApplicantList: (obj) => {
    return axios.request({
      url: '/mpa/applicant/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getMpaApplicantInfo: (id, obj) => {
    return axios.request({
      url: `/mpa/applicant/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  getMpaApplicantScoreInfo: (id, obj) => {
    return axios.request({
      url: `/mpa/applicant/score_info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMpaApplicant: (obj) => {
    return axios.request({
      url: '/mpa/applicant/save',
      data: obj,
      method: 'post'
    })
  },

  updateMpaApplicant: (obj) => {
    return axios.request({
      url: '/mpa/applicant/update',
      data: obj,
      method: 'post'
    })
  },

  deleteMpaApplicant: (obj) => {
    return axios.request({
      url: '/mpa/applicant/delete',
      data: obj,
      method: 'post'
    })
  },
  getBaseInfo: (obj) => {
    return axios.request({
      url: `/mpa/applicant/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveBaseInfo: (obj) => {
    return axios.request({
      url: '/mpa/applicant/save',
      data: obj,
      method: 'post'
    })
  },
  getStudyExp: (obj) => {
    return axios.request({
      url: `/mpa/applicantstudy/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveStudyExp: (obj) => {
    return axios.request({
      url: '/mpa/applicantstudy/save',
      data: obj,
      method: 'post'
    })
  },
  getWorkExp: (obj) => {
    return axios.request({
      url: `/mpa/applicantwork/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveWorkExp: (obj) => {
    return axios.request({
      url: '/mpa/applicantwork/save',
      data: obj,
      method: 'post'
    })
  },
  getPaperInfo: (obj) => {
    return axios.request({
      url: `/mpa/applicantpaper/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  savePaperInfo: (obj) => {
    return axios.request({
      url: '/mpa/applicantpaper/save',
      data: obj,
      method: 'post'
    })
  },
  getRecommendInfo: (obj) => {
    return axios.request({
      url: `/mpa/applicantrecommend/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveRecommendInfo: (obj) => {
    return axios.request({
      url: '/mpa/applicantrecommend/save',
      data: obj,
      method: 'post'
    })
  },
  getFileInfo: (obj) => {
    return axios.request({
      url: `/mpa/applicantfile/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveFileInfo: (obj) => {
    return axios.request({
      url: '/mpa/applicantfile/save',
      data: obj,
      method: 'post'
    })
  }
}

export default api
