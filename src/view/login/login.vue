<style lang="less">
@import './login.less';
</style>

<template>
  <div>
    <!-- <header id="header">
      <a href="">
        <span id="logo"> <img alt="" style="" src="../../assets/images/logo.png"> </span>
      </a>
      <span style="display:none" id="extr-page-header-space"> <span class="hidden-mobile hidden-xs">没有帐号?</span> <a class="btn btn-danger" href="http://mall.poteviohealth.com/admin/register.html">注册</a> </span>
    </header> -->
    <div class="login">
      <p style="position:absolute;left:20px;top:20px"> <img alt="" src="../../assets/images/logo_login.png"></p>
      <div class="login-con">
        <p style="margin:0 auto 20px;text-align:center"> <img alt="" src="../../assets/images/welcome_img.png" style="width:100%"></p>
        <Card icon="log-in" title="欢迎登录" :bordered="false">
          <div class="form-con">
            <login-form ref="login-form" @on-success-valid="handleSubmit"></login-form>
          </div>
        </Card>
      </div>
    </div>
    <Footer id="footer">
      <p class="muted">清华大学公共管理学院 sppm_adm@tsinghua.edu.cn</p>
      <!-- <p class="muted" style="padding-top: 0;">津ICP备140033343号-2 津教备0165号</p> -->
    </Footer>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit (formData) {
      this.handleLogin(formData).then(res => {
        this.getUserInfo().then(res => {
          this.$Message.success('登录成功')
          this.$router.push({
            name: 'home'
          })
        })
      }).catch(res => {
        this.$refs['login-form'].resetForm()
      })
    }
  }
}
</script>

<style scoped>
.ivu-layout-footer {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0px;
  color: #fff !important;
  background: none !important;
  border: none !important;
}

.ivu-card {
  background: rgba(255, 255, 255, 0.2);
}
</style>
