<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="提交人" prop="createUser">
            <Input type="text" v-model="searchForm.createUser" clearable placeholder="请输入提交人" style="width: 170px" />
          </Form-item>
          <Form-item label="适用课程" prop="courseName">
            <Input type="text" v-model="searchForm.courseName" clearable placeholder="请输入适用课程" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('cases:caseclue:save')" @click="addCaseClue" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('cases:caseclue:delete')" :disabled="selectedList.length === 0" @click="deleteCaseClue()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportCaseClue" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('cases:caseclue:update')" type="primary" size="small" @click="editCaseClue(row)">编辑</Button>
                <Button v-if="isAuth('cases:caseclue:update')" type="primary" size="small" @click="commentCaseClue(row)">回复</Button>
                <Button v-if="isAuth('cases:caseclue:delete')" type="error"   size="small" @click="deleteCaseClue(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <CaseClueForm ref="caseClueForm" @update="getCaseClueList" />
      <CaseClueView ref="caseClueView" />
  </div>
</template>

<script>
import api from '@/api/cases/caseclue'
import CaseClueForm from './components/caseclue-form'
import CaseClueView from './components/caseclue-view'
export default {
  name: 'CaseClue-manage',
  components: { CaseClueForm, CaseClueView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        createUser: '',
        courseName: ''
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
          title: '适用课程',
          key: 'courseName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '线索',
          key: 'clueInfo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '提交人',
          key: 'createUser',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '线索回复',
          key: 'comment',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '回复时间',
          key: 'commentTime',
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
      this.getCaseClueList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseClueList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseClueList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getCaseClueList () {
      this.loading = true
      api.getCaseClueList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportCaseClue () {
      this.$refs.table.exportCsv({
        filename: '案例线索表列表'
      })
    },
    addCaseClue () {
      this.$refs.caseClueForm.addCaseClue()
    },
    viewCaseClue (v) {
      this.$refs.caseClueView.viewCaseClue(v.id)
    },
    editCaseClue (v) {
      this.$refs.caseClueForm.editCaseClue(v.id)
    },
    commentCaseClue (v) {
      this.$refs.caseClueForm.commentCaseClue(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteCaseClue (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseClue(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
