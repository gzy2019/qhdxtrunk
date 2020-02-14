<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <FormItem label="分类名称" prop="typeName">
                    {{dataForm.typeName}}
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">关闭</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>
<script>
import api from '@/api/activity/officeactivitytype'
export default {
  name: 'OfficeActivityType-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        typeName: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewOfficeActivityType(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewOfficeActivityType (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeActivityTypeInfo(id).then(res => {
        let entity = res.officeActivityType
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
