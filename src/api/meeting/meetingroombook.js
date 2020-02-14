import axios from '@/libs/api.request'
const qs = require('qs')

const api = {
  getMeetingRoomList: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/room_list',
      params: obj,
      method: 'get'
    })
  },
  getAllTeacherList: (obj) => {
    return axios.request({
      url: '/app/allteacher/all',
      params: obj,
      method: 'get'
    })
  },
  getMineBookList: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/my_list',
      params: obj,
      method: 'get'
    })
  },
  getBookTimeList: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/book_time_list',
      params: obj,
      method: 'get',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  getMeetingRoomInfo: (id) => {
    return axios.request({
      url: `/meeting/meetingroombook/meeting_room_info/${id}`,
      method: 'get'
    })
  },
  saveMeetingRoomBook: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/save',
      data: obj,
      method: 'post'
    })
  },
  updateMeetingRoomBook: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/update',
      data: obj,
      method: 'post'
    })
  },
  approveMeetingRoomBook: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/approve',
      data: obj,
      method: 'post'
    })
  },
  cancelMeetingRoomBook: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/delete',
      data: obj,
      method: 'post'
    })
  },
  getMeetingRoomBookList: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/list',
      params: obj,
      method: 'get'
    })
  },
  getMeetingRoomBookInfo: (id) => {
    return axios.request({
      url: `/meeting/meetingroombook/info/${id}`,
      method: 'get'
    })
  },
  deleteMeetingRoomBook: (obj) => {
    return axios.request({
      url: '/meeting/meetingroombook/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
