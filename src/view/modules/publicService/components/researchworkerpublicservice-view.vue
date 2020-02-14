<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="服务名称:">{{dataForm.serviceName}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/publicService/researchworkerpublicservice'
export default {
  name: 'ResearchworkerPublicservice-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        serviceName: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerPublicservice(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerPublicservice (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerPublicserviceInfo(id).then(res => {
        let entity = res.researchworkerPublicservice
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
