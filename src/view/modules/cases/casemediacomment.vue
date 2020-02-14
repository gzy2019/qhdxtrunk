<template>
  <div class="search">
    <Card>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>
  </div>
</template>

<script>
import api from '@/api/cases/casemediacomment'
export default {
  name: 'CaseMediaComment-manage',
  props: {
    mediaId: {
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
      tableHeight: 450,
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
          title: '好评标签',
          key: 'positive',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '差评标签',
          key: 'negative',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '意见反馈',
          key: 'memo',
          minWidth: 200,
          ellipsis: true,
          tooltip: true
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getCaseMediaCommentList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseMediaCommentList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseMediaCommentList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getCaseMediaCommentList () {
      this.loading = true
      this.searchForm.mediaId = this.mediaId
      api.getCaseMediaCommentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
      })
    },
    exportCaseMediaComment () {
      this.$refs.table.exportCsv({
        filename: '多媒体评论表列表'
      })
    },
    addCaseMediaComment () {
      this.$refs.caseMediaCommentForm.addCaseMediaComment()
    },
    viewCaseMediaComment (v) {
      this.$refs.caseMediaCommentView.viewCaseMediaComment(v.id)
    },
    editCaseMediaComment (v) {
      this.$refs.caseMediaCommentForm.editCaseMediaComment(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteCaseMediaComment (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseMediaComment(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
