<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="姓名" prop="teacherName">
            <Input type="text" v-model="searchForm.teacherName" clearable placeholder="请输入姓名" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('salary:salarystaff:save')" @click="addSalaryStaff" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('salary:salarystaff:delete')" :disabled="selectedList.length === 0" @click="deleteSalaryStaff()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportSalaryStaff" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="status">
              <Tag :color="row.status === 1 ? 'primary' : 'warning'">{{row.statusInfo}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('salary:salarystaff:info')"   type="primary" size="small" @click="viewSalaryStaff(row)">查看</Button>
                <Button v-if="isAuth('salary:salarystaff:update')" type="primary" size="small" @click="editSalaryStaff(row)">编辑</Button>
                <Button v-if="isAuth('salary:salarystaff:delete')" type="error"   size="small" @click="deleteSalaryStaff(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <SalaryStaffForm ref="salaryStaffForm" @update="getSalaryStaffList" />
      <SalaryStaffView ref="salaryStaffView" />
  </div>
</template>

<script>
import api from '@/api/salary/salarystaff'
import SalaryStaffForm from './components/salarystaff-form'
import SalaryStaffView from './components/salarystaff-view'
export default {
  name: 'SalaryStaff-manage',
  components: { SalaryStaffForm, SalaryStaffView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        teacherName: ''
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
          title: '姓名',
          key: 'teacherName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '证件号',
          key: 'teacherCode',
          minWidth: 110,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '入职时间',
          key: 'hiredate',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '在职状态',
          slot: 'status',
          minWidth: 100
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
      this.getSalaryStaffList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSalaryStaffList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSalaryStaffList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSalaryStaffList () {
      this.loading = true
      api.getSalaryStaffList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportSalaryStaff () {
      this.$refs.table.exportCsv({
        filename: '员工管理列表'
      })
    },
    addSalaryStaff () {
      this.$refs.salaryStaffForm.addSalaryStaff()
    },
    viewSalaryStaff (v) {
      this.$refs.salaryStaffView.viewSalaryStaff(v.id)
    },
    editSalaryStaff (v) {
      this.$refs.salaryStaffForm.editSalaryStaff(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteSalaryStaff (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteSalaryStaff(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
