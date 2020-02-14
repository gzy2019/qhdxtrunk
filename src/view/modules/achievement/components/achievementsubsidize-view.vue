<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="申请教师姓名:">{{dataForm.teacherName}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="会议名称:">{{dataForm.meetingTopic}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="会议地点:">{{dataForm.meetingPlace}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="参与方式:">{{dataForm.attentdType}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="海外停留开始时间:">{{dataForm.overseasStartDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="海外停留结束时间:">{{dataForm.overseasEndDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="申请经费:">{{dataForm.applyFee}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="申请年度:">{{dataForm.applyYear}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="申请日期:">{{dataForm.applyDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="申请状态：">{{dataForm.applyStatus}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="申请备注:">{{dataForm.applyMemo}}</FormItem>
            </Col>
            <Divider orientation="left">领导批示状态</Divider>
            <Col span="8">
              <FormItem label="批示状态：">{{dataForm.replyStatus}}</FormItem>
            </Col>
            <Col span="8">
              <FormItem label="批示经费:">{{dataForm.replyFee}}</FormItem>
            </Col>
            <Col span="8">
              <FormItem label="下拨经费:">{{dataForm.allocatedFee}}</FormItem>
            </Col>
            <Col span="24">
              <FormItem label="批示备注:">{{dataForm.replyMemo}}</FormItem>
            </Col>
            <Divider orientation="left">确认状态</Divider>
            <Col span="24">
              <FormItem label="资料确认状态：">{{dataForm.confirmStatus}}</FormItem>
            </Col>
            <Col span="24">
              <FormItem label="报销说明:">{{dataForm.confirmMemo}}</FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/achievement/achievementsubsidize'
export default {
  name: 'AchievementSubsidize-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        createUserId: '',
        techerId: '',
        teacherName: '',
        meetingFiles: '',
        meetingTopic: '',
        meetingPlace: '',
        attentdType: '',
        overseasStartDate: '',
        overseasEndDate: '',
        applyFee: '',
        applyYear: '',
        applyDate: '',
        applyStatus: '',
        applyMemo: '',
        replyStatus: '',
        replyFee: '',
        allocatedFee: '',
        replyMemo: '',
        confirmStatus: '',
        confirmMemo: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewAchievementSubsidize(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewAchievementSubsidize (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getAchievementSubsidizeInfo(id).then(res => {
        let entity = res.achievementSubsidize
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    }
  }
}
</script>
