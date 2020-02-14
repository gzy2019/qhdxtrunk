<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <!-- <FormItem label="创建人ID:">{{dataForm.createUserId}}</FormItem> -->
          <FormItem label="姓名:">{{dataForm.applicantName}}</FormItem>
          <FormItem label="性别:">{{dataForm.applicantSex ? '男' : '女'}}</FormItem>
          <FormItem label="论坛活动:">{{dataForm.forumName}}</FormItem>
          <FormItem label="手机号:">{{dataForm.applicantPhone}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/officeforum/officeforumapply'
export default {
  name: 'OfficeForumApply-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        // createUserId: '',
        applicantName: '',
        applicantSex: '',
        forumName: '',
        applicantPhone: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewOfficeForumApply(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewOfficeForumApply (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeForumApplyInfo(id).then(res => {
        let entity = res.officeForumApply
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
