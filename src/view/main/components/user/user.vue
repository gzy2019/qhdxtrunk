<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Avatar :src="userAvator"/> -->
      <Avatar v-if="false" style="color: #464c5b;background-color: #5cadff"></Avatar><B>{{userName}}</B>
      <Icon :size="18" type="md-arrow-dropdown" style="color:#fff"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="setpwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal title="修改密码" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
        <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
          <FormItem label="旧密码" prop="userPsd">
            <Input type="password" v-model="dataForm.userPsd" clearable placeholder="请输入旧密码" />
          </FormItem>
          <FormItem label="新密码" prop="newUserPsd">
            <Input type="password" v-model="dataForm.newUserPsd" clearable placeholder="请输入新密码" />
          </FormItem>
          <FormItem label="确认密码" prop="newUserPsd2">
            <Input type="password" v-model="dataForm.newUserPsd2" clearable placeholder="请输入确认密码" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" :loading="submitLoading" @click="saveData">确定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { setTagNavListInLocalstorage } from '@/libs/util'
import { updateUserPsd } from '@/api/user'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data () {
    const validateUserPsd = (rule, value, callback) => {
      let regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}')
      if (!this.dataForm.newUserPsd) {
        callback(new Error('密码不能为空'))
      } else if (!regex.test(this.dataForm.newUserPsd)) {
        callback(new Error('密码中必须包含字母、数字，至少8个字符'))
      } else {
        callback()
      }
    }
    const validateUserPsd2 = (rule, value, callback) => {
      if (!this.dataForm.newUserPsd2) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.newUserPsd !== this.dataForm.newUserPsd2) {
        callback(new Error('确认密码不一致，请重复输入'))
      } else {
        callback()
      }
    }
    return {
      userName: this.$store.state.user.userName,
      formModalVisible: false,
      submitLoading: false,
      dataForm: {
        userId: this.$store.state.user.userId,
        userPsd: '',
        newUserPsd: '',
        newUserPsd2: ''
      },
      dataFormValidate: {
        userPsd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newUserPsd: [
          { validator: validateUserPsd, required: true, trigger: 'blur' }
        ],
        newUserPsd2: [
          { validator: validateUserPsd2, required: true, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    ...mapActions(['handleLogOut']),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$store.commit('setRouters', [])
            this.$store.commit('setHasGetRouter', false)
            this.$store.commit('setHasGetInfo', false)
            setTagNavListInLocalstorage([])
            // this.$router.replace({
            //   name: 'login'
            // })
            window.location = ''
          })
          break
        case 'setpwd':
          this.formModalVisible = true
          break
      }
    },
    saveData () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          updateUserPsd(this.dataForm).then(res => {
            this.$Message.success('修改密码成功！请重新登录系统')
            this.formModalVisible = false
            this.submitLoading = false
            this.$refs.dataForm.resetFields()
            setTimeout(() => {
              this.handleClick('logout')
            }, 1000)
          }).catch(() => {
            // 如果修改不成功暂时不关闭页面
            this.formModalVisible = true
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="css" scoped>
.ivu-dropdown-rel b {
  display: inline-block;
  max-width: 100px;
  margin: 0 0 0 5px;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
  color: #fff;
}
</style>
