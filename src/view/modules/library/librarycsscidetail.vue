<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="期刊名称" prop="cssciName">
            <Input type="text" v-model="searchForm.cssciName" clearable placeholder="请输入期刊名称" style="width: 160px" />
          </Form-item>
          <Form-item label="期刊号" prop="cssciNum">
            <Input type="text" v-model="searchForm.cssciNum" clearable placeholder="请输入期刊号" style="width: 160px" />
          </Form-item>
          <Form-item label="期刊年" prop="cssciTime">
           <IDatePicker type="daterange" clearable split-panels v-model="searchForm.dateRange" format="yyyy-MM-dd" placeholder="请输入期刊年" sty/>
          </Form-item>
          <Form-item style="margin-left: -60px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('library:librarycsscidetail:save')" @click="addLibraryCssciDetail" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('library:librarycsscidetail:delete')" :disabled="selectedList.length === 0" @click="deleteLibraryCssciDetail()" type="primary" icon="ios-trash-outline">删除</Button>
            <!-- <Button @click="importData" type="primary" icon="ios-cloud-upload-outline">导入</Button> -->
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('library:librarycsscidetail:info')"   type="primary" size="small" @click="viewLibraryCssciDetail(row)">查看</Button>
                <Button v-if="isAuth('library:librarycsscidetail:update')" type="primary" size="small" @click="editLibraryCssciDetail(row)">编辑</Button>
                <Button v-if="isAuth('library:librarycsscidetail:delete')" type="error"   size="small" @click="deleteLibraryCssciDetail(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <LibraryCssciDetailForm ref="libraryCssciDetailForm" @on-save="handleSearch" @on-update="getLibraryCssciDetailList" />
      <LibraryCssciDetailView ref="libraryCssciDetailView" />

  </div>
</template>

<script>
import api from '@/api/library/librarycsscidetail'
import IDatePicker from '@/view/components/idate-picker'
import LibraryCssciDetailForm from './components/librarycsscidetail-form'
import LibraryCssciDetailView from './components/librarycsscidetail-view'

export default {
  name: 'LibraryCssciDetail-manage',
  components: { LibraryCssciDetailForm, LibraryCssciDetailView, IDatePicker },
  data () {
    return {
      loading: true,
      exportLoading: false,
      modalImport: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        cssciName: undefined,
        dateRange: [],
        cssciTitleId: undefined
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
          title: '期刊名称',
          key: 'cssciName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '期刊年',
          key: 'cssciTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '期刊号',
          key: 'cssciNum',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '摘要',
          key: 'abstract1',
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
      this.getLibraryCssciDetailList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getLibraryCssciDetailList()
      console.log(this.searchForm.cssciTime, '111')
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getLibraryCssciDetailList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.searchForm.dateRange = []
      this.handleSearch()
    },
    getLibraryCssciDetailList () {
      this.loading = true
      let cssciTitleId = this.$route.params.cssciTitleId
      this.searchForm.cssciTitleId = cssciTitleId
      console.log(this.searchForm, '222')
      api.getLibraryCssciDetailList(this.searchForm).then(res => {
        this.loading = false

        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportLibraryCssciDetail () {
      this.$refs.table.exportCsv({
        filename: '期刊详细信息列表'
      })
    },
    addLibraryCssciDetail () {
      this.$refs.libraryCssciDetailForm.addLibraryCssciDetail()
    },
    viewLibraryCssciDetail (v) {
      this.$refs.libraryCssciDetailView.viewLibraryCssciDetail(v.id)
    },
    editLibraryCssciDetail (v) {
      this.$refs.libraryCssciDetailForm.editLibraryCssciDetail(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteLibraryCssciDetail (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteLibraryCssciDetail(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
