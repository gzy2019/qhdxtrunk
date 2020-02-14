<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="书名" prop="bookName">
            <Input type="text" v-model="searchForm.bookName" clearable placeholder="请输入书名" style="width: 160px" />
          </Form-item>
          <Form-item label="出版社" prop="publishers">
            <Input type="text" v-model="searchForm.publishers" clearable placeholder="请输入出版社" style="width: 160px" />
          </Form-item>
          <Form-item style="margin-left: -60px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('library:librarybookrecommend:save')" @click="addLibraryBookRecommend" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('library:librarybookrecommend:delete')" :disabled="selectedList.length === 0" @click="deleteLibraryBookRecommend()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportLibraryBookRecommend" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('library:librarybookrecommend:info')"   type="primary" size="small" @click="viewLibraryBookRecommend(row)">查看</Button>
                <Button v-if="isAuth('library:librarybookrecommend:update')" type="primary" size="small" @click="editLibraryBookRecommend(row)">编辑</Button>
                <Button v-if="isAuth('library:librarybookrecommend:delete')" type="error"   size="small" @click="deleteLibraryBookRecommend(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <LibraryBookRecommendForm ref="libraryBookRecommendForm" @on-save="handleSearch" @on-update="getLibraryBookRecommendList" />
      <LibraryBookRecommendView ref="libraryBookRecommendView" />
  </div>
</template>

<script>
import api from '@/api/library/librarybookrecommend'
import LibraryBookRecommendForm from './components/librarybookrecommend-form'
import LibraryBookRecommendView from './components/librarybookrecommend-view'
export default {
  name: 'LibraryBookRecommend-manage',
  components: { LibraryBookRecommendForm, LibraryBookRecommendView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        bookName: undefined,
        publishers: undefined
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
          title: '书名',
          key: 'bookName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '作者',
          key: 'author',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '出版社',
          key: 'publishers',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注',
          key: 'comment',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '推荐人',
          key: 'recommendName',
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
      this.getLibraryBookRecommendList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getLibraryBookRecommendList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getLibraryBookRecommendList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getLibraryBookRecommendList () {
      this.loading = true
      api.getLibraryBookRecommendList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportLibraryBookRecommend () {
      this.$refs.table.exportCsv({
        filename: '图书推荐列表'
      })
    },
    addLibraryBookRecommend () {
      this.$refs.libraryBookRecommendForm.addLibraryBookRecommend()
    },
    viewLibraryBookRecommend (v) {
      this.$refs.libraryBookRecommendView.viewLibraryBookRecommend(v.id)
    },
    editLibraryBookRecommend (v) {
      this.$refs.libraryBookRecommendForm.editLibraryBookRecommend(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteLibraryBookRecommend (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteLibraryBookRecommend(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
