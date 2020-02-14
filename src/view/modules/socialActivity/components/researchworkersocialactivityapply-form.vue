<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="申请小组" prop="applyGroups">
             <Select v-model="dataForm.applyGroups" clearable>
              <Option v-for="item in tagList" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <!-- <Input type="text" v-model="dataForm.applyGroup" :maxlength="100" placeholder="请输入申请小组" /> -->
          </FormItem>
          <FormItem label="审核结果" prop="confirmResult">
            <Select v-model="dataForm.confirmResult" clearable>
              <Option v-for="item in confirmResultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerSocialactivityApply">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/socialActivity/researchworkersocialactivityapply'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'ResearchworkerSocialactivityApply-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      projectList: [],
      confirmResultList: [{value: 1, label: '通过'}, {value: 2, label: '未通过'}],
      tagList: [],
      dataForm: {
        confirmResult: '',
        applyGroups: '',
        id: ''
      },
      dataFormValidate: {
        activityId: [
          { type: 'number', required: true, message: '活动不能为空', trigger: 'blur' }
        ],
        applyDate: [
          { required: true, message: '报名时间不能为空', trigger: 'blur' }
        ],
        // confirmDate: [
        //   { required: true, message: '审核时间不能为空', trigger: 'blur' }
        // ],
        // commentDate: [
        //   { required: true, message: '评论时间不能为空', trigger: 'blur' }
        // ],
        // confirmResult: [
        //   { type: 'number', required: true, message: '审核结果不能为空', trigger: 'blur' }
        // ],
        // stuName: [
        //   { required: true, message: '学生姓名不能为空', trigger: 'blur' }
        // ],
        // stuCode: [
        //   { required: true, message: '学生学号不能为空', trigger: 'blur' }
        // ],
        // applyGroup: [
        //   { type: 'array', required: true, message: '申请小组不能为空', trigger: 'blur' }
        // ],
        // activityDesc: [
        //   { required: true, message: '活动评论不能为空', trigger: 'blur' }
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
    addResearchworkerSocialactivityApply () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerSocialactivityApply (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      this.submitLoading = true
      let time = new Date()
      let year = time.getFullYear()
      let month = time.getMonth()
      let day = time.getDate()

      // 获取时分秒
      let h = time.getHours()
      let m = time.getMinutes()
      let s = time.getSeconds()

      // 检查是否小于10
      // h = check(h)
      // m = check(m)
      // s = check(s)
      let commentTime = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
      // 新增保存
      this.dataForm.confirmDate = commentTime
      api.getResearchworkerSocialactivityApplyInfo(id).then(res => {
        let entity = res.researchworkerSocialactivityApply
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerSocialactivityApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (data.id) {
            api.saveResearchworkerSocialactivityApply(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerSocialactivityApply(data).then(res => {
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
