import axios from '@/libs/api.request'
import md5 from 'crypto-js/md5'

const api = {
  // 菜单数据列表
  getMenuList: (obj) => {
    return axios.request({
      url: '/sys/menu/menulist',
      params: obj,
      method: 'get'
    })
  },
  // 菜单数据列表
  getMenuCascaderList: (obj) => {
    return axios.request({
      url: '/sys/menu/menucascaderlist',
      params: obj,
      method: 'get'
    })
  },
  // 菜单树
  getMenuTree: (obj) => {
    return axios.request({
      url: '/sys/menu/menutree',
      params: obj,
      method: 'get'
    })
  },
  // 保存Menu数据
  saveMenu: (obj) => {
    return axios.request({
      url: '/sys/menu/save',
      data: obj,
      method: 'post'
    })
  },
  // 更新Menu数据
  updateMenu: (obj) => {
    return axios.request({
      url: '/sys/menu/update',
      data: obj,
      method: 'post'
    })
  },
  // 删除Menu数据
  deleteMenu: (obj) => {
    return axios.request({
      url: '/sys/menu/delete',
      data: obj,
      method: 'post'
    })
  },
  // 角色管理页面---分页查询角色列表
  getRoleList: (obj) => {
    return axios.request({
      url: '/sys/role/list',
      params: obj,
      method: 'get'
    })
  },
  // 用户管理-查询所有角色
  getAllRoleList: (obj) => {
    return axios.request({
      url: '/sys/role/select',
      params: obj,
      method: 'get'
    })
  },
  // 用户列表
  getUserList: (obj) => {
    return axios.request({
      url: '/sys/user/list',
      params: obj,
      method: 'get'
    })
  },
  // 保存角色数据
  saveRoleData: (obj) => {
    return axios.request({
      url: '/sys/role/save',
      data: obj,
      method: 'post'
    })
  },
  // 验证角色编码
  validateRoleCode: (obj) => {
    return axios.request({
      url: '/sys/role/validate_code',
      data: obj,
      method: 'post'
    })
  },
  // 更新角色数据
  updateRoleData: (obj) => {
    return axios.request({
      url: '/sys/role/update',
      data: obj,
      method: 'post'
    })
  },
  // 删除角色数据
  delRole: (obj) => {
    return axios.request({
      url: '/sys/role/del',
      params: obj,
      method: 'post'
    })
  },
  // 保存用户数据
  saveUserData: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    return axios.request({
      url: '/sys/user/save',
      data: obj,
      method: 'post'
    })
  },
  // 更新用户数据
  updateUserData: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    return axios.request({
      url: '/sys/user/update',
      data: obj,
      method: 'post'
    })
  },
  // 更新用户数据
  updateUserPassword: (obj) => {
    obj = Object.assign({}, obj)
    if (obj.userPsd) {
      obj.userPsd = md5(obj.userPsd).toString()
    }
    if (obj.newUserPsd) {
      obj.newUserPsd = md5(obj.newUserPsd).toString()
    }
    return axios.request({
      url: '/sys/user/password',
      data: obj,
      method: 'post'
    })
  },
  // 启用/禁用用户
  updateUserStatus: (obj) => {
    return axios.request({
      url: '/sys/user/updatestatus',
      data: obj,
      method: 'post'
    })
  }
}

export default api
