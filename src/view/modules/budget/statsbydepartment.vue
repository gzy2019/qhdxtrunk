<template>
    <div class="search">
      <Card>
        <div class="budget-title">
            <span>公共管理学院预算分析表（按部门）</span>
        </div>
        <Spin size="large" fix v-if="loading"></Spin>
        <Row class="operation btn_group" style="margin-top: 10px;">
            <Col span="24">
                <Button style="float:right;" :loading="exportLoading" @click="exportData" type="primary" icon="ios-download-outline">导出</Button>
            </Col>
        </Row>
        <Row class="budget-stats-table">
          <Table ref="table" :row-class-name="rowClassName"  size="small" border :data="tableData" :columns="columns"></Table>
        </Row>

      </Card>
    </div>
</template>

<script>
import api from '@/api/budget/budgetdepartmentmain'
import batchapi from '@/api/budget/budgetbatch'
export default {
  name: 'BudgetStats-department',
  data () {
    return {
      loading: true,
      exportLoading: false,
      statsData: {
        batchList: [],
        incomeList: [],
        spendingList: [],
        mainList: []
      },
      tableData: []
    }
  },
  computed: {
    columns () {
      let arr = []
      arr.push({ title: '项目', key: 'name', width: 180 })
      if (this.statsData.batchList.length) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.statsData.batchList.forEach(item => {
          arr.push({ title: item.name, key: item.id, minWidth: 100 })
        })
      }

      return arr
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadBatchList()
    },
    loadBatchList () {
      batchapi.getBudgetBatchDataList().then(res => {
        let list = res.list.filter((item, index) => index < 3)
        this.statsData.batchList = list || []
        this.loadStatsDetail()
      })
    },
    loadStatsDetail () {
      if (this.statsData.batchList.length) {
        let ids = this.statsData.batchList.map(item => item.id)
        let param = { batchIds: ids }
        api.getStatsByDepartment(param).then(res => {
          this.statsData.incomeList = res.data.incomeList || []
          this.statsData.spendingList = res.data.spendingList || []
          this.statsData.mainList = res.data.mainList || []

          this.handleIncomeList()
          this.handleSpendingList()
          this.handleMainList()
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    handleDefaultVal (obj) {
      let headerBatchIds = this.statsData.batchList.map(item => item.id)
      headerBatchIds.forEach(headerKey => {
        obj[headerKey] = obj[headerKey] || 0
      })
    },
    handleIncomeList () {
      this.tableData.push({ name: '收入', cellClassName: { name: 'row-text-center' } })
      let totalObj = { name: '收入合计', cellClassName: { name: 'row-text-center' } }
      this.handleDefaultVal(totalObj)

      let dics = []
      this.statsData.incomeList.forEach(item => {
        let dicItem = dics.find(ditem => ditem.departmentId === item.departmentId)
        if (!dicItem) {
          dicItem = item
          dics.push(item)
        }
        if (totalObj[item.batchId]) {
          totalObj[item.batchId] += item.amount
        } else {
          totalObj[item.batchId] = item.amount
        }

        dicItem[item.batchId] = item.amount
      })

      dics.forEach(item => {
        let obj = item
        obj.name = obj.departmentName
        this.handleDefaultVal(obj)
        obj.cellClassName = {}
        obj.cellClassName['name'] = 'row-text-right'
        this.tableData.push(obj)
      })

      this.tableData.push(totalObj)
    },
    handleSpendingList () {
      this.tableData.push({ name: '支出', cellClassName: { name: 'row-text-center' } })
      let totalObj = { name: '支出合计', cellClassName: { name: 'row-text-center' } }
      this.handleDefaultVal(totalObj)

      let dics = []
      this.statsData.spendingList.forEach(item => {
        let dicItem = dics.find(ditem => ditem.departmentName === item.departmentName)
        if (!dicItem) {
          dicItem = item
          dics.push(item)
        }
        if (totalObj[item.batchId]) {
          totalObj[item.batchId] += item.amount
        } else {
          totalObj[item.batchId] = item.amount
        }

        dicItem[item.batchId] = item.amount
      })
      dics.forEach(item => {
        let obj = item
        obj.name = item.departmentName
        this.handleDefaultVal(obj)
        obj.cellClassName = {}
        obj.cellClassName['name'] = 'row-text-right'
        this.tableData.push(obj)
      })

      this.tableData.push(totalObj)
    },
    handleMainList () {
      let otherTotalObj = { name: '其它经费数', cellClassName: { name: 'row-text-center' } }
      let applyTotalObj = { name: '预算申请数', cellClassName: { name: 'row-text-center' } }
      let netTotalObj = { name: '结余数', summary: 0, cellClassName: { name: 'row-text-center' } }
      this.handleDefaultVal(otherTotalObj)
      this.handleDefaultVal(applyTotalObj)
      this.handleDefaultVal(netTotalObj)

      let incomeTotal = this.tableData.find(item => item.name === '收入合计')
      let spendingTotal = this.tableData.find(item => item.name === '支出合计')
      let headerIds = this.statsData.batchList.map(item => item.id)
      headerIds.forEach(headerKey => {
        netTotalObj[headerKey] = incomeTotal[headerKey] - spendingTotal[headerKey]
      })

      this.statsData.mainList.forEach(item => {
        if (otherTotalObj[item.batchId]) {
          otherTotalObj[item.batchId] += item.otherAmount
        } else {
          otherTotalObj[item.batchId] = item.otherAmount
        }

        if (applyTotalObj[item.batchId]) {
          applyTotalObj[item.batchId] += item.applyAmount
        } else {
          applyTotalObj[item.batchId] = item.applyAmount
        }
      })

      this.tableData.push(otherTotalObj)
      this.tableData.push(applyTotalObj)
      this.tableData.push(netTotalObj)

      console.log(this.tableData)
    },
    rowClassName (row, index) {
      let names = ['收入合计', '支出合计', '其它经费数', '预算申请数']
      if (names.includes(row.name)) {
        return 'stats-summary-row'
      }
      return ''
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: '预算分析表(部门)'
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
</style>
