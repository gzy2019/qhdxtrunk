<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
          <FormItem label="学生学号:">{{dataForm.stuCode}}</FormItem>
          <FormItem label="学生资料:">{{dataForm.stuApplyInfo}}</FormItem>
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
import api from '@/api/fellowship/researchworkerfellowshipapply'
export default {
  name: 'ResearchworkerFellowshipApply-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        stuName: '',
        stuCode: '',
        stuApplyInfo: '',
        // fellowshipInfoId: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewResearchworkerFellowshipApply(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewResearchworkerFellowshipApply (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerFellowshipApplyInfo(id).then(res => {
        let entity = res.researchworkerFellowshipApply
        console.log(entity.stuApplyInfo[0].name,'11')
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
