<template>
  <div v-if="showFullScreenBtn" class="full-screen-btn-con">
    <Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
      <Icon @click.native="handleChange" :type="value ? 'md-contract' : 'ios-expand'" :size="23" style="color:#fff"></Icon>
    </Tooltip>
    <Tooltip :content="value ? '' : '消息'" placement="bottom">
      <Icon type="ios-notifications-outline" class="top_icon" />
    </Tooltip>
    <Tooltip :content="value ? '' : '搜索'" placement="bottom">
      <Icon type="ios-search-outline" class="top_icon" />
    </Tooltip>
    <Divider type="vertical" />
    <div class="search_popup" style="display:none">
      <!-- <Input prefix="ios-search" placeholder="搜索" style="width: auto" /> -->
      <Input search placeholder="搜索" type="text" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fullscreen',
  computed: {
    showFullScreenBtn () {
      return window.navigator.userAgent.indexOf('MSIE') < 0
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleFullscreen () {
      let main = document.body
      if (this.value) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen()
        }
      }
    },
    handleChange () {
      this.handleFullscreen()
    }
  },
  mounted () {
    let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
    isFullscreen = !!isFullscreen
    document.addEventListener('fullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('mozfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('webkitfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    document.addEventListener('msfullscreenchange', () => {
      this.$emit('input', !this.value)
      this.$emit('on-change', !this.value)
    })
    this.$emit('input', isFullscreen)
  }
}
</script>

<style lang="less">
.full-screen-btn-con .ivu-tooltip-rel {
  height: 64px;
  line-height: 56px;
  i {
    cursor: pointer;
  }
}
</style>
