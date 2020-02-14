<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange" class="fold"></sider-trigger>
    <Menu mode="horizontal" :theme="theme" :active-name="activeName" @on-select="handleSelect" class="menu_box">
      <div v-for="(item, index) in headerFixedMenuList" :key="index">
        <MenuItem v-if="!item.hideInMenu" :name="item.meta.menuId">
          <!-- <Icon :type="item.icon" /> -->
          {{item.meta.title}}
        </MenuItem>
      </div>
      <div v-if="headerMoreMenuList.length">
        <Submenu name="headerMoreMenuList">
          <template slot="title">
            更多功能
          </template>
          <div v-for="(item, index) in headerMoreMenuList" :key="index">
            <MenuItem v-if="!item.hideInMenu" :name="item.meta.menuId">
              <!-- <Icon :type="item.icon" /> -->
              {{item.meta.title}}
            </MenuItem>
          </div>
        </Submenu>
      </div>
    </Menu>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean,
    theme: {
      type: String,
      default: 'dark'
    }
  },
  data () {
    return {
      activeName: '',
      headerFixedMenuList: [],
      headerMoreMenuList: []
    }
  },
  computed: {
    // breadCrumbList () {
    //   return this.$store.state.app.breadCrumbList
    // }
  },
  methods: {
    ...mapMutations([
      'setSideMenuList'
    ]),
    // 选中header菜单更新左侧菜单
    handleSelect (activeName) {
      let userAllMenuList = this.$store.getters.menuList
      let selectedMenu = userAllMenuList.filter(item => item.meta.menuId === activeName)
      this.setSideMenuList(selectedMenu)
    },
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  },
  mounted () {
    // 初始化header菜单和更多功能下来菜单
    this.headerFixedMenuList = this.$store.state.app.headerFixedMenuList
    this.headerMoreMenuList = this.$store.state.app.headerMoreMenuList
    // 初始化默认选中菜单
    let defaultMenu = this.headerFixedMenuList[0]
    this.$nextTick(() => {
      this.activeName = defaultMenu.meta.menuId
    })
  }
}
</script>
