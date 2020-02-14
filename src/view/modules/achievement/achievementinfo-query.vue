<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="成果名称" prop="name">
          <Input type="text" v-model="searchForm.name" clearable placeholder="请输入成果名称" style="width: 180px"/>
        </Form-item>
        <Form-item label="批次标题" prop="batchId">
          <Select v-model="searchForm.batchId" clearable style="width:180px" @on-change="handleSearch">
            <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <Form-item label="第一作者" prop="name">
          <Input type="text" v-model="searchForm.firstAuthor" clearable placeholder="请输入第一作者" style="width: 180px"/>
        </Form-item>
        <FormItem label="学科门类" prop="subject">
            <DicSelect v-model="searchForm.subject" style="width: 180px" dtype="achievement-subject" :clearable="true" placeholder="请选择学科门类" />
          </FormItem>
        <FormItem label="成果来源" prop="source">
          <DicSelect v-model="searchForm.source" style="width: 180px" dtype="achievement-source" :clearable="true" placeholder="请选择成果来源" />
        </FormItem>
        <FormItem label="发表范围" prop="scope">
          <DicSelect v-model="searchForm.scope" style="width: 180px" dtype="achievement-scope" :clearable="true" placeholder="请选择发表范围" />
        </FormItem>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <i-Col span="24">
          <Button @click="exportAchievementInfo" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
        </i-Col>
      </Row>
      <Row>
        <Table
          :loading="loading"
          ref="table"
          size="small"
          border
          stripe
          :data="pageData.list"
          :columns="columns"
          @on-selection-change="selectionChangeHandle"
        >
          <template slot-scope="{ row }" slot="action">
            <ButtonGroup>
              <Button
                v-if="isAuth('achievement:achievementinfo:info')"
                type="primary"
                size="small"
                @click="viewAchievementInfo(row)"
              >查看</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page
          :total="pageData.totalCount"
          current.sync="searchForm.page"
          :current="searchForm.page"
          :page-size="searchForm.limit"
          @on-change="changePage"
          @on-page-size-change="handlePageSize"
          show-total
          show-sizer
        ></Page>
      </Row>
    </Card>

    <AchievementInfoForm ref="achievementInfoForm" @update="getAchievementInfoList" />
  </div>
</template>

<script>
import api from '@/api/achievement/achievementinfo'
import AchievementInfoForm from './achievementinfo-form'
import DicSelect from '@/view/components/dic-select'

export default {
  name: 'AchievementInfo-manage',
  components: { AchievementInfoForm, DicSelect },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      batchList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: '',
        firstAuthor: undefined,
        subject: undefined,
        source: undefined,
        scope: undefined
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
          key: 'createBy',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '成果名称',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '第一作者',
          key: 'firstAuthor',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '作者列表',
          key: 'authors',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '成果来源',
          key: 'sourceStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '成果形式',
          key: 'formStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '发表范围',
          key: 'scopeStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否译成外文',
          key: 'translateOtherLangStr',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '研究类别',
          key: 'categoryStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否提交给有交部门',
          key: 'submitInstituteStr',
          minWidth: 200,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否采购',
          key: 'accpetedStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学科门类',
          key: 'subjectStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '出版发表使用单位',
          key: 'publishOrg',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '出版发表使用时间',
          key: 'publishTime',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '发行代码',
          key: 'publishCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '关键字',
          key: 'keyword',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '期刊级别',
          key: 'journalLevel',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '字数(千字)',
          key: 'wordCount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '成果产生时间',
          key: 'produceTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '成果提交时间',
          key: 'submitTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '成果摘要',
          key: 'summary',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 160
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getAchievementInfoList()
      this.adjustTableHeight()
      this.loadBatchList()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 230
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getAchievementInfoList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getAchievementInfoList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getAchievementInfoList () {
      this.loading = true
      api.getAchievementInfoList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    loadBatchList () {
      api.getAchievementBatchList().then(res => {
        this.batchList = res.list
      })
    },
    exportAchievementInfo () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api
        .getAchievementInfoList(params)
        .then(res => {
          this.exportLoading = false
          let data = res.data
          this.turn2NewPage(this.$config.downloadExcelUrl, data)
        })
        .catch(e => {
          this.exportLoading = false
        })
    },
    addAchievementInfo () {
      this.$refs.achievementInfoForm.addAchievementInfo()
    },
    viewAchievementInfo (v) {
      this.$refs.achievementInfoForm.viewAchievementInfo(v.id)
    },
    editAchievementInfo (v) {
      this.$refs.achievementInfoForm.editAchievementInfo(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteAchievementInfo (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.deleteAchievementInfo(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
