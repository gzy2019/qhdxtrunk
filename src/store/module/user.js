import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    teacherId: ''
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setTeacherId (state, status) {
      state.teacherId = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, formData) {
      return new Promise((resolve, reject) => {
        login(formData).then(res => {
          console.log('handleLogin', JSON.stringify(res))
          commit('setToken', res.token)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          commit('setHasGetInfo', false)
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data
          // commit('setAvator', data.avator)
          commit('setUserName', data.name || data.username)
          commit('setUserId', data.userId)
          // commit('setAccess', data.access)
          commit('setHasGetInfo', true)
          commit('setTeacherId', data.teacherId)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
