<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <FormItem label="部门名称:">{{dataForm.name}}</FormItem>
                <FormItem label="部门职责:">{{dataForm.duty}}</FormItem>
                <FormItem label="填报人证件号:">{{dataForm.operCode}}</FormItem>
                <FormItem label="填报人姓名:">{{dataForm.operName}}</FormItem>
                <FormItem label="状态:">{{dataForm.status ? '有效' : '无效'}}</FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">关闭</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/budget/budgetdepartment'
export default {
  name: 'BudgetDepartment-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        createUserId: '',
        name: '',
        duty: '',
        operId: '',
        operCode: '',
        operName: '',
        status: '',
        isDel: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewBudgetDepartment(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewBudgetDepartment (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getBudgetDepartmentInfo(id).then(res => {
        let entity = res.budgetDepartment
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
