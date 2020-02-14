<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate" label-position="right">
                <FormItem label="分类名称" prop="typeName">
                    <Input type="text" v-model="dataForm.typeName" :maxlength="200" placeholder="请输入分类名称" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveOfficeActivityType">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/activity/officeactivitytype'
export default {
  name: 'OfficeActivityType-form',
  data () {
    // const validateDicType = (rule, value, callback) => {
    //   if (!this.dataForm.dicValue) {
    //     callback(new Error('编码不能为空'))
    //   } else {
    //     api.validateDicValue(this.dataForm).then(res => {
    //       if (!res.result) {
    //         callback(new Error('编码已经存在'))
    //       } else {
    //         callback()
    //       }
    //     })
    //   }
    // }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        typeName: '',
        id: undefined
      },
      dataFormValidate: {
        typeName: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
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
    addOfficeActivityType () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editOfficeActivityType (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeActivityTypeInfo(id).then(res => {
        let entity = res.officeActivityType
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveOfficeActivityType () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveOfficeActivityType(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateOfficeActivityType(data).then(res => {
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
