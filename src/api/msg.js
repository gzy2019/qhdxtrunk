import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  getOrgTree: (obj) => {
    return axios.request({
      url: '/msg/group/orgTree',
      params: obj,
      method: 'get'
    })
  },
  getMsgGroupList: (obj) => {
    return axios.request({
      url: '/msg/group/list',
      params: obj,
      method: 'get'
    })
  },
  getMsgGroupInfo: (id, obj) => {
    return axios.request({
      url: `/msg/group/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveMsgGroupData: (obj) => {
    return axios.request({
      url: '/msg/group/save',
      data: obj,
      method: 'post'
    })
  },
  updateMsgGroupData: (obj) => {
    return axios.request({
      url: '/msg/group/update',
      data: obj,
      method: 'post'
    })
  },
  deleteGroupData: (obj) => {
    return axios.request({
      url: '/msg/group/delete',
      data: obj,
      method: 'post'
    })
  },
  saveMailOutData: (obj) => {
    return axios.request({
      url: '/msg/mailoutbox/save',
      data: obj,
      method: 'post'
    })
  },
  saveSmsOutData: (obj) => {
    return axios.request({
      url: '/msg/smsoutbox/save',
      data: obj,
      method: 'post'
    })
  },
  getMailOutList: (obj) => {
    return axios.request({
      url: '/msg/mailoutbox/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getSmsOutList: (obj) => {
    return axios.request({
      url: '/msg/smsoutbox/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getSmsInList: (obj) => {
    return axios.request({
      url: '/msg/smsinbox/list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 内容模板
  getMsgTemplateDataList: (obj) => {
    return axios.request({
      url: '/msg/msgtemplate/data/list',
      params: obj,
      method: 'get'
    })
  },
  getMsgTemplateList: (obj) => {
    return axios.request({
      url: '/msg/msgtemplate/list',
      params: obj,
      method: 'get'
    })
  },
  getMsgTemplateInfo: (id) => {
    return axios.request({
      url: `/msg/msgtemplate/info/${id}`,
      method: 'get'
    })
  },
  validateMsgTemplateCode: (obj) => {
    return axios.request({
      url: '/msg/msgtemplate/validate_code',
      data: obj,
      method: 'post'
    })
  },
  saveMsgTemplate: (obj) => {
    return axios.request({
      url: '/msg/msgtemplate/save',
      data: obj,
      method: 'post'
    })
  },
  updateMsgTemplate: (obj) => {
    return axios.request({
      url: '/msg/msgtemplate/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMsgTemplate: (obj) => {
    return axios.request({
      url: '/msg/msgtemplate/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
