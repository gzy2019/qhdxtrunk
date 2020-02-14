<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="loading"></Spin>
      <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
        <FormItem label="申报标题" prop="batchTitle">
          <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.batchTitle" :maxlength="100" placeholder="请输入申报标题" />
        </FormItem>
        <FormItem label="学生开始时间" prop="studentStartTime">
          <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.studentStartTime" format="yyyy-MM-dd" placeholder="请输入学生开始时间" />
        </FormItem>
        <FormItem label="学生结束时间" prop="studentEndTime">
          <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.studentEndTime" format="yyyy-MM-dd" placeholder="请输入学生结束时间" />
        </FormItem>
        <FormItem label="老师开始时间" prop="teacherStartTime">
          <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.teacherStartTime" format="yyyy-MM-dd" placeholder="请输入老师开始时间" />
        </FormItem>
        <FormItem label="老师结束时间" prop="teacherEndTime">
          <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.teacherEndTime" format="yyyy-MM-dd" placeholder="请输入老师结束时间" />
        </FormItem>
        <FormItem label="是否开放" prop="batchOpenFlag">
          <i-switch :disabled="modalView" v-model="dataForm.batchOpenFlag">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveEstimateBatch">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/declare-estimate/estimatebatch'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'EstimateBatch-form',
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
        createUserId: '',
        batchTitle: '',
        studentStartTime: '',
        studentEndTime: '',
        teacherStartTime: '',
        teacherEndTime: '',
        batchOpenFlag: '',
        id: undefined
      },
      dataFormValidate: {
        batchTitle: [
          { required: true, message: '申报标题不能为空', trigger: 'blur' }
        ],
        studentStartTime: [
          { required: true, message: '学生开始时间不能为空', trigger: 'blur' }
        ],
        studentEndTime: [
          { required: true, message: '学生结束时间不能为空', trigger: 'blur' }
        ],
        teacherStartTime: [
          { required: true, message: '老师开始时间不能为空', trigger: 'blur' }
        ],
        teacherEndTime: [
          { required: true, message: '老师结束时间不能为空', trigger: 'blur' }
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
    addEstimateBatch () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewEstimateBatch (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getEstimateBatchInfo(id).then(res => {
        let entity = res.estimateBatch
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editEstimateBatch (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getEstimateBatchInfo(id).then(res => {
        let entity = res.estimateBatch
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
      this.formModalVisible = true
      this.modalView = false
    },
    saveEstimateBatch () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveEstimateBatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).catch(e => {
              this.submitLoading = false
              this.$emit('update')
            })
          } else {
            api.updateEstimateBatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).catch(e => {
              this.$emit('update')
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
