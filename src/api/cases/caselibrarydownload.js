import axios from '@/libs/api.request'

const api = {
  getCaseLibraryDownloadDataList: (obj) => {
    return axios.request({
      url: '/cases/caselibrarydownload/data/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryDownloadList: (obj) => {
    return axios.request({
      url: '/cases/caselibrarydownload/list',
      params: obj,
      method: 'get'
    })
  },
  getCaseLibraryDownloadInfo: (id) => {
    return axios.request({
      url: `/cases/caselibrarydownload/info/${id}`,
      method: 'get'
    })
  },
  saveCaseLibraryDownload: (obj) => {
    return axios.request({
      url: '/cases/caselibrarydownload/save',
      data: obj,
      method: 'post'
    })
  },
  updateCaseLibraryDownload: (obj) => {
    return axios.request({
      url: '/cases/caselibrarydownload/update',
      data: obj,
      method: 'post'
    })
  },
  deleteCaseLibraryDownload: (obj) => {
    return axios.request({
      url: '/cases/caselibrarydownload/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
