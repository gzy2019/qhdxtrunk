<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="名称" prop="tagName">
            <Input type="text" v-model="searchForm.tagName" clearable placeholder="请输入名称" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('cases:casetag:save')" @click="addCaseTag" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('cases:casetag:delete')" :disabled="selectedList.length === 0" @click="deleteCaseTag()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportCaseTag" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="type">
              <Tag color="primary">{{row.type | typeInfo}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('cases:casetag:update')" type="primary" size="small" @click="editCaseTag(row)">编辑</Button>
                <Button v-if="isAuth('cases:casetag:delete')" type="error"   size="small" @click="deleteCaseTag(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <CaseTagForm ref="caseTagForm" @on-save="handleSearch" @on-update="getCaseTagList" />
  </div>
</template>

<script>
import api from '@/api/cases/casetag'
import CaseTagForm from './components/casetag-form'
export default {
  name: 'CaseTag-manage',
  components: { CaseTagForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        tagName: ''
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
          title: '标签名称',
          key: 'tagName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '标签类型',
          slot: 'type',
          minWidth: 100
        },
        {
          title: '累计评论数',
          key: 'comments',
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
  filters: {
    typeInfo (val) {
      if (val === 'positive') {
        return '好评'
      } else {
        return '差评'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getCaseTagList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseTagList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseTagList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getCaseTagList () {
      this.loading = true
      api.getCaseTagList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportCaseTag () {
      this.$refs.table.exportCsv({
        filename: '标签管理列表'
      })
    },
    addCaseTag () {
      this.$refs.caseTagForm.addCaseTag()
    },
    viewCaseTag (v) {
      this.$refs.caseTagView.viewCaseTag(v.id)
    },
    editCaseTag (v) {
      this.$refs.caseTagForm.editCaseTag(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteCaseTag (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseTag(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
