<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
          <FormItem label="学生学号:">{{dataForm.stuCode}}</FormItem>
          <FormItem label="奖学金的结果:">{{dataForm.fellowshipResult}}</FormItem>
          <!-- <FormItem label="申请的奖学金id:">{{dataForm.fellowshipInfoId}}</FormItem> -->
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/fellowship/researchworkerfellowshipresult'
export default {
  name: 'ResearchworkerFellowshipResult-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        stuName: '',
        stuCode: '',
        fellowshipResult: '',
        // fellowshipInfoId: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerFellowshipResult(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerFellowshipResult (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerFellowshipResultInfo(id).then(res => {
        let entity = res.researchworkerFellowshipResult
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
