<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="dataForm.name" :maxlength="200" placeholder="请输入名称" />
                </FormItem>
                <FormItem label="项目" prop="category">
                    <Input type="text" v-model="dataForm.category" :maxlength="200" placeholder="请输入项目" />
                </FormItem>
                <Row>
                    <Col span="12">
                        <FormItem label="数量" prop="quantity">
                            <InputNumber :min="0" :max="99999" v-model="dataForm.quantity" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="标准" prop="standard">
                            <InputNumber :min="0" :step="100" :max="999999" v-model="dataForm.standard" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="单位说明" prop="unit">
                            <Input type="text" v-model="dataForm.unit" :maxlength="200" placeholder="请输入单位说明" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="预算数" prop="amount">
                            <Input type="text" v-model="dataForm.amount" :readonly="true" />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="备注" prop="memo">
                    <Input type="text" v-model="dataForm.memo" :maxlength="300" placeholder="请输入备注" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveBudgetIncome">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/budget/budgetincome'
export default {
  name: 'BudgetIncome-form',
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
        quantity: 1,
        standard: 1,
        unit: '',
        amount: 0,
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
    addBudgetIncome () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editBudgetIncome (id) {
      this.modalTitle = '编辑'
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
    },
    saveBudgetIncome () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          data.budgetDepartmentMainId = this.departmentMainId
          data.budgetDepartmentId = this.departmentId
          data.batchId = this.batchId
          if (!data.id) {
            api.saveBudgetIncome(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateBudgetIncome(data).then(res => {
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
