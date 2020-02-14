<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <Row>
                    <Col span="12">
                        <FormItem label="部门ID:">{{dataForm.budgetDepartmentId}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="批次ID:">{{dataForm.batchId}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="名称:">{{dataForm.name}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="项目:">{{dataForm.category}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="数量:">{{dataForm.quantity}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="标准:">{{dataForm.standard}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="单位说明:">{{dataForm.unit}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="预算数:">{{dataForm.amount}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="备注:">{{dataForm.memo}}</FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button @click="cancel">关闭</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/budget/budgetincome'
export default {
  name: 'BudgetIncome-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        createUserId: '',
        budgetDepartmentId: '',
        batchId: '',
        name: '',
        category: '',
        quantity: '',
        standard: '',
        unit: '',
        amount: '',
        memo: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewBudgetIncome(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewBudgetIncome (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getBudgetIncomeInfo(id).then(res => {
        let entity = res.budgetIncome
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
