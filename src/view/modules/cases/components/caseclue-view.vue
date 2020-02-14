<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="适用课程:">{{dataForm.courseName}}</FormItem>
          <FormItem label="线索:">{{dataForm.clueInfo}}</FormItem>
          <FormItem label="提交人:">{{dataForm.createUser}}</FormItem>
          <FormItem label="回复人:">{{dataForm.commentUser}}</FormItem>
          <FormItem label="线索回复:">{{dataForm.comment}}</FormItem>
          <FormItem label="回复时间:">{{dataForm.commentTime}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/cases/caseclue'
export default {
  name: 'CaseClue-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        courseName: '',
        clueInfo: '',
        createUser: '',
        commentUser: '',
        comment: '',
        commentTime: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewCaseClue(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewCaseClue (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getCaseClueInfo(id).then(res => {
        let entity = res.caseClue
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    }
  }
}
</script>
