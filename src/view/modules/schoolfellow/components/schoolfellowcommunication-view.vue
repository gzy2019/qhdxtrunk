<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="沟通时间:">{{dataForm.modifyTime}}</FormItem>
          <FormItem label="学号:">{{dataForm.stuCode}}</FormItem>
          <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
          <FormItem label="备注信息:">{{dataForm.infoDesc}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowcommunication'
export default {
  name: 'SchoolfellowCommunication-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        stuCode: '',
        stuName: '',
        infoDesc: '',
        modifyTime: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSchoolfellowCommunication(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSchoolfellowCommunication (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowCommunicationInfo(id).then(res => {
        let entity = res.schoolfellowCommunication
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
