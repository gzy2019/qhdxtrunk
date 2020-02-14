<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="活动名称" prop="activityName">
            <Input type="text" v-model="dataForm.activityName" :maxlength="100" placeholder="请输入活动名称" />
          </FormItem>
          <FormItem label="活动时间" prop="startDate">
            <IDatePicker type="daterange" v-model="dataForm.startDate" format="yyyy-MM-dd" placeholder="请输入活动时间" />
          </FormItem>
          <FormItem label="活动天数" prop="countTime">
            <Input type="text" v-model="dataForm.countTime" :maxlength="100" placeholder="请输入活动天数" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerActivity">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/pukactivity/researchworkeractivity'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'ResearchworkerActivity-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        activityName: '',
        countTime: '',
        startDate: [],
        id: null
      },
      dataFormValidate: {
        activityName: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        countTime: [
          { required: true, message: '活动天数不能为空', trigger: 'blur' }
        ],
        startDate: [
          { type: 'array', required: true, message: '活动时间不能为空', trigger: 'blur' }
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
    addResearchworkerActivity () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerActivity (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerActivityInfo(id).then(res => {
        let entity = res.researchworkerActivity
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.dataForm.startDate = []
        this.dataForm.startDate.push(entity.startTime)
        this.dataForm.startDate.push(entity.endTime)
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerActivity () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.startTime = this.dataForm.startDate[0]
          this.dataForm.endTime = this.dataForm.startDate[1]
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveResearchworkerActivity(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerActivity(data).then(res => {
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
