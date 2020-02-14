<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="名称" prop="name">
            <Input type="text" v-model="searchForm.name" clearable placeholder="请输入名称" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('salary:salarydepartment:save')" @click="addSalaryDepartment" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('salary:salarydepartment:delete')" :disabled="selectedList.length === 0" @click="deleteSalaryDepartment()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportSalaryDepartment" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('salary:salarydepartment:info')"   type="primary" size="small" @click="viewSalaryDepartment(row)">查看</Button>
                <Button v-if="isAuth('salary:salarydepartment:update')" type="primary" size="small" @click="editSalaryDepartment(row)">编辑</Button>
                <Button v-if="isAuth('salary:salarydepartment:delete')" type="error"   size="small" @click="deleteSalaryDepartment(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <SalaryDepartmentForm ref="salaryDepartmentForm" @update="getSalaryDepartmentList" />
      <SalaryDepartmentView ref="salaryDepartmentView" />
  </div>
</template>

<script>
import api from '@/api/salary/salarydepartment'
import SalaryDepartmentForm from './components/salarydepartment-form'
import SalaryDepartmentView from './components/salarydepartment-view'
export default {
  name: 'SalaryDepartment-manage',
  components: { SalaryDepartmentForm, SalaryDepartmentView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
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
          title: '部门名称',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '负责人证件号',
          key: 'operCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '负责人姓名',
          key: 'operName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 150
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getSalaryDepartmentList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSalaryDepartmentList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSalaryDepartmentList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSalaryDepartmentList () {
      this.loading = true
      api.getSalaryDepartmentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportSalaryDepartment () {
      this.$refs.table.exportCsv({
        filename: '工资部门列表'
      })
    },
    addSalaryDepartment () {
      this.$refs.salaryDepartmentForm.addSalaryDepartment()
    },
    viewSalaryDepartment (v) {
      this.$refs.salaryDepartmentView.viewSalaryDepartment(v.id)
    },
    editSalaryDepartment (v) {
      this.$refs.salaryDepartmentForm.editSalaryDepartment(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteSalaryDepartment (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteSalaryDepartment(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
