import axios from '@/libs/api.request'

const api = {
  getPaypointStatsInfo: (obj) => {
    return axios.request({
      url: '/paypoint/stats/info',
      params: obj,
      method: 'get'
    })
  }
}

export default api
