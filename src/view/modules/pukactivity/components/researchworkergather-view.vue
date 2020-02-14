<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="学生ID:">{{dataForm.stuId}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="总结:">{{dataForm.gatherInfo}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="签到的总天数:">{{dataForm.checkinCount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="请假的总天数:">{{dataForm.leaveCount}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="旷签的总天数:">{{dataForm.absentCount}}</FormItem>
            </Col>
            <!-- <Col span="12">
              <FormItem label="活动:">{{dataForm.activityId}}</FormItem>
            </Col> -->
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
import api from '@/api/pukactivity/researchworkergather'
export default {
  name: 'ResearchworkerGather-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        activityId: '',
        stuName: '',
        stuId: '',
        gatherInfo: '',
        checkinCount: '',
        leaveCount: '',
        absentCount: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerGather(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerGather (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerGatherInfo(id).then(res => {
        console.log(res)
        let entity = res.researchworkerGather
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
