<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <Row>
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
                        <FormItem label="人员费:">{{dataForm.personFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="办公费:">{{dataForm.officeFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="设备费:">{{dataForm.equipmentFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="交通费:">{{dataForm.trafficFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="差旅费:">{{dataForm.travelFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="出国费:">{{dataForm.overseaasFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="水电费:">{{dataForm.electricityWaterFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="招待费:">{{dataForm.treatFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="图书费:">{{dataForm.bookFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="福利费:">{{dataForm.welfareFee}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="其它:">{{dataForm.otherFee}}</FormItem>
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
import api from '@/api/budget/budgetspending'
export default {
  name: 'BudgetSpending-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        name: '',
        category: '',
        quantity: '',
        standard: '',
        unit: '',
        amount: '',
        personFee: '',
        officeFee: '',
        equipmentFee: '',
        trafficFee: '',
        travelFee: '',
        overseaasFee: '',
        electricityWaterFee: '',
        treatFee: '',
        bookFee: '',
        welfareFee: '',
        otherFee: '',
        memo: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewBudgetSpending(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewBudgetSpending (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getBudgetSpendingInfo(id).then(res => {
        let entity = res.budgetSpending
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
