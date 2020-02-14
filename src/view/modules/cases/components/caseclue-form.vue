<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="适用课程" prop="courseName" v-show="model === 'clue'">
            <Input type="text" v-model="dataForm.courseName" :maxlength="200" placeholder="请输入适用课程" />
          </FormItem>
          <FormItem label="线索" prop="clueInfo" v-show="model === 'clue'">
            <Input type="textarea" v-model="dataForm.clueInfo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入线索" />
          </FormItem>
          <FormItem label="线索回复" prop="comment" v-show="model === 'clueComment'">
            <Input type="textarea" v-model="dataForm.comment" :autosize="{minRows: 4,maxRows: 6}" :maxlength="250" placeholder="请输入线索" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseClue">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/cases/caseclue'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'CaseClue-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      model: 'clue',
      dataForm: {
        courseName: '',
        clueInfo: '',
        comment: '',
        id: null
      },
      dataFormValidate: {
        courseName: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ],
        clueInfo: [
          { required: true, message: '线索不能为空', trigger: 'blur' }
        ],
        comment: [
          { required: false, message: '线索回复不能为空', trigger: 'blur' }
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
    addCaseClue () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.courseName = ''
      this.dataForm.clueInfo = ''
      this.dataForm.id = undefined
      this.formModalVisible = true
      this.dataFormValidate.comment.required = false
      this.model = 'clue'
    },
    editCaseClue (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.dataFormValidate.comment.required = false
      this.loading = true
      this.model = 'clue'
      api.getCaseClueInfo(id).then(res => {
        let entity = res.caseClue
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    commentCaseClue (id) {
      this.modalTitle = '回复'
      this.$refs.dataForm.resetFields()
      this.dataFormValidate.comment.true = false
      this.loading = true
      this.model = 'clueComment'
      api.getCaseClueInfo(id).then(res => {
        let entity = res.caseClue
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveCaseClue () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveCaseClue(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else if (this.model === 'clueComment') {
            api.saveCaseClueComment(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseClue(data).then(res => {
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
