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
                    <Button v-if="isAuth('budget:budgetdepartment:save')" @click="addBudgetDepartment" type="primary" icon="md-add">新增</Button>
                    <Button v-if="isAuth('budget:budgetdepartment:delete')" :disabled="selectedList.length === 0" @click="deleteBudgetDepartment()" type="primary" icon="ios-trash-outline">删除</Button>
                    <Button @click="exportBudgetDepartment" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="status">
                        <Tag v-if="row.status" color="primary">有效</Tag>
                        <Tag v-else color="default">无效</Tag>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('budget:budgetdepartment:info')"   type="primary" size="small" @click="viewBudgetDepartment(row)">查看</Button>
                            <Button v-if="isAuth('budget:budgetdepartment:update')" type="primary" size="small" @click="editBudgetDepartment(row)">编辑</Button>
                            <Button v-if="isAuth('budget:budgetdepartment:delete')" type="error"   size="small" @click="deleteBudgetDepartment(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <BudgetDepartmentForm ref="budgetDepartmentForm" @update="getBudgetDepartmentList" />
        <BudgetDepartmentView ref="budgetDepartmentView" />
    </div>
</template>

<script>
import api from '@/api/budget/budgetdepartment'
import BudgetDepartmentForm from './components/budgetdepartment-form'
import BudgetDepartmentView from './components/budgetdepartment-view'
export default {
  name: 'BudgetDepartment-manage',
  components: { BudgetDepartmentForm, BudgetDepartmentView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      tableHeight: 330,
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
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '部门职责',
          key: 'duty',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '填报人证件号',
          key: 'operCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '填报人姓名',
          key: 'operName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '状态',
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
      this.getBudgetDepartmentList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getBudgetDepartmentList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getBudgetDepartmentList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getBudgetDepartmentList () {
      this.loading = true
      api.getBudgetDepartmentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportBudgetDepartment () {
      this.$refs.table.exportCsv({
        filename: '预算部门列表'
      })
    },
    addBudgetDepartment () {
      this.$refs.budgetDepartmentForm.addBudgetDepartment()
    },
    viewBudgetDepartment (v) {
      this.$refs.budgetDepartmentView.viewBudgetDepartment(v.id)
    },
    editBudgetDepartment (v) {
      this.$refs.budgetDepartmentForm.editBudgetDepartment(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteBudgetDepartment (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteBudgetDepartment(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
