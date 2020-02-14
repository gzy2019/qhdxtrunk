<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="150" :rules="dataFormValidate">
          <FormItem label="部门名称" prop="salaryDepartmentId" v-if="departmentList.length > 1">
            <Select v-model="dataForm.salaryDepartmentId" placeholder="请选择">
              <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="年度" prop="year">
            <Select v-model="dataForm.year" placeholder="请选择" :disabled="dataForm.id">
              <Option v-for="(item,index) in yearList" :key="index" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem label="年度绩效工资限额" prop="yearMax">
              <InputNumber v-model="dataForm.yearMax" :min="0" :max="99999999" :step="100"  style="width: 200px;" />
          </FormItem>
          <FormItem label="月度绩效工资限额" prop="monthMax">
              <InputNumber v-model="dataForm.monthMax" :min="0" :max="99999999" :step="100" style="width: 200px;" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSalaryConfig">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/salary/salaryconfig'
export default {
  name: 'SalaryConfig-form',
  data () {
    const validateDept = (rule, value, callback) => {
      if (!this.dataForm.salaryDepartmentId) {
        callback(new Error('部门不能为空'))
      } else {
        api.validateSalaryConfig(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('年度限额已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    const validateYear = (rule, value, callback) => {
      if (!this.dataForm.year) {
        callback(new Error('年度不能为空'))
      } else {
        api.validateSalaryConfig(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('年度限额已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      departmentList: [],
      yearList: [],
      dataForm: {
        salaryDepartmentId: '',
        year: null,
        yearMax: 10000,
        monthMax: 10000,
        id: null
      },
      dataFormValidate: {
        salaryDepartmentId: [
          { validator: validateDept, required: true, message: '部门名称不能为空', trigger: 'change' }
        ],
        year: [
          { validator: validateYear, required: true, trigger: 'change' }
        ],
        yearMax: [
          { type: 'number', required: true, message: '年度绩效工资限额不能为空', trigger: 'blur' }
        ],
        monthMax: [
          { type: 'number', required: true, message: '月度绩效工资限额不能为空', trigger: 'blur' }
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
      this.loadDepartmentList()
      let curYear = new Date().getFullYear()
      for (let i = 0; i < 5; i++) {
        this.yearList.push(curYear++)
      }
    },
    cancel () {
      this.formModalVisible = false
    },
    loadDepartmentList () {
      api.getSalaryDepartmentDataList().then(res => {
        this.departmentList = res.list
        if (this.departmentList.length === 1) {
          this.dataForm.salaryDepartmentId = this.departmentList[0].id
        }
      })
    },
    addSalaryConfig () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.year = new Date().getFullYear()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editSalaryConfig (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSalaryConfigInfo(id).then(res => {
        let entity = res.salaryConfig
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveSalaryConfig () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveSalaryConfig(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateSalaryConfig(data).then(res => {
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
