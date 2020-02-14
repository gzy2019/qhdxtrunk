<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="活动" prop="activityId">
            <Select v-model="dataForm.activityId" clearable>
              <Option v-for="item in tagList" :value="item.id" :key="item.id">{{ item.activityName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="100" placeholder="请输入学生姓名" />
          </FormItem>
          <FormItem label="学生ID" prop="stuId">
            <Input type="text" v-model="dataForm.stuId" :maxlength="100" placeholder="请输入学生学号" />
          </FormItem>
          <!-- <FormItem label="请假内容" prop="leaveInfo">
            <Input type="text" v-model="dataForm.leaveInfo" :maxlength="300" placeholder="请输入请假内容" />
          </FormItem>
          <FormItem label="请假时间" prop="leaveDate">
            <IDatePicker type="date" v-model="dataForm.leaveDate" format="yyyy-MM-dd" placeholder="请输入请假时间" />
          </FormItem>
          <FormItem label="请假的天数" prop="leaveDay">
          </FormItem>-->
          <!-- <FormItem label="旷签的天数" prop="absentDay">
            1
          </FormItem> -->
          <!-- <FormItem label="旷签时间" prop="absentDate">
            <IDatePicker type="date" v-model="dataForm.absentDate" format="yyyy-MM-dd" placeholder="请输入旷签时间" />
          </FormItem> -->

          <FormItem label="备注" prop="infoDesc">
            <Input type="textarea" v-model="dataForm.infoDesc" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入备注" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerLeave">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api1 from '@/api/pukactivity/researchworkeractivity'
import api from '@/api/pukactivity/researchworkerleave'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'ResearchworkerLeave-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      confirmResultList: [{value: 1, label: '通过'}, {value: 2, label: '拒绝'}],
      modalTitle: '',
      tagList: [],
      dataForm: {
        activityId: '',
        stuName: '',
        stuId: '',
        absentDay: '',
        absentDate: '',
        infoDesc: '',
        id: null
      },
      dataFormValidate: {
        // activityId: [
        //   { type: 'string', required: true, message: '活动不能为空', trigger: 'blur' }
        // ],
        stuName: [
          { required: true, message: '学生姓名不能为空', trigger: 'blur' }
        ],
        stuId: [
          { required: true, message: '学生学号不能为空', trigger: 'blur' }
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
      api1.getResearchworkerActivityList().then(res => {
        console.log(res, 'wqwww')
        this.tagList = res.page.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addResearchworkerLeave () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerLeave (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerLeaveInfo(id).then(res => {
        let entity = res.researchworkerLeave
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerLeave () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let time = new Date()
          let year = time.getFullYear()
          let month = time.getMonth()
          let day = time.getDate()
          let commentTime = year + '-' + month + '-' + day
          this.dataForm.absentDate = commentTime
          this.dataForm.absentDay = 1
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveResearchworkerLeave(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerLeave(data).then(res => {
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
