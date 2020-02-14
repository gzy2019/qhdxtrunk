<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <Row>
            <Col span="12">
              <FormItem label="员工姓名" prop="salaryStaffName">
                {{dataForm.salaryStaffName}}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="工资年月" prop="payYearMonth">
                {{dataForm.payYearMonth}}
              </FormItem>
            </Col>
          </Row>
          <FormItem label="绩效工资" prop="performanceAmount">
            <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.performanceAmount" placeholder="请输入绩效工资" style="width:200px;" />
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
  name: 'SalaryPay-form',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        salaryStaffName: '',
        salaryStaffCode: '',
        payYear: '',
        payMonth: '',
        payYearMonth: '',
        performanceAmount: '',
        id: null
      },
      dataFormValidate: {
        performanceAmount: [
          { type: 'number', required: true, message: '绩效工资不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
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
