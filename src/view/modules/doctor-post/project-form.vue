<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal
      :title="modalTitle"
      v-model="formModalVisible"
      :mask-closable="false"
      :width="600"
      class-name="vertical-center-modal"
    >
      <Spin size="large" fix v-if="loading"></Spin>
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="批次名称" prop="projectName">
          <Input
            type="text"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.projectName"
            :maxlength="100"
            placeholder="请输入批次名称"
          />
        </FormItem>
        <FormItem label="开始日期" prop="projectStartTime">
          <IDatePicker
            type="date"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.projectStartTime"
            format="yyyy-MM-dd"
            placeholder="请输入开始日期"
          />
        </FormItem>
        <FormItem label="结束日期" prop="projectEndTime">
          <IDatePicker
            type="date"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.projectEndTime"
            format="yyyy-MM-dd"
            placeholder="请输入结束日期"
          />
        </FormItem>
        <FormItem label="备注" prop="projectMemo">
          <Input
            type="textarea"
            :readonly="modalView"
            :clearable="!modalView"
            v-model="dataForm.projectMemo"
            :autosize="{minRows: 4,maxRows: 6}"
            :maxlength="500"
            placeholder="请输入备注"
          />
        </FormItem>
        <FormItem label="申报开关" prop="projectOpenFlag">
          <i-switch :disabled="modalView" v-model="dataForm.projectOpenFlag">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveDoctorPostProject">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import api from '@/api/doctorpost/doctorpostproject'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'DoctorPostProject-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      modalView: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        projectName: '',
        projectStartTime: '',
        projectEndTime: '',
        projectOpenFlag: true,
        projectMemo: '',
        id: undefined
      },
      dataFormValidate: {
        projectName: [
          { required: true, message: '批次名称不能为空', trigger: 'blur' }
        ],
        projectStartTime: [
          { required: true, message: '开始日期不能为空', trigger: 'blur' }
        ],
        projectEndTime: [
          { required: true, message: '结束日期不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {},
    cancel () {
      this.formModalVisible = false
    },
    addDoctorPostProject () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewDoctorPostProject (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api
        .getDoctorPostProjectInfo(id)
        .then(res => {
          let entity = res.doctorPostProject
          Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = entity[key]
          })
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
      this.formModalVisible = true
      this.modalView = true
    },
    editDoctorPostProject (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api
        .getDoctorPostProjectInfo(id)
        .then(res => {
          let entity = res.doctorPostProject
          Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = entity[key]
          })
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
      this.formModalVisible = true
      this.modalView = false
    },
    saveDoctorPostProject () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api
              .saveDoctorPostProject(this.dataForm)
              .then(res => {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.$emit('update')
              })
              .finally(() => {
                this.submitLoading = false
              })
          } else {
            api
              .updateDoctorPostProject(this.dataForm)
              .then(res => {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.$emit('update')
              })
              .finally(() => {
                this.submitLoading = false
              })
          }
        }
      })
    }
  }
}
</script>
