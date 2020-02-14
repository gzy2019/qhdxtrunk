<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <Row>
                    <Col span="12">
                        <FormItem label="部门" prop="paypointDepartmentId">
                            {{dataForm.department.name}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="名称" prop="name">
                            {{dataForm.name}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="编码" prop="code">
                            {{dataForm.code}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="参与人事工作量统计" prop="joinStats">
                            {{dataForm.joinStats ? '是' : '否'}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="类型" prop="category">
                            {{dataForm.category | categoryInfo}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="参与统计类型" prop="statsCategory">
                            {{dataForm.statsCategory | statsCategoryInfo}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="说明" prop="memo">
                            {{dataForm.memo}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="是否已发放" prop="sendFlag">
                            {{dataForm.sendFlag ? '是' : '否'}}
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
import api from '@/api/paypoint/paypointbatch'
export default {
  name: 'PaypointBatch-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        paypointDepartmentId: '',
        department: {},
        name: '',
        code: '',
        joinStats: '',
        category: '',
        statsCategory: '',
        memo: '',
        sendFlag: '',
        id: undefined
      }
    }
  },
  filters: {
    categoryInfo (val) {
      if (val === 0) {
        return '课酬'
      } else if (val === 1) {
        return '公共服务'
      } else if (val === 2) {
        return '其它'
      }

      return '未知'
    },
    statsCategoryInfo (val) {
      if (val === 0) {
        return '授课统计'
      } else if (val === 1) {
        return '指导学生统计'
      } else if (val === 2) {
        return '公共服务统计'
      } else if (val === 3) {
        return '培训部统计'
      }

      return '未知'
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewPaypointBatch(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewPaypointBatch (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointBatchInfo(id).then(res => {
        let entity = res.paypointBatch
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
