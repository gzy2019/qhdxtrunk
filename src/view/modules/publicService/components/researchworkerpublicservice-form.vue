<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="服务名称" prop="serviceName">
            <Input type="text" v-model="dataForm.serviceName" :maxlength="100" placeholder="请输入服务名称" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerPublicservice">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/publicService/researchworkerpublicservice'
export default {
  name: 'ResearchworkerPublicservice-form',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        serviceName: '',
        id: null
      },
      dataFormValidate: {
        serviceName: [
          { required: true, message: '服务名称不能为空', trigger: 'blur' }
        ],
        formItem_: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' },
          { type: 'string', min: 20, message: '不能超过20个字符', trigger: 'blur' }
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
    addResearchworkerPublicservice () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerPublicservice (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerPublicserviceInfo(id).then(res => {
        let entity = res.researchworkerPublicservice
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerPublicservice () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveResearchworkerPublicservice(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerPublicservice(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-update')
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
