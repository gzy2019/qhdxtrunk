<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="标签名称" prop="tagName">
            <!-- <ClassSelect v-model="dataForm.tagName" :clearable="true" multiple placeholder="请输入标签名称"></ClassSelect> -->
            <Input type="text" v-model="dataForm.tagName" :maxlength="100" placeholder="请输入标签名称" />
          </FormItem>

          <!-- <FormItem label="学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="50" placeholder="请输入学号" />
          </FormItem>
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem> -->
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSchoolfellowTag">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowtag'
import IDatePicker from '@/view/components/idate-picker'
// import ClassSelect from '@/view/components/class-select'

export default {
  name: 'SchoolfellowTag-form',
  components: {
    IDatePicker
    // ClassSelect
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        tagName: [],
        // stuCode: '',
        // stuName: '',
        id: null
      },
      dataFormValidate: {
        tagName: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' }
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
      this.formModalVisibe = false
    },
    addSchoolfellowTag () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editSchoolfellowTag (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowTagInfo(id).then(res => {
        let entity = res.schoolfellowTag
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveSchoolfellowTag () {
      // let stuCode = this.$route.params.stuCode
      // this.dataForm.stuCode = stuCode
      // let stuName = this.$route.params.stuName
      // this.dataForm.stuName = stuName
      // let schoolfellowInfoId = this.$route.params.schoolfellowInfoId
      // this.dataForm.schoolfellowInfoId = schoolfellowInfoId
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveSchoolfellowTag(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateSchoolfellowTag(data).then(res => {
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
