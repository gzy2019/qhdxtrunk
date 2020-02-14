<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :footer-hide="true" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <DFormPreview ref="dFormPreview"/>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import DFormPreview from '@/view/modules/qa/design-components/dform-preview'
import api from '@/api/qa/qaforminst'
export default {
  name: 'QaFormInst-view',
  components: {DFormPreview},
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        userId: '',
        formId: '',
        formDef: '',
        itemInstList: [],
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewQaFormInst(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewQaFormInst (id) {
      this.loading = true
      api.getQaFormInstInfo(id).then(res => {
        let entity = res.qaFormInst
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.showFormInst()
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    showFormInst () {
      let answerMap = {}
      this.dataForm.itemInstList.forEach(item => {
        answerMap[item.itemId] = item.answer
      })
      console.log('answerMap', answerMap)
      this.$refs.dFormPreview.init(this.dataForm.formDef, true)
      this.$refs.dFormPreview.initFormVal(answerMap)
    }
  }
}
</script>
