<template>
    <div class="search">
        <Modal title="部门预算详情" v-model="formModalVisible" :footer-hide="true" :mask-closable='true' :width="950" class-name="vertical-center-modal">
        <Card>
            <div class="budget-title">
                <span>{{curBatch.name}}</span>
                <span>【填报时间：{{curBatch.beginTime}} - {{curBatch.endTime}}】</span>
            </div>
            <Spin size="large" fix v-if="loading"></Spin>
            <Card style="margin-top: 10px;">
              <div class="words">
                  <p>1、学院预算坚持“量入为出，收支平衡”的总原则，各部门编制预算时应遵循合法性、真实性、稳妥性和完整性原则；</p>
                  <p>2、部门目标：各部门根据下一年度事业发展计划制定可以量化的具体部门任务目标；</p>
                  <p>3、预算依据：各部门各项支出活动产生的主要依据，包括学院现有事业编制、合同制、博士后学生人数等基础数据；</p>
                  <p>4、收入与支出按各部门业务活动特点分项目列示，各项目标准可用现行学院政策作为估计数，或用上一年度实际发生数作为参考依据，如有变化必须做出说明。</p>
                  <p>5、各部门做支出预算时可以分为固定支出和可变支出，固定支出可不随预算依据发生变化，可变支出则随着预算依据发生变化；</p>
                  <p>6、各部门可在支出项目中按3%安排机动经费。</p>
              </div>
            </Card>
            <Row class="operation btn_group" style="margin-top: 10px;">
                <Col span="8">
                    <Form ref="dataForm0" :label-width="110">
                        <Form-item  label="所在部门:">
                            {{curDepartment.name}}
                        </Form-item>
                    </Form>
                </Col>
                <Col span="6" offset="10">
                    <Button style="float:right;" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Card v-if="budgetMain.id" >
                <Form ref="dataForm1" :model="dataForm" :label-width="110">
                    <FormItem label="任务描述" prop="deptDuty">
                        {{dataForm.deptDuty}}
                    </FormItem>
                    <FormItem label="预期目标" prop="deptGoal">
                        {{dataForm.deptGoal}}
                    </FormItem>
                    <FormItem label="预算依据" prop="deptBasis">
                        {{dataForm.deptBasis}}
                    </FormItem>
                    <FormItem label="考核指标" prop="kpiIndex">
                        {{dataForm.kpiIndex}}
                    </FormItem>
                </Form>
            </Card>

            <div v-if="budgetMain.id && formModalVisible">
                <BudgetIncome :viewModel="true" :departmentMainId="budgetMain.id" :departmentId="curDepartmentId" :batchId="curBatchId" style="margin-top: 10px;"/>
                <BudgetSpending :viewModel="true" :departmentMainId="budgetMain.id" :departmentId="curDepartmentId" :batchId="curBatchId" style="margin-top: 10px;"/>

                <Card style="margin-top: 10px;">
                    <Form ref="dataForm2" :model="dataForm" :label-width="110" :rules="dataFormValidate">
                        <FormItem label="其它经费来源" prop="otherAmount">
                            {{dataForm.otherAmount}}
                        </FormItem>
                        <FormItem label="预算申请" prop="applyAmount">
                            {{dataForm.applyAmount}}
                        </FormItem>
                        <FormItem label="预算批准" prop="approveMemo">
                            {{dataForm.approveMemo}}
                        </FormItem>
                        <FormItem label="修改说明" prop="changeMemo">
                            {{dataForm.changeMemo}}
                        </FormItem>
                    </Form>
                </Card>
            </div>
        </Card>
        </Modal>
    </div>
</template>

<script>
import api from '@/api/budget/budgetdepartmentmain'
import departmentapi from '@/api/budget/budgetdepartment'
import batchapi from '@/api/budget/budgetbatch'
import BudgetIncome from './budgetincome'
import BudgetSpending from './budgetspending'
export default {
  name: 'Budgetdepartmentmain-detail',
  components: { BudgetIncome, BudgetSpending },
  data () {
    return {
      loading: true,
      formModalVisible: false,
      exportLoading: false,
      submitLoading: false,
      departmentList: [],
      batchList: [],
      curDepartmentId: '',
      curBatchId: '',
      curBatch: {},
      curDepartment: {},
      budgetMain: {},
      dataForm: {
        deptDuty: '',
        deptGoal: '',
        deptBasis: '',
        kpiIndex: '',
        otherAmount: 0,
        applyAmount: 0,
        approveMemo: '',
        changeMemo: '',
        id: undefined
      },
      dataFormValidate: {
        otherAmount: [
          { type: 'number', required: true, message: '其它经费来源不能为空', trigger: 'blur' }
        ],
        applyAmount: [
          { type: 'number', required: true, message: '预算申请不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'curDepartmentId': {
      handler () {
        this.loadDepartmentMain()
      }
    },
    'curBatchId': {
      handler () {
        this.loadDepartmentMain()
      }
    }
  },
  methods: {
    init (batchId, departmentId) {
      this.curBatchId = batchId
      this.curDepartmentId = departmentId
      if (!this.curBatchId || !this.curDepartmentId) {
        this.$Message.error('参数错误!')
        return false
      }
      this.formModalVisible = true
      this.loadBatchList()
      this.loadDepartmentList()
    },
    loadBatchList () {
      batchapi.getBudgetBatchDataList().then(res => {
        this.batchList = res.list
        if (this.curBatchId) {
          this.curBatch = res.list.find(item => item.id === this.curBatchId)
        }
      })
    },
    loadDepartmentList () {
      departmentapi.getBudgetDepartmentDataList().then(res => {
        this.departmentList = res.list
        if (this.curDepartmentId) {
          this.curDepartment = res.list.find(item => item.id === this.curDepartmentId)
        }
      })
    },
    loadDepartmentMain () {
      if (!this.curDepartmentId || !this.curBatchId) {
        return
      }
      let param = {
        departmentId: this.curDepartmentId,
        batchId: this.curBatchId
      }
      this.loading = true
      api.getBudgetDepartmentMainInfoByDept(param).then(res => {
        this.budgetMain = res.budgetDepartmentMain
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = this.budgetMain[key]
        })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.budget-title {
  display: block;
  margin: 5px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
}
.words {
  font-size: 13px;
  line-height: 20px;
  p {
    margin: 5px 0;
  }
}
</style>
