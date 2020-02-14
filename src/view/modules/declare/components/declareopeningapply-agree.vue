<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="备注" prop="stuDesc">
            <Input type="text" v-model="dataForm.stuDesc" :maxlength="100" placeholder="请输入备注" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="declineDeclareOpeningApply">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/declare/declareopeningapply'

export default {
  name: 'DeclareOpeningApply-plan',
  data () {
    return {
      // list1: [],
      selectedList: [],
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        stuDesc: '',
        id: null
      },
      dataFormValidate: {
        stuDesc: [
          { type: 'string', required: true, message: '备注不能为空', trigger: 'blur' }
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
    agreedeclareOpeningApply () {
      this.modalTitle = '驳回'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    declineDeclareOpeningApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let ids = {}
          for (let i in this.selectedList) {
            ids.push(this.selectedList[i].id)
          }
          // 新增保存
          // let data = Object.assign({}, this.dataForm)
          console.log(this.dataForm.id)
          api.updateDeclareOpeningApply({'applyStatus': 3, 'stuDesc': this.dataForm.stuDesc, ids: ids}).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.$emit('update')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
      // let params = []
      // this.selectedList.map(item => {
      //   let param = {}
      //   param.id = item.id
      //   param.stuDesc = item.stuDesc
      //   param.applyStatus = 3
      //   params.push(param)
      // })
      // console.log(params)
      // this.submitLoading = true
      // // 新增保存
      // api.updateDeclareOpeningApply(params).then(res => {
      //   this.submitLoading = false
      //   if (res.code === 200) {
      //     this.$Message.success('操作成功！')
      //     this.dataModalVisible = false
      //     this.handleSearch()
      //   }
      // })
    }
  }
}

</script>
