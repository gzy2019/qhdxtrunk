<template>
    <div class="search">
      <Card>
        <Spin size="large" fix v-if="loading"></Spin>
        <Row class="operation btn_group" style="margin-bottom: 10px;">
          <Col span="8">
            <Form ref="dataForm0" label-position="left" :label-width="50">
              <Form-item  label="批次:">
                <Select v-model="batchId" placeholder="请选择" style="width:170px">
                    <Option v-for="(item,index) in statsData.batchList" :key="index" :value="item.id">{{item.name}}</Option>
                </Select>
              </Form-item>
            </Form>
          </Col>
          <Col span="12" offset="4">
            <Button style="float:right;" :loading="exportLoading" @click="exportData" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row class="budget-stats-table">
          <Table ref="table" :row-class-name="rowClassName"  size="small" border :data="tableData" :columns="columns"></Table>
        </Row>

        <BudgetDetail ref="budgetdttail" />
      </Card>
    </div>
</template>

<script>
import api from '@/api/budget/budgetdepartmentmain'
import batchapi from '@/api/budget/budgetbatch'
import departmentapi from '@/api/budget/budgetdepartment'
import BudgetDetail from './budgetdetail'
export default {
  name: 'BudgetStats-summary',
  components: { BudgetDetail },
  data () {
    return {
      loading: true,
      exportLoading: false,
      statsData: {
        batchList: [],
        departmentList: [],
        incomeList: [],
        spendingList: [],
        mainList: []
      },
      batchId: 0,
      tableData: []
    }
  },
  computed: {
    columns () {
      let arr = []
      arr.push({ title: '项目', key: 'name', width: 120 })
      if (this.statsData.departmentList.length) {
        this.statsData.departmentList.forEach(item => {
          let column = { title: item.name, key: item.id, minWidth: 110 }
          column.renderHeader = (h, params) => {
            return h('div', [
              h('strong', {
                domProps: {
                  title: '点击查看详情'
                },
                title: '点击查看详情',
                style: { cursor: 'pointer' },
                on: {
                  click: () => {
                    this.showDepartmentStats(params.column.key)
                  }
                }
              }, params.column.title)
            ])
          }
          arr.push(column)
        })
      }
      arr.push({ title: '合计', key: 'summary', width: 120 })

      return arr
    }
  },
  watch: {
    batchId: {
      immediate: true,
      handler () {
        this.loadStatsDetail()
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
        this.statsData.batchList = res.list || []
        if (res.list.length) {
          this.batchId = res.list[0].id
        }
      })
    },
    loadDepartmentList () {
      departmentapi.getBudgetDepartmentDataList().then(res => {
        this.statsData.departmentList = res.list || []
      })
    },
    loadStatsDetail () {
      if (this.batchId) {
        let param = { batchId: this.batchId }
        this.loading = true
        this.tableData = []
        api.getStatsBySummary(param).then(res => {
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
      let headerBatchIds = this.statsData.departmentList.map(item => item.id)
      headerBatchIds.forEach(headerKey => {
        obj[headerKey] = obj[headerKey] || 0
      })
    },
    handleIncomeList () {
      this.tableData.push({ name: '收入', cellClassName: { name: 'row-text-center' } })
      let totalObj = { name: '收入合计', summary: 0, cellClassName: { name: 'row-text-center' } }
      this.handleDefaultVal(totalObj)

      let dics = []
      this.statsData.incomeList.forEach(item => {
        let dicItem = dics.find(ditem => ditem.category === item.category)
        if (!dicItem) {
          dicItem = item
          dics.push(item)
        }
        if (totalObj[item.departmentId]) {
          totalObj[item.departmentId] += item.amount
        } else {
          totalObj[item.departmentId] = item.amount
        }

        dicItem[item.departmentId] = item.amount
      })
      console.log('dic==', dics)
      let headerIds = this.statsData.departmentList.map(item => item.id)
      dics.forEach(item => {
        let obj = { type: '收入', summary: 0, name: item.category }
        headerIds.forEach(headerKey => {
          obj[headerKey] = item[headerKey] || 0
          obj.summary += obj[headerKey]
        })
        obj.cellClassName = {}
        obj.cellClassName['name'] = 'row-text-right'
        this.tableData.push(obj)

        totalObj.summary += obj.summary
      })

      this.tableData.push(totalObj)
    },
    handleSpendingList () {
      this.tableData.push({ name: '支出', cellClassName: { name: 'row-text-center' } })
      let itemObj1 = { type: '支出', summary: 0, name: '人员费', cellClassName: { name: 'row-text-right' } }
      let itemObj2 = { type: '支出', summary: 0, name: '办公费', cellClassName: { name: 'row-text-right' } }
      let itemObj3 = { type: '支出', summary: 0, name: '设备费', cellClassName: { name: 'row-text-right' } }
      let itemObj4 = { type: '支出', summary: 0, name: '交通费', cellClassName: { name: 'row-text-right' } }
      let itemObj5 = { type: '支出', summary: 0, name: '差旅费', cellClassName: { name: 'row-text-right' } }
      let itemObj6 = { type: '支出', summary: 0, name: '出国费', cellClassName: { name: 'row-text-right' } }
      let itemObj7 = { type: '支出', summary: 0, name: '水电费', cellClassName: { name: 'row-text-right' } }
      let itemObj8 = { type: '支出', summary: 0, name: '招待费', cellClassName: { name: 'row-text-right' } }
      let itemObj9 = { type: '支出', summary: 0, name: '图书费', cellClassName: { name: 'row-text-right' } }
      let itemObj10 = { type: '支出', summary: 0, name: '福利费', cellClassName: { name: 'row-text-right' } }
      let itemObj11 = { type: '支出', summary: 0, name: '其它费', cellClassName: { name: 'row-text-right' } }
      let totalObj = { name: '支出合计', summary: 0, cellClassName: { name: 'row-text-center' } }

      let headerIds = this.statsData.departmentList.map(item => item.id)
      headerIds.forEach(headerKey => {
        itemObj1[headerKey] = 0
        itemObj2[headerKey] = 0
        itemObj3[headerKey] = 0
        itemObj4[headerKey] = 0
        itemObj5[headerKey] = 0
        itemObj6[headerKey] = 0
        itemObj7[headerKey] = 0
        itemObj8[headerKey] = 0
        itemObj9[headerKey] = 0
        itemObj10[headerKey] = 0
        itemObj11[headerKey] = 0
        totalObj[headerKey] = 0
      })

      this.statsData.spendingList.forEach(item => {
        let deptId = item.departmentId
        itemObj1[deptId] = item.personFee
        itemObj2[deptId] = item.officeFee
        itemObj3[deptId] = item.equipmentFee
        itemObj4[deptId] = item.trafficFee
        itemObj5[deptId] = item.travelFee
        itemObj6[deptId] = item.overseasFee
        itemObj7[deptId] = item.electricityWaterFee
        itemObj8[deptId] = item.treatFee
        itemObj9[deptId] = item.bookFee
        itemObj10[deptId] = item.welfareFee
        itemObj11[deptId] = item.otherFee

        itemObj1.summary += itemObj1[deptId]
        itemObj2.summary += itemObj2[deptId]
        itemObj3.summary += itemObj3[deptId]
        itemObj4.summary += itemObj4[deptId]
        itemObj5.summary += itemObj5[deptId]
        itemObj6.summary += itemObj6[deptId]
        itemObj7.summary += itemObj7[deptId]
        itemObj8.summary += itemObj8[deptId]
        itemObj9.summary += itemObj9[deptId]
        itemObj10.summary += itemObj10[deptId]
        itemObj11.summary += itemObj11[deptId]

        if (!totalObj[deptId]) {
          totalObj[deptId] = 0
        }
        totalObj[deptId] += itemObj1[deptId]
        totalObj[deptId] += itemObj2[deptId]
        totalObj[deptId] += itemObj3[deptId]
        totalObj[deptId] += itemObj4[deptId]
        totalObj[deptId] += itemObj5[deptId]
        totalObj[deptId] += itemObj6[deptId]
        totalObj[deptId] += itemObj7[deptId]
        totalObj[deptId] += itemObj8[deptId]
        totalObj[deptId] += itemObj9[deptId]
        totalObj[deptId] += itemObj10[deptId]
        totalObj[deptId] += itemObj11[deptId]

        totalObj.summary += itemObj1.summary
        totalObj.summary += itemObj2.summary
        totalObj.summary += itemObj3.summary
        totalObj.summary += itemObj4.summary
        totalObj.summary += itemObj5.summary
        totalObj.summary += itemObj6.summary
        totalObj.summary += itemObj7.summary
        totalObj.summary += itemObj8.summary
        totalObj.summary += itemObj9.summary
        totalObj.summary += itemObj10.summary
        totalObj.summary += itemObj11.summary
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
      let otherTotalObj = { name: '其它经费数', summary: 0, cellClassName: { name: 'row-text-center' } }
      let applyTotalObj = { name: '预算申请数', summary: 0, cellClassName: { name: 'row-text-center' } }
      let netTotalObj = { name: '结余数', summary: 0, cellClassName: { name: 'row-text-center' } }
      this.handleDefaultVal(otherTotalObj)
      this.handleDefaultVal(applyTotalObj)
      this.handleDefaultVal(netTotalObj)

      let incomeTotal = this.tableData.find(item => item.name === '收入合计')
      let spendingTotal = this.tableData.find(item => item.name === '支出合计')
      let headerIds = this.statsData.departmentList.map(item => item.id)
      headerIds.forEach(headerKey => {
        netTotalObj[headerKey] = incomeTotal[headerKey] - spendingTotal[headerKey]
      })

      this.statsData.mainList.forEach(item => {
        let deptId = item.budgetDepartmentId
        if (otherTotalObj[deptId]) {
          otherTotalObj[deptId] += item.otherAmount
        } else {
          otherTotalObj[deptId] = item.otherAmount
        }

        if (applyTotalObj[deptId]) {
          applyTotalObj[deptId] += item.applyAmount
        } else {
          applyTotalObj[deptId] = item.applyAmount
        }

        otherTotalObj.summary += otherTotalObj[deptId]
        applyTotalObj.summary += applyTotalObj[deptId]
      })

      this.tableData.push(otherTotalObj)
      this.tableData.push(applyTotalObj)
      this.tableData.push(netTotalObj)
    },
    rowClassName (row, index) {
      let names = ['收入合计', '支出合计', '其它经费数', '预算申请数']
      if (names.includes(row.name)) {
        return 'stats-summary-row'
      }
      return ''
    },
    showDepartmentStats (deptId) {
      this.$refs.budgetdttail.init(this.batchId, deptId)
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: '预算填报汇总表'
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
