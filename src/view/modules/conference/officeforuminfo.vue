<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="论坛名称" prop="forumName">
            <Input type="text" v-model="searchForm.forumName" clearable placeholder="请输入论坛名称" style="width: 170px" />
          </Form-item>
          <Form-item label="举办时间" prop="startDate">
           <IDatePicker type="daterange" clearable split-panels v-model="searchForm.dateRange" format="yyyy-MM-dd" placeholder="请输入举办日期" style="width: 170px"/>
          </Form-item>
          <Form-item style="margin-left: -60px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <i-Col span="24">
            <Button v-if="isAuth('forum:officeforuminfo:save')" @click="addOfficeForumInfo" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('forum:officeforuminfo:delete')" :disabled="selectedList.length === 0" @click="deleteOfficeForumInfo()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportOfficeForumInfo" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </i-Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('forum:officeforuminfo:info')"   type="primary" size="small" @click="viewOfficeForumInfo(row)">查看</Button>
                <Button @click="applyOfficeForumApply" type="primary" size="small">报名</Button>
                <Button v-if="isAuth('forum:officeforuminfo:update')" type="primary" size="small" @click="editOfficeForumInfo(row)">编辑</Button>
                <Button v-if="isAuth('forum:officeforuminfo:delete')" type="error"   size="small" @click="deleteOfficeForumInfo(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>
      <OfficeForumInfoForm ref="officeForumInfoForm" @update="getOfficeForumInfoList" />
      <OfficeForumInfoView ref="officeForumInfoView" />
      <officeforumapplyApply ref="officeForumApplyApple"/>

  </div>
</template>

<script>
import api from '@/api/officeforum/officeforuminfo'
import IDatePicker from '@/view/components/idate-picker'
import OfficeForumInfoForm from './components/officeforuminfo-form'
import officeforumapplyApply from './components/officeforumapply-apply'
import OfficeForumInfoView from './components/officeforuminfo-view'
export default {
  name: 'OfficeForumInfo-manage',
  components: { OfficeForumInfoForm, OfficeForumInfoView, IDatePicker, officeforumapplyApply },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        dateRange: [],
        forumName: undefined
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
          title: '论坛名字',
          key: 'forumName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '举办地点',
          key: 'forumAddress',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '举办时间',
          key: 'startDate',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注',
          key: 'forumDesc',
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
      this.getOfficeForumInfoList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getOfficeForumInfoList()
      console.log(this.searchForm.dateRange)

      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getOfficeForumInfoList()
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
    getOfficeForumInfoList () {
      this.loading = true
      console.log(this.searchForm)
      api.getOfficeForumInfoList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportOfficeForumInfo () {
      this.$refs.table.exportCsv({
        filename: '论坛信息表列表'
      })
    },
    addOfficeForumInfo () {
      this.$refs.officeForumInfoForm.addOfficeForumInfo()
    },
    viewOfficeForumInfo (v) {
      this.$refs.officeForumInfoView.viewOfficeForumInfo(v.id)
    },
    editOfficeForumInfo (v) {
      this.$refs.officeForumInfoForm.editOfficeForumInfo(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    applyOfficeForumApply () {
      console.log('abc', this.$refs.officeForumApplyApple)
      this.$refs.officeForumApplyApple.applyOfficeForumApply()
    },
    deleteOfficeForumInfo (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteOfficeForumInfo(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
