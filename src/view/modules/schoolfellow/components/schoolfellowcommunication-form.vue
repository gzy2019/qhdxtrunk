<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="沟通时间" prop="communicateDate">
            <IDatePicker type="date" v-model="dataForm.communicateDate" format="yyyy-MM-dd" placeholder="请输入沟通时间" />
          </FormItem>
          <!-- <FormItem label="学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="50" placeholder="请输入学号" />
          </FormItem>
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem> -->
          <FormItem label="备注信息" prop="infoDesc">
            <Input type="textarea" v-model="dataForm.infoDesc" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入备注信息" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSchoolfellowCommunication">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowcommunication'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'SchoolfellowCommunication-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        // stuCode: '',
        // stuName: '',
        infoDesc: '',
        id: null
      },
      dataFormValidate: {
        // updateUserName: [
        //   { required: true, message: '更新人姓名不能为空', trigger: 'blur' }
        // ],
        // stuCode: [
        //   { required: true, message: '学号不能为空', trigger: 'blur' }
        // ],
        // stuName: [
        //   { required: true, message: '学生姓名不能为空', trigger: 'blur' }
        // ],
        infoDesc: [
          { required: true, message: '备注信息不能为空', trigger: 'blur' }
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
    addSchoolfellowCommunication () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editSchoolfellowCommunication (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowCommunicationInfo(id).then(res => {
        let entity = res.schoolfellowCommunication
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveSchoolfellowCommunication () {
      // let stuCode = this.$route.params.stuCode
      // this.dataForm.stuCode = stuCode
      // let stuName = this.$route.params.stuName
      // this.dataForm.stuName = stuName
      let schoolfellowInfoId = this.$route.params.schoolfellowInfoId
      this.dataForm.schoolfellowInfoId = schoolfellowInfoId
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveSchoolfellowCommunication(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateSchoolfellowCommunication(data).then(res => {
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
