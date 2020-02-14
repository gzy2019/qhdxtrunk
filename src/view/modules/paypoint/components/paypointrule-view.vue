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
                        <FormItem label="绩点分类" prop="categoryId">
                            {{dataForm.category ? dataForm.category.name : '无'}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="类型" prop="ruleCategory">
                            {{dataForm.ruleCategory || ruleCategoryInfo}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="编码" prop="code">
                            {{dataForm.code}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="服务内容" prop="title">
                            {{dataForm.title}}
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
                        <FormItem label="绩点标准" prop="pointStandard">
                            {{dataForm.pointStandard}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="说明" prop="memo">
                            {{dataForm.memo}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="统计分类" prop="statsCategory">
                            {{dataForm.statsCategory}}
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
import api from '@/api/paypoint/paypointrule'
export default {
  name: 'PaypointRule-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        paypointDepartmentId: '',
        department: {},
        categoryId: '',
        category: {},
        ruleCategory: null,
        title: '',
        code: '',
        unit: '',
        payStandard: '',
        pointStandard: '',
        memo: '',
        statsCategory: '',
        id: undefined
      }
    }
  },
  computed: {
    ruleCategoryInfo (val) {
      if (val === 0) {
        return '课酬'
      } else if (val === 1) {
        return '公共服务'
      } else if (val === 2) {
        return '其它'
      }

      return ''
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewPaypointRule(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewPaypointRule (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointRuleInfo(id).then(res => {
        let entity = res.paypointRule
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
