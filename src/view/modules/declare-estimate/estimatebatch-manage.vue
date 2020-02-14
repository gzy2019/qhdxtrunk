<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="标题" prop="batchTitle">
          <Input type="text" v-model="searchForm.batchTitle" clearable placeholder="请输入标题" style="width: 170px" />
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
      	<i-Col span="24">
          <Button v-if="isAuth('declare:estimatebatch:save')" @click="addEstimateBatch" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('declare:estimatebatch:delete')" :disabled="selectedList.length === 0" @click="deleteEstimateBatch()" type="primary" icon="ios-trash-outline">删除</Button>
          <Button @click="exportEstimateBatch" v-if="false" type="primary" icon="ios-download-outline">导出</Button>
        </i-Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="batchOpenFlag">
            <Tag :color="`${row.batchOpenFlag ? 'primary' : 'error' }`">{{ row.batchOpenFlag ? '打开' : '关闭' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="action">
            <ButtonGroup>
              <Button v-if="isAuth('declare:estimatebatch:info')"   type="primary" size="small" @click="viewEstimateBatch(row)">查看</Button>
              <Button v-if="isAuth('declare:estimatebatch:update')" type="primary" size="small" @click="editEstimateBatch(row)">编辑</Button>
              <Button v-if="isAuth('declare:estimatebatch:delete')" type="error"   size="small" @click="deleteEstimateBatch(row)">删除</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

	<EstimateBatchForm ref="estimateBatchForm" @update="getEstimateBatchList" />
  </div>
</template>

<script>
import api from '@/api/declare-estimate/estimatebatch'
import EstimateBatchForm from './estimatebatch-form'
export default {
  name: 'EstimateBatch-manage',
  components: { EstimateBatchForm },
  data () {
    return {
      loading: true,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        batchTitle: ''
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
          title: '申报标题',
          key: 'batchTitle',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生开始时间',
          key: 'studentStartTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生结束时间',
          key: 'studentEndTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '老师开始时间',
          key: 'teacherStartTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '老师结束时间',
          key: 'teacherEndTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否开放',
          slot: 'batchOpenFlag',
          minWidth: 100
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
      this.getEstimateBatchList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getEstimateBatchList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getEstimateBatchList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getEstimateBatchList () {
      this.loading = true
      api.getEstimateBatchList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportEstimateBatch () {
      this.$refs.table.exportCsv({
        filename: '三助评估批次列表'
      })
    },
    addEstimateBatch () {
      this.$refs.estimateBatchForm.addEstimateBatch()
    },
    viewEstimateBatch (v) {
      this.$refs.estimateBatchForm.viewEstimateBatch(v.id)
    },
    editEstimateBatch (v) {
      this.$refs.estimateBatchForm.editEstimateBatch(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteEstimateBatch (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteEstimateBatch(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
