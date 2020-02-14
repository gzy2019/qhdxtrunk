import axios from '@/libs/api.request'

const api = {
  // 角色管理页面---分页查询角色列表
  getDicList: (obj) => {
    return axios.request({
      url: '/sys/alldic/list',
      params: obj,
      method: 'get'
    })
  },
  // 保存角色数据
  saveDicData: (obj) => {
    return axios.request({
      url: '/sys/alldic/save',
      data: obj,
      method: 'post'
    })
  },
  // 更新角色数据
  updateDicData: (obj) => {
    return axios.request({
      url: '/sys/alldic/update',
      data: obj,
      method: 'post'
    })
  },
  // 删除角色数据
  delDic: (obj) => {
    return axios.request({
      url: '/sys/alldic/delete',
      data: obj,
      method: 'post'
    })
  },
  // 更新角色数据
  validateDicValue: (obj) => {
    return axios.request({
      url: '/sys/alldic/validate_value',
      data: obj,
      method: 'post'
    })
  },
  // 数据字典列表
  getDicByType: (type) => {
    return axios.request({
      url: `/sys/alldic/list/${type}`,
      params: type,
      method: 'get'
    })
  }
}

export default api
