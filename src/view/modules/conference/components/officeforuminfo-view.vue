<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <!-- <FormItem label="创建人ID:">{{dataForm.createUserId}}</FormItem> -->
          <FormItem label="论坛名字:">{{dataForm.forumName}}</FormItem>
          <FormItem label="举办日期:">{{dataForm.startDate}}</FormItem>
          <FormItem label="举办地点:">{{dataForm.forumAddress}}</FormItem>
          <FormItem label="备注:">{{dataForm.forumDesc}}</FormItem>
          <FormItem label="是否开放报名:">{{dataForm.batchOpenFlag ? '是' : '否' }}</FormItem>
          <FormItem label="限报人数:">{{dataForm.applyAmount}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/officeforum/officeforuminfo'
export default {
  name: 'OfficeForumInfo-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        // createUserId: '',
        forumName: '',
        startDate: '',
        forumAddress: '',
        forumDesc: '',
        batchOpenFlag: '',
        applyAmount: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewOfficeForumInfo(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewOfficeForumInfo (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeForumInfoInfo(id).then(res => {
        let entity = res.officeForumInfo
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
