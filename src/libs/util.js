import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import url from '_conf/url'
import { forEach, hasOneOf, oneOf } from '@/libs/tools'
import Main from '@/view/main'
import parentView from '@/components/parent-view'
import { loginSign } from '@/api/user'
const qs = require('qs')
const _import = require('@/libs/import-' + process.env.NODE_ENV)

export const TOKEN_KEY = 'token-admin'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: config.cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) {
    return token
  } else {
    return false
  }
}

export const getSignToken = () => {
  return new Promise((resolve, reject) => {
    loginSign({
      _username: getUrlKey('_username'),
      _date: getUrlKey('_date'),
      _sign: getUrlKey('_sign')
    }).then(res => {
      if (res.code === 200) {
        setToken(res.token)
        resolve(Cookies.get(TOKEN_KEY))
      }
    })
  })
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

// const showThisMenuEle = (item, access) => {
//   if (item.meta && item.meta.access && item.meta.access.length) {
//     if (hasOneOf(item.meta.access, access)) return true
//     else return false
//   } else return true
// }
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways))) {
        obj.children = getMenuByRouter(item.children)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      // if (showThisMenuEle(item, access))
      res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched, homeRoute) => {
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [Object.assign(homeRoute, { to: homeRoute.path }), ...res]
}

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list, name) => {
  let res = ''
  if (list.length === 2) {
    res = 'home'
  } else {
    if (list.findIndex(item => item.name === name) === list.length - 1) res = list[list.length - 2].name
    else res = list[list.findIndex(item => item.name === name) + 1].name
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback()
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * @description 将菜单树转换为路由树
 * @param {Array} menus
 * @returns {Array}
 */
export const translateMenusToRouters = (menus) => {
  let routers = []
  forEach(menus, (menu) => {
    // 将数据转换成路由数据，按钮不进行转换
    if (menu.type !== 2) {
      let route = translateMenuToRoute(menu)
      // 如果数据有下级，则递归处理下级
      if (menu.list && menu.list.length !== 0) {
        route.children = translateMenusToRouters(menu.list)
      }
      routers.push(route)
    }
  })
  return routers
}

/**
 * @description 将菜单转换为路由
 * @param {Object} menu
 * @returns {Object}
 */
const translateMenuToRoute = (menu) => {
  let route = Object.assign({}, menu)
  route.name = menu.url
  route.meta = {
    menuId: menu.menuId,
    title: menu.name,
    icon: menu.icon,
    hideInMenu: menu.isHide === 1
  }
  route.path = '/' + menu.url
  if (menu.type === 0) {
    if (menu.parentId === 0) {
      route.component = Main
    } else {
      route.component = parentView
    }
    route.meta.showAlways = true
  } else if (menu.type === 1) {
    if (isURL(menu.url)) {
      route.path = ''
      route.name = menu.name
      route.meta.href = menu.url
    } else {
      try {
        route.component = _import(`${menu.url}`) || null
      } catch (e) {
        // console.log('eeeeee=', JSON.stringify(e))
      }
    }
  }
  return route
}

/**
 * 判断用户是否有操作权限
 * @param {key} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * @description 将后端菜单树转换为路由树
 * @param {Array} menus 菜单原始数据
 * @param {int} expandLevel 展开层级
 * @returns {Array} tempExpandLevel 当前递归到的层级
 */
export const translateMenusToTree = (menus, expandLevel, tempExpandLevel) => {
  let menuTree = []
  tempExpandLevel = tempExpandLevel + 1
  forEach(menus, (menu) => {
    let node = Object.assign({}, menu)
    node.title = menu.name
    if (tempExpandLevel < expandLevel) {
      node.expand = true
    } else {
      node.expand = false
    }
    if (menu.list && menu.list !== null && menu.list.length !== 0) {
      node.children = translateMenusToTree(menu.list, expandLevel, tempExpandLevel)
    }
    menuTree.push(node)
  })
  return menuTree
}

export const translateMenusIdToArray = (menus) => {
  let menuIds = []
  forEach(menus, (menu) => {
    let node = Object.assign({}, menu)
    if (menu.list && menu.list !== null && menu.list.length !== 0) {
      node.children = translateMenusIdToArray(menu.list)
    }
    menuIds.push(node.menuId)
  })
  return menuIds
}

/**
 * @description 将后端菜单树转换为路由树
 * @param {Array} oTree 原始树数据
 * @param {int} checkedNodes 选中节点id数组
 */
export const initMenuTreeChecked = (oTree, checkedNodes) => {
  checkedNodes = checkedNodes || []
  let resultTree = []
  forEach(oTree, (menu) => {
    let node = Object.assign({}, menu)
    node.title = menu.name
    // console.log('==', node.menuId, oneOf(node.menuId, checkedNodes))
    // 这里存储sys_role_menu的时候，将父节点也进行了存储，所以导致新增加节点后，父节点选中后所有子节点也被选中，所以处理逻辑修改为
    // 只有叶子节点需要处理checked状态；父节点会自动处理
    if (menu.list && menu.list.length) {
      node.children = initMenuTreeChecked(menu.list, checkedNodes)
    } else {
      node.checked = oneOf(node.menuId, checkedNodes)
    }
    resultTree.push(node)
  })
  return resultTree
}

export const turn2NewPage = (pageUrl, params = {}) => {
  params = Object.assign({}, params)
  params.token = getToken()
  params = qs.stringify(params, { arrayFormat: 'repeat' })
  if (pageUrl.indexOf('?') < 0) {
    pageUrl += '?' + params
  } else {
    pageUrl += '&' + params
  }
  pageUrl = url + pageUrl

  window.open(pageUrl, '_blank')
}

export const exportExcel = (options = {}) => {
  let defaults = {
    original: true,
    filename: '列表导出数据'
  }
  Object.assign(defaults, options)
  if (defaults.columns) {
    defaults.columns = defaults.columns.filter(item => item.title && item.title !== '操作')
  }
  console.log('defaults.columns======', defaults)
  let obj = options.table
  obj.exportCsv(defaults)
}

export function getUrlKey (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

// 日期格式化
export function getFormateDateTime (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
export const dateAdds = (interval, number, date) => {
  date = new Date(date.valueOf())
  switch (interval) {
    case 'y ': {
      date.setFullYear(date.getFullYear() + number)
      return date
    }
    case 'q ': {
      date.setMonth(date.getMonth() + number * 3)
      return date
    }
    case 'M ': {
      date.setMonth(date.getMonth() + number)
      return date
    }
    case 'w ': {
      date.setDate(date.getDate() + number * 7)
      return date
    }
    case 'd ': {
      date.setDate(date.getDate() + number)
      return date
    }
    case 'h ': {
      date.setHours(date.getHours() + number)
      return date
    }
    case 'm ': {
      date.setMinutes(date.getMinutes() + number)
      return date
    }
    case 's ': {
      date.setSeconds(date.getSeconds() + number)
      return date
    }
    default: {
      date.setDate(d.getDate() + number)
      return date
    }
  }
}
