import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import env from '_conf/env'
import { setToken, getToken, getSignToken, getUrlKey } from '@/libs/util'
import com404 from '@/view/error-page/404.vue'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash',
  base: env === 'stage' ? '/sppmtest/admin/' : '/sppm/admin'
  // isAddDynamicMenuRoutes: false // 是否已经添加动态(菜单)路由
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  let token = getToken()
  // console.log(token, 'getToken')
  if (getUrlKey('_sign')) {
  // 只要是单点登录，就直接重新登录系统
    getSignToken().then(res => {
      token = res
      handleRoute(token, to, next)
    })
  } else {
    handleRoute(token, to, next)
  }
})
const handleRoute = (token, to, next) => {
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到home页
    })
  } else {
    // 这里由于使用Promise异步更新用户信息和路由信息，所以必须等全部加载成功后才能下一步
    if (store.state.user.hasGetInfo && store.state.app.hasGetRouter) {
      next()
    } else {
      // 加载用户信息
      store.dispatch('getUserInfo').then(user => {
        // 加载用户菜单
        store.dispatch('getRouters').then(routers => {
          // commonRoutes需要追加到路由解析最后的404，把原先的routers.js中的404删掉即可
          router.addRoutes(routers.concat([{
            path: '*',
            name: 'error_404',
            meta: {
              hideInMenu: true
            },
            component: () => com404
          }]))
          next({ ...to })
        })
      }).catch(() => {
        setToken('')
        next({
          replace: true,
          name: 'login'
        })
      })
    }
  }
}
router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
