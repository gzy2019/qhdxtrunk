<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="问卷" prop="formId">
            <Select v-model="searchForm.formId" clearable @on-change="handleSearch" placeholder="请选择" style="width: 180px;">
              <Option v-for="(item,index) in formList" :key="index" :value="item.id">{{item.title}}</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('qa:qaforminst:delete')" :disabled="selectedList.length === 0" @click="deleteQaFormInst()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportQaFormInst" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('qa:qaforminst:info')"   type="primary" size="small" @click="viewQaFormInst(row)">查看</Button>
                <Button v-if="isAuth('qa:qaforminst:delete')" type="error"   size="small" @click="deleteQaFormInst(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <QaFormInstView ref="qaFormInstView" />
  </div>
</template>

<script>
import api from '@/api/qa/qaforminst'
import formApi from '@/api/qa/qaform'
import QaFormInstView from './components/qaforminst-view'
export default {
  name: 'QaFormInst-manage',
  components: { QaFormInstView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      tableHeight: 330,
      selectedList: [],
      formList: [],
      searchForm: {
        page: 1,
        limit: 10,
        formId: null
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
          title: '问卷标题',
          key: 'title',
          minWidth: 200,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '用户ID',
          key: 'userId',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '提交时间',
          key: 'createTime',
          minWidth: 150,
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
      this.getQaFormInstList()
      this.adjustTableHeight()
      this.loadFormList()
    },
    loadFormList () {
      formApi.getQaFormDataList().then(res => {
        this.formList = res.list
      })
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getQaFormInstList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getQaFormInstList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getQaFormInstList () {
      this.loading = true
      api.getQaFormInstList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportQaFormInst () {
      this.$refs.table.exportCsv({
        filename: '问卷表单实例列表'
      })
    },
    viewQaFormInst (v) {
      this.$refs.qaFormInstView.viewQaFormInst(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteQaFormInst (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteQaFormInst(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
