<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
          <FormItem label="申请教师" prop="teacherId">
              <TeacherSelect v-model="dataForm.teacherId" :clearable="true" ></TeacherSelect>
          </FormItem>
          <FormItem label="申请年度" prop="applyYear">
            <IDatePicker type="year" v-model="dataForm.applyYear" format="yyyy" placeholder="请输入申请年度" />
          </FormItem>
          <FormItem label="会议名称" prop="meetingTopic">
            <Input type="text" v-model="dataForm.meetingTopic" :maxlength="50" placeholder="请输入会议名称" />
          </FormItem>
          <FormItem label="会议地点" prop="meetingPlace">
            <Input type="text" v-model="dataForm.meetingPlace" :maxlength="50" placeholder="请输入会议地点" />
          </FormItem>
          <FormItem label="参与方式" prop="attentdType">
             <Select v-model="dataForm.attentdType" placeholder="请选择">
                <Option :value="0">方式一</Option>
                <Option :value="1">方式二</Option>
                <Option :value="2">方式三</Option>
              </Select>
          </FormItem>
          <FormItem label="海外停留时间" prop="overseasDate">
            <IDatePicker type="daterange" v-model="dataForm.overseasDate" split-panels format="yyyy-MM-dd" placeholder="请输入海外停留时间" />
          </FormItem>
          <FormItem label="申请经费" prop="applyFee">
            <InputNumber v-model="dataForm.applyFee" :max="20000.00" :precision="2" placeholder="请输入申请经费"/>
          </FormItem>
          <FormItem label="申请日期" prop="applyDate">
            <IDatePicker type="date" v-model="dataForm.applyDate" format="yyyy-MM-dd" placeholder="请输入申请日期" />
          </FormItem>
          <FormItem label="申请备注" prop="applyMemo">
            <Input type="textarea" v-model="dataForm.applyMemo" :maxlength="300" placeholder="请输入申请备注" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveAchievementSubsidize">保存</Button>
            <Button type="primary" :loading="submitLoading" @click="saveAchievementSubsidize">保存并提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/achievement/achievementsubsidize'
import IDatePicker from '@/view/components/idate-picker'
import TeacherSelect from '@/view/components/teacher-select'
export default {
  name: 'AchievementSubsidize-form',
  components: {
    IDatePicker, TeacherSelect
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        teacherId: '',
        meetingTopic: '',
        meetingPlace: '',
        attentdType: '',
        overseasDate: [],
        overseasStartDate: '',
        overseasEndDate: '',
        applyFee: '',
        applyYear: '',
        applyDate: '',
        applyMemo: '',
        id: null
      },
      dataFormValidate: {
        teacherId: [
          { type: 'number', required: true, message: '申请教师ID不能为空', trigger: 'blur' }
        ],
        meetingTopic: [
          { required: true, message: '会议名称不能为空', trigger: 'blur' }
        ],
        meetingPlace: [
          { required: true, message: '会议地点不能为空', trigger: 'blur' }
        ],
        applyFee: [
          { type: 'number', required: true, message: '申请经费不能为空', trigger: 'blur' }
        ],
        applyYear: [
          { required: true, message: '申请年度不能为空', trigger: 'blur' }
        ],
        applyDate: [
          { required: true, message: '申请日期不能为空', trigger: 'blur' }
        ],
        overseasDate: [
          { type: 'array', len: 2, required: true, message: '海外停留时间不能为空', trigger: 'blur' }
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
    addAchievementSubsidize () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editAchievementSubsidize (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getAchievementSubsidizeInfo(id).then(res => {
        let entity = res.achievementSubsidize
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
          this.dataForm.overseasDate = []
          this.dataForm.overseasDate.push(this.dataForm.overseasStartDate)
          this.dataForm.overseasDate.push(this.dataForm.overseasEndDate)
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveAchievementSubsidize () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          data.overseasStartDate = data.overseasDate[0]
          data.overseasEndDate = data.overseasDate[1]
          data.teacherName = '123'
          data.applyStatus = 0
          data.replyStatus = 0
          data.confirmStatus = 0
          delete data.overseasDate
          if (!data.id) {
            api.saveAchievementSubsidize(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateAchievementSubsidize(data).then(res => {
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
