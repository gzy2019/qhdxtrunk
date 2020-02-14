<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import url from '_conf/url'
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      uploadUrl: ''
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  watch: {
    value () {
      this.$nextTick(() => {
        this.editor.txt.html(this.value)
      })
    }
  },
  mounted () {
    this.uploadUrl = url + '/sys/common/upload?token=' + this.$store.state.user.token
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    this.editor.customConfig.uploadFileName = 'file' // 上传参数 自定义
    this.editor.customConfig.uploadImgServer = this.uploadUrl // 上传图片
    this.editor.customConfig.uploadImgHooks = { // 监听
      before: function (xhr, editor, files) {
        // 图片上传之前触发
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
      },
      fail: function (xhr, editor, result) {
        Message.error('插入图片失败！')
      },
      error: function (xhr, editor) {
        Message.error('插入图片失败！')
      },
      timeout: function (xhr, editor) {
        Message.error('插入图片失败！')
      },
      customInsert: function (insertImg, result, editor) {
        var url = result.data.url
        insertImg(url)
      }
    }
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    if (this.cache) {
      let html = localStorage.editorCache
      if (html) this.editor.txt.html(html)
    } else {
      this.editor.txt.html(this.value)
    }
  }
}
</script>

<style>

</style>
