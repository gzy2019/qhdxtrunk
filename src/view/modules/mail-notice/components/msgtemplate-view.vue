<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="750" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <FormItem label="名称" prop="name">
                    {{dataForm.name}}
                </FormItem>
                <FormItem label="编码" prop="code">
                    {{dataForm.code}}
                </FormItem>
                <FormItem label="类型" prop="type">
                    {{dataForm.type | typeInfo}}
                </FormItem>
                <FormItem label="内容" prop="content">
                    {{dataForm.content}}
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">关闭</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/msg'
export default {
  name: 'MsgTemplate-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        name: '',
        code: '',
        type: '',
        content: '',
        id: undefined
      }
    }
  },
  filters: {
    typeInfo (val) {
      if (val === 'sms') return '短信'
      if (val === 'email') return '邮件'
      return '未知'
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewMsgTemplate(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewMsgTemplate (id) {
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
    }
  }
}
</script>
