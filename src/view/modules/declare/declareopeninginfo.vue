<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="申报名称" prop="name">
            <Input type="text" v-model="searchForm.name" clearable placeholder="请输入申报名称" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('declare:declareopeninginfo:save')" @click="addDeclareOpeningInfo" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('declare:declareopeninginfo:delete')" :disabled="selectedList.length === 0" @click="deleteDeclareOpeningInfo()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportDeclareOpeningInfo" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('declare:declareopeninginfo:info')"   type="primary" size="small" @click="viewDeclareOpeningInfo(row)">查看</Button>
                <Button v-if="isAuth('declare:declareopeninginfo:update')" type="primary" size="small" @click="editDeclareOpeningInfo(row)">编辑</Button>
                <Button type="primary" @click="declineDeclareOpeningApply(row)" size="small">未申报</Button>
                  <Button v-if="isAuth('declare:declareopeninginfo:delete')" type="error"   size="small" @click="deleteDeclareOpeningInfo(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <DeclareOpeningInfoForm ref="declareOpeningInfoForm" @update="getDeclareOpeningInfoList" />
      <DeclareOpeningInfoView ref="declareOpeningInfoView" />
      <DeclareOpeningInfoUndeclared ref="declareOpeningInfoUndeclared" />

  </div>
</template>

<script>
import api from '@/api/declare/declareopeninginfo'
import DeclareOpeningInfoForm from './components/declareopeninginfo-form'
import DeclareOpeningInfoView from './components/declareopeninginfo-view'
import DeclareOpeningInfoUndeclared from './components/declareopeninginfo-undeclared'

export default {
  name: 'DeclareOpeningInfo-manage',
  components: { DeclareOpeningInfoForm, DeclareOpeningInfoView, DeclareOpeningInfoUndeclared },
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
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '申报名称',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申报详情',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    // console.log('object :', params.row)
                    this.$router.push({ name: 'declare/declareopeningapply', params: { activityId: params.row.id } })
                  }
                }
              }, '查看详情')
          }
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
      this.getDeclareOpeningInfoList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDeclareOpeningInfoList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDeclareOpeningInfoList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getDeclareOpeningInfoList () {
      this.loading = true
      api.getDeclareOpeningInfoList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportDeclareOpeningInfo () {
      this.$refs.table.exportCsv({
        filename: '开题申报信息表列表'
      })
    },
    addDeclareOpeningInfo () {
      this.$refs.declareOpeningInfoForm.addDeclareOpeningInfo()
    },
    viewDeclareOpeningInfo (v) {
      this.$refs.declareOpeningInfoView.viewDeclareOpeningInfo(v.id)
    },
    editDeclareOpeningInfo (v) {
      this.$refs.declareOpeningInfoForm.editDeclareOpeningInfo(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    declineDeclareOpeningApply () {
      this.$refs.declareOpeningInfoUndeclared.declineDeclareOpeningApply()
      // console.log(11)
    },
    deleteDeclareOpeningInfo (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteDeclareOpeningInfo(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
