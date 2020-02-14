<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="活动名称:">{{dataForm.activityName}}</FormItem>
            </Col>
            <Col span="12">
             <FormItem label="活动天数:">{{dataForm.countTime}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="活动开始时间:">{{dataForm.startTime}}</FormItem>
            </Col>
            <Col span="12">
             <FormItem label="活动结束时间:">{{dataForm.endTime}}</FormItem>
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
import api from '@/api/pukactivity/researchworkeractivity'
export default {
  name: 'ResearchworkerActivity-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        activityName: '',
        startTime: '',
        countTime: '',
        endTime: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerActivity(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerActivity (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerActivityInfo(id).then(res => {
        let entity = res.researchworkerActivity
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
