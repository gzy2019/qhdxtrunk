<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <FormItem label="名称" prop="name">
                    {{dataForm.name}}
                </FormItem>
                <FormItem label="管理员" prop="adminId">
                    {{dataForm.adminUser.teaName}}
                </FormItem>
                <FormItem label="管理员证件号" prop="adminId">
                    {{dataForm.adminUser.teaCode}}
                </FormItem>
                <FormItem label="操作员" prop="operId">
                    {{dataForm.operUser.teaName}}
                </FormItem>
                <FormItem label="操作员证件号" prop="operId">
                    {{dataForm.operUser.teaCode}}
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
import api from '@/api/paypoint/paypointdepartment'
export default {
  name: 'PaypointDepartment-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        name: '',
        adminUser: {},
        operUser: {},
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewPaypointDepartment(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewPaypointDepartment (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointDepartmentInfo(id).then(res => {
        let entity = res.paypointDepartment
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
