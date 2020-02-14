<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="部门名称" prop="name">
            <Input type="text" v-model="dataForm.name" :maxlength="200" placeholder="请输入部门名称" />
          </FormItem>
          <FormItem label="负责人" prop="operId">
            <Select v-model="dataForm.operId" placeholder="请选择">
              <Option v-for="(item,index) in teacherList" :key="index" :value="item.id">{{item.teaName}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSalaryDepartment">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/salary/salarydepartment'
export default {
  name: 'SalaryDepartment-form',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      teacherList: [],
      dataForm: {
        name: '',
        operId: '',
        operCode: '',
        operName: '',
        id: null
      },
      dataFormValidate: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        operId: [
          { type: 'number', required: true, message: '负责人不能为空', trigger: 'blur' }
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
      this.loadTeacherList()
    },
    cancel () {
      this.formModalVisible = false
    },
    loadTeacherList () {
      api.getTeacherDataList().then(res => {
        this.teacherList = res.data
      })
    },
    addSalaryDepartment () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editSalaryDepartment (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSalaryDepartmentInfo(id).then(res => {
        let entity = res.salaryDepartment
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveSalaryDepartment () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (this.teacherList && this.teacherList.length) {
            let oper = this.teacherList.find(item => item.id === data.operId)
            data.operName = oper.teaName
            data.operCode = oper.teaCode
          }
          if (!data.id) {
            api.saveSalaryDepartment(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateSalaryDepartment(data).then(res => {
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
