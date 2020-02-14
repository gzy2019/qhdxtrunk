<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
      <span slot="prepend">
        <Icon :size="16" type="ios-person"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="userPsd">
      <Input type="password" v-model="form.userPsd" placeholder="请输入密码">
      <span slot="prepend">
        <Icon :size="14" type="md-lock"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem label="">
      <Row>
        <Col span="14">
        <Input v-model="form.captcha" placeholder="验证码" style="width:95%">
        <span slot="prepend">
          <Icon :size="16" type="ios-lock"></Icon>
        </span>
        </Input>
        </Col>
        <Col span="8">
        <img :src="captchaPath" @click="getCaptcha()" title="点击换一张" alt="" style="width: 110px;margin-top:3px;">
        </Col>
      </Row>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" :loading="submitLoading" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getUUID } from '@/libs/util'
import url from '_conf/url'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      submitLoading: false,
      form: {
        userName: '',
        userPsd: '',
        uuid: '',
        captcha: ''
      },
      captchaPath: ''
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        userPsd: this.passwordRules
      }
    }
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    resetForm () {
      this.form.userPsd = ''
      this.getCaptcha()
      this.submitLoading = false
    },
    getCaptcha () {
      this.form.uuid = getUUID()
      this.captchaPath = url + `/captcha.jpg?uuid=${this.form.uuid}`
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.form.userName = this.form.userName.trim()
          this.submitLoading = true
          this.$emit('on-success-valid', this.form)
        }
      })
    }
  }
}
</script>
