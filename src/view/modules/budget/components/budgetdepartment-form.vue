<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="部门名称" prop="name">
                    <Input type="text" v-model="dataForm.name" :maxlength="200" placeholder="请输入部门名称" />
                </FormItem>
                <FormItem label="部门职责" prop="duty">
                    <Input type="text" v-model="dataForm.duty" :maxlength="300" placeholder="请输入部门职责" />
                </FormItem>
                <FormItem label="填报人" prop="operId">
                    <Select v-model="dataForm.operId" placeholder="请选择" filterable>
                        <Option v-for="(item,index) in teacherList" :key="index" :value="item.id">{{item.teaName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="填报人证件号" prop="operCode">
                    <Input type="text" v-model="dataForm.operCode" :readonly="true" :maxlength="100" placeholder="请输入填报人证件号" />
                </FormItem>
                <FormItem label="状态" prop="status">
                    <i-switch v-model="dataForm.status">
                        <span slot="open">有效</span>
                        <span slot="close">有效</span>
                    </i-switch>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveBudgetDepartment">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/budget/budgetdepartment'
export default {
  name: 'BudgetDepartment-form',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      teacherList: [],
      dataForm: {
        name: '',
        duty: '',
        operId: '',
        operCode: '',
        operName: '',
        status: true,
        id: undefined
      },
      dataFormValidate: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        duty: [
          { required: true, message: '部门职责不能为空', trigger: 'blur' }
        ],
        operId: [
          { type: 'number', required: true, message: '填报人ID不能为空', trigger: 'blur' }
        ],
        operCode: [
          { required: true, message: '填报人证件号不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    'dataForm.operId': {
      immediate: true,
      handler () {
        if (this.teacherList && this.teacherList.length) {
          let oper = this.teacherList.find(item => item.id === this.dataForm.operId)
          if (oper) {
            this.dataForm.operName = oper.teaName
            this.dataForm.operCode = oper.teaCode
          }
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadTeacherList()
    },
    loadTeacherList () {
      api.getTeacherDataList().then(res => {
        this.teacherList = res.data
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addBudgetDepartment () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editBudgetDepartment (id) {
      this.modalTitle = '编辑'
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
    },
    saveBudgetDepartment () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveBudgetDepartment(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateBudgetDepartment(data).then(res => {
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
