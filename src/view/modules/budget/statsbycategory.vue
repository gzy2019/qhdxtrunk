<template>
    <div class="search">
      <Card>
        <div class="budget-title">
            <span>公共管理学院预算分析表（按项目类型）</span>
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
  name: 'BudgetStats-category',
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
        api.getStatsByCategory(param).then(res => {
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
        let dicItem = dics.find(ditem => ditem.category === item.category)
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
        obj.name = obj.category
        this.handleDefaultVal(obj)
        obj.cellClassName = {}
        obj.cellClassName['name'] = 'row-text-right'
        this.tableData.push(obj)
      })

      this.tableData.push(totalObj)
    },
    handleSpendingList () {
      this.tableData.push({ name: '支出', cellClassName: { name: 'row-text-center' } })

      let itemObj1 = { name: '人员费', cellClassName: { name: 'row-text-right' } }
      let itemObj2 = { name: '办公费', cellClassName: { name: 'row-text-right' } }
      let itemObj3 = { name: '设备费', cellClassName: { name: 'row-text-right' } }
      let itemObj4 = { name: '交通费', cellClassName: { name: 'row-text-right' } }
      let itemObj5 = { name: '差旅费', cellClassName: { name: 'row-text-right' } }
      let itemObj6 = { name: '出国费', cellClassName: { name: 'row-text-right' } }
      let itemObj7 = { name: '水电费', cellClassName: { name: 'row-text-right' } }
      let itemObj8 = { name: '招待费', cellClassName: { name: 'row-text-right' } }
      let itemObj9 = { name: '图书费', cellClassName: { name: 'row-text-right' } }
      let itemObj10 = { name: '福利费', cellClassName: { name: 'row-text-right' } }
      let itemObj11 = { name: '其它费', cellClassName: { name: 'row-text-right' } }

      let totalObj = { name: '支出合计', cellClassName: { name: 'row-text-center' } }

      this.handleDefaultVal(itemObj1)
      this.handleDefaultVal(itemObj2)
      this.handleDefaultVal(itemObj3)
      this.handleDefaultVal(itemObj4)
      this.handleDefaultVal(itemObj5)
      this.handleDefaultVal(itemObj6)
      this.handleDefaultVal(itemObj7)
      this.handleDefaultVal(itemObj8)
      this.handleDefaultVal(itemObj9)
      this.handleDefaultVal(itemObj10)
      this.handleDefaultVal(itemObj11)
      this.handleDefaultVal(totalObj)

      this.statsData.spendingList.forEach(item => {
        itemObj1[item.batchId] = item.personFee
        itemObj2[item.batchId] = item.officeFee
        itemObj3[item.batchId] = item.equipmentFee
        itemObj4[item.batchId] = item.trafficFee
        itemObj5[item.batchId] = item.travelFee
        itemObj6[item.batchId] = item.overseasFee
        itemObj7[item.batchId] = item.electricityWaterFee
        itemObj8[item.batchId] = item.treatFee
        itemObj9[item.batchId] = item.bookFee
        itemObj10[item.batchId] = item.welfareFee
        itemObj11[item.batchId] = item.otherFee

        totalObj[item.batchId] += item.personFee + item.officeFee + item.equipmentFee + item.trafficFee + item.overseasFee
        totalObj[item.batchId] += item.electricityWaterFee + item.treatFee + item.bookFee + item.welfareFee + item.otherFee
      })

      this.tableData.push(itemObj1)
      this.tableData.push(itemObj2)
      this.tableData.push(itemObj3)
      this.tableData.push(itemObj4)
      this.tableData.push(itemObj5)
      this.tableData.push(itemObj6)
      this.tableData.push(itemObj7)
      this.tableData.push(itemObj8)
      this.tableData.push(itemObj9)
      this.tableData.push(itemObj10)
      this.tableData.push(itemObj11)

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
        filename: '预算分析表(项目)'
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
