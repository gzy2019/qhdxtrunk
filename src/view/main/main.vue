<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="220" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList" :open-names='openNames' style="margin-top:64px">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con" style="height: 64px;position: absolute; z-index: 990;left: 0; right: 0;top: 0;">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" style="width: 154px;height: 50px;" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" theme="light" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator" />
          <!-- <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/> -->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <custom-bread-crumb show-icon style="margin-left: 18px;" :list="breadCrumbList"></custom-bread-crumb>
            <!-- <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" /> -->
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import customBreadCrumb from './components/header-bar/custom-bread-crumb'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, getNextName } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User,
    customBreadCrumb
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    }
  },
  computed: {
    openNames () {
      let resNames = []
      let tSideMenuList = this.$store.state.app.sideMenuList
      tSideMenuList.map((item, index) => {
        resNames.push(item.name)
        if (item.children && item.children.length > 0) {
          item.children.map((citem, index) => {
            resNames.push(citem.name)
          })
        }
      })
      return resNames
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.state.app.sideMenuList
    },
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
    // local () {
    //   return this.$store.state.app.local
    // }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag'
      // 'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (name) {
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name: name
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, name) {
      const nextName = getNextName(this.tagNavList, name)
      this.setTagNavList(res)
      if (type === 'all') this.turnToPage('home')
      else if (this.$route.name === name) this.$router.push({ name: nextName })
    },
    handleClick (item) {
      this.turnToPage(item.name)
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag(this.$store.state.app.homeRoute)
    this.setBreadCrumb(this.$route.matched)
    // 设置初始语言
    // this.setLocal(this.$i18n.locale)
  }
}
</script>
<style lang="less" scoped>
.ivu-breadcrumb {
  margin: 10px 0 0 10px;
}
</style>
