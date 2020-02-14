<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="部门" prop="salaryDepartmentId">
            <Select v-model="searchForm.salaryDepartmentId" :clearable="true" @on-change="handleSearch" placeholder="请选择" style="width: 170px">
              <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="年月" prop="payYearMonth">
            <Select v-model="searchForm.payYearMonth" placeholder="请选择" style="width: 170px">
              <Option v-for="(item,index) in yearMonthList" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          </Form-item>
        </Form>
        <Alert type="success" style="font-size: 1em">
          <p>
            <div style="display:inline-block;width: 240px;">年度绩效工资累计：{{configInfo.curYearAmount}}</div>
            <div style="display:inline-block;">年度绩效工资限额：{{configInfo.yearMax}} </div>
          </p>
          <p>
            <div style="display:inline-block;width: 240px;">月度绩效工资合计：{{configInfo.curMonthAmount}}</div>
            <div style="display:inline-block;">月度绩效工资限额：{{configInfo.monthMax}}</div>
          </p>
        </Alert>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('salary:salarypay:save')" :loading="batchLoading1" @click="generate" type="primary" icon="md-add">一键生成</Button>
            <Button v-if="isAuth('salary:salarypay:update')" :loading="batchLoading2"  @click="batchStatus" type="primary" icon="md-create">批量提交</Button>
            <Button v-if="isAuth('salary:salarypay:delete')" :disabled="selectedList.length === 0" @click="deleteSalaryPay()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportSalaryPay" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="status">
              <Tag :color="row.performanceStatus === 0 ? 'default' : 'success'">{{row.performanceStatus === 0 ? '未提交' : '已提交'}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('salary:salarypay:update') && row.performanceStatus === 0" type="primary" size="small" @click="editSalaryPay(row)">编辑</Button>
                <Button v-if="isAuth('salary:salarypay:delete') && row.performanceStatus === 0" type="error"   size="small" @click="deleteSalaryPay(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total></Page>
        </Row>
      </Card>

      <SalaryPerformanceForm ref="salaryPayForm" @update="handleUpdate" />
  </div>
</template>

<script>
import api from '@/api/salary/salarypay'
import SalaryPerformanceForm from './components/salaryperformance-form'
import { dateAdds, getFormateDateTime } from '@/libs/util'
export default {
  name: 'SalaryPay-manage',
  components: { SalaryPerformanceForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      batchLoading1: false,
      batchLoading2: false,
      selectedList: [],
      departmentList: [],
      yearMonthList: [],
      configInfo: {},
      searchForm: {
        page: 1,
        limit: 200,
        salaryDepartmentId: null,
        payYearMonth: null
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
          title: '部门名称',
          key: 'departmentName',
          minWidth: 110,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '员工姓名',
          key: 'salaryStaffName',
          minWidth: 100,
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
          title: '绩效工资',
          key: 'performanceAmount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '提交状态',
          slot: 'status',
          minWidth: 100
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 100
        }
      ]
    }
  },
  watch: {
    'searchForm.salaryDepartmentId': {
      immediate: true,
      handler () {
        this.loadConfigInfo()
      }
    },
    'searchForm.payYearMonth': {
      immediate: true,
      handler () {
        this.loadConfigInfo()
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
    loadConfigInfo () {
      if (!this.searchForm.salaryDepartmentId || !this.searchForm.payYearMonth) {
        return false
      }
      let params = {
        departmentId: this.searchForm.salaryDepartmentId,
        yearMonth: this.searchForm.payYearMonth
      }

      api.getSalaryConfigInfo(params).then(res => {
        this.configInfo = res.data || {}
      })
    },
    handleUpdate () {
      this.loadConfigInfo()
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
        this.adjustTableHeight()
      })
    },
    exportSalaryPay () {
      this.$refs.table.exportCsv({
        filename: '工资管理列表'
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
    },
    generate () {
      if (!this.searchForm.salaryDepartmentId || !this.searchForm.payYearMonth) {
        this.$Message.error('请选择部门和年月')
        return false
      }
      let params = {
        departmentId: this.searchForm.salaryDepartmentId,
        payYearMonth: this.searchForm.payYearMonth
      }
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>一键生成将对部门下所有在职员工生成工资记录，您确定执行此操作吗?</p>`,
        onOk: () => {
          this.batchLoading1 = true
          api.generateSalaryPay(params).then(res => {
            this.$Message.success('生成完毕!')
            this.handleSearch()
          }).finally(() => {
            this.batchLoading1 = false
          })
        }
      })
    },
    batchStatus () {
      let ids = this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定提交${ids.length + '条记录'}吗?</p>`,
        onOk: () => {
          this.batchLoading2 = true
          api.batchUpdateStatus1(ids).then(res => {
            this.$Message.success('提交成功!')
            this.handleSearch()
          }).finally(() => {
            this.batchLoading2 = false
          })
        }
      })
    },
    deleteSalaryPay (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteSalaryPay(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
