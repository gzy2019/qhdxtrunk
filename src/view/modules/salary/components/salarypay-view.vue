<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="工资部门ID:">{{dataForm.salaryDepartmentId}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="员工ID:">{{dataForm.salaryStaffId}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="员工姓名:">{{dataForm.salaryStaffName}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="员工证件号:">{{dataForm.salaryStaffCode}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工资年份:">{{dataForm.year}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工资月份:">{{dataForm.month}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工资年月:">{{dataForm.yearMonth}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="绩效工资:">{{dataForm.performanceAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="年终奖:">{{dataForm.annualBonus}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="基本工资合计:">{{dataForm.baseTotalAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="基本工资:">{{dataForm.baseAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="是否转正:">{{dataForm.regular}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="试用期扣款:">{{dataForm.probationDeductionAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工资工资:">{{dataForm.ageAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="事假:">{{dataForm.personalLeaveCount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="病假:">{{dataForm.sickLeaveCount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="产假:">{{dataForm.maternityLeaveCount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="调休:">{{dataForm.overtimeCompensationCount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="考勤扣款:">{{dataForm.attendanceDeductionAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="加班补助:">{{dataForm.overtimeAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="餐补:">{{dataForm.mealAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="其它奖励:">{{dataForm.otherBonusAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="其它扣款:">{{dataForm.otherDeductionAmount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="备注:">{{dataForm.memo}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="状态，0-编辑 1-提交:">{{dataForm.performanceStatus}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="状态，0-编辑 1-提交:">{{dataForm.baseStatus}}</FormItem>
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
import api from '@/api/salary/salarypay'
export default {
  name: 'SalaryPay-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        salaryDepartmentId: '',
        salaryStaffId: '',
        salaryStaffName: '',
        salaryStaffCode: '',
        year: '',
        month: '',
        yearMonth: '',
        performanceAmount: '',
        annualBonus: '',
        baseTotalAmount: '',
        baseAmount: '',
        regular: '',
        probationDeductionAmount: '',
        ageAmount: '',
        personalLeaveCount: '',
        sickLeaveCount: '',
        maternityLeaveCount: '',
        overtimeCompensationCount: '',
        attendanceDeductionAmount: '',
        overtimeAmount: '',
        mealAmount: '',
        otherBonusAmount: '',
        otherDeductionAmount: '',
        memo: '',
        performanceStatus: '',
        baseStatus: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSalaryPay(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSalaryPay (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSalaryPayInfo(id).then(res => {
        let entity = res.salaryPay
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
