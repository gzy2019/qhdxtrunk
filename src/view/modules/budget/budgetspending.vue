<template>
    <div class="search">
        <Card>
            <Row class="operation btn_group">
                <Col span="24">
                  <span style="margin-right: 20px;">支出填报表
                    <template v-if="!viewModel">(双击可编辑)</template>
                  </span>
                  <div v-if="!viewModel" style="display:inline-block">
                    <Button v-if="isAuth('budget:budgetspending:save')" @click="addBudgetSpending" type="primary" icon="md-add">新增</Button>
                    <Button v-if="isAuth('budget:budgetspending:delete')" :disabled="selectedList.length === 0" @click="deleteBudgetSpending()" type="primary" icon="ios-trash-outline">删除</Button>
                  </div>
                </Col>
            </Row>
            <Row>
              <Table :loading="loading" ref="table" :height="350" size="small" border stripe :data="pageData.list" :columns="columns" @on-row-dblclick="editBudgetSpending" @on-selection-change="selectionChangeHandle">
                <template slot-scope="{ row }" slot="action">
                  <ButtonGroup v-if="row.id && !viewModel">
                      <Button v-if="isAuth('budget:budgetspending:update')" type="primary" size="small" @click="editBudgetSpending(row)">编辑</Button>
                      <Button v-if="isAuth('budget:budgetspending:delete')" type="error"   size="small" @click="deleteBudgetSpending(row)">删除</Button>
                  </ButtonGroup>
                </template>
              </Table>
            </Row>
        </Card>

        <BudgetSpendingForm ref="budgetSpendingForm" :departmentMainId="departmentMainId" :departmentId="departmentId" :batchId="batchId" @update="getBudgetSpendingList" />
        <BudgetSpendingView ref="budgetSpendingView" />
    </div>
</template>

<script>
import api from '@/api/budget/budgetspending'
import BudgetSpendingForm from './components/budgetspending-form'
import BudgetSpendingView from './components/budgetspending-view'
export default {
  name: 'BudgetSpending-manage',
  components: { BudgetSpendingForm, BudgetSpendingView },
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
        limit: 500,
        name: ''
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
          title: '支出',
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
          title: '人员费',
          key: 'personFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '办公费',
          key: 'officeFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '设备费',
          key: 'equipmentFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '交通费',
          key: 'trafficFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '差旅费',
          key: 'travelFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '出国费',
          key: 'overseasFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '水电费',
          key: 'electricityWaterFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '招待费',
          key: 'treatFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '图书费',
          key: 'bookFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '福利费',
          key: 'welfareFee',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '其它',
          key: 'otherFee',
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
      this.getBudgetSpendingList()
    },
    getBudgetSpendingList () {
      if (!this.departmentMainId) {
        return false
      }
      this.loading = true
      this.searchForm.budgetDepartmentMainId = this.departmentMainId
      api.getBudgetSpendingList(this.searchForm).then(res => {
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
        amount: 0,
        personFee: 0,
        officeFee: 0,
        equipmentFee: 0,
        trafficFee: 0,
        travelFee: 0,
        overseasFee: 0,
        electricityWaterFee: 0,
        treatFee: 0,
        bookFee: 0,
        welfareFee: 0,
        otherFee: 0
      }
      list.forEach(item => {
        obj.amount += item.amount
        obj.personFee += item.personFee
        obj.officeFee += item.officeFee
        obj.equipmentFee += item.equipmentFee
        obj.trafficFee += item.trafficFee
        obj.travelFee += item.travelFee
        obj.overseasFee += item.overseasFee
        obj.electricityWaterFee += item.electricityWaterFee
        obj.treatFee += item.treatFee
        obj.bookFee += item.bookFee
        obj.welfareFee += item.welfareFee
        obj.otherFee += item.otherFee
      })
      list.push(obj)
    },
    addBudgetSpending () {
      this.$refs.budgetSpendingForm.addBudgetSpending()
    },
    viewBudgetSpending (v) {
      this.$refs.budgetSpendingView.viewBudgetSpending(v.id)
    },
    editBudgetSpending (v) {
      if (!v.id || v.name === '合计' || this.viewModel) {
        return false
      }
      this.$refs.budgetSpendingForm.editBudgetSpending(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteBudgetSpending (row) {
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
          api.deleteBudgetSpending(ids).then(res => {
            this.$Message.success('删除成功!')
            this.getBudgetSpendingList()
          })
        }
      })
    }
  }
}
</script>
