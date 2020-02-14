<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="开题时间" prop="openingDate">
            <IDatePicker type="date" v-model="dataForm.openingDate" format="yyyy-MM-dd" placeholder="请输入开题时间" />
          </FormItem>
          <FormItem label="开题地点" prop="openingAds">
            <Input type="text" v-model="dataForm.openingAds" :maxlength="100" placeholder="请输入开题地点" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveDeclareOpeningApply">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/declare/declareopeningapply'
import IDatePicker from '@/view/components/idate-picker'

export default {
  name: 'DeclareOpeningApply-plan',
  components: {
    IDatePicker
  },
  data () {
    return {
      // list1: [],
      selectedList: [],
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        openingDate: '',
        openingAds: '',
        id: null
      },
      dataFormValidate: {
        openingDate: [
          { type: 'string', required: true, message: '开题时间不能为空', trigger: 'blur' }
        ],
        openingAds: [
          { type: 'string', required: true, message: '开题地点不能为空', trigger: 'blur' }
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
    planDeclareOpeningApply () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    // editDeclareOpeningApply (id) {
    //   this.modalTitle = '编辑'
    //   this.$refs.dataForm.resetFields()
    //   this.loading = true
    //   api.getDeclareOpeningApplyInfo(id).then(res => {
    //     let entity = res.declareOpeningApply
    //     Object.keys(this.dataForm).forEach(key => {
    //       this.dataForm[key] = entity[key]
    //     })
    //   }).finally(() => {
    //     this.loading = false
    //   })
    //   this.formModalVisible = true
    // },
    saveDeclareOpeningApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          console.log(this.dataForm)
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          api.updateDeclareOpeningApply(data).then(res => {
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
      //   // param.applyStatus = 2
      //   params.push(param)
      // })
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
