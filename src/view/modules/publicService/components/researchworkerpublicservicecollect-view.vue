<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
          <FormItem label="学生学号:">{{dataForm.stuCode}}</FormItem>
          <FormItem label="服务批次:">{{dataForm.serviceId}}</FormItem>
          <FormItem label="信息备注:">{{dataForm.infoDesc}}</FormItem>
          <FormItem label="服务总时长:">{{dataForm.countTime}}</FormItem>
          <FormItem label="结果">{{dataForm.result}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/publicService/researchworkerpublicservicecollect'
export default {
  name: 'ResearchworkerPublicserviceCollect-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        stuName: '',
        stuCode: '',
        serviceId: '',
        infoDesc: '',
        countTime: '',
        result: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerPublicserviceCollect(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerPublicserviceCollect (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerPublicserviceCollectInfo(id).then(res => {
        let entity = res.researchworkerPublicserviceCollect
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
