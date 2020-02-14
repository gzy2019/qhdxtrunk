// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import RawDisplayer from '@/components/raw-displayer'
import './index.less'
// import './indexpink.less'
import '@/assets/icons/iconfont.css'
import { isAuth, exportExcel, turn2NewPage } from '@/libs/util'
import '@/mock'
// 实际打包时应该不引入mock
// import env from '../config/env'
/* eslint-disable */
// env === 'development' ? require('@/mock') : ''

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(BaiduMap, {
//     ak: 'xyPhixfr1Q1PyPU8GOc12Z5Uim6glijV'
// })

// import '../public/kindeditor/themes/default/default.css'
// import '../public/kindeditor/kindeditor-all-min.js'
// import '../public/kindeditor/lang/zh-CN.js'
// import VueKindEditor from './libs/kindeditor.js'
// Vue.use(VueKindEditor)

Vue.config.productionTip = false
Vue.component("rawDisplayer", RawDisplayer);
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$store = store
Vue.prototype.isAuth = isAuth // 权限方法
Vue.prototype.exportExcel = exportExcel
Vue.prototype.turn2NewPage = turn2NewPage
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})