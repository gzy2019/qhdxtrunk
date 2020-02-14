<template>
  <div>
    <Modal title="问卷进行时" v-model="formModalVisible" :mask-closable='true' :footer-hide="true" :width="800" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="loading"></Spin>
      <DFormPreview ref="dFormPreview" :showButton="true" />
    </Modal>
  </div>
</template>

<script>
import api from '@/api/qa/qaform'
import DFormPreview from './dform-preview'
export default {
  name: 'dformReady',
  components: { DFormPreview },
  data () {
    return {
      loading: false,
      formModalVisible: false,
      formId: null,
      formData: {}
    }
  },
  methods: {
    init (formId) {
      this.formId = formId
      this.formModalVisible = true
      this.loadFormData()
    },
    loadFormData () {
      if (!this.formId) {
        return false
      }
      this.loading = true
      api.getQaFormDesignInfo(this.formId).then(res => {
        this.loading = false
        let item = res.qaForm
        let form = {
          attribute: {},
          itemList: []
        }
        Object.assign(form.attribute, item)
        delete form.attribute.itemList
        form.itemList = item.itemList || []
        form.itemList.forEach(item => {
          item.attrCodes = JSON.parse(item.attrCodes)
        })
        Object.assign(this.formData, form)
        this.previewForm()
      }).finally(() => {
        this.loading = false
      })
    },
    previewForm () {
      this.$refs.dFormPreview.init(JSON.stringify(this.formData))
    }
  }
}
</script>
