<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="90" class="search-form">
          <Form-item label="Case Ttile" prop="title">
            <Input type="text" v-model="searchForm.title" clearable placeholder="please input case title" style="width: 180px" />
          </Form-item>
          <Form-item label="Key Words" prop="keywords">
            <Input type="text" v-model="searchForm.keywords" clearable placeholder="please input keywords" style="width: 180px" />
          </Form-item>
          <Form-item label="Is Vedio File" prop="haveMedia">
            <Select v-model="searchForm.haveMedia" clearable placeholder="please choose" @on-change="handleSearch" style="width: 180px">
              <Option value="1">yes</Option>
              <Option value="0">no</Option>
            </Select>
          </Form-item>
          <Form-item label="Curriculum Division" prop="courseId">
            <Select v-model="searchForm.courseId" clearable placeholder="please choose" @on-change="handleSearch" style="width: 180px">
              <Option v-for="(item,index) in courseList" :key="index" :value="item.id">{{item.courseName}}</Option>
            </Select>
          </Form-item>
          <Form-item label="Main Topics" prop="topic">
            <Input type="text" v-model="searchForm.topic" clearable placeholder="please input main topics" style="width: 180px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">search</Button>
            <Button @click="handleClear" style="margin-left: 5px">clear</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('cases:caselibrary:save')" @click="addCaseLibrary" type="primary" icon="md-add">add</Button>
            <Button v-if="isAuth('cases:caselibrary:delete')" :disabled="selectedList.length === 0" @click="deleteCaseLibrary()" type="primary" icon="ios-trash-outline">remove</Button>
            <Button @click="exportCaseLibrary" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" no-data-text="no data" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="haveMedia">
              <Tag color="primary">{{row.haveMedia ? 'yes' : 'no'}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="download">
              <Button @click="downloadCase(row)" size="small">download</Button>
            </template>
            <template slot-scope="{ row }" slot="ups">
              <Button shape="circle" @click="handleUp(row)" :type="row.upsId ? 'primary' : 'default'" icon="ios-thumbs-up" size="small"></Button>
              {{row.ups}}
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('cases:caselibrary:info')"   type="primary" size="small" @click="viewCaseLibrary(row)">view</Button>
                <Button v-if="isAuth('cases:caselibrary:update')" type="primary" size="small" @click="editCaseLibrary(row)">edit</Button>
                <Button type="primary" size="small" @click="addCaseLibraryComment(row)">comment</Button>
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
import CaseLibraryCommentForm from './components/caselibrarycomment-form-en'
import CaseLibraryForm from './components/caselibrary-form-en'
import CaseLibraryView from './components/caselibrary-view-en'
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
        type: 'en',
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
          title: 'Case Reference No',
          key: 'code',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Case Title',
          key: 'title',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Language',
          key: 'lang',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Curriculum Division',
          key: 'courseNameStr',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Main Topics',
          key: 'topic',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Is Vedio File',
          slot: 'haveMedia',
          minWidth: 150
        },
        {
          title: 'Download',
          slot: 'download',
          minWidth: 100,
          fixed: 'right'
        },
        {
          title: 'Thumbs',
          slot: 'ups',
          minWidth: 100,
          fixed: 'right'
        },
        {
          title: 'Operator',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 180
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
        title: 'Confirm Message',
        content: `<p>Are you sure to delete${ids.length > 1 ? ids.length + 'records' : 'this record'}?</p>`,
        onOk: () => {
          api.deleteCaseLibrary(ids).then(res => {
            this.$Message.success('delete success!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
