<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="课程名称" prop="courseName">
            <Input type="text" v-model="dataForm.courseName" :maxlength="100" placeholder="请输入课程名称" />
          </FormItem>
          <FormItem label="语种" prop="lang">
            <Select v-model="dataForm.lang" placeholder="请输入选择">
              <Option value="cn">中文</Option>
              <Option value="en">英文</Option>
              <Option value="etc">其它</Option>
              <Option value="none">无</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseCourse">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/cases/casecourse'
export default {
  name: 'CaseCourse-form',
  data () {
    const validateCourseName = (rule, value, callback) => {
      if (!this.dataForm.courseName) {
        callback(new Error('课程名称不能为空}'))
      } else {
        api.validateCourseName(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('课程名称已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        courseName: '',
        lang: '',
        id: null
      },
      dataFormValidate: {
        courseName: [
          { validator: validateCourseName, trigger: 'blur' }
        ],
        lang: [
          { required: true, message: '语种不能为空', trigger: 'blur' }
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
    addCaseCourse () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editCaseCourse (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getCaseCourseInfo(id).then(res => {
        let entity = res.caseCourse
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveCaseCourse () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveCaseCourse(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseCourse(data).then(res => {
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
