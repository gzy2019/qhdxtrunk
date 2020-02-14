<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable="false" :width="500" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="loading"></Spin>
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <Form-item label="导师姓名" prop="teacherId">
          <TeacherSelect :disabled="modalView" ref="teacherSelect" v-model="dataForm.teacherId" :clearable="!modalView" @on-change="teacherHandle"></TeacherSelect>
        </Form-item>
        <Form-item label="研究方向" prop="applyDirection">
          <DicSelect :disabled="modalView" v-model="dataForm.applyDirection" dtype="doctor-post-direction" :clearable="!modalView" ></DicSelect>
        </Form-item>
        <Form-item label="联合导师" prop="teacher2Id">
          <TeacherSelect :disabled="modalView" ref="teacherSelect2" v-model="dataForm.teacher2Id" :clearable="!modalView" @on-change="teacher2Handle"></TeacherSelect>
        </Form-item>
        <FormItem label="是否启用标记" prop="openFlag">
          <i-switch :disabled="modalView" v-model="dataForm.openFlag">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveDoctorPostTeacher">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import api from '@/api/doctorpost/doctorpostteacher'
import DicSelect from '@/view/components/dic-select'
import TeacherSelect from '@/view/components/teacher-select'
export default {
  name: 'DoctorPostTeacher-form',
  components: { DicSelect, TeacherSelect },
  data () {
    return {
      formModalVisible: false,
      modalView: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        applyDirection: '',
        teacherName: '',
        teacherId: '',
        teacher2Name: '',
        teacher2Id: '',
        openFlag: true,
        id: undefined
      },
      dataFormValidate: {
        applyDirection: [
          { required: true, message: '研究方向不能为空', trigger: 'blur' }
        ],
        teacherId: [
          {
            type: 'number',
            required: true,
            message: '教师姓名不能为空',
            trigger: 'blur'
          }
        ],
        teacher2Id: [
          {
            type: 'number',
            required: true,
            message: '联合教师不能为空',
            trigger: 'blur'
          }
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
    addDoctorPostTeacher () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewDoctorPostTeacher (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getDoctorPostTeacherInfo(id).then(res => {
        let entity = res.doctorPostTeacher
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
    teacher2Handle (id) {
      this.dataForm.teacher2Name = this.$refs.teacherSelect2.getTeacherName(id)
    },
    teacherHandle (id) {
      this.dataForm.teacherName = this.$refs.teacherSelect.getTeacherName(id)
    },
    editDoctorPostTeacher (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getDoctorPostTeacherInfo(id).then(res => {
        let entity = res.doctorPostTeacher
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
    saveDoctorPostTeacher () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveDoctorPostTeacher(this.dataForm).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateDoctorPostTeacher(this.dataForm).then(res => {
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
