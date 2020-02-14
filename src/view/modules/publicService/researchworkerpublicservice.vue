<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="服务名称" prop="serviceName">
            <Input type="text" v-model="searchForm.serviceName" clearable placeholder="请输入名称" style="width: 200px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('publicService:researchworkerpublicservice:save')" @click="addResearchworkerPublicservice" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('publicService:researchworkerpublicservice:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerPublicservice()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerPublicservice" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button type="primary" size="small" @click="viewResearchworkerPublicservice(row)">查看</Button>
                <Button type="primary" size="small" @click="editResearchworkerPublicservice(row)">编辑</Button>
                <Button type="error"   size="small" @click="deleteResearchworkerPublicservice(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerPublicserviceForm ref="researchworkerPublicserviceForm" @on-save="handleSearch" @on-update="getResearchworkerPublicserviceList" />
      <ResearchworkerPublicserviceView ref="researchworkerPublicserviceView" />
  </div>
</template>

<script>
import api from '@/api/publicService/researchworkerpublicservice'
import ResearchworkerPublicserviceForm from './components/researchworkerpublicservice-form'
import ResearchworkerPublicserviceView from './components/researchworkerpublicservice-view'
export default {
  name: 'ResearchworkerPublicservice-manage',
  components: { ResearchworkerPublicserviceForm, ResearchworkerPublicserviceView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        serviceName: undefined
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
          title: '服务名称',
          key: 'serviceName',
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
      this.getResearchworkerPublicserviceList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerPublicserviceList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerPublicserviceList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getResearchworkerPublicserviceList () {
      this.loading = true
      api.getResearchworkerPublicserviceList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerPublicservice () {
      this.$refs.table.exportCsv({
        filename: '公共服务批批次列表'
      })
    },
    addResearchworkerPublicservice () {
      this.$refs.researchworkerPublicserviceForm.addResearchworkerPublicservice()
    },
    viewResearchworkerPublicservice (v) {
      this.$refs.researchworkerPublicserviceView.viewResearchworkerPublicservice(v.id)
    },
    editResearchworkerPublicservice (v) {
      this.$refs.researchworkerPublicserviceForm.editResearchworkerPublicservice(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteResearchworkerPublicservice (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerPublicservice(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
