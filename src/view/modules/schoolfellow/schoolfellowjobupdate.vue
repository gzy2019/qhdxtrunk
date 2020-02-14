<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="工作省份" prop="adsWorking">
            <Input type="text" v-model="searchForm.adsWorking" clearable placeholder="请输入工作省份" style="width:170px"/>
          </Form-item>
          <Form-item label="岗位" prop="post">
            <Input type="text" v-model="searchForm.post" clearable placeholder="请输入岗位" style="width:170px"/>
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <i-Col span="24">
            <Button v-if="isAuth('schoolfellow:schoolfellowjobupdate:save')" @click="addSchoolfellowJobupdate" type="primary" icon="md-add">新增</Button>
            <Button @click="back" type="primary">返回</Button>
            <Button v-if="isAuth('schoolfellow:schoolfellowjobupdate:delete')" :disabled="selectedList.length === 0" @click="deleteSchoolfellowJobupdate()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportSchoolfellowJobupdate" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </i-Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('schoolfellow:schoolfellowjobupdate:info')"   type="primary" size="small" @click="viewSchoolfellowJobupdate(row)">查看</Button>
                <Button v-if="isAuth('schoolfellow:schoolfellowjobupdate:update')" type="primary" size="small" @click="editSchoolfellowJobupdate(row)">编辑</Button>
                <Button v-if="isAuth('schoolfellow:schoolfellowjobupdate:delete')" type="error"   size="small" @click="deleteSchoolfellowJobupdate(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <SchoolfellowJobupdateForm ref="schoolfellowJobupdateForm" @on-save="handleSearch" @on-update="getSchoolfellowJobupdateList" />
      <SchoolfellowJobupdateView ref="schoolfellowJobupdateView" />
  </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowjobupdate'
// import api1 from '@/api/schoolfellow/schoolfellowinfo'

import SchoolfellowJobupdateForm from './components/schoolfellowjobupdate-form'
import SchoolfellowJobupdateView from './components/schoolfellowjobupdate-view'
export default {
  name: 'SchoolfellowJobupdate-manage',
  components: { SchoolfellowJobupdateForm, SchoolfellowJobupdateView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      // q: '',
      searchForm: {
        page: 1,
        limit: 10,
        adsWorking: undefined,
        post: undefined,
        schoolfellowInfoId: undefined
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
          title: '工作省份',
          key: 'adsWorking',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '单位/部门',
          key: 'unit',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '岗位',
          key: 'post',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '级别',
          key: 'rank',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '工作部门性质',
          key: 'nature',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 200
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
      this.adjustTableHeight()
      this.getSchoolfellowJobupdateList()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSchoolfellowJobupdateList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSchoolfellowJobupdateList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSchoolfellowJobupdateList () {
      this.loading = true
      // let stuCode = this.$route.params.stuCode
      // this.searchForm.stuCode = stuCode
      // let stuName = this.$route.params.stuName
      // this.searchForm.stuName = stuName
      let schoolfellowInfoId = this.$route.params.schoolfellowInfoId
      this.searchForm.schoolfellowInfoId = schoolfellowInfoId
      api.getSchoolfellowJobupdateList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportSchoolfellowJobupdate () {
      this.$refs.table.exportCsv({
        filename: '校友工作信息更新列表'
      })
    },
    addSchoolfellowJobupdate () {
      this.$refs.schoolfellowJobupdateForm.addSchoolfellowJobupdate()
    },
    viewSchoolfellowJobupdate (v) {
      this.$refs.schoolfellowJobupdateView.viewSchoolfellowJobupdate(v.id)
    },
    editSchoolfellowJobupdate (v) {
      this.$refs.schoolfellowJobupdateForm.editSchoolfellowJobupdate(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteSchoolfellowJobupdate (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteSchoolfellowJobupdate(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
