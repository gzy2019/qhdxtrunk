<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="活动名称" prop="activityName">
            <Input type="text" v-model="searchForm.activityName" clearable placeholder="请输入活动名称" style="width: 170px" />
          </Form-item>
          <Form-item label="活动类型" prop="activityType">
            <Input type="text" v-model="searchForm.activityType" clearable placeholder="请输入活动类型" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('socialActivity:researchworkersocialactivityinfo:save')" @click="addResearchworkerSocialactivityInfo" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('socialActivity:researchworkersocialactivityinfo:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerSocialactivityInfo()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerSocialactivityInfo" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('socialActivity:researchworkersocialactivityinfo:info')"   type="primary" size="small" @click="viewResearchworkerSocialactivityInfo(row)">查看</Button>
                <Button v-if="isAuth('socialActivity:researchworkersocialactivityinfo:update')" type="primary" size="small" @click="editResearchworkerSocialactivityInfo(row)">编辑</Button>
                <Button v-if="isAuth('socialActivity:researchworkersocialactivityinfo:delete')" type="error"   size="small" @click="deleteResearchworkerSocialactivityInfo(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerSocialactivityInfoForm ref="researchworkerSocialactivityInfoForm" @on-save="handleSearch" @on-update="getResearchworkerSocialactivityInfoList" />
      <ResearchworkerSocialactivityInfoView ref="researchworkerSocialactivityInfoView" />
  </div>
</template>

<script>
import api from '@/api/socialActivity/researchworkersocialactivityinfo'
import ResearchworkerSocialactivityInfoForm from './components/researchworkersocialactivityinfo-form'
import ResearchworkerSocialactivityInfoView from './components/researchworkersocialactivityinfo-view'
export default {
  name: 'ResearchworkerSocialactivityInfo-manage',
  components: { ResearchworkerSocialactivityInfoForm, ResearchworkerSocialactivityInfoView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        activityName: undefined,
        activityType: undefined
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
          title: '活动名',
          key: 'activityName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动地址',
          key: 'activityAds',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动类型',
          key: 'activityType',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动组别',
          key: 'activityGroup',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动详情',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row)
                    this.$router.push({ name: 'socialActivity/researchworkersocialactivityapply', params: { activityId: params.row.id } })
                    console.log('23332 :', params.row.id)
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
      this.getResearchworkerSocialactivityInfoList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerSocialactivityInfoList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerSocialactivityInfoList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getResearchworkerSocialactivityInfoList () {
      this.loading = true
      api.getResearchworkerSocialactivityInfoList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerSocialactivityInfo () {
      this.$refs.table.exportCsv({
        filename: '社会实践主表列表'
      })
    },
    addResearchworkerSocialactivityInfo () {
      this.$refs.researchworkerSocialactivityInfoForm.addResearchworkerSocialactivityInfo()
    },
    viewResearchworkerSocialactivityInfo (v) {
      this.$refs.researchworkerSocialactivityInfoView.viewResearchworkerSocialactivityInfo(v.id)
    },
    editResearchworkerSocialactivityInfo (v) {
      this.$refs.researchworkerSocialactivityInfoForm.editResearchworkerSocialactivityInfo(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteResearchworkerSocialactivityInfo (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerSocialactivityInfo(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
