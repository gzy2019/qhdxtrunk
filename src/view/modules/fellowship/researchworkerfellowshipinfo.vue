<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="80" class="search-form">
          <Form-item label="奖学金名称" prop="fellowshipTitle">
            <Input type="text" v-model="searchForm.fellowshipTitle" clearable placeholder="请输入奖学金名称" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('fellowship:researchworkerfellowshipinfo:save')" @click="addResearchworkerFellowshipInfo" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('fellowship:researchworkerfellowshipinfo:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerFellowshipInfo()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerFellowshipInfo" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button type="primary" size="small" @click="viewResearchworkerFellowshipInfo(row)">查看</Button>
                <Button v-if="isAuth('fellowship:researchworkerfellowshipinfo:update')" type="primary" size="small" @click="editResearchworkerFellowshipInfo(row)">编辑</Button>
                <Button v-if="isAuth('fellowship:researchworkerfellowshipinfo:delete')" type="error"   size="small" @click="deleteResearchworkerFellowshipInfo(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerFellowshipInfoForm ref="researchworkerFellowshipInfoForm" @on-save="handleSearch" @on-update="getResearchworkerFellowshipInfoList" />
      <ResearchworkerFellowshipInfoView ref="researchworkerFellowshipInfoView" />
  </div>
</template>

<script>
import api from '@/api/fellowship/researchworkerfellowshipinfo'
import ResearchworkerFellowshipInfoForm from './components/researchworkerfellowshipinfo-form'
import ResearchworkerFellowshipInfoView from './components/researchworkerfellowshipinfo-view'
export default {
  name: 'ResearchworkerFellowshipInfo-manage',
  components: { ResearchworkerFellowshipInfoForm, ResearchworkerFellowshipInfoView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        fellowshipTitle: undefined
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
          title: '奖学金名称',
          key: 'fellowshipTitle',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '奖学金明细',
          key: 'fellowshipDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '奖学金结果',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row)
                    this.$router.push({ name: 'fellowship/researchworkerfellowshipresult', params: { fellowshipInfoId: params.row.id } })
                    console.log('23332 :', params.row.id)
                  }
                }
              }, '结果详情')
          }
        },
        {
          title: '报名详情',
          key: 'gotoPos',
          minWidth: 120,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row)
                    this.$router.push({ name: 'fellowship/researchworkerfellowshipapply', params: { fellowshipInfoId: params.row.id } })
                    console.log('23332 :', params.row.id)
                  }
                }
              }, '报名详情')
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
      this.getResearchworkerFellowshipInfoList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerFellowshipInfoList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerFellowshipInfoList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getResearchworkerFellowshipInfoList () {
      this.loading = true
      api.getResearchworkerFellowshipInfoList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerFellowshipInfo () {
      this.$refs.table.exportCsv({
        filename: '奖学金录入表列表'
      })
    },
    addResearchworkerFellowshipInfo () {
      this.$refs.researchworkerFellowshipInfoForm.addResearchworkerFellowshipInfo()
    },
    viewResearchworkerFellowshipInfo (v) {
      this.$refs.researchworkerFellowshipInfoView.viewResearchworkerFellowshipInfo(v.id)
    },
    editResearchworkerFellowshipInfo (v) {
      this.$refs.researchworkerFellowshipInfoForm.editResearchworkerFellowshipInfo(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteResearchworkerFellowshipInfo (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerFellowshipInfo(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
