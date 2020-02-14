<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <Row>
                    <Col span="12">
                        <FormItem label="批次" prop="batchId">
                            {{dataForm.batch.name}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="部门" prop="paypointDepartmentId">
                            {{dataForm.department.name}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="记录人" prop="createUserName">
                            {{dataForm.createUserName}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="教师" prop="teacherId">
                            {{dataForm.teacher.teaName}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="时间" prop="serviceDate">
                            {{dataForm.serviceDate}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="服务内容" prop="serviceContent">
                            {{dataForm.serviceContent}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="计量单位" prop="unit">
                            {{dataForm.unit}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="薪酬标准" prop="payStandard">
                            {{dataForm.payStandard}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="不计薪酬" prop="payNotCounted">
                            {{dataForm.payNotCounted ? '是' : '否'}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次薪酬计数" prop="curPayCount">
                            {{dataForm.curPayCount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次薪酬金额" prop="curPayAmount">
                            {{dataForm.curPayAmount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="绩点标准" prop="pointStandard">
                            {{dataForm.pointStandard}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次绩点计数" prop="curPointCount">
                            {{dataForm.curPointCount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="本次绩点金额" prop="curPointAmount">
                            {{dataForm.curPointAmount}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="学年学期" prop="term">
                            {{dataForm.term}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="摘要" prop="summary">
                            {{dataForm.summary}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="老师是否已确认" prop="teacherConfirm">
                            {{dataForm.teacherConfirm ? '是' : '否'}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="备注" prop="memo">
                            {{dataForm.memo}}
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
import api from '@/api/paypoint/paypointpubservice'
export default {
  name: 'PaypointPubService-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        batch: {},
        department: {},
        createUserName: '',
        teacher: {},
        serviceDate: '',
        categoryId: '',
        ruleId: '',
        serviceContent: '',
        unit: '',
        payNotCounted: false,
        payStandard: 0,
        curPayCount: 0,
        curPayAmount: 0,
        pointStandard: 0,
        curPointCount: 0,
        curPointAmount: 0,
        term: '',
        summary: '',
        teacherConfirm: '',
        memo: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewPaypointPubService(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewPaypointPubService (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointPubServiceInfo(id).then(res => {
        let entity = res.paypointPubService
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
