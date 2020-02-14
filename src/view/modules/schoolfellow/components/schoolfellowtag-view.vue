<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="标签名称:">{{dataForm.tagName}}</FormItem>
          <FormItem label="开始时间:">{{dataForm.startDate}}</FormItem>
          <FormItem label="结束时间:">{{dataForm.endDate}}</FormItem>
          <FormItem label="学号:">{{dataForm.stuCode}}</FormItem>
          <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowtag'
export default {
  name: 'SchoolfellowTag-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        tagName: '',
        startDate: '',
        endDate: '',
        stuCode: '',
        stuName: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSchoolfellowTag(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSchoolfellowTag (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowTagInfo(id).then(res => {
        let entity = res.schoolfellowTag
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
