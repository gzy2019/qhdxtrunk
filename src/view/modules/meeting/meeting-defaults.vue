<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <Form-item label="姓名" prop="name">
                    <Input type="text" v-model="searchForm.name" clearable placeholder="请输入姓名" style="width: 180px" />
                </Form-item>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <Col span="24">
                <Button v-if="isAuth('meeting:meetingroomdefaults:delete')" :disabled="selectedList.length === 0" @click="deleteMeetingRoomDefaults()" type="primary" icon="ios-trash-outline">批量删除</Button>
                <Button v-if="isAuth('meeting:meetingroomdefaults:update')" :disabled="selectedList.length === 0" @click="releaseDefaults()" type="primary" icon="ios-trash-outline">解除限制</Button>
                <Button @click="exportMeetingRoomDefaults" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('meeting:meetingroomdefaults:info')"   type="primary" size="small" @click="viewMeetingRoomDefaults(row)">查看</Button>
                            <Button v-if="isAuth('meeting:meetingroomdefaults:delete')" type="error"   size="small" @click="deleteMeetingRoomDefaults(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>
        <DefaultsDetail ref="defaultsDetail" />
    </div>
</template>

<script>
import api from '@/api/meeting/meetingroomdefaults'
import DefaultsDetail from './components/defaults-detail'
export default {
  name: 'MeetingRoomDefaults-manage',
  components: { DefaultsDetail },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        useName: ''
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
          title: '姓名',
          key: 'useName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '违约次数总计',
          key: 'restrictCount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '限制开始使用时间',
          key: 'restrictBegin',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '限制结束使用时间',
          key: 'restrictEnd',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '限制原因',
          key: 'restrictMemo',
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
      this.getMeetingRoomDefaultsList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMeetingRoomDefaultsList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMeetingRoomDefaultsList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMeetingRoomDefaultsList () {
      this.loading = true
      api.getMeetingRoomDefaultsList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportMeetingRoomDefaults () {
      this.$refs.table.exportCsv({
        filename: '会议室预订预订违约'
      })
    },
    addMeetingRoomDefaults () {

    },
    viewMeetingRoomDefaults (v) {
      this.$refs.defaultsDetail.init(v.id)
    },
    editMeetingRoomDefaults (v) {

    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    releaseDefaults () {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定解除${ids.length > 1 ? ids.length + '条限制' : '此限制'}吗?</p>`,
        onOk: () => {
          api.releaseMeetingRoomDefaults(ids).then(res => {
            this.$Message.success('解除成功!')
            this.handleSearch()
          })
        }
      })
    },
    deleteMeetingRoomDefaults (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMeetingRoomDefaults(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
