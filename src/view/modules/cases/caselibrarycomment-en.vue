<template>
  <div class="search">
    <Card>
        <Row>
          <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>
  </div>
</template>

<script>
import api from '@/api/cases/caselibrarycomment'
export default {
  name: 'CaseLibraryComment-manage',
  props: {
    caseId: {
      type: Number,
      required: true,
      default () {
        return 0
      }
    }
  },
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
          title: 'Positive Tag',
          key: 'positive',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Negative tag',
          key: 'negative',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Suggestion',
          key: 'memo',
          minWidth: 200,
          ellipsis: true,
          tooltip: true
        }
      ]
    }
  },
  watch: {
    caseId: {
      immediate: true,
      handler () {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.getCaseLibraryCommentList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseLibraryCommentList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseLibraryCommentList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getCaseLibraryCommentList () {
      this.loading = true
      this.searchForm.caseId = this.caseId
      api.getCaseLibraryCommentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
      })
    },
    exportCaseLibraryComment () {
      this.$refs.table.exportCsv({
        filename: '案例评论表列表'
      })
    },
    addCaseLibraryComment () {
      this.$refs.caseLibraryCommentForm.addCaseLibraryComment()
    },
    viewCaseLibraryComment (v) {
      this.$refs.caseLibraryCommentView.viewCaseLibraryComment(v.id)
    },
    editCaseLibraryComment (v) {
      this.$refs.caseLibraryCommentForm.editCaseLibraryComment(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteCaseLibraryComment (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseLibraryComment(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
