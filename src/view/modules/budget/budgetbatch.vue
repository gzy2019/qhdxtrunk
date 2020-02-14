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
                    <Button v-if="isAuth('budget:budgetbatch:save')" @click="addBudgetBatch" type="primary" icon="md-add">新增</Button>
                    <Button v-if="isAuth('budget:budgetbatch:delete')" :disabled="selectedList.length === 0" @click="deleteBudgetBatch()" type="primary" icon="ios-trash-outline">删除</Button>
                    <Button @click="exportBudgetBatch" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('budget:budgetbatch:info')"   type="primary" size="small" @click="viewBudgetBatch(row)">查看</Button>
                            <Button v-if="isAuth('budget:budgetbatch:update')" type="primary" size="small" @click="editBudgetBatch(row)">编辑</Button>
                            <Button v-if="isAuth('budget:budgetbatch:delete')" type="error"   size="small" @click="deleteBudgetBatch(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <BudgetBatchForm ref="budgetBatchForm" @update="getBudgetBatchList" />
        <BudgetBatchView ref="budgetBatchView" />
    </div>
</template>

<script>
import api from '@/api/budget/budgetbatch'
import BudgetBatchForm from './components/budgetbatch-form'
import BudgetBatchView from './components/budgetbatch-view'
export default {
  name: 'BudgetBatch-manage',
  components: { BudgetBatchForm, BudgetBatchView },
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
          title: '批次名称',
          key: 'name',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '年度',
          key: 'year',
          minWidth: 80,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '开始时间',
          key: 'beginTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '结束时间',
          key: 'endTime',
          minWidth: 120,
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
      this.getBudgetBatchList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getBudgetBatchList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getBudgetBatchList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getBudgetBatchList () {
      this.loading = true
      api.getBudgetBatchList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportBudgetBatch () {
      this.$refs.table.exportCsv({
        filename: '预算批次列表'
      })
    },
    addBudgetBatch () {
      this.$refs.budgetBatchForm.addBudgetBatch()
    },
    viewBudgetBatch (v) {
      this.$refs.budgetBatchView.viewBudgetBatch(v.id)
    },
    editBudgetBatch (v) {
      this.$refs.budgetBatchForm.editBudgetBatch(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteBudgetBatch (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteBudgetBatch(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
