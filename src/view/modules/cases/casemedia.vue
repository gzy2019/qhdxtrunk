<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="案例题目" prop="title">
            <Input type="text" v-model="searchForm.title" clearable placeholder="请输入内容" style="width: 180px" />
          </Form-item>
          <Form-item label="适用课程" prop="courseId">
            <Select v-model="searchForm.courseId" clearable placeholder="请选择" @on-change="handleSearch" style="width: 180px">
              <Option v-for="(item,index) in courseList" :key="index" :value="item.id">{{item.courseName}}</Option>
            </Select>
          </Form-item>
          <Form-item label="案例主题" prop="topic">
            <Input type="text" v-model="searchForm.topic" clearable placeholder="请输入内容" style="width: 180px" />
          </Form-item>
          <Form-item label="案例语言" prop="lang">
            <Select v-model="searchForm.lang" clearable @on-change="handleSearch" placeholder="请选择语种" style="width: 180px">
                <Option value="中文">中文</Option>
                <Option value="英文">英文</Option>
                <Option value="其它">其它</Option>
                <Option value="无">无</Option>
              </Select>
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('cases:casemedia:save')" @click="addCaseMedia" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('cases:casemedia:delete')" :disabled="selectedList.length === 0" @click="deleteCaseMedia()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportCaseMedia" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <List item-layout="vertical" :loading="loading" :border="true">
          <Row>
            <Col span="8" v-for="(item, index) in pageData.list" :key="index" >
              <ListItem>
                <ListItemMeta :title="item.approveStatusInfo" style="margin-bottom: -5px;"/>
                <img :src="getCoverUrl(item)" style="width: 195px">
                <p>内容标题：{{item.summary}}</p>
                <p>内容简介：{{item.summary}}</p>
                <p>案例主题：{{item.topic}}</p>
                <p>片长：{{item.mediaLength}}</p>
                <p>点赞数：<Button shape="circle" @click="handleUp(item)" size="small" :type="item.upsId ? 'primary' : 'default'" icon="ios-thumbs-up-outline"></Button> {{item.ups}}</p>
                <template slot="action">
                    <li><Button @click="viewCaseMedia(item)" shape="circle" size="small" icon="ios-eye-outline"></Button></li>
                    <li><Button @click="editCaseMedia(item)" shape="circle" size="small" icon="ios-create-outline"></Button></li>
                    <li><Button @click="addCaseMediaComment(item)" shape="circle" size="small" icon="ios-chatbubbles-outline"></Button></li>
                    <li><Button @click="deleteCaseMedia(item)" shape="circle" size="small" icon="ios-trash-outline"></Button></li>
                </template>
              </ListItem>
            </Col>
          </Row>
        </List>

        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <CaseMediaForm ref="caseMediaForm" @update="getCaseMediaList" />
      <CaseMediaView ref="caseMediaView" />
      <CaseMediaCommentForm ref="caseMediaCommentForm" :mediaId="curCase.id" />
  </div>
</template>

<script>
import api from '@/api/cases/casemedia'
import courseApi from '@/api/cases/casecourse'
import CaseMediaForm from './components/casemedia-form'
import CaseMediaCommentForm from './components/casemediacomment-form'
import CaseMediaView from './components/casemedia-view'
export default {
  name: 'CaseMedia-manage',
  components: { CaseMediaForm, CaseMediaView, CaseMediaCommentForm },
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
        title: '',
        topic: '',
        courseId: null,
        lang: ''
      },
      pageData: {
        totalCount: 0,
        list: []
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.getCaseMediaList()
        this.loadCourseList()
      })
    },
    loadCourseList () {
      courseApi.getCaseCourseDataList().then(res => {
        this.courseList = res.list
      })
    },
    getCoverUrl (item) {
      if (item && item.imageFile) {
        let file = JSON.parse(item.imageFile)
        if (file && file.length && file[0].url) {
          return file[0].url
        }
      }
      return 'https://dev-file.iviewui.com/5wxHCQMUyrauMCGSVEYVxHR5JmvS7DpH/large'
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseMediaList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseMediaList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getCaseMediaList () {
      this.loading = true
      api.getCaseMediaList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
      })
    },
    exportCaseMedia () {
      this.$refs.table.exportCsv({
        filename: '多媒体库管理列表'
      })
    },
    addCaseMediaComment (item) {
      this.curCase = item
      this.$refs.caseMediaCommentForm.addCaseMediaComment()
    },
    addCaseMedia () {
      this.$refs.caseMediaForm.addCaseMedia()
    },
    viewCaseMedia (v) {
      this.$refs.caseMediaView.viewCaseMedia(v.id)
    },
    editCaseMedia (v) {
      this.$refs.caseMediaForm.editCaseMedia(v.id)
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
    deleteCaseMedia (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseMedia(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
