<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="部门名称" prop="salaryDepartmentId" v-if="!dataForm.id">
            <Select v-model="dataForm.salaryDepartmentId" placeholder="请选择">
              <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="员工" prop="teacherIds" v-if="!dataForm.id">
            <Select v-model="dataForm.teacherIds" :multiple="true" placeholder="请选择">
              <Option v-for="(item,index) in teacherList" :key="index" :value="item.id">{{item.teaName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="在职状态" prop="status">
            <Select v-model="dataForm.status" placeholder="请选择">
              <Option :value="1">在职</Option>
              <Option :value="2">离职</Option>
              <Option :value="3">退休</Option>
            </Select>
          </FormItem>
          <FormItem label="入职时间" prop="hiredate">
            <IDatePicker type="date" v-model="dataForm.hiredate" format="yyyy-MM-dd" placeholder="请输入入职时间" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSalaryStaff">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/salary/salarystaff'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'SalaryStaff-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      teacherList: [],
      departmentList: [],
      dataForm: {
        salaryDepartmentId: '',
        teacherId: '',
        teacherIds: [],
        teacherName: '',
        teacherCode: '',
        status: 1,
        hiredate: '',
        id: null
      },
      dataFormValidate: {
        salaryDepartmentId: [
          { type: 'number', required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        teacherIds: [
          { type: 'array', required: true, message: '老师ID不能为空', trigger: 'blur' }
        ],
        teacherId: [
          { type: 'number', required: true, message: '老师ID不能为空', trigger: 'blur' }
        ],
        status: [
          { type: 'number', required: true, message: '在职状态不能为空', trigger: 'blur' }
        ],
        hiredate: [
          { required: true, message: '入职日期不能为空', trigger: 'blur' }
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
      this.loadDepartmentList()
    },
    cancel () {
      this.formModalVisible = false
    },
    loadTeacherList () {
      api.getTeacherDataList().then(res => {
        this.teacherList = res.data
      })
    },
    loadDepartmentList () {
      api.getSalaryDepartmentDataList().then(res => {
        this.departmentList = res.list
      })
    },
    addSalaryStaff () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
      this.dataFormValidate.teacherId.required = false
      this.dataFormValidate.teacherIds.required = true
    },
    editSalaryStaff (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      this.dataFormValidate.teacherId.required = true
      this.dataFormValidate.teacherIds.required = false
      api.getSalaryStaffInfo(id).then(res => {
        let entity = res.salaryStaff
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveSalaryStaff () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            let arr = []
            data.teacherIds.forEach(id => {
              let tea = this.teacherList.find(item => item.id === id)
              let staff = Object.assign({}, data)
              staff.teacherId = id
              staff.teacherName = tea.teaName
              staff.teacherCode = tea.teaCode
              delete staff.teacherIds
              arr.push(staff)
            })

            api.baseSaveSalaryStaff(arr).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            let tea = this.teacherList.find(item => item.id === data.teacherId)
            data.teacherName = tea.teaName
            data.teacherCode = tea.teaCode
            api.updateSalaryStaff(data).then(res => {
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
