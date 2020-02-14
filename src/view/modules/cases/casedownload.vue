<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="案例编号" prop="caseCode">
            <Input type="text" v-model="searchForm.caseCode" clearable placeholder="请输入案例编号" style="width: 180px" />
          </Form-item>
          <Form-item label="案例名称" prop="caseName">
            <Input type="text" v-model="searchForm.caseName" clearable placeholder="请输入案例名称" style="width: 180px" />
          </Form-item>
          <Form-item label="下载人" prop="username">
            <Input type="text" v-model="searchForm.username" clearable placeholder="请输入下载人姓名" style="width: 180px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group" v-if="false">
          <Col span="24">
            <Button v-if="isAuth('cases:caselibrarydownload:delete')" :disabled="selectedList.length === 0" @click="deleteCaseLibraryDownload()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportCaseLibraryDownload" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="caseName">
              {{row.caseLibrary.title}}
            </template>
            <template slot-scope="{ row }" slot="caseCode">
              {{row.caseLibrary.code}}
            </template>
            <template slot-scope="{ row }" slot="caseLang">
              {{row.caseLibrary.lang}}
            </template>
            <template slot-scope="{ row }" slot="haveMedia">
              {{row.caseLibrary.haveMedia ? '有' : '无'}}
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('cases:caselibrarydownload:delete')" type="error"   size="small" @click="deleteCaseLibraryDownload(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

  </div>
</template>

<script>
import api from '@/api/cases/caselibrarydownload'
export default {
  name: 'CaseLibraryDownload-manage',
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        caseCode: '',
        caseName: '',
        username: ''
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
          title: '案例编号',
          slot: 'caseCode',
          minWidth: 110
        },
        {
          title: '案例名称',
          slot: 'caseName',
          minWidth: 130
        },
        {
          title: '语种',
          slot: 'caseLang',
          minWidth: 90
        },
        {
          title: '多媒体',
          slot: 'haveMedia',
          minWidth: 90
        },
        {
          title: '下载人',
          key: 'username',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '下载时间',
          key: 'createTimeStr',
          minWidth: 120,
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
      this.getCaseLibraryDownloadList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseLibraryDownloadList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseLibraryDownloadList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getCaseLibraryDownloadList () {
      this.loading = true
      api.getCaseLibraryDownloadList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportCaseLibraryDownload () {
      this.$refs.table.exportCsv({
        filename: '案例下载表列表'
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteCaseLibraryDownload (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseLibraryDownload(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
