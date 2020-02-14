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
import api from '@/api/schoolfellow/schoolfellowjobupdate'
export default {
  name: 'schoolfellowjobupdate',
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
          title: '工作省份',
          key: 'adsWorking',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '单位/部门',
          key: 'unit',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '岗位',
          key: 'post',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '级别',
          key: 'rank',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '工作部门性质',
          key: 'nature',
          minWidth: 120,
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
    getCaseLibraryCommentList () {
      this.loading = true
      this.searchForm.caseId = this.caseId
      api.getSchoolfellowJobupdateList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
      })
    }
  }
}
</script>
