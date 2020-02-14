<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="工资部门:">{{dataForm.salaryDepartmentId}}</FormItem>
          <FormItem label="年度:">{{dataForm.year}}</FormItem>
          <FormItem label="年度绩效工资限额:">{{dataForm.yearMax}}</FormItem>
          <FormItem label="月度绩效工资限额:">{{dataForm.monthMax}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/salary/salaryconfig'
export default {
  name: 'SalaryConfig-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        salaryDepartmentId: '',
        year: '',
        yearMax: '',
        monthMax: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSalaryConfig(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSalaryConfig (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSalaryConfigInfo(id).then(res => {
        let entity = res.salaryConfig
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
