<template>
    <div class="search">
        <Card>
            <Row class="operation btn_group" style="margin-top: 10px;">
                <Col span="8">
                    <Form ref="dataForm0" :label-width="110">
                        <Form-item  label="切换批次:">
                            <Select v-model="curBatchId" placeholder="请选择" style="width:170px">
                                <Option v-for="(item,index) in batchList" :key="index" :value="item.id">{{item.name}}</Option>
                            </Select>
                        </Form-item>
                    </Form>
                </Col>
                <Col span="16" v-if="curBatch.id">
                  <div class="budget-title">
                    <span>{{curBatch.name}}</span>
                    <span>【填报时间：{{curBatch.beginTime}} - {{curBatch.endTime}}】</span>
                  </div>
                </Col>
            </Row>
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
                            <Select v-model="curDepartmentId" placeholder="请选择" style="width:170px">
                                <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
                            </Select>
                        </Form-item>
                    </Form>
                </Col>
                <Col span="6" offset="10" v-if="budgetMain.id">
                    <Button v-if="isAuth('budget:budgetdepartmentmain:save') && curBatch.timeWindowOpen" style="float:right;" :loading="copyLoading" @click="copyBudgetFromLast" type="primary" icon="ios-copy-outline">复制</Button>
                    <Button @click="exportData" v-if="isAuth('budget:budgetdepartmentmain:list')" style="float:right;" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Card v-if="budgetMain.id" >
                <Form ref="dataForm1" :model="dataForm" :label-width="110">
                    <FormItem label="任务描述" prop="deptDuty">
                        <Input type="textarea" v-model="dataForm.deptDuty" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入任务描述" />
                    </FormItem>
                    <FormItem label="预期目标" prop="deptGoal">
                        <Input type="textarea" v-model="dataForm.deptGoal" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入预期目标" />
                    </FormItem>
                    <FormItem label="预算依据" prop="deptBasis">
                        <Input type="textarea" v-model="dataForm.deptBasis" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入预算依据" />
                    </FormItem>
                    <FormItem label="考核指标" prop="kpiIndex">
                        <Input type="textarea" v-model="dataForm.kpiIndex" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入考核指标" />
                    </FormItem>
                </Form>
            </Card>

            <div v-if="budgetMain.id">
                <BudgetIncome ref="budgetIncome" :viewModel="!curBatch.timeWindowOpen" :departmentMainId="budgetMain.id" :departmentId="curDepartmentId" :batchId="curBatchId" style="margin-top: 10px;"/>
                <BudgetSpending ref="budgetSpending" :viewModel="!curBatch.timeWindowOpen" :departmentMainId="budgetMain.id" :departmentId="curDepartmentId" :batchId="curBatchId" style="margin-top: 10px;"/>

                <Card style="margin-top: 10px;">
                    <Form ref="dataForm2" :model="dataForm" :label-width="110" :rules="dataFormValidate">
                        <FormItem label="其它经费来源" prop="otherAmount">
                            <InputNumber :min="0" :max="99999999" v-model="dataForm.otherAmount" style="width: 150px;"/>
                        </FormItem>
                        <FormItem label="预算申请" prop="applyAmount">
                            <InputNumber :min="0" :max="99999999" v-model="dataForm.applyAmount" :readonly="false" style="width: 150px;" />
                        </FormItem>
                        <FormItem label="预算批准" prop="approveMemo">
                            <Input type="textarea" v-model="dataForm.approveMemo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入" />
                        </FormItem>
                        <FormItem label="修改说明" prop="changeMemo">
                            <Input type="textarea" v-model="dataForm.changeMemo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入" />
                        </FormItem>
                    </Form>
                </Card>

                <Row class="operation btn_group" style="margin-top: 10px;" v-if="isAuth('budget:budgetdepartmentmain:save') && curBatch.timeWindowOpen">
                    <Col span="8">
                        <Button long @click="saveDepartmentMain" :loading="submitLoading" type="primary">保存</Button>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>

<script>
import api from '@/api/budget/budgetdepartmentmain'
import departmentapi from '@/api/budget/budgetdepartment'
import batchapi from '@/api/budget/budgetbatch'
import BudgetIncome from './budgetincome'
import BudgetSpending from './budgetspending'
export default {
  name: 'Budgetdepartmentmain-manage',
  components: { BudgetIncome, BudgetSpending },
  data () {
    return {
      loading: false,
      copyLoading: false,
      exportLoading: false,
      submitLoading: false,
      departmentList: [],
      batchList: [],
      curDepartmentId: '',
      curBatchId: '',
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
  computed: {
    curBatch () {
      if (this.batchList && this.curBatchId) {
        return this.batchList.find(item => item.id === this.curBatchId)
      }
      return {}
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
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadBatchList()
      this.loadDepartmentList()
    },
    loadBatchList () {
      batchapi.getBudgetBatchDataList().then(res => {
        this.batchList = res.list
        this.curBatchId = this.curBatch.id
      })
    },
    loadDepartmentList () {
      departmentapi.getBudgetDepartmentDataList().then(res => {
        this.departmentList = res.list
      })
    },
    loadDepartmentMain (refreshFlag) {
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
        if (refreshFlag) {
          this.$refs.budgetIncome.getBudgetIncomeList()
          this.$refs.budgetSpending.getBudgetSpendingList()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    saveDepartmentMain () {
      this.$refs.dataForm2.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          api.updateBudgetDepartmentMain(data).then(res => {
            this.$Message.success('保存成功！')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    exportData () {
      if (!this.budgetMain.id) {
        return false
      }
      this.exportLoading = true
      let params = { departmentMainId: this.budgetMain.id }
      api.exportBudgetDepartmentMain(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    copyBudgetFromLast () {
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>此操作将清除当前预算数据并复制上年度预算数据，您确定要执行此操作吗?</p>`,
        onOk: () => {
          this.copyLoading = true
          let param = {
            fromDepartmentId: this.curDepartmentId,
            toDepartmentMainId: this.budgetMain.id
          }
          api.copyFromLastYear(param).then(res => {
            this.$Message.success('复制成功!')
            this.loadDepartmentMain(true)
          }).finally(() => {
            this.copyLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.budget-title {
  display: block;
  margin: 5px 15px;
  text-align: left;
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
