<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="标签名称" prop="tagName">
            <Input type="text" v-model="dataForm.tagName" :maxlength="50" placeholder="请输入标签名称,唯一" />
          </FormItem>
          <FormItem label="标签类型" prop="type">
            <Select v-model="dataForm.type" placeholder="请选择">
              <Option value="positive">好评</Option>
              <Option value="negative">差评</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseTag">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/cases/casetag'
export default {
  name: 'CaseTag-form',
  data () {
    const validateTagName = (rule, value, callback) => {
      if (!this.dataForm.tagName) {
        callback(new Error('标签名称不能为空}'))
      } else {
        api.validateTagName(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('标签名称已经存在'))
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
      dataForm: {
        tagName: '',
        type: '',
        id: null
      },
      dataFormValidate: {
        tagName: [
          { validator: validateTagName, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '标签类型不能为空', trigger: 'blur' }
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
    addCaseTag () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editCaseTag (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getCaseTagInfo(id).then(res => {
        let entity = res.caseTag
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveCaseTag () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveCaseTag(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseTag(data).then(res => {
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
