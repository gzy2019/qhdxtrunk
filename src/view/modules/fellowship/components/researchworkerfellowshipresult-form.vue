<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem>
          <FormItem label="学生学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="50" placeholder="请输入学生学号" />
          </FormItem>
          <FormItem label="奖学金的结果" prop="fellowshipResult">
            <Input type="text" v-model="dataForm.fellowshipResult" :maxlength="100" placeholder="请输入奖学金的结果" />
          </FormItem>
          <!-- <FormItem label="申请的奖学金id" prop="fellowshipInfoId"> -->
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerFellowshipResult">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/fellowship/researchworkerfellowshipresult'
export default {
  name: 'ResearchworkerFellowshipResult-form',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        stuName: '',
        stuCode: '',
        fellowshipResult: '',
        // fellowshipInfoId: '',
        id: null
      },
      dataFormValidate: {
        stuName: [
          { required: true, message: '学生姓名不能为空', trigger: 'blur' }
        ],
        stuCode: [
          { required: true, message: '学生学号不能为空', trigger: 'blur' }
        ],
        fellowshipResult: [
          { required: true, message: '奖学金的结果不能为空', trigger: 'blur' }
        ],
        // fellowshipInfoId: [
        //   { required: true, message: '申请的奖学金id不能为空', trigger: 'blur' }
        // ],
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
    addResearchworkerFellowshipResult () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerFellowshipResult (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerFellowshipResultInfo(id).then(res => {
        let entity = res.researchworkerFellowshipResult
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerFellowshipResult () {
      let fellowshipInfoId = this.$route.params.fellowshipInfoId
      this.dataForm.fellowshipInfoId = fellowshipInfoId
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveResearchworkerFellowshipResult(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerFellowshipResult(data).then(res => {
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
