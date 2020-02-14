<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="780" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <Row>
            <Col span="8">
              <FormItem label="部门名称" prop="departmentName">
                {{dataForm.departmentName}}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="员工姓名" prop="salaryStaffName">
                {{dataForm.salaryStaffName}}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="工资年月" prop="payYearMonth">
                {{dataForm.payYearMonth}}(工作日:{{workDays}}天)
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="基本工资合计" prop="baseTotalAmount">
                {{comBaseTotalAmount}}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="基本工资" prop="baseAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.baseAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="年终奖" prop="annualBonus">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.annualBonus" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="是否转正" prop="regular">
                <i-switch v-model="dataForm.regular">
                <span slot="open">是</span>
                <span slot="close">否</span>
                </i-switch>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="试用期扣款" prop="probationDeductionAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.probationDeductionAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="工龄工资" prop="ageAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.ageAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="事假" prop="personalLeaveCount">
                <InputNumber :min="0" :max="300" :step="1" v-model="dataForm.personalLeaveCount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="病假" prop="sickLeaveCount">
                <InputNumber :min="0" :max="300" :step="1" v-model="dataForm.sickLeaveCount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="产假" prop="maternityLeaveCount">
                <InputNumber :min="0" :max="300" :step="1" v-model="dataForm.maternityLeaveCount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="调休" prop="overtimeCompensationCount">
                <InputNumber :min="0" :max="300" :step="1" v-model="dataForm.overtimeCompensationCount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="考勤扣款" prop="attendanceDeductionAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.attendanceDeductionAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="加班补助" prop="overtimeAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.overtimeAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="餐补" prop="mealAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.mealAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="其它奖励" prop="otherBonusAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.otherBonusAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="其它扣款" prop="otherDeductionAmount">
                <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.otherDeductionAmount" placeholder="请输入" style="width:100px;" />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="备注" prop="memo">
            <Input type="text" v-model="dataForm.memo" :maxlength="250" placeholder="请输入备注" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSalaryPay">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/salary/salarypay'
export default {
  name: 'SalaryBase-form',
  props: {
    workDays: {
      type: Number,
      default () {
        return 22
      }
    }
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        departmentName: '',
        salaryStaffName: '',
        salaryStaffCode: '',
        payYearMonth: '',
        annualBonus: 0,
        baseTotalAmount: 0,
        baseAmount: 0,
        regular: 1,
        probationDeductionAmount: 0,
        ageAmount: 0,
        personalLeaveCount: 0,
        sickLeaveCount: 0,
        maternityLeaveCount: 0,
        overtimeCompensationCount: 0,
        attendanceDeductionAmount: 0,
        overtimeAmount: 0,
        mealAmount: 0,
        otherBonusAmount: 0,
        otherDeductionAmount: 0,
        memo: '',
        id: null
      },
      dataFormValidate: {
        annualBonus: [
          { type: 'number', required: true, message: '年终奖不能为空', trigger: 'blur' }
        ],
        baseAmount: [
          { type: 'number', equired: true, message: '基本工资不能为空', trigger: 'blur' }
        ],
        probationDeductionAmount: [
          { type: 'number', required: true, message: '试用期扣款不能为空', trigger: 'blur' }
        ],
        ageAmount: [
          { type: 'number', required: true, message: '工资工资不能为空', trigger: 'blur' }
        ],
        personalLeaveCount: [
          { type: 'number', required: true, message: '事假不能为空', trigger: 'blur' }
        ],
        sickLeaveCount: [
          { type: 'number', required: true, message: '病假不能为空', trigger: 'blur' }
        ],
        maternityLeaveCount: [
          { type: 'number', required: true, message: '产假不能为空', trigger: 'blur' }
        ],
        overtimeCompensationCount: [
          { type: 'number', required: true, message: '调休不能为空', trigger: 'blur' }
        ],
        attendanceDeductionAmount: [
          { type: 'number', required: true, message: '考勤扣款不能为空', trigger: 'blur' }
        ],
        overtimeAmount: [
          { type: 'number', required: true, message: '加班补助不能为空', trigger: 'blur' }
        ],
        mealAmount: [
          { type: 'number', required: true, message: '餐补不能为空', trigger: 'blur' }
        ],
        otherBonusAmount: [
          { type: 'number', required: true, message: '其它奖励不能为空', trigger: 'blur' }
        ],
        otherDeductionAmount: [
          { type: 'number', required: true, message: '其它扣款不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  computed: {
    comBaseTotalAmount () {
      return this.dataForm.baseAmount + this.dataForm.ageAmount + this.dataForm.overtimeAmount +
         this.dataForm.otherBonusAmount - this.dataForm.probationDeductionAmount -
          this.dataForm.attendanceDeductionAmount - this.dataForm.otherDeductionAmount
    },
    comMealAmount () {
      return (this.workDays - this.dataForm.personalLeaveCount - this.dataForm.sickLeaveCount -
        this.dataForm.maternityLeaveCount) * 100
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {

    },
    cancel () {
      this.formModalVisible = false
    },
    addSalaryPay () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editSalaryPay (id) {
      this.modalTitle = '编辑'
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
    },
    saveSalaryPay () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          data.baseTotalAmount = this.comBaseTotalAmount
          if (!data.id) {
            api.saveSalaryPay(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateSalaryPay(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
