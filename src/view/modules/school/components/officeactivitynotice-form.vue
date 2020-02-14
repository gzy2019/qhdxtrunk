<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate" label-position="right">
                <FormItem label="活动名称" prop="activityTitle" >
                    <Input type="text" v-model="dataForm.activityTitle" :maxlength="200" placeholder="请输入通知名称" />
                </FormItem>
                <FormItem label="创建人" prop="contactsId" >
                    <TeacherSelect v-model="dataForm.contactsId" dtype="position-title" :clearable="true"></TeacherSelect>
                </FormItem>
                <FormItem label="活动日期" prop="batchDate">
                    <IDatePicker type="daterange" split-panels clearable v-model="dataForm.batchDate" format="yyyy-MM-dd" placeholder="请输入活动日期" />
                </FormItem>
                <FormItem label="报名范围" prop="applyType">
                  <Select v-model="dataForm.applyType"  clearable>
                      <Option v-for="item in applyTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="活动状态" prop="activityStatus">
                  <Select v-model="dataForm.activityStatus"  clearable>
                    <Option v-for="item in activityTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="活动分类" prop="typeId">
                    <Select v-model="dataForm.typeId" clearable>
                      <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="活动说明" prop="activityContent">
                    <Input type="textarea" v-model="dataForm.activityContent" :autosize="{minRows: 4,maxRows: 6}" :maxlength="2000" placeholder="请输入活动说明" />
                </FormItem>
                <FormItem label="是否需要报名" prop="applyFlag">
                    <i-switch v-model="dataForm.applyFlag" @click="save">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <div v-if="dataForm.applyFlag">
                  <FormItem label="报名日期" prop="applyDate">
                      <IDatePicker type="daterange" split-panels clearable v-model="dataForm.applyDate" format="yyyy-MM-dd" placeholder="请输入报名日期" />
                  </FormItem>
                  <FormItem label="报名限额" prop="applyAmount">
                      <Input type="text" v-model="dataForm.applyAmount" :maxlength="200" placeholder="请输入报名限额" />
                  </FormItem>
                </div>
                <FormItem label="是否群发邮件" prop="emailFlag">
                    <i-switch v-model="dataForm.emailFlag">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveOfficeActivityNotice">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->
    </div>
</template>
<script>
import apiProject from '@/api/activity/officeactivitytype'
import TeacherSelect from '@/view/components/teacher-select'
import api from '@/api/activity/officeactivitynotice'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'OfficeActivityNotice-form',
  components: {
    IDatePicker, TeacherSelect, apiProject
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
      projectList: [],
      editable: true,
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      activityTimeList: [{ value: 0, label: '已开始' }, { value: 1, label: '已结束' }],
      applyTypeList: [{ value: 0, label: '学生' }, { value: 1, label: '教师' }, { value: 2, label: '学生&教师' }],
      dataForm: {
        activityTitle: '',
        activityContent: '',
        typeId: undefined,
        contactsId: '',
        batchDate: [],
        applyFlag: true,
        applyDate: [],
        applyAmount: '',
        emailFlag: false,
        applyType: '',
        activityStatus: '',
        id: undefined
      },
      dataFormValidate: {
        activityTitle: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        activityContent: [
          { required: true, message: '活动说明不能为空', trigger: 'blur' }
        ],
        typeId: [
          { type: 'number', required: true, message: '活动分类不能为空', trigger: 'blur' }
        ],
        // batchId: [
        //   { type: 'number', required: true, message: '活动类型不能为空', trigger: 'blur' }
        // ],
        batchDate: [
          { type: 'array', len: 2, required: true, message: '活动时间不能为空', trigger: 'blur' }],
        contactsId: [
          { type: 'number', required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        // applyAmount: [
        //   { required: true, message: '报名限额不能为空', trigger: 'blur' }
        // ],
        // applyFlag: [
        //   { type: 'number', required: true, message: '是否需要报名不能为空', trigger: 'blur' }
        // ],
        applyType: [
          { type: 'number', required: true, message: '报名范围不能为空', trigger: 'blur' }
        ],
        applyDate: [
          { type: 'array', len: 2, required: true, message: '活动报名时间不能为空', trigger: 'blur' }
        ],
        activityStatus: [
          { type: 'number', required: true, message: '活动状态不能为空', trigger: 'blur' }
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
    save () {
      this.dataForm.applyFlag = !this.dataForm.applyFlag
      // if (this.dataForm.applyFlag === 0) {
      // delete this.dataForm.applyDate
      // this.dataForm.applyAmount = 0
      // }
    },
    init () {
      apiProject.getOfficeActivityTypeList({ limit: 100 }).then(res => {
        this.projectList = res.page.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addOfficeActivityNotice () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      delete this.dataForm.startDate
      delete this.dataForm.endDate
      delete this.dataForm.applyStartDate
      delete this.dataForm.applyEndDate
      this.formModalVisible = true
    },
    editOfficeActivityNotice (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeActivityNoticeInfo(id).then(res => {
        let entity = res.officeActivityNotice
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
          // console.log(this.dataForm)
        })
        this.dataForm.batchDate = []
        this.dataForm.batchDate.push(entity.startDate)
        this.dataForm.batchDate.push(entity.endDate)
        this.dataForm.applyDate = []
        this.dataForm.applyDate.push(entity.applyStartDate)
        this.dataForm.applyDate.push(entity.applyEndDate)
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveOfficeActivityNotice () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.startDate = this.dataForm.batchDate[0]
          this.dataForm.endDate = this.dataForm.batchDate[1]
          this.dataForm.applyStartDate = this.dataForm.applyDate[0]
          this.dataForm.applyEndDate = this.dataForm.applyDate[1]
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveOfficeActivityNotice(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateOfficeActivityNotice(data).then(res => {
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
