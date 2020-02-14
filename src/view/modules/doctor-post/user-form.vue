<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal
      :title="modalTitle"
      v-model="formModalVisible"
      :mask-closable="false"
      :width="500"
      class-name="vertical-center-modal"
    >
      <Spin size="large" fix v-if="loading"></Spin>
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="真实姓名" prop="userName">
          <Input
            type="text"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.userName"
            :maxlength="30"
            placeholder="请输入真实姓名"
          />
        </FormItem>
        <FormItem label="手机号" prop="userMobile">
          <Input
            type="text"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.userMobile"
            :maxlength="13"
            placeholder="请输入手机号"
          />
        </FormItem>
        <FormItem label="邮箱" prop="userEmail">
          <Input
            type="text"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.userEmail"
            :maxlength="30"
            placeholder="请输入邮箱"
          />
        </FormItem>
        <FormItem label="性别" prop="userSex">
          <DicSelect v-model="dataForm.userSex" dtype="sex" :clearable="true"></DicSelect>
        </FormItem>
        <FormItem label="密码" prop="userPsd">
          <Input
            type="password"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.userPsd"
            :maxlength="100"
            placeholder="请输入密码"
          />
        </FormItem>
        <FormItem label="确认密码" prop="userPsd2">
          <Input
            type="password"
            v-model="dataForm.userPsd2"
            :readonly="modalView"
            :clearable="!modalView"
            :maxlength="100"
            placeholder="请输入密码"
          />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveDoctorPostUser">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import api from '@/api/doctorpost/doctorpostuser'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'DoctorPostUser-form',
  components: { DicSelect },
  data () {
    const validateUserPsd2 = (rule, value, callback) => {
      if (this.dataForm.userPsd !== this.dataForm.userPsd2) {
        callback(new Error('确认密码不一致，请重复输入'))
      } else {
        callback()
      }
    }
    return {
      formModalVisible: false,
      modalView: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        userName: '',
        userMobile: '',
        userEmail: '',
        userSex: '',
        userPsd: '',
        userPsd2: '',
        id: undefined
      },
      dataFormValidate: {
        userName: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        userMobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        userPsd2: [{ validator: validateUserPsd2, trigger: 'blur' }]
      },
      submitLoading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {},
    cancel () {
      this.formModalVisible = false
    },
    addDoctorPostUser () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewDoctorPostUser (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api
        .getDoctorPostUserInfo(id)
        .then(res => {
          let entity = res.doctorPostUser
          Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = entity[key]
          })
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
      this.formModalVisible = true
      this.modalView = true
    },
    editDoctorPostUser (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api
        .getDoctorPostUserInfo(id)
        .then(res => {
          let entity = res.doctorPostUser
          Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = entity[key]
          })
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
      this.formModalVisible = true
      this.modalView = false
    },
    saveDoctorPostUser () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          console.log('dateForm', this.dataForm)
          // 新增保存
          if (!this.dataForm.id) {
            api
              .saveDoctorPostUser(this.dataForm)
              .then(res => {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.$emit('update')
              })
              .finally(() => {
                this.submitLoading = false
              })
          } else {
            api
              .updateDoctorPostUser(this.dataForm)
              .then(res => {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.$emit('update')
              })
              .finally(() => {
                this.submitLoading = false
              })
          }
        }
      })
    }
  }
}
</script>
