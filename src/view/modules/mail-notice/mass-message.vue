<template>
  <div class="search">
    <Card>
      <Row>
        <Col span="23">
        <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
          <FormItem label="发送方式" prop="sendType">
            <RadioGroup v-model="dataForm.sendType">
              <Radio label="mail">系统邮件</Radio>
              <Radio label="sms">短信</Radio>
              <Radio label="importsms">批量导入短信</Radio>
              <Radio label="personmail">个人邮箱</Radio>
              <div v-if="dataForm.sendType !== 'sms' && dataForm.sendType !== 'importsms'" @click="configure = true" style="display:inline-block"><a href="javascript:volid(0);" style="padding:6px 0 0;vertical-align:middle">配置</a></div>
            </RadioGroup>
          </FormItem>
          <div v-if="dataForm.sendType === 'importsms'" style="margin:20px;">
            <Row>
              <Col span="16">
                <Upload ref="uploadSms" :action="importSmsUrl" :default-file-list="defaultSmsFileList" :before-upload="handleImportSmsBeforeUpload" :on-success="handleImportSmsSuccess" :show-upload-list="false" :with-credentials="true" :data="paramsImportSms">
                  <Button icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
                {{ smsFile && smsFile.name }}
              </Col>
              <Col span="4">
                <Button icon="ios-cloud-download-outline" @click="downloadTeplate()">下载模版</Button>
              </Col>
            </Row>
          </div>
          <FormItem label="收件人" prop="receiver" >
            <Input v-model="dataForm.receiver" :icon="dataForm.sendType !== 'importsms'?'ios-more':undefined" @on-click="selectUser"/>
          </FormItem>
          <FormItem label="主题" prop="title" v-if="dataForm.sendType !== 'sms' && dataForm.sendType !== 'importsms'">
            <Input type="text" v-model="dataForm.title" clearable placeholder="请输入主题" />
          </FormItem>
          <FormItem label="内容" prop="content">
            <Input v-model="dataForm.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="0-200个字符"></Input>
          </FormItem>
          <div class="up_files" v-if="dataForm.sendType !== 'sms' && dataForm.sendType !== 'importsms'">
            <Upload ref="upload" multiple :action="actionUrl" :on-success="handleUploadSuccess" :on-exceeded-size="onExceededSize" :before-upload="handleBeforeUpload" :show-upload-list="false" :with-credentials="true" :max-size="40960">
              <Button icon="ios-cloud-upload-outline">上传附件</Button>
            </Upload>
            <!-- <Button @click="files = true">上传附件</Button> -->
            <span style="font-size:12px;color:#969696">（附件文件总大小不可超过40M，请注意选择。）</span>
            <p style="margin-top:15px" v-for="(item,index) in uploadFileList" :key="index">
                <a :href="item.response && item.response.data.url">
                  <Icon type="ios-copy-outline"/>{{item.name}}({{parseFloat(item.size/1024).toFixed(2) }}KB)
                </a>
                <a href="javascript:;"  @click="deleteFile(item.uid)">
                  <Icon type="ios-close-circle-outline" />
                </a>
            </p>
            <!-- <p><a href="">
                <Icon type="ios-copy-outline" />附件2.xls(4.5M)
                <Icon type="ios-close-circle-outline" /></a></p>
            <p><a href="">
                <Icon type="ios-copy-outline" />附件1.ppt(4.5M)
                <Icon type="ios-close-circle-outline" /></a></p> -->
          </div>
          <div style="text-align:right">
            <Button type="primary" :loading="submitLoading" @click="sendSms">发送</Button>
          </div>
        </Form>
        </Col>
      </Row>
    </Card>
    <!--上传附件提示 start-->
    <Modal title="" v-model="onExceededSizeShow" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>附件提示</span>
      </p>
      <p style="padding:20px;font-size:14px">您添加的附件文件总大小超过40M，无法上传。请重新选择。</p>
      <div slot="footer">
        <Button @click="files = false">取消</Button>
        <Button type="primary" @click="files = false">确定</Button>
      </div>
    </Modal>
    <!--上传附件提示 end-->

    <!--收件人弹出框 start-->
    <Modal title="选择成员对象" v-model="receiverSelectVisible" :fullscreen="false" :width="650" class-name="vertical-center-modal" :styles="{top: '20px'}">
      <div class="receiverSelectVisible_cont" style="position:relative;">
        <a style="position: absolute;width:60px;right:0;top:10px;color:red;z-index:9;display:none;">清空已选</a>
        <Tabs v-if="receiverSelectVisible">
          <TabPane label="学生" style="max-height:460px;overflow:auto;">
            <StudentTree @on-check-change="onStudentSelectCheck"/>
          </TabPane>
          <TabPane label="教师" style="max-height:460px;overflow:auto;">
            <TeacherTree @on-check-change="onTeacherSelectCheck"/>
          </TabPane>
          <TabPane label="组织" style="max-height:460px;overflow:auto;">
            <OrgTree @on-check-change="onOrgSelectCheck"/>
          </TabPane>
        </Tabs>

      </div>
      <div slot="footer">
        <Button @click="saveDraft">存草稿</Button>
        <Button type="primary" :loading="submitLoading" @click="completeSelect">保存</Button>
      </div>
    </Modal>
    <!--收件人弹出框 end-->

    <!--配置个人邮箱 start-->
    <Modal title="配置个人邮箱" v-model="configure" width="" class-name="vertical-center-modal">
      <Form ref="configForm" :model="configForm" :label-width="80">
        <FormItem label="邮箱地址" prop="username">
          <Input type="text" v-model="configForm.username" clearable placeholder="请输入邮箱地址" style="width:50%" />
          @mail.tsinghua.edu.cn
        </FormItem>
        <FormItem label="邮箱密码" prop="mailPsd">
          <Input type="text" v-model="configForm.mailPsd" clearable placeholder="请输入邮箱密码" style="width:50%" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="configure = false">取消</Button>
        <Button type="primary" @click="configure = false">保存</Button>
      </div>
    </Modal>
    <!--配置个人邮箱 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import TeacherTree from '@/view/components/teacher-tree'
import StudentTree from '@/view/components/student-tree'
import OrgTree from '@/view/components/org-tree'
import api from '@/api/msg'
import url from '_conf/url'
import { getToken } from '@/libs/util'
export default {
  name: 'mass-message',
  components: {
    Tables, TeacherTree, StudentTree, OrgTree
  },
  data () {
    return {
      actionUrl: url + '/app/upload',
      importSmsUrl: url + '/msg/smsoutbox/import',
      smsFile: null,
      defaultSmsFileList: [],
      dataForm: {
        sendType: 'mail',
        receiver: '',
        receiverName: '',
        title: '',
        content: '',
        attachment: '',
        mailReceiverGroupId: '',
        mailSender: '',
        mailSenderPsd: ''
      },
      paramsImportSms: {
        token: getToken()
      },
      tmpReceiverList: [],
      receiverList: [],
      userFullscreen: false,
      files: false,
      dataFormValidate: {
        sendType: [{ required: true, message: '发送方式不能为空', trigger: 'blur' }],
        receiver: [{ required: true, message: '收件人不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '主题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      uploadFileList: [],
      onExceededSizeShow: false,
      configure: false,
      receiverSelectVisible: false,
      configForm: {
        username: '',
        mailPsd: ''
      },
      data4: [],
      submitLoading: false
    }
  },
  methods: {
    handleBeforeUpload () {

    },
    handleUploadSuccess () {
      this.uploadFileList = this.$refs.upload.fileList
    },
    deleteFile (uid) {
      this.uploadFileList = this.uploadFileList.filter(item => {
        return item.uid !== uid
      })
    },
    onExceededSize () {
      this.onExceededSizeShow = true
    },
    sendSms () {
      if (this.dataForm.sendType === 'sms' || this.dataForm.sendType === 'importsms') {
        this.saveSmsOutData()
      } else {
        this.saveMailOutData()
      }
    },
    saveMailOutData () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          api.saveMailOutData({
            mailReceiver: this.dataForm.receiver,
            mailReceiverName: this.dataForm.receiverName,
            mailTitle: this.dataForm.title,
            mailContent: this.dataForm.content,
            mailAttachment: JSON.stringify(this.uploadFileList),
            mailReceiverGroupId: this.dataForm.receiverGroupId,
            mailSender: this.configForm.username + '@mail.tsinghua.edu.cn',
            mailSenderPsd: this.configForm.mailPsd
          }).then(res => {
            this.submitLoading = false
            this.$refs.dataForm.resetFields()
            this.uploadFileList = []
            this.$refs.upload.clearFiles()
            this.$Message.success('发送成功！')
          }).catch(err => {
            this.submitLoading = false
            this.$Message.warn('发送失败！' + err)
          })
        }
      })
    },
    saveSmsOutData () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          api.saveSmsOutData({
            smsPhone: this.dataForm.receiver,
            smsReceiver: this.dataForm.receiverName,
            smsContent: this.dataForm.content
          }).then(res => {
            this.submitLoading = false
            this.$refs.dataForm.resetFields()
            this.$Message.success('发送成功！')
          }).catch(err => {
            this.$Message.warn('发送失败！' + err)
          })
        }
      })
    },
    saveDraft () {

    },
    selectUser () {
      this.receiverSelectVisible = true
      this.userFullscreen = false
    },
    onStudentSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          list.push({
            name: item.title,
            mobile: item.mobile,
            email: item.email,
            type: 'student',
            id: item.id
          })
        })
        let otherList = this.tmpReceiverList.filter(item => item.type !== 'student')
        this.tmpReceiverList = [...otherList, ...list]
      }
    },
    onTeacherSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          list.push({
            name: item.title,
            mobile: item.mobile,
            email: item.email,
            type: 'tea',
            id: item.id
          })
        })
        let otherList = this.tmpReceiverList.filter(item => item.type !== 'tea')
        this.tmpReceiverList = [...otherList, ...list]
      }
    },
    onOrgSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          list.push({
            name: item.title,
            mobile: item.mobile,
            email: item.email,
            type: 'org',
            id: item.id
          })
        })
        let otherList = this.tmpReceiverList.filter(item => item.type !== 'org')
        this.tmpReceiverList = [...otherList, ...list]
      }
    },
    completeSelect () {
      this.receiverSelectVisible = false
      this.receiverList = [...this.tmpReceiverList]
      let receiverArr = []
      let receiverNameArr = []
      this.receiverList.forEach(item => {
        if (this.dataForm.sendType === 'sms') {
          if (item.mobile) {
            receiverArr.push(item.mobile)
            receiverNameArr.push(item.name)
          }
        } else {
          if (item.email) {
            receiverArr.push(item.email)
            receiverNameArr.push(item.name)
          }
        }
      })
      this.dataForm.receiver = receiverArr.join(',')
      this.dataForm.receiverName = receiverNameArr.join(',')
    },
    handleImportSmsBeforeUpload (file) {
    },
    handleImportSmsSuccess (response, file, fileList) {
      console.log('object 1:', JSON.stringify(response))
      if (response.code === 200) {
        let list = response.data || []
        this.dataForm.receiver = list.map(item => item.smsPhone).join(',')
        this.dataForm.receiverName = list.map(item => item.username).join(',')
      } else {
        this.$Message.warn('操作失败：' + response.msg)
      }
    },
    // 下载导入模版
    downloadTeplate () {
      const url = 'http://info.sppm.tsinghua.edu.cn/sppmtest/file/template/importsms.xlsx'
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '批量发送短信模板')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  mounted () {
  }
}
</script>
