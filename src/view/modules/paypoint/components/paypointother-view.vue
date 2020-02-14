<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="130">
                <Row>
                    <Col span="12">
                        <FormItem label="批次">
                            {{dataForm.batch.name}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="部门">
                            {{dataForm.department.name}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="记录人">
                            {{dataForm.createUserName}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="时间">
                            {{dataForm.serviceDate}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="服务内容">
                            {{dataForm.serviceContent}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="计量单位">
                            {{dataForm.unit}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="教师">
                            {{dataForm.teacher.teaName}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="选课人数">
                            {{dataForm.attendCount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="中英文">
                            {{dataForm.langInfo}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="薪酬系数">
                            {{dataForm.payFactor}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="薪酬标准">
                            {{dataForm.payStandard}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次薪酬计数">
                            {{dataForm.curPayCount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次薪酬金额">
                            {{dataForm.curPayAmount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="绩点标准">
                            {{dataForm.pointStandard}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次绩点计数">
                            {{dataForm.curPointCount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次绩点数量">
                            {{dataForm.curPointAmount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="学年学期">
                            {{dataForm.term}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="摘要">
                            {{dataForm.summary}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="老师是否已确认">
                            {{dataForm.teacherConfirm ? '是' : '否'}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="备注">
                            {{dataForm.memo}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="记录状态">
                            {{dataForm.recordStatus | recordStatusInfo}}
                        </FormItem>
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
import api from '@/api/paypoint/paypointother'
export default {
  name: 'PaypointOther-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        batch: {},
        department: {},
        createUserName: '',
        serviceDate: '',
        categoryId: '',
        ruleId: '',
        serviceContent: '',
        unit: '',
        payStandard: 0,
        pointStandard: 0,
        teacher: {},
        attendCount: '',
        langInfo: '',
        payFactor: '',
        curPayCount: 0,
        curPayAmount: 0,
        curPointCount: 0,
        curPointAmount: 0,
        term: '',
        summary: '',
        teacherConfirm: '',
        memo: '',
        recordStatus: null,
        id: undefined
      }
    }
  },
  filters: {
    recordStatusInfo (val) {
      if (val === 0) {
        return '录入'
      } else if (val === 1) {
        return '教师已确认'
      } else if (val === 2) {
        return '主管已审核'
      }

      return '未知'
    },
    recordStatusColor (val) {
      if (val === 0) {
        return 'default'
      } else if (val === 1) {
        return 'primary'
      } else if (val === 2) {
        return 'success'
      }

      return ''
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewPaypointOther(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewPaypointOther (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointOtherInfo(id).then(res => {
        let entity = res.paypointOther
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
