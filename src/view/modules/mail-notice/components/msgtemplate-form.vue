<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="750" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="名称" prop="name">
                    <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.name" :maxlength="200" placeholder="请输入名称" />
                </FormItem>
                <FormItem label="编码" prop="code">
                    <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.code" :maxlength="50" placeholder="请输入编码" />
                </FormItem>
                <FormItem label="类型" prop="type">
                    <Select v-model="dataForm.type" placeholder="请选择类型">
                      <Option value="sms">短信</Option>
                      <Option value="email">邮信</Option>
                    </Select>
                </FormItem>
                <FormItem label="内容" prop="content">
                    <Input type="textarea" :readonly="modalView" :clearable="!modalView" v-model="dataForm.content" :rows="8" :maxlength="5000" placeholder="请输入内容" />
                </FormItem>
            </Form>
            <div slot="footer" v-show="!modalView">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveMsgTemplate">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/msg'
export default {
  name: 'MsgTemplate-form',
  data () {
    const validateCode = (rule, value, callback) => {
      if (!this.dataForm.code) {
        callback(new Error('编码不能为空'))
      } else {
        api.validateMsgTemplateCode(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('编码已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      formModalVisible: false,
      modalView: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        name: '',
        code: '',
        type: '',
        content: '',
        id: undefined
      },
      dataFormValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'change' }
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

    },
    cancel () {
      this.formModalVisible = false
    },
    addMsgTemplate () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewMsgTemplate (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getMsgTemplateInfo(id).then(res => {
        let entity = res.msgTemplate
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editMsgTemplate (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getMsgTemplateInfo(id).then(res => {
        let entity = res.msgTemplate
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
      this.modalView = false
    },
    saveMsgTemplate () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveMsgTemplate(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateMsgTemplate(data).then(res => {
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
