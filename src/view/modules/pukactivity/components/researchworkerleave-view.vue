<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="活动:">{{dataForm.activityName }}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="学生ID:">{{dataForm.stuId}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="请假内容:">{{dataForm.leaveInfo}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="请假时间:">{{dataForm.leaveDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="请假天数:">{{dataForm.leaveDay}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="旷签天数:">{{dataForm.absentDay}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="旷签时间:">{{dataForm.absentDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="请假结果:">{{dataForm.leaveResultDesc}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="备注:">{{dataForm.infoDesc}}</FormItem>
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
import api from '@/api/pukactivity/researchworkerleave'
export default {
  name: 'ResearchworkerLeave-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        activityName: '',
        stuName: '',
        stuId: '',
        leaveInfo: '',
        leaveDate: '',
        leaveDay: '',
        absentDay: '',
        absentDate: '',
        leaveResultDesc: '',
        infoDesc: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerLeave(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerLeave (id) {
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
    }
  }
}
</script>
