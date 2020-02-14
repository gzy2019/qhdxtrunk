<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="活动名称" prop="forumId">
            <Select v-model="searchForm.forumId" style="width:170px" clearable filterable>
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.forumName }}</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left: -60px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <i-Col span="24">
            <Button v-if="isAuth('forum:officeforumapply:save')" @click="addOfficeForumApply" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('forum:officeforumapply:delete')" :disabled="selectedList.length === 0" @click="deleteOfficeForumApply()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportOfficeForumApply" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </i-Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('forum:officeforumapply:info')"   type="primary" size="small" @click="viewOfficeForumApply(row)">查看</Button>
                <Button v-if="isAuth('forum:officeforumapply:update')" type="primary" size="small" @click="editOfficeForumApply(row)">编辑</Button>
                <Button v-if="isAuth('forum:officeforumapply:delete')" type="error"   size="small" @click="deleteOfficeForumApply(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <OfficeForumApplyForm ref="officeForumApplyForm" @update="getOfficeForumApplyList" />
      <OfficeForumApplyView ref="officeForumApplyView" />
  </div>
</template>

<script>
import api from '@/api/officeforum/officeforumapply'
import apply from '@/api/officeforum/officeforuminfo'
import OfficeForumApplyForm from './components/officeforumapply-form'
import OfficeForumApplyView from './components/officeforumapply-view'
export default {
  name: 'officeforumapply',
  components: { OfficeForumApplyForm, OfficeForumApplyView, apply },
  data () {
    return {
      projectList: [],
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        forumId: undefined
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
          title: '活动名称',
          key: 'forumName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '姓名',
          key: 'applicantName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '性别',
          key: 'applicantSexDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '手机号',
          key: 'applicantPhone',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 120
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      apply.getOfficeForumInfoList({ limit: 100 }).then(res => {
        this.projectList = res.page.list
      })
      this.getOfficeForumApplyList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getOfficeForumApplyList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getOfficeForumApplyList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getOfficeForumApplyList () {
      this.loading = true
      api.getOfficeForumApplyList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportOfficeForumApply () {
      this.$refs.table.exportCsv({
        filename: '论坛报名表列表'
      })
    },
    addOfficeForumApply () {
      this.$refs.officeForumApplyForm.addOfficeForumApply()
    },
    viewOfficeForumApply (v) {
      this.$refs.officeForumApplyView.viewOfficeForumApply(v.id)
    },
    editOfficeForumApply (v) {
      this.$refs.officeForumApplyForm.editOfficeForumApply(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteOfficeForumApply (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteOfficeForumApply(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
