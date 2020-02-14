import axios from '@/libs/api.request'

const api = {
  getMeetingRoomDefaultsList: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdefaults/list',
      params: obj,
      method: 'get'
    })
  },
  getMeetingRoomDefaultsInfo: (id) => {
    return axios.request({
      url: `/meeting/meetingroomdefaults/info/${id}`,
      method: 'get'
    })
  },
  saveMeetingRoomDefaults: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdefaults/save',
      data: obj,
      method: 'post'
    })
  },
  updateMeetingRoomDefaults: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdefaults/update',
      data: obj,
      method: 'post'
    })
  },
  releaseMeetingRoomDefaults: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdefaults/release',
      data: obj,
      method: 'post'
    })
  },
  deleteMeetingRoomDefaults: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdefaults/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
