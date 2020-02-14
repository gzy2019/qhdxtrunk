<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="申报名称" prop="name">
            <Input type="text" v-model="dataForm.name" :maxlength="200" placeholder="请输入申报名称" clearable/>
          </FormItem>
          <FormItem label="报名时间" prop="DateTime">
            <IDatePicker type="daterange" v-model="dataForm.DateTime" format="yyyy-MM-dd" placeholder="请输入报名开始时间" clearable/>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveDeclareOpeningInfo">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/declare/declareopeninginfo'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'DeclareOpeningInfo-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        name: '',
        DateTime: [],
        // startDate: '',
        // endDate: '',
        id: null
      },
      dataFormValidate: {
        name: [
          { required: true, message: '申报名称不能为空', trigger: 'blur' }
        ],
        DateTime: [
          { type: 'array', required: true, message: '报名时间不能为空', trigger: 'blur' }
        ],
        // endDate: [
        //   { required: true, message: '报名结束时间不能为空', trigger: 'blur' }
        // ],
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
    addDeclareOpeningInfo () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editDeclareOpeningInfo (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getDeclareOpeningInfoInfo(id).then(res => {
        let entity = res.declareOpeningInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.dataForm.DateTime = []
        this.dataForm.DateTime.push(entity.startDate)
        this.dataForm.DateTime.push(entity.endDate)
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveDeclareOpeningInfo () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.startDate = this.dataForm.DateTime[0]
          this.dataForm.endDate = this.dataForm.DateTime[1]
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveDeclareOpeningInfo(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateDeclareOpeningInfo(data).then(res => {
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
