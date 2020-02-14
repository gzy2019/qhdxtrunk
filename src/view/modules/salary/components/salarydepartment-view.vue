<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="部门名称:">{{dataForm.name}}</FormItem>
          <FormItem label="负责人ID:">{{dataForm.operId}}</FormItem>
          <FormItem label="负责人证件号:">{{dataForm.operCode}}</FormItem>
          <FormItem label="负责人姓名:">{{dataForm.operName}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/salary/salarydepartment'
export default {
  name: 'SalaryDepartment-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        name: '',
        operId: '',
        operCode: '',
        operName: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSalaryDepartment(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSalaryDepartment (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSalaryDepartmentInfo(id).then(res => {
        let entity = res.salaryDepartment
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
