import axios from '@/libs/api.request'

const api = {
  getMeetingRoomDefList: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdef/list',
      params: obj,
      method: 'get'
    })
  },
  getMeetingRoomDefInfo: (id) => {
    return axios.request({
      url: `/meeting/meetingroomdef/info/${id}`,
      method: 'get'
    })
  },
  saveMeetingRoomDef: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdef/save',
      data: obj,
      method: 'post'
    })
  },
  updateMeetingRoomDef: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdef/update',
      data: obj,
      method: 'post'
    })
  },
  deleteMeetingRoomDef: (obj) => {
    return axios.request({
      url: '/meeting/meetingroomdef/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
