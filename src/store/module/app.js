import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  translateMenusToRouters
} from '@/libs/util'
import routers from '@/router/routers'
import api from '@/api/routers'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    local: '',
    routers: [],
    hasGetRouter: false,
    sideMenuList: [], // 左侧菜单
    headerFixedMenuList: [], // 用户header固定菜单
    headerMoreMenuList: [] // 用户header更多功能菜单
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(state.routers)
  },
  mutations: {
    setRouters (state, routers) {
      state.routers = routers
    },
    setHasGetRouter (state, status) {
      state.hasGetRouter = status
    },
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      state.local = lang
    },
    // 设置左侧菜单
    setSideMenuList (state, list) {
      if (list) {
        state.sideMenuList = []
        state.sideMenuList = [...list]
      } else {
        state.sideMenuList = []
      }
    },
    // 设置header菜单，可在菜单管理功能调整一级菜单排序，把常用的一级菜单放到header固定
    setHeaderFixedAndMoreMenuList (state, list) {
      if (list) {
        list.map((item, index) => {
          // header目前最多可以放5个一级菜单
          if (index < 5) {
            state.headerFixedMenuList.push(item)
          } else {
            // 多余5个的其他一级菜单放到更多功能
            state.headerMoreMenuList.push(item)
          }
        })
      } else {
        state.headerFixedMenuList = []
        state.headerMoreMenuList = []
        state.sideMenuList = []
      }
    }
  },
  actions: {
    getRouters ({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          api.getMenuNavList({ }).then(res => {
            let routers = translateMenusToRouters(res.menuList)
            commit('setRouters', [])
            commit('setRouters', routers)
            commit('setHasGetRouter', true)

            // 根据菜单列表设置header菜单
            let tMenuList = getMenuByRouter(routers)
            commit('setHeaderFixedAndMoreMenuList', tMenuList)
            // 设置默认的左侧菜单
            let defaultSideMenuList = tMenuList.filter((item, index) => index === 0)
            commit('setSideMenuList', defaultSideMenuList)

            sessionStorage.setItem('permissions', JSON.stringify(res.permissions || '[]'))
            setTagNavListInLocalstorage([])
            resolve(routers)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          commit('setRouters', [])
          commit('setHasGetRouter', false)
          commit('setHeaderFixedAndMoreMenuList', [])
          sessionStorage.setItem('permissions', '[]')
          setTagNavListInLocalstorage([])
          reject(error)
        }
      })
    }
  }
}
