<!--
accept: .pdf .doc .docx .jpg
        audio/* video/* image/*
-->
<template>
  <div>
    <div class="demo-upload-list" v-for="(item, index) in imageList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleItemRemove(index)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :disabled="disabled"
      :action="action"
      type="drag"
      accept="image/*"
      :format="['jpg','jpeg','png']"
      :max-size="maxSize"
      :show-upload-list="showUploadlist"
      :default-file-list="myDefaultList"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :on-progress="handleProgress"
      :multiple="multiple"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="查看图片" v-model="previewVisible" :footer-hide="true">
      <img :src="previewImgUrl" v-if="previewVisible" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import url from '_conf/url'
export default {
  name: 'image-upload',
  props: {
    maxSize: {
      type: Number,
      default () {
        return 1024 * 5
      }
    },
    format: {
      type: Array,
      default () {
        return []
      }
    },
    placeholder: {
      type: String,
      default () {
        return '上传文件'
      }
    },
    name: {
      type: String,
      default () {
        return 'file'
      }
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    value: {
      type: [Array, Object],
      default () {
        return undefined
      }
    },
    defaultList: {
      type: [Array, Object],
      default () {
        return undefined
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    onlyone: {
      type: Boolean,
      default () {
        return true
      }
    },
    showUploadlist: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      action: '',
      uploadList: [],
      previewVisible: false,
      previewImgUrl: '',
      myDefaultList: []
    }
  },
  computed: {
    imageList () {
      let dic = ['jpg', 'jpeg', 'png', 'bmp', 'gif']
      return this.uploadList.filter(item => {
        let url = item.url || (item.response ? item.response.data.url : '')
        let suffix = url.substring(url.lastIndexOf('.') + 1)
        suffix = suffix.toLowerCase()
        return dic.includes(suffix)
      })
    }
  },
  watch: {
    defaultList () {
      this.handleDefaultList()
    }
  },
  mounted () {
    this.action = url + '/sys/common/upload?token=' + this.$store.state.user.token
    this.handleDefaultList()
  },
  methods: {
    handleView (item) {
      this.previewImgUrl = item.url || item.response.data.url
      this.previewVisible = true
    },
    handleItemRemove (index) {
      let file = this.$refs.upload.fileList[index]
      this.$refs.upload.fileList.splice(index, 1)
      this.handleRemove(file)
    },
    handleDefaultList () {
      if (this.defaultList) {
        this.myDefaultList = this.defaultList
      }
      this.$nextTick(() => {
        this.uploadList = this.$refs.upload.fileList
      })
    },
    handleRemove (file) {
      // 删除完成后的回调
      const fileList = this.$refs.upload.fileList
      this.$emit('on-remove', file)
      if (this.onlyone) {
        this.$emit('input', undefined)
      } else {
        this.$emit('input', fileList)
      }
    },
    handleSuccess (res, file, fileList) {
      this.$emit('on-success', file, fileList)
      if (file.response && file.response.data) {
        Object.assign(file, file.response.data)
      }
      if (fileList) {
        fileList.forEach(element => {
          if (element.response && element.response.data) {
            Object.assign(element, element.response.data)
            delete element.response
          }
        })
      }
      if (this.onlyone) {
        this.$refs.upload.fileList.length = 0
        this.$refs.upload.fileList.push(file)
        this.$emit('input', [file])
      } else {
        this.$emit('input', fileList)
      }
    },
    handleProgress () {},
    handleFormatError (file) {
      this.$Message.warning('文件格式不正确')
      this.$emit('on-format-error', file)
    },
    handleMaxSize (file) {
      this.$Message.warning(file.name + '太大,超过' + this.maxSize + 'K')
      this.$emit('on-max-size', file)
    },
    handleBeforeUpload () {}
  }
}
</script>

<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
