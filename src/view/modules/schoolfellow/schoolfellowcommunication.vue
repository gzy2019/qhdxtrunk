<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="备注信息" prop="infoDesc">
          <Input type="text" v-model="searchForm.infoDesc" clearable placeholder="请输入备注信息" style="width:170px"/>
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <i-Col span="24">
          <Button v-if="isAuth('schoolfellow:schoolfellowcommunication:save')" @click="addSchoolfellowCommunication" type="primary" icon="md-add">新增</Button>
          <Button @click="back" type="primary">返回</Button>
          <Button v-if="isAuth('schoolfellow:schoolfellowcommunication:delete')" :disabled="selectedList.length === 0" @click="deleteSchoolfellowCommunication()" type="primary" icon="ios-trash-outline">删除</Button>
          <Button @click="exportSchoolfellowCommunication" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
        </i-Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="action">
            <ButtonGroup>
              <Button v-if="isAuth('schoolfellow:schoolfellowcommunication:info')"   type="primary" size="small" @click="viewSchoolfellowCommunication(row)">查看</Button>
              <Button v-if="isAuth('schoolfellow:schoolfellowcommunication:update')" type="primary" size="small" @click="editSchoolfellowCommunication(row)">编辑</Button>
              <Button v-if="isAuth('schoolfellow:schoolfellowcommunication:delete')" type="error"   size="small" @click="deleteSchoolfellowCommunication(row)">删除</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <SchoolfellowCommunicationForm ref="schoolfellowCommunicationForm" @on-save="handleSearch" @on-update="getSchoolfellowCommunicationList" />
    <SchoolfellowCommunicationView ref="schoolfellowCommunicationView" />
  </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowcommunication'
import SchoolfellowCommunicationForm from './components/schoolfellowcommunication-form'
import SchoolfellowCommunicationView from './components/schoolfellowcommunication-view'
export default {
  name: 'SchoolfellowCommunication-manage',
  components: { SchoolfellowCommunicationForm, SchoolfellowCommunicationView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        infoDesc: undefined
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
          title: '更新人姓名',
          key: 'updateUserName',
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
          title: '修改时间',
          key: 'modifyTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注信息',
          key: 'infoDesc',
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
    back () {
      this.$router.push({name: 'schoolfellow/schoolfellowinfo'})
    },
    init () {
      this.getSchoolfellowCommunicationList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSchoolfellowCommunicationList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSchoolfellowCommunicationList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSchoolfellowCommunicationList () {
      this.loading = true
      // let stuCode = this.$route.params.stuCode
      // this.searchForm.stuCode = stuCode
      // let stuName = this.$route.params.stuName
      // this.searchForm.stuName = stuName
      let schoolfellowInfoId = this.$route.params.schoolfellowInfoId
      this.searchForm.schoolfellowInfoId = schoolfellowInfoId
      api.getSchoolfellowCommunicationList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportSchoolfellowCommunication () {
      this.$refs.table.exportCsv({
        filename: '校友信息录入表列表'
      })
    },
    addSchoolfellowCommunication () {
      this.$refs.schoolfellowCommunicationForm.addSchoolfellowCommunication()
    },
    viewSchoolfellowCommunication (v) {
      this.$refs.schoolfellowCommunicationView.viewSchoolfellowCommunication(v.id)
    },
    editSchoolfellowCommunication (v) {
      this.$refs.schoolfellowCommunicationForm.editSchoolfellowCommunication(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteSchoolfellowCommunication (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteSchoolfellowCommunication(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
