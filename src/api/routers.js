import axios from '@/libs/api.request'

const api = {
  // 权限菜单数据
  getMenuNavList: (obj) => {
    return axios.request({
      url: '/sys/menu/nav',
      params: obj,
      method: 'get'
    })
  }
}

export default api