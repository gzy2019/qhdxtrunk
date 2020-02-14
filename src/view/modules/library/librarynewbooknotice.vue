<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="分类" prop="bookType">
            <Input type="text" v-model="searchForm.bookType" clearable placeholder="请输入分类" style="width: 180px" />
          </Form-item>
          <Form-item label="书名" prop="bookName">
            <Input type="text" v-model="searchForm.bookName" clearable placeholder="请输入书名" style="width: 180px" />
          </Form-item>
          <Form-item label="作者" prop="author">
            <Input type="text" v-model="searchForm.author" clearable placeholder="请输入作者" style="width: 180px" />
          </Form-item>
          <Form-item label="出版社" prop="publishers">
            <Input type="text" v-model="searchForm.publishers" clearable placeholder="请输入出版社" style="width: 180px" />
          </Form-item>
          <Form-item style="margin-left: -60px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('library:librarynewbooknotice:save')" @click="addLibraryNewbookNotice" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('library:librarynewbooknotice:delete')" :disabled="selectedList.length === 0" @click="deleteLibraryNewbookNotice()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportLibraryNewbookNotice" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('library:librarynewbooknotice:info')"   type="primary" size="small" @click="viewLibraryNewbookNotice(row)">查看</Button>
                <Button v-if="isAuth('library:librarynewbooknotice:update')" type="primary" size="small" @click="editLibraryNewbookNotice(row)">编辑</Button>
                <Button v-if="isAuth('library:librarynewbooknotice:delete')" type="error"   size="small" @click="deleteLibraryNewbookNotice(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <LibraryNewbookNoticeForm ref="libraryNewbookNoticeForm" @on-save="handleSearch" @on-update="getLibraryNewbookNoticeList" />
      <LibraryNewbookNoticeView ref="libraryNewbookNoticeView" />
  </div>
</template>

<script>
import api from '@/api/library/librarynewbooknotice'
import LibraryNewbookNoticeForm from './components/librarynewbooknotice-form'
import LibraryNewbookNoticeView from './components/librarynewbooknotice-view'
export default {
  name: 'LibraryNewbookNotice-manage',
  components: { LibraryNewbookNoticeForm, LibraryNewbookNoticeView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        bookName: undefined,
        author: undefined,
        publishers: undefined,
        bookType: undefined
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
          title: '分类',
          key: 'bookType',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '副本数',
          key: 'numberOfCopies',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
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
      this.getLibraryNewbookNoticeList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getLibraryNewbookNoticeList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getLibraryNewbookNoticeList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getLibraryNewbookNoticeList () {
      this.loading = true
      api.getLibraryNewbookNoticeList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportLibraryNewbookNotice () {
      this.$refs.table.exportCsv({
        filename: '新书通知列表'
      })
    },
    addLibraryNewbookNotice () {
      this.$refs.libraryNewbookNoticeForm.addLibraryNewbookNotice()
    },
    viewLibraryNewbookNotice (v) {
      this.$refs.libraryNewbookNoticeView.viewLibraryNewbookNotice(v.id)
    },
    editLibraryNewbookNotice (v) {
      this.$refs.libraryNewbookNoticeForm.editLibraryNewbookNotice(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteLibraryNewbookNotice (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteLibraryNewbookNotice(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
