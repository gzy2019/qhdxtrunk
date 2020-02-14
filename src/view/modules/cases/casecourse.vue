<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="名称" prop="courseName">
            <Input type="text" v-model="searchForm.courseName" clearable placeholder="请输入名称" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('cases:casecourse:save')" @click="addCaseCourse" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('cases:casecourse:delete')" :disabled="selectedList.length === 0" @click="deleteCaseCourse()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportCaseCourse" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="lang">
              <Tag color="primary">{{row.lang | langInfo}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('cases:casecourse:update')" type="primary" size="small" @click="editCaseCourse(row)">编辑</Button>
                <Button v-if="isAuth('cases:casecourse:delete')" type="error"   size="small" @click="deleteCaseCourse(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <CaseCourseForm ref="caseCourseForm" @on-save="handleSearch" @on-update="getCaseCourseList" />
  </div>
</template>

<script>
import api from '@/api/cases/casecourse'
import CaseCourseForm from './components/casecourse-form'
export default {
  name: 'CaseCourse-manage',
  components: { CaseCourseForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        courseName: ''
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
          title: '课程名称',
          key: 'courseName',
          minWidth: 240,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '语种',
          slot: 'lang',
          minWidth: 150
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
  filters: {
    langInfo (val) {
      if (val === 'cn') {
        return '中文'
      } else if (val === 'en') {
        return '英文'
      } else if (val === 'etc') {
        return '其它'
      } else {
        return '无'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getCaseCourseList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getCaseCourseList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getCaseCourseList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getCaseCourseList () {
      this.loading = true
      api.getCaseCourseList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportCaseCourse () {
      this.$refs.table.exportCsv({
        filename: '课程管理列表'
      })
    },
    addCaseCourse () {
      this.$refs.caseCourseForm.addCaseCourse()
    },
    editCaseCourse (v) {
      this.$refs.caseCourseForm.editCaseCourse(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteCaseCourse (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteCaseCourse(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
