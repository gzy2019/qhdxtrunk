<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="案例题目" prop="title">
            <Input type="text" v-model="searchForm.title" clearable placeholder="请输入案例题目" style="width: 180px" />
          </Form-item>
          <Form-item label="关键字" prop="keywords">
            <Input type="text" v-model="searchForm.keywords" clearable placeholder="请输入关键字" style="width: 180px" />
          </Form-item>
          <Form-item label="多媒体" prop="haveMedia">
            <Select v-model="searchForm.haveMedia" clearable placeholder="请选择" @on-change="handleSearch" style="width: 180px">
              <Option value="1">有</Option>
              <Option value="0">无</Option>
            </Select>
          </Form-item>
          <Form-item label="适用课程" prop="courseId">
            <Select v-model="searchForm.courseId" clearable placeholder="请选择" @on-change="handleSearch" style="width: 180px">
              <Option v-for="(item,index) in courseList" :key="index" :value="item.id">{{item.courseName}}</Option>
            </Select>
          </Form-item>
          <Form-item label="案例主题" prop="topic">
            <Input type="text" v-model="searchForm.topic" clearable placeholder="请输入案例主题" style="width: 180px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('cases:caselibrary:save')" @click="addCaseLibrary" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('cases:caselibrary:delete')" :disabled="selectedList.length === 0" @click="deleteCaseLibrary()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportCaseLibrary" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="haveMedia">
              <Tag color="primary">{{row.haveMedia ? '有' : '无'}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="download">
              <Button @click="downloadCase(row)" size="small">下载</Button>
            </template>
            <template slot-scope="{ row }" slot="ups">
              <Button shape="circle" @click="handleUp(row)" :type="row.upsId ? 'primary' : 'default'" icon="ios-thumbs-up" size="small"></Button>
              {{row.ups}}
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('cases:caselibrary:info')"   type="primary" size="small" @click="viewCaseLibrary(row)">查看</Button>
                <Button v-if="isAuth('cases:caselibrary:update')" type="primary" size="small" @click="editCaseLibrary(row)">编辑</Button>
                <Button type="primary" size="small" @click="addCaseLibraryComment(row)">评论</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <CaseLibraryForm ref="caseLibraryForm" @update="getCaseLibraryList" />
      <CaseLibraryView ref="caseLibraryView" />
      <CaseLibraryCommentForm ref="caseLibraryCommentForm" :caseId="curCase.id" />
  </div>
</template>

<script>
import api from '@/api/cases/caselibrary'
import courseApi from '@/api/cases/casecourse'
import downloadApi from '@/api/cases/caselibrarydownload'
import CaseLibraryCommentForm from './components/caselibrarycomment-form'
import CaseLibraryForm from './components/caselibrary-form'
import CaseLibraryView from './components/caselibrary-view'
export default {
  name: 'CaseLibrary-manage',
  components: { CaseLibraryForm, CaseLibraryCommentForm, CaseLibraryView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      courseList: [],
      curCase: {},
      searchForm: {
        page: 1,
        limit: 10,
        type: 'cn',
        title: '',
        keywords: '',
        topic: '',
        haveMedia: null,
        courseId: null
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
          title: '案例编号',
          key: 'code',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '案例题目',
          key: 'title',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '语种',
          key: 'lang',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '适用课程',
          key: 'courseNameStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '案例主题',
          key: 'topic',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '多媒体',
          slot: 'haveMedia',
          minWidth: 100
        },
        {
          title: '案例下载',
          slot: 'download',
          minWidth: 100,
          fixed: 'right'
        },
        {
          title: '好评数',
          slot: 'ups',
          minWidth: 100,
          fixed: 'right'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 170
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getCaseLibraryList()
      this.adjustTableHeight()
      this.loadCourseList()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseLibraryList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseLibraryList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    loadCourseList () {
      courseApi.getCaseCourseDataList().then(res => {
        this.courseList = res.list
      })
    },
    getCaseLibraryList () {
      this.loading = true
      api.getCaseLibraryList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.pageData.list.forEach(item => {
          item.courseNameStr = ''
          if (item.courseList) {
            let arr = item.courseList.map(item => item.courseName)
            item.courseNameStr = arr.join(' ')
          }
        })
        this.adjustTableHeight()
      })
    },
    exportCaseLibrary () {
      this.$refs.table.exportCsv({
        filename: '案例库列表'
      })
    },
    addCaseLibrary () {
      this.$refs.caseLibraryForm.addCaseLibrary()
    },
    addCaseLibraryComment (item) {
      this.curCase = item
      this.$refs.caseLibraryCommentForm.addCaseLibraryComment()
    },
    viewCaseLibrary (v) {
      this.$refs.caseLibraryView.viewCaseLibrary(v.id)
    },
    editCaseLibrary (v) {
      this.$refs.caseLibraryForm.editCaseLibrary(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    handleUp (item) {
      let data = {
        id: item.id,
        upsId: item.upsId
      }
      api.handleCaseLibraryUp(data).then(res => {
        item.upsId = res.data
        if (item.upsId) {
          item.ups++
        } else {
          item.ups--
        }
      })
    },
    downloadCase (item) {
      if (item.files) {
        let files = JSON.parse(item.files)
        if (files && files.length) {
          downloadApi.saveCaseLibraryDownload({ caseId: item.id }).then(res => {})
          let url = files[0].url
          if (url) {
            window.open(url)
          }
        }
      }
    },
    deleteCaseLibrary (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseLibrary(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
