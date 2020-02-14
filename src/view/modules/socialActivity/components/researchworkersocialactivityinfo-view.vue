<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="报名开始时间:">{{dataForm.applyStartDate}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="报名结束时间:">{{dataForm.applyEndDate}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动开始时间:">{{dataForm.activityStartDate}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动结束时间:">{{dataForm.activityEndDate}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动名:">{{dataForm.activityName}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动地址:">{{dataForm.activityAds}}</FormItem>
            </Col>
            <Col span="12">
             <FormItem label="活动类型:">{{dataForm.activityType}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="活动组别:">{{dataForm.activityGroup}}</FormItem>
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
import api from '@/api/socialActivity/researchworkersocialactivityinfo'
export default {
  name: 'ResearchworkerSocialactivityInfo-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        applyStartDate: '',
        applyEndDate: '',
        activityStartDate: '',
        activityEndDate: '',
        activityName: '',
        activityAds: '',
        activityType: '',
        activityGroup: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerSocialactivityInfo(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerSocialactivityInfo (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerSocialactivityInfoInfo(id).then(res => {
        let entity = res.researchworkerSocialactivityInfo
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
