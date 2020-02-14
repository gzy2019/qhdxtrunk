<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="批次名称" prop="name">
                    <Input type="text" v-model="dataForm.name" :maxlength="200" placeholder="请输入批次名称" />
                </FormItem>
                <FormItem label="年度" prop="year">
                    <Select v-model="dataForm.year" placeholder="请选择">
                      <Option :value="2018">2018</Option>
                      <Option :value="2019">2019</Option>
                      <Option :value="2020">2020</Option>
                      <Option :value="2021">2021</Option>
                      <Option :value="2022">2022</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间" prop="beginTime">
                    <IDatePicker type="date" v-model="dataForm.beginTime" format="yyyy-MM-dd" placeholder="请输入开始时间" />
                </FormItem>
                <FormItem label="结束时间" prop="endTime">
                    <IDatePicker type="date" v-model="dataForm.endTime" format="yyyy-MM-dd" placeholder="请输入结束时间" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveBudgetBatch">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/budget/budgetbatch'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'BudgetBatch-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        name: '',
        year: '',
        beginTime: '',
        endTime: '',
        id: undefined
      },
      dataFormValidate: {
        name: [
          { required: true, message: '批次名称不能为空', trigger: 'blur' }
        ],
        year: [
          { type: 'number', required: true, message: '年度不能为空', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
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
    addBudgetBatch () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.year = new Date().getFullYear()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editBudgetBatch (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getBudgetBatchInfo(id).then(res => {
        let entity = res.budgetBatch
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveBudgetBatch () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveBudgetBatch(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateBudgetBatch(data).then(res => {
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
