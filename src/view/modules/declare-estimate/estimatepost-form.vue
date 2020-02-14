<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="loading"></Spin>
      <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
        <Form-item label="批次名称" prop="batchId" class="margin10">
          <Select v-model="dataForm.batchId" :disabled="modalView" :clearable="!modalView">
            <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <FormItem label="岗位/课程名称" prop="courseName">
          <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.courseName" :maxlength="200" placeholder="请输入岗位/课程名称" />
        </FormItem>
        <FormItem label="岗位类别" prop="postCategory" v-if="false">
          <DicSelect v-model="dataForm.postCategory" dtype="declare-estimate-category" :clearable="true" placeholder="请选择岗位类别" />
        </FormItem>
        <FormItem label="学生" prop="studentId">
          <StudentSelect ref="studentSelect" :disabled="modalView" :clearable="!modalView" v-model="dataForm.studentId" filterable placeholder="请选择学生" />
        </FormItem>
        <FormItem label="学生电话" prop="studentPhone">
          <Input type="text" :readonly="true" v-model="dataForm.studentPhone" :maxlength="200" placeholder="请选择学生" />
        </FormItem>
        <FormItem label="学生邮箱" prop="studentEmail">
          <Input type="text" :readonly="true" v-model="dataForm.studentEmail" :maxlength="200" placeholder="请选择学生" />
        </FormItem>
        <FormItem label="学号" prop="studentCode">
          <Input type="text" :readonly="true" v-model="dataForm.studentCode" :maxlength="200" placeholder="请选择学生" />
        </FormItem>
        <FormItem label="老师" prop="teacherId">
          <TeacherSelect ref="teacherSelect" :disabled="modalView" :clearable="!modalView" v-model="dataForm.teacherId" filterable placeholder="请选择老师" />
        </FormItem>
        <FormItem label="老师姓名" prop="teacherName" v-if="false">
          <Input type="text" :readonly="true" v-model="dataForm.teacherName" :maxlength="200" placeholder="请输入老师姓名" />
        </FormItem>
        <FormItem label="岗位备注" prop="memo">
          <Input type="textarea" :rows="4" :readonly="modalView" :clearable="!modalView" v-model="dataForm.memo" :maxlength="500" placeholder="请输入岗位备注" />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveEstimatePost">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/declare-estimate/estimatepost'
import DicSelect from '@/view/components/dic-select'
import StudentSelect from '@/view/components/student-select'
import TeacherSelect from '@/view/components/teacher-select'
export default {
  name: 'EstimatePost-form',
  components: {
    DicSelect, StudentSelect, TeacherSelect
  },
  data () {
    return {
      formModalVisible: false,
      modalView: false,
      loading: false,
      modalTitle: '',
      batchList: [],
      dataForm: {
        batchId: '',
        courseName: '',
        postCategory: '',
        studentId: '',
        studentName: '',
        studentPhone: '',
        studentEmail: '',
        studentCode: '',
        teacherId: '',
        teacherName: '',
        memo: '',
        id: undefined
      },
      dataFormValidate: {
        batchId: [
          { type: 'number', required: true, message: '批次不能为空', trigger: 'blur' }
        ],
        courseName: [
          { required: true, message: '岗位/课程名称不能为空', trigger: 'blur' }
        ],
        studentId: [
          { type: 'number', required: true, message: '学生不能为空', trigger: 'blur' }
        ],
        teacherId: [
          { type: 'number', required: true, message: '老师不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    'dataForm.studentId': {
      handler () {
        let item = this.$refs.studentSelect.getRecord(this.dataForm.studentId) || {}
        this.dataForm.studentName = item.stuName
        this.dataForm.studentCode = item.stuCode
        this.dataForm.studentPhone = item.mobile
        this.dataForm.studentEmail = item.email
      }
    },
    'dataForm.teacherId': {
      handler () {
        let item = this.$refs.teacherSelect.getRecord(this.dataForm.teacherId) || {}
        this.dataForm.teacherName = item.teaName
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadEstimateBatchList()
    },
    loadEstimateBatchList () {
      api.getEstimateBatchList().then(res => {
        this.batchList = res.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addEstimatePost (batchId) {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      if (batchId) this.dataForm.batchId = batchId
      this.formModalVisible = true
    },
    viewEstimatePost (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getEstimatePostInfo(id).then(res => {
        let entity = res.estimatePost
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
    editEstimatePost (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getEstimatePostInfo(id).then(res => {
        let entity = res.estimatePost
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
    saveEstimatePost () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveEstimatePost(
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
            api.updateEstimatePost(
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
