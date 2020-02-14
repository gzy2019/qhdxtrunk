<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="标签名称" prop="tagName">
            <Input type="text" v-model="searchForm.tagName" clearable placeholder="请输入标签名称" style="width:170px"/>
          </Form-item>
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form>
        <Row class="operation btn_group">
          <i-Col span="24">
            <Button v-if="isAuth('schoolfellow:schoolfellowtag:save')" @click="addSchoolfellowTag" type="primary" icon="md-add">新增</Button>
            <!-- <Button @click="back" type="primary">返回</Button> -->
            <Button v-if="isAuth('schoolfellow:schoolfellowtag:delete')" :disabled="selectedList.length === 0" @click="deleteSchoolfellowTag()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportSchoolfellowTag" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </i-Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('schoolfellow:schoolfellowtag:info')"   type="primary" size="small" @click="viewSchoolfellowTag(row)">查看</Button>
                <Button v-if="isAuth('schoolfellow:schoolfellowtag:update')" type="primary" size="small" @click="editSchoolfellowTag(row)">编辑</Button>
                <Button v-if="isAuth('schoolfellow:schoolfellowtag:delete')" type="error"   size="small" @click="deleteSchoolfellowTag(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <SchoolfellowTagForm ref="schoolfellowTagForm" @on-save="handleSearch" @on-update="getSchoolfellowTagList" />
      <SchoolfellowTagView ref="schoolfellowTagView" />
  </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowtag'
import SchoolfellowTagForm from './components/schoolfellowtag-form'
import SchoolfellowTagView from './components/schoolfellowtag-view'
export default {
  name: 'SchoolfellowTag-manage',
  components: { SchoolfellowTagForm, SchoolfellowTagView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        tagName: undefined
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
          title: '标签名称',
          key: 'tagName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        // {
        //   title: '学号',
        //   key: 'stuCode',
        //   minWidth: 100,
        //   ellipsis: true,
        //   tooltip: true
        // },
        // {
        //   title: '学生姓名',
        //   key: 'stuName',
        //   minWidth: 100,
        //   ellipsis: true,
        //   tooltip: true
        // },
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
    // back () {
    //   this.$router.push({name: 'schoolfellow/schoolfellowinfo'})
    // },
    init () {
      this.getSchoolfellowTagList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSchoolfellowTagList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSchoolfellowTagList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSchoolfellowTagList () {
      this.loading = true
      // let stuCode = this.$route.params.stuCode
      // this.searchForm.stuCode = stuCode
      // let stuName = this.$route.params.stuName
      // this.searchForm.stuName = stuName
      // let schoolfellowInfoId = this.$route.params.schoolfellowInfoId
      // this.searchForm.schoolfellowInfoId = schoolfellowInfoId
      api.getSchoolfellowTagList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportSchoolfellowTag () {
      this.$refs.table.exportCsv({
        filename: '校友标签表列表'
      })
    },
    addSchoolfellowTag () {
      this.$refs.schoolfellowTagForm.addSchoolfellowTag()
    },
    viewSchoolfellowTag (v) {
      this.$refs.schoolfellowTagView.viewSchoolfellowTag(v.id)
    },
    editSchoolfellowTag (v) {
      this.$refs.schoolfellowTagForm.editSchoolfellowTag(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteSchoolfellowTag (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteSchoolfellowTag(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
