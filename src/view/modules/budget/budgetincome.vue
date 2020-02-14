<template>
    <div class="search">
        <Card>
            <Row class="operation btn_group">
              <Col span="24">
                <span style="margin-right: 20px;">收入填报表
                  <template v-if="!viewModel">(双击可编辑)</template>
                </span>
                <div v-if="!viewModel" style="display:inline-block">
                  <Button v-if="isAuth('budget:budgetincome:save')" @click="addBudgetIncome" type="primary" icon="md-add">新增</Button>
                  <Button v-if="isAuth('budget:budgetincome:delete')" :disabled="selectedList.length === 0" @click="deleteBudgetIncome()" type="primary" icon="ios-trash-outline">删除</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Table :loading="loading" ref="table" :height="350" size="small" border stripe :data="pageData.list" :columns="columns" @on-row-dblclick="editBudgetIncome" @on-selection-change="selectionChangeHandle">
                <template slot-scope="{ row }" slot="action">
                  <ButtonGroup v-if="row.id && !viewModel">
                    <Button v-if="isAuth('budget:budgetincome:update')" type="primary" size="small" @click="editBudgetIncome(row)">编辑</Button>
                    <Button v-if="isAuth('budget:budgetincome:delete')" type="error"   size="small" @click="deleteBudgetIncome(row)">删除</Button>
                  </ButtonGroup>
                </template>
              </Table>
            </Row>
        </Card>

        <BudgetIncomeForm ref="budgetIncomeForm" :departmentMainId="departmentMainId" :departmentId="departmentId" :batchId="batchId" @update="getBudgetIncomeList" />
        <BudgetIncomeView ref="budgetIncomeView" />
    </div>
</template>

<script>
import api from '@/api/budget/budgetincome'
import BudgetIncomeForm from './components/budgetincome-form'
import BudgetIncomeView from './components/budgetincome-view'
export default {
  name: 'BudgetIncome-manage',
  components: { BudgetIncomeForm, BudgetIncomeView },
  props: {
    departmentMainId: {
      required: true,
      type: Number,
      default () {
        return 0
      }
    },
    departmentId: {
      required: true,
      type: Number,
      default () {
        return 0
      }
    },
    batchId: {
      required: true,
      type: Number,
      default () {
        return 0
      }
    },
    viewModel: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      loading: true,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 500
      },
      pageData: {
        totalCount: 0,
        list: []
      },
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '收入',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目',
          key: 'category',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '数量',
          key: 'quantity',
          minWidth: 80,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '标准',
          key: 'standard',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '单位说明',
          key: 'unit',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '预算数',
          key: 'amount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注',
          key: 'memo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        }
      ]
    }
  },
  watch: {
    departmentMainId: {
      handler () {
        this.init()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getBudgetIncomeList()
    },
    getBudgetIncomeList () {
      if (!this.departmentMainId) {
        return false
      }
      this.searchForm.budgetDepartmentMainId = this.departmentMainId
      this.loading = true
      api.getBudgetIncomeList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.computeSummary(res.page.list)
      })
    },
    computeSummary (list) {
      if (!list || !list.length) {
        return false
      }
      let obj = {
        name: '合计',
        amount: 0
      }
      list.forEach(item => {
        obj.amount += item.amount
      })
      list.push(obj)
    },
    addBudgetIncome () {
      this.$refs.budgetIncomeForm.addBudgetIncome()
    },
    viewBudgetIncome (v) {
      this.$refs.budgetIncomeView.viewBudgetIncome(v.id)
    },
    editBudgetIncome (v) {
      if (!v.id || v.name === '合计' || this.viewModel) {
        return false
      }
      this.$refs.budgetIncomeForm.editBudgetIncome(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteBudgetIncome (row) {
      let ids = []
      if (row && row.id) {
        ids.push(row.id)
      } else {
        ids = this.selectedList.filter(item => item.id).map(item => item.id)
      }
      if (!ids.length) {
        return false
      }

      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteBudgetIncome(ids).then(res => {
            this.$Message.success('删除成功!')
            this.getBudgetIncomeList()
          })
        }
      })
    }
  }
}
</script>
