<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="90" class="search-form">
          <Form-item label="部门" prop="salaryDepartmentId" v-if="departmentList.length > 0">
            <Select v-model="searchForm.salaryDepartmentId" :clearable="true" @on-change="handleSearch" placeholder="请选择" style="width: 170px">
              <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="年月" prop="payYearMonth">
            <Select v-model="searchForm.payYearMonth" placeholder="请选择" style="width: 170px">
              <Option v-for="(item,index) in yearMonthList" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="工作日数量">
            {{searchForm.workDays}}
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button @click="exportSalaryPay" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="regular">
              <Tag :color="row.regular ? 'success' : 'default'">{{row.regular ? '已转正' : '未转正'}}</Tag>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total></Page>
        </Row>
      </Card>
  </div>
</template>

<script>
import api from '@/api/salary/salarypay'
// import staffApi from '@/api/salary/salarystaff'
import { dateAdds, getFormateDateTime, exportExcel } from '@/libs/util'
export default {
  name: 'SalaryPayQuery-manage',
  data () {
    return {
      loading: true,
      exportLoading: false,
      batchLoading1: false,
      batchLoading2: false,
      selectedList: [],
      departmentList: [],
      yearMonthList: [],
      staffList: [],
      searchForm: {
        page: 1,
        limit: 200,
        salaryDepartmentId: null,
        payYearMonth: null,
        workDays: 0
      },
      pageData: {
        totalCount: 0,
        list: []
      },
      columns: [
        {
          key: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '部门名称',
          key: 'departmentName',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '员工姓名',
          key: 'salaryStaffName',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '员工证件号',
          key: 'salaryStaffCode',
          minWidth: 110,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '工资年月',
          key: 'payYearMonth',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '税前工资合计',
          key: 'pretaxTotal',
          minWidth: 130
        },
        {
          title: '基本工资合计',
          key: 'baseTotalAmount',
          minWidth: 130
        },
        {
          title: '绩效工资',
          key: 'performanceAmount',
          minWidth: 100
        },
        {
          title: '基本工资',
          key: 'baseAmount',
          minWidth: 100
        },
        {
          title: '是否转正',
          slot: 'regular',
          minWidth: 100
        },
        {
          title: '试用期扣款',
          key: 'probationDeductionAmount',
          minWidth: 100
        },
        {
          title: '工龄工资',
          key: 'ageAmount',
          minWidth: 100
        },
        {
          title: '事假',
          key: 'personalLeaveCount',
          minWidth: 70
        },
        {
          title: '病假',
          key: 'sickLeaveCount',
          minWidth: 70
        },
        {
          title: '产假',
          key: 'maternityLeaveCount',
          minWidth: 70
        },
        {
          title: '调休',
          key: 'overtimeCompensationCount',
          minWidth: 70
        },
        {
          title: '考勤扣款',
          key: 'attendanceDeductionAmount',
          minWidth: 100
        },
        {
          title: '加班补助',
          key: 'overtimeAmount',
          minWidth: 100
        },
        {
          title: '餐补',
          key: 'mealAmount',
          minWidth: 100
        },
        {
          title: '其它奖励',
          key: 'otherBonusAmount',
          minWidth: 100
        },
        {
          title: '其它扣款',
          key: 'otherDeductionAmount',
          minWidth: 100
        },
        {
          title: '备注',
          key: 'memo',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        }
      ]
    }
  },
  watch: {
    'searchForm.payYearMonth': {
      immediate: true,
      handler () {
        this.loadWorkDays()
      }
    },
    'searchForm.salaryDepartmentId': {
      immediate: true,
      handler () {
        this.loadStaffList()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getSalaryPayList()
      this.adjustTableHeight()
      this.initYearMonthList()
      this.loadDepartmentList()
    },
    initYearMonthList () {
      let now = new Date()
      for (let i = 0; i < 5; i++) {
        let label = getFormateDateTime(now, 'yyyy年MM月')
        let value = parseInt(getFormateDateTime(now, 'yyyyMM'))
        this.yearMonthList.push({
          label: label,
          value: value
        })

        now = dateAdds('M ', 1, now)
      }
      this.searchForm.payYearMonth = this.yearMonthList[0].value
    },
    loadDepartmentList () {
      api.getSalaryDepartmentDataList().then(res => {
        this.departmentList = res.list
        if (this.departmentList.length === 1) {
          this.searchForm.salaryDepartmentId = this.departmentList[0].id
        }
      })
    },
    loadWorkDays () {
      if (!this.searchForm.payYearMonth) {
        return false
      }
      let param = {
        payYearMonth: this.searchForm.payYearMonth
      }
      api.getSalaryWorkDays(param).then(res => {
        this.searchForm.workDays = res.data.count
      })
    },
    loadStaffList () {
      if (!this.searchForm.salaryDepartmentId) {
        return false
      }
      let param = {
        salaryDepartmentId: this.searchForm.salaryDepartmentId
      }
      api.getSalaryStaffDataList(param).then(res => {
        this.staffList = res.list
      })
    },
    handleUpdate () {
      this.getSalaryPayList()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSalaryPayList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSalaryPayList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSalaryPayList () {
      this.loading = true
      api.getSalaryPayList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.pageData.list.forEach((item, index) => {
          item.index = index + 1
        })
        this.adjustTableHeight()
      })
    },
    exportSalaryPay () {
      exportExcel({
        original: false,
        filename: '工资列表',
        table: this.$refs.table
      })
    },
    addSalaryPay () {
      this.$refs.salaryPayForm.addSalaryPay()
    },
    editSalaryPay (v) {
      this.$refs.salaryPayForm.editSalaryPay(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    }
  }
}
</script>
