<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="dataForm.name" :maxlength="200" placeholder="请输入名称" />
                </FormItem>
                <FormItem label="项目" prop="category">
                    <Input type="text" v-model="dataForm.category" :maxlength="200" placeholder="请输入项目" />
                </FormItem>
                <Row>
                    <Col span="8">
                        <FormItem label="数量" prop="quantity">
                            <InputNumber :min="0" :max="99999" v-model="dataForm.quantity" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="标准" prop="standard">
                            <InputNumber :min="0" :step="100" :max="999999" v-model="dataForm.standard" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="单位说明" prop="unit">
                            <Input type="text" v-model="dataForm.unit" :maxlength="200" placeholder="请输入单位说明" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="预算数" prop="amount">
                            <Input type="text" v-model="dataForm.amount" :readonly="true" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="人员费" prop="personFee">
                            <InputNumber :min="0" :max="9999" v-model="dataForm.personFee" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="办公费" prop="officeFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.officeFee" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="设备费" prop="equipmentFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.equipmentFee" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="交通费" prop="trafficFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.trafficFee" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="差旅费" prop="travelFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.travelFee" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="出国费" prop="overseasFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.overseasFee" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="水电费" prop="electricityWaterFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.electricityWaterFee" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="招待费" prop="treatFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.treatFee" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="图书费" prop="bookFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.bookFee" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="福利费" prop="welfareFee">
                            <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.welfareFee" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="其它" prop="otherFee">
                          <InputNumber :min="0" :step="100" :max="9999999" v-model="dataForm.otherFee" />
                      </FormItem>
                    </Col>
                </Row>
                <FormItem label="备注" prop="memo">
                    <Input type="text" v-model="dataForm.memo" :maxlength="300" placeholder="请输入备注" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveBudgetSpending">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/budget/budgetspending'
export default {
  name: 'BudgetSpending-form',
  props: {
    departmentMainId: {
      type: Number,
      required: true,
      default () {
        return 0
      }
    },
    departmentId: {
      type: Number,
      required: true,
      default () {
        return 0
      }
    },
    batchId: {
      type: Number,
      required: true,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        name: '',
        category: '',
        quantity: 0,
        standard: 0,
        unit: '',
        amount: 0,
        personFee: 0,
        officeFee: 0,
        equipmentFee: 0,
        trafficFee: 0,
        travelFee: 0,
        overseasFee: 0,
        electricityWaterFee: 0,
        treatFee: 0,
        bookFee: 0,
        welfareFee: 0,
        otherFee: 0,
        memo: '',
        id: undefined
      },
      dataFormValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
        ],
        quantity: [
          { type: 'number', required: true, message: '数量不能为空', trigger: 'blur' }
        ],
        standard: [
          { type: 'number', required: true, message: '标准不能为空', trigger: 'blur' }
        ],
        amount: [
          { type: 'number', required: true, message: '预算数不能为空', trigger: 'blur' }
        ],
        personFee: [
          { type: 'number', required: true, message: '人员费不能为空', trigger: 'blur' }
        ],
        officeFee: [
          { type: 'number', required: true, message: '办公费不能为空', trigger: 'blur' }
        ],
        equipmentFee: [
          { type: 'number', required: true, message: '设备费不能为空', trigger: 'blur' }
        ],
        trafficFee: [
          { type: 'number', required: true, message: '交通费不能为空', trigger: 'blur' }
        ],
        travelFee: [
          { type: 'number', required: true, message: '差旅费不能为空', trigger: 'blur' }
        ],
        overseasFee: [
          { type: 'number', required: true, message: '出国费不能为空', trigger: 'blur' }
        ],
        electricityWaterFee: [
          { type: 'number', required: true, message: '水电费不能为空', trigger: 'blur' }
        ],
        treatFee: [
          { type: 'number', required: true, message: '招待费不能为空', trigger: 'blur' }
        ],
        bookFee: [
          { type: 'number', required: true, message: '图书费不能为空', trigger: 'blur' }
        ],
        welfareFee: [
          { type: 'number', required: true, message: '福利费不能为空', trigger: 'blur' }
        ],
        otherFee: [
          { type: 'number', required: true, message: '其它不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    'dataForm.quantity' () {
      this.dataForm.amount = this.dataForm.quantity * this.dataForm.standard
    },
    'dataForm.standard' () {
      this.dataForm.amount = this.dataForm.quantity * this.dataForm.standard
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
    addBudgetSpending () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editBudgetSpending (id) {
      this.modalTitle = '编辑'
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
    },
    saveBudgetSpending () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          data.budgetDepartmentMainId = this.departmentMainId
          data.budgetDepartmentId = this.departmentId
          data.batchId = this.batchId
          if (!data.id) {
            api.saveBudgetSpending(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateBudgetSpending(data).then(res => {
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
