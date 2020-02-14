<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <Row>
                    <i-Col span="12">
                      <FormItem label="活动报名人ID" prop="userCode">
                        {{dataForm.userId}}
                      </FormItem>
                    </i-Col>
                    <i-Col span="12">
                      <FormItem label="人员类型" prop="userType">
                        {{dataForm.userType | recordStatusInfo}}
                      </FormItem>
                    </i-Col>
                    <i-Col span="12">
                      <FormItem label="证件号" prop="userId">
                        {{dataForm.userCode}}
                      </FormItem>
                    </i-Col>
                    <!-- <Col span="12">
                        <FormItem label="学生/教师" prop="userCode">
                            {{dataForm.userCode}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="学生姓名/教师姓名" prop="userName">
                            {{dataForm.userName}}
                        </FormItem>
                    </Col> -->
                    <i-Col span="12">
                      <FormItem label="报名留言" prop="applyMsg">
                        {{dataForm.applyMsg}}
                      </FormItem>
                    </i-Col>
                    <i-Col span="12">
                      <FormItem label="报名状态" prop="applyAuditStatus">
                        {{dataForm.applyAuditStatus ? '同意' : '拒绝'}}
                      </FormItem>
                    </i-Col>
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
import api from '@/api/activity/officeactivityapply'
export default {
  name: 'OfficeActivityApply-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        userType: '',
        userId: '',
        userCode: '',
        userName: '',
        applyMsg: '',
        applyAuditStatus: '',
        applyAuditUserId: '',
        emailedFlag: '',
        id: undefined
      }
    }
  },
  filters: {
    recordStatusInfo (val) {
      if (val === 0) {
        return '学生'
      } else if (val === 1) {
        return '老师'
      } else if (val === 2) {
        return '学生&老师'
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewOfficeActivityApply(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewOfficeActivityApply (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeActivityApplyInfo(id).then(res => {
        let entity = res.officeActivityApply
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
