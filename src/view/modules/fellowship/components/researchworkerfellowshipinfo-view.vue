<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
          <Col span='12'>
          <FormItem label="奖学金明细:">{{dataForm.fellowshipDesc}}</FormItem>
          </Col>
          <Col span='12'>
          <FormItem label="报名开始时间:">{{dataForm.applyStartDate}}</FormItem>
          </Col>
          <Col span='12'>
          <FormItem label="报名结束时间:">{{dataForm.applyEndDate}}</FormItem>
          </Col>
          <Col span='12'>
          <FormItem label="结果公示开始时间:">{{dataForm.resultStartDate}}</FormItem>
          </Col>
          <Col span='12'>
          <FormItem label="结果公示结束时间:">{{dataForm.resultEndDate}}</FormItem>
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
import api from '@/api/fellowship/researchworkerfellowshipinfo'
export default {
  name: 'ResearchworkerFellowshipInfo-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        fellowshipTitle: '',
        fellowshipDesc: '',
        applyStartDate: '',
        applyEndDate: '',
        resultStartDate: '',
        resultEndDate: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerFellowshipInfo(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerFellowshipInfo (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      // let fellowshipInfoId = this.$route.params.fellowshipInfoId
      // this.searchForm.fellowshipInfoId = fellowshipInfoId
      api.getResearchworkerFellowshipInfoInfo(id).then(res => {
        let entity = res.researchworkerFellowshipInfo
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
