<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="部门名称:">{{dataForm.salaryDepartmentId}}</FormItem>
          <FormItem label="姓名:">{{dataForm.teacherName}}</FormItem>
          <FormItem label="证件号:">{{dataForm.teacherCode}}</FormItem>
          <FormItem label="在职状态">{{dataForm.status}}</FormItem>
          <FormItem label="入职时间:">{{dataForm.hiredate}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/salary/salarystaff'
export default {
  name: 'SalaryStaff-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        salaryDepartmentId: '',
        teacherId: '',
        teacherName: '',
        teacherCode: '',
        status: '',
        hiredate: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSalaryStaff(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSalaryStaff (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSalaryStaffInfo(id).then(res => {
        let entity = res.salaryStaff
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
