<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="名称" prop="name">
            <Input type="text" v-model="searchForm.name" clearable placeholder="请输入名称" style="width: 200px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('achievement:achievementsubsidize:save')" @click="addAchievementSubsidize" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('achievement:achievementsubsidize:delete')" :disabled="selectedList.length === 0" @click="deleteAchievementSubsidize()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportAchievementSubsidize" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('achievement:achievementsubsidize:info')"   type="primary" size="small" @click="viewAchievementSubsidize(row)">查看</Button>
                <Button v-if="isAuth('achievement:achievementsubsidize:update')" type="primary" size="small" @click="editAchievementSubsidize(row)">编辑</Button>
                <Button v-if="isAuth('achievement:achievementsubsidize:delete')" type="error"   size="small" @click="deleteAchievementSubsidize(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <AchievementSubsidizeForm ref="achievementSubsidizeForm" @update="getAchievementSubsidizeList" />
      <AchievementSubsidizeView ref="achievementSubsidizeView" />
  </div>
</template>

<script>
import api from '@/api/achievement/achievementsubsidize'
import AchievementSubsidizeForm from './components/achievementsubsidize-form'
import AchievementSubsidizeView from './components/achievementsubsidize-view'
export default {
  name: 'AchievementSubsidize-manage',
  components: { AchievementSubsidizeForm, AchievementSubsidizeView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      tableHeight: 330,
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
          title: '教师姓名',
          key: 'teacherName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '相关资料',
          key: 'meetingFiles',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '会议名称',
          key: 'meetingTopic',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '会议地点',
          key: 'meetingPlace',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申请年度',
          key: 'applyYear',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申请备注',
          key: 'applyMemo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '批示备注',
          key: 'replyMemo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报销说明',
          key: 'confirmMemo',
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
      this.getAchievementSubsidizeList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getAchievementSubsidizeList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getAchievementSubsidizeList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getAchievementSubsidizeList () {
      this.loading = true
      api.getAchievementSubsidizeList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportAchievementSubsidize () {
      this.$refs.table.exportCsv({
        filename: '学术会议资助列表'
      })
    },
    addAchievementSubsidize () {
      this.$refs.achievementSubsidizeForm.addAchievementSubsidize()
    },
    viewAchievementSubsidize (v) {
      this.$refs.achievementSubsidizeView.viewAchievementSubsidize(v.id)
    },
    editAchievementSubsidize (v) {
      this.$refs.achievementSubsidizeForm.editAchievementSubsidize(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteAchievementSubsidize (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteAchievementSubsidize(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
