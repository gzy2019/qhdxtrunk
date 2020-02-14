<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="130" :rules="dataFormValidate" label-position="right">
                <FormItem label="报名人ID" prop="userId">
                    <i-Input v-model="dataForm.userId" clearable>
                      <Select v-model="dataForm.userType" slot="prepend" style="width: 80px">
                          <Option :value="0">学生</Option>
                          <Option :value="1">教师</Option>
                      </Select>
                    </i-Input>
                </FormItem>
                <FormItem label="活动名称" prop="activityId">
                  <Select v-model="dataForm.activityId" clearable>
                    <Option v-for="item in activityList" :value="item.id" :key="item.id">{{ item.activityTitle }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="报名留言" prop="applyMsg"  >
                    <Input type="textarea" v-model="dataForm.applyMsg" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入报名留言" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveOfficeActivityApply">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->
    </div>
</template>

<script>
import apiProject from '@/api/activity/officeactivitynotice'
// import TeacherSelect from '@/view/components/teacher-select'
import api from '@/api/activity/officeactivityapply'
export default {
  name: 'OfficeActivityApply-form',
  components: {
    apiProject
  },
  data () {
    // const validateDicType = (rule, value, callback) => {
    //   if (!this.dataForm.dicValue) {
    //     callback(new Error('编码不能为空'))
    //   } else {
    //     api.validateDicValue(this.dataForm).then(res => {
    //       if (!res.result) {
    //         callback(new Error('编码已经存在'))
    //       } else {
    //         callback()
    //       }
    //     })
    //   }
    // }
    return {
      // initList: [],
      activityList: [],
      userTypeList: [{ value: 0, label: '学生' }, { value: 1, label: '教师' }, { value: 2, label: '学生&教师' }],
      applyAuditStatusList: [{ value: 0, label: '开始' }, { value: 1, label: '结束' }],
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        // teacherId: this.$store.state.user.teacherId,
        userId: undefined,
        userType: 1,
        // userId: '',
        activityId: undefined,
        applyMsg: '',
        id: undefined
      },
      dataFormValidate: {
        userId: [
          { type: 'string', required: true, message: '报名人不能为空', trigger: 'blur' }
        ],
        // userCode: [
        //   { required: true, message: '证件号不能为空', trigger: 'blur' }
        // ],
        activityId: [
          { type: 'number', required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        applyAuditStatus: [
          { type: 'number', required: true, message: '报名状态不能为空', trigger: 'blur' }
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
    // this.getLocalInfo()
  },
  methods: {
    // getLocalInfo () {
    //   const bodyListS = localStorage.getItem('body')
    //   const bodyList = JSON.parse(bodyListS)
    //   this.initList = bodyList
    //   console.log('object :', bodyList)
    // },
    init () {
      apiProject.getOfficeActivityNoticeList({ limit: 1000 }).then(res => {
        this.activityList = res.page.list
        if (this.$route.params.activityId) {
          this.activityId = this.$route.params.activityId
        } else if (this.activityList.length > 0) {
          this.activityId = this.activityList[0].id
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addOfficeActivityApply () {
      this.modalTitle = '报名'
      this.dataForm.activityId = this.dataForm.activityId
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editOfficeActivityApply (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeActivityApplyInfo(id).then(res => {
        let entity = res.officeActivityApply
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveOfficeActivityApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveOfficeActivityApply(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateOfficeActivityApply(data).then(res => {
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
