<template>
  <div class="search">
    <Card>
        <Row>
          <Col span="12" offset="8">
            <span>{{curDept.name}}工资限额设置</span>
          </Col>
        </Row>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('salary:salaryconfig:save')" @click="addSalaryConfig" type="primary" icon="md-add">新增</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('salary:salaryconfig:update') && row.year >= curYear" type="primary" size="small" @click="editSalaryConfig(row)">编辑</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <SalaryConfigForm ref="salaryConfigForm" @update="getSalaryConfigList" />
  </div>
</template>

<script>
import api from '@/api/salary/salaryconfig'
import SalaryConfigForm from './components/salaryconfig-form'
export default {
  name: 'SalaryConfig-manage',
  components: { SalaryConfigForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      curDept: {},
      curYear: 0,
      searchForm: {
        page: 1,
        limit: 10,
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
          title: '年度',
          key: 'year',
          align: 'center',
          minWidth: 100
        },
        {
          title: '年度绩效工资限额',
          key: 'yearMax',
          align: 'center',
          minWidth: 210
        },
        {
          title: '月度绩效工资限额',
          key: 'monthMax',
          align: 'center',
          minWidth: 210
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
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.curYear = new Date().getFullYear()
      this.getSalaryConfigList()
      this.adjustTableHeight()
      this.loadDepartmentList()
    },
    loadDepartmentList () {
      api.getSalaryDepartmentDataList().then(res => {
        if (res.list.length === 1) {
          this.curDept = res.list[0]
        }
      })
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSalaryConfigList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSalaryConfigList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSalaryConfigList () {
      this.loading = true
      api.getSalaryConfigList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    addSalaryConfig () {
      this.$refs.salaryConfigForm.addSalaryConfig()
    },
    editSalaryConfig (v) {
      this.$refs.salaryConfigForm.editSalaryConfig(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    }
  }
}
</script>
