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
        <Col span="24">
          <Button v-if="isAuth('achievement:achievementbatch:save')" @click="addAchievementBatch" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('achievement:achievementbatch:delete')" :disabled="selectedList.length === 0" @click="deleteAchievementBatch()" type="primary" icon="ios-trash-outline">删除</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="batchOpenFlag">
            <Tag :color="`${row.batchOpenFlag ? 'primary' : 'error' }`">{{ row.batchOpenFlag ? '打开' : '关闭' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="action">
            <ButtonGroup>
              <Button v-if="isAuth('achievement:achievementbatch:info')"   type="primary" size="small" @click="viewAchievementBatch(row)">查看</Button>
              <Button v-if="isAuth('achievement:achievementbatch:update')" type="primary" size="small" @click="editAchievementBatch(row)">编辑</Button>
              <Button v-if="isAuth('achievement:achievementbatch:delete')" type="error"   size="small" @click="deleteAchievementBatch(row)">删除</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

	<AchievementBatchForm ref="achievementBatchForm" @update="getAchievementBatchList" />
  </div>
</template>

<script>
import api from '@/api/achievement/achievementbatch'
import AchievementBatchForm from './achievementbatch-form'
export default {
  name: 'AchievementBatch-manage',
  components: { AchievementBatchForm },
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
          title: '批次标题',
          key: 'batchTitle',
          minWidth: 130,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '填报开始时间',
          key: 'batchStartTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '填报截止时间',
          key: 'batchEndTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '年度',
          key: 'batchYear',
          minWidth: 80,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申报开关',
          slot: 'batchOpenFlag',
          minWidth: 80,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
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
      this.getAchievementBatchList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getAchievementBatchList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getAchievementBatchList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getAchievementBatchList () {
      this.loading = true
      api.getAchievementBatchList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportAchievementBatch () {
      this.$refs.table.exportCsv({
        filename: '科研成果批次列表'
      })
    },
    addAchievementBatch () {
      this.$refs.achievementBatchForm.addAchievementBatch()
    },
    viewAchievementBatch (v) {
      this.$refs.achievementBatchForm.viewAchievementBatch(v.id)
    },
    editAchievementBatch (v) {
      this.$refs.achievementBatchForm.editAchievementBatch(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteAchievementBatch (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteAchievementBatch(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
