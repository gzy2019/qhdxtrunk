<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <FormItem label="批次名称:">{{dataForm.name}}</FormItem>
                <FormItem label="年度:">{{dataForm.year}}</FormItem>
                <FormItem label="开始时间:">{{dataForm.beginTime}}</FormItem>
                <FormItem label="结束时间:">{{dataForm.endTime}}</FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">关闭</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/budget/budgetbatch'
export default {
  name: 'BudgetBatch-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        name: '',
        year: '',
        beginTime: '',
        endTime: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewBudgetBatch(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewBudgetBatch (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getBudgetBatchInfo(id).then(res => {
        let entity = res.budgetBatch
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
