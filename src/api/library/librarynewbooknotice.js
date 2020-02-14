import axios from '@/libs/api.request'

const api = {
  getLibraryNewbookNoticeDataList: (obj) => {
    return axios.request({
      url: '/library/librarynewbooknotice/data/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryNewbookNoticeList: (obj) => {
    return axios.request({
      url: '/library/librarynewbooknotice/list',
      params: obj,
      method: 'get'
    })
  },
  getLibraryNewbookNoticeInfo: (id) => {
    return axios.request({
      url: `/library/librarynewbooknotice/info/${id}`,
      method: 'get'
    })
  },
  saveLibraryNewbookNotice: (obj) => {
    return axios.request({
      url: '/library/librarynewbooknotice/save',
      data: obj,
      method: 'post'
    })
  },
  updateLibraryNewbookNotice: (obj) => {
    return axios.request({
      url: '/library/librarynewbooknotice/update',
      data: obj,
      method: 'post'
    })
  },
  deleteLibraryNewbookNotice: (obj) => {
    return axios.request({
      url: '/library/librarynewbooknotice/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
