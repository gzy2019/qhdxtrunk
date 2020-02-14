<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="dataForm.name" :maxlength="100" placeholder="请输入名称" />
                </FormItem>
                <FormItem label="管理员" prop="adminId">
                  <Select v-model="dataForm.adminId" placeholder="请选择" filterable>
                    <Option v-for="(item,index) in adminList" :key="index" :value="item.id">{{item.teaName}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="操作员" prop="operId">
                  <Select v-model="dataForm.operId" placeholder="请选择" filterable>
                    <Option v-for="(item,index) in operList" :key="index" :value="item.id">{{item.teaName}}</Option>
                  </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="savePaypointDepartment">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/paypoint/paypointdepartment'
export default {
  name: 'PaypointDepartment-form',
  data () {
    const validateName = (rule, value, callback) => {
      if (!this.dataForm.name) {
        callback(new Error('名称不能为空'))
      } else {
        api.validateName(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('名称已经存在'))
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
      teacherList: [],
      dataForm: {
        createUserId: '',
        name: '',
        adminId: '',
        operId: '',
        isDel: '',
        id: undefined
      },
      dataFormValidate: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        adminId: [
          { type: 'number', required: true, message: '管理员不能为空', trigger: 'blur' }
        ],
        operId: [
          { type: 'number', required: true, message: '操作员不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  computed: {
    adminList () {
      let arr = this.teacherList.filter(item => item.id !== this.dataForm.operId)
      return [...arr]
    },
    operList () {
      let arr = this.teacherList.filter(item => item.id !== this.dataForm.adminId)
      return [...arr]
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
    addPaypointDepartment () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editPaypointDepartment (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointDepartmentInfo(id).then(res => {
        let entity = res.paypointDepartment
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    savePaypointDepartment () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.savePaypointDepartment(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updatePaypointDepartment(data).then(res => {
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
