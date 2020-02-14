<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="活动">{{dataForm.activityName}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="报名时间:">{{dataForm.applyDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="审核时间:">{{dataForm.confirmDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="评论时间:">{{dataForm.commentDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="审核结果:">{{dataForm.confirmResultDesc}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="学生学号:">{{dataForm.stuCode}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="申请小组:">{{dataForm.applyGroup}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="活动评论:">{{dataForm.activityDesc}}</FormItem>
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
import api from '@/api/socialActivity/researchworkersocialactivityapply'
export default {
  name: 'ResearchworkerSocialactivityApply-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        activityName: '',
        applyDate: '',
        confirmDate: '',
        commentDate: '',
        confirmResultDesc: '',
        stuName: '',
        stuCode: '',
        applyGroup: '',
        activityDesc: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerSocialactivityApply(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerSocialactivityApply (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerSocialactivityApplyInfo(id).then(res => {
        let entity = res.researchworkerSocialactivityApply
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
