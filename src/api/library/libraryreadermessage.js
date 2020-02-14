import axios from '@/libs/api.request'

const api = {
  getLibraryReaderMessageDataList: (obj) => {
    return axios.request({
      url: '/library/libraryreadermessage/data/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryReaderMessageList: (obj) => {
    return axios.request({
      url: '/library/libraryreadermessage/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryReaderMessageInfo: (id) => {
    return axios.request({
      url: `/library/libraryreadermessage/info/${id}`,
      method: 'get'
    })
  },
  saveLibraryReaderMessage: (obj) => {
    return axios.request({
      url: '/library/libraryreadermessage/save',
      data: obj,
      method: 'post'
    })
  },
  updateLibraryReaderMessage: (obj) => {
    return axios.request({
      url: '/library/libraryreadermessage/update',
      data: obj,
      method: 'post'
    })
  },
  deleteLibraryReaderMessage: (obj) => {
    return axios.request({
      url: '/library/libraryreadermessage/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
