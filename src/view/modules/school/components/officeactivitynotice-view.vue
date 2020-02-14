<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <Row>
                    <i-col span="12">
                        <FormItem label="活动名称" prop="activityTitle">
                            {{dataForm.activityTitle}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="活动说明" prop="activityContent">
                            {{dataForm.activityContent}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="创建人ID" prop="typeId">
                            {{dataForm.createUserId}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="活动开始日期" prop="startDate">
                            {{dataForm.startDate}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="活动结束日期" prop="endDate">
                            {{dataForm.endDate}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="是否需要报名" prop="applyFlag">
                            {{dataForm.applyFlag ? '是' : '否'}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="报名开始日期" prop="applyStartDate">
                            {{dataForm.applyStartDate}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="报名结束日期" prop="applyEndDate">
                            {{dataForm.applyEndDate}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="报名限额" prop="applyAmount">
                            {{dataForm.applyAmount}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="是否群发邮件" prop="emailFlag">
                            {{dataForm.emailFlag ? '是' : '否'}}
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="报名范围" prop="applyType" >
                            {{dataForm.applyType | recordStatusInfo}}
                        </FormItem>
                    </i-col>
                    <!-- <i-col span="12">
                        <FormItem label="报名范围" prop="isDelete">
                            {{dataForm.isDelete}}
                        </FormItem>
                    </i-col> -->
                    <i-col span="12">
                        <FormItem label="活动状态" prop="activityStatus">
                            {{dataForm.activityStatus ? '已结束' : '进行中'}}
                        </FormItem>
                    </i-col>
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
import api from '@/api/activity/officeactivitynotice'
export default {
  name: 'OfficeActivityNotice-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        createUserId: '',
        activityTitle: '',
        activityContent: '',
        typeId: '',
        startDate: '',
        endDate: '',
        applyFlag: '',
        applyStartDate: '',
        applyEndDate: '',
        applyAmount: '',
        emailFlag: '',
        applyType: '',
        //   isDelete: '',
        activityStatus: '',
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
      if (id) this.viewOfficeActivityNotice(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewOfficeActivityNotice (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeActivityNoticeInfo(id).then(res => {
        let entity = res.officeActivityNotice
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
