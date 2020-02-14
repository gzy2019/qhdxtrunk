<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="申报名称:">{{dataForm.name}}</FormItem>
          <FormItem label="报名开始时间:">{{dataForm.startDate}}</FormItem>
          <FormItem label="报名结束时间:">{{dataForm.endDate}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/declare/declareopeninginfo'
export default {
  name: 'DeclareOpeningInfo-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        name: '',
        startDate: '',
        endDate: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewDeclareOpeningInfo(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewDeclareOpeningInfo (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getDeclareOpeningInfoInfo(id).then(res => {
        let entity = res.declareOpeningInfo
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
