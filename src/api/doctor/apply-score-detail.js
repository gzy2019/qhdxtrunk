import axios from '@/libs/api.request'

const api = {
  getScoreDetailList4SectionOne: (obj) => {
    return axios.request({
      url: '/doctor/apply/scoredetail/score_list',
      params: obj,
      method: 'get'
    })
  },
  getScoreDetailList4SectionTwo: (obj) => {
    return axios.request({
      url: '/doctor/apply/scoredetail/expert_score_list',
      params: obj,
      method: 'get'
    })
  },
  getApplyScoreDetailList2: (obj) => {
    return axios.request({
      url: '/doctor/apply/scoredetail/list2',
      params: obj,
      method: 'get'
    })
  },
  getApplyScoreDetailList: (obj) => {
    return axios.request({
      url: '/doctor/apply/scoredetail/list',
      params: obj,
      method: 'get'
    })
  },
  getApplyScoreDetailInfo: (id, obj) => {
    return axios.request({
      url: `/doctor/apply/scoredetail/info/${id}`,
      params: obj,
      method: 'get'
    })
  },
  saveApplyScoreDetail: (obj) => {
    return axios.request({
      url: '/doctor/apply/scoredetail/save',
      data: obj,
      method: 'post'
    })
  },
  updateApplyScoreDetail: (obj) => {
    return axios.request({
      url: '/doctor/apply/scoredetail/update',
      data: obj,
      method: 'post'
    })
  },
  submitRecommend: (obj) => {
    return axios.request({
      url: '/doctor/apply/scoredetail/submit_recommend',
      data: obj,
      method: 'post'
    })
  }
}

export default api
