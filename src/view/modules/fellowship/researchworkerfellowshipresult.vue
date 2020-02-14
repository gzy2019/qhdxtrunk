<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="学生姓名" prop="stuName">
            <Input type="text" v-model="searchForm.stuName" clearable placeholder="请输入学生姓名" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <!-- <Button v-if="isAuth('fellowship:researchworkerfellowshipresult:save')" @click="addResearchworkerFellowshipResult" type="primary" icon="md-add">新增</Button> -->
            <Button @click="back" type="primary">返回</Button>
            <Button v-if="isAuth('fellowship:researchworkerfellowshipresult:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerFellowshipResult()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerFellowshipResult" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <!-- <Button v-if="isAuth('fellowship:researchworkerfellowshipresult:info')"   type="primary" size="small" @click="viewResearchworkerFellowshipResult(row)">查看</Button> -->
                <Button v-if="isAuth('fellowship:researchworkerfellowshipresult:update')" type="primary" size="small" @click="editResearchworkerFellowshipResult(row)">编辑</Button>
                <Button v-if="isAuth('fellowship:researchworkerfellowshipresult:delete')" type="error"   size="small" @click="deleteResearchworkerFellowshipResult(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerFellowshipResultForm ref="researchworkerFellowshipResultForm" @on-save="handleSearch" @on-update="getResearchworkerFellowshipResultList" />
      <ResearchworkerFellowshipResultView ref="researchworkerFellowshipResultView" />
  </div>
</template>

<script>
import api from '@/api/fellowship/researchworkerfellowshipresult'
import ResearchworkerFellowshipResultForm from './components/researchworkerfellowshipresult-form'
import ResearchworkerFellowshipResultView from './components/researchworkerfellowshipresult-view'
export default {
  name: 'ResearchworkerFellowshipResult-manage',
  components: { ResearchworkerFellowshipResultForm, ResearchworkerFellowshipResultView },
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
          title: '学生姓名',
          key: 'stuName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生学号',
          key: 'stuCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '奖学金结果',
          key: 'fellowshipResult',
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
    back () {
      this.$router.push({name: 'fellowship/researchworkerfellowshipinfo'})
    },
    init () {
      this.getResearchworkerFellowshipResultList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerFellowshipResultList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerFellowshipResultList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getResearchworkerFellowshipResultList () {
      this.loading = true
      let fellowshipInfoId = this.$route.params.fellowshipInfoId
      this.searchForm.fellowshipInfoId = fellowshipInfoId
      api.getResearchworkerFellowshipResultList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerFellowshipResult () {
      this.$refs.table.exportCsv({
        filename: '奖学金结果表列表'
      })
    },
    addResearchworkerFellowshipResult () {
      this.$refs.researchworkerFellowshipResultForm.addResearchworkerFellowshipResult()
    },
    viewResearchworkerFellowshipResult (v) {
      this.$refs.researchworkerFellowshipResultView.viewResearchworkerFellowshipResult(v.id)
    },
    editResearchworkerFellowshipResult (v) {
      this.$refs.researchworkerFellowshipResultForm.editResearchworkerFellowshipResult(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteResearchworkerFellowshipResult (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerFellowshipResult(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
