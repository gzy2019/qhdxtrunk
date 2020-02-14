<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <Form-item label="部门名称" prop="name">
                    <Input type="text" v-model="searchForm.name" clearable placeholder="请输入部门名称" style="width: 180px" />
                </Form-item>
                <Form-item label="操作员" prop="operName">
                    <Input type="text" v-model="searchForm.operName" clearable placeholder="请输入操作员姓名" style="width: 180px" />
                </Form-item>
                <Form-item label="管理员" prop="adminName">
                    <Input type="text" v-model="searchForm.adminName" clearable placeholder="请输入管理员姓名" style="width: 180px" />
                </Form-item>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <Col span="24">
                <Button v-if="isAuth('paypoint:paypointdepartment:save')" @click="addPaypointDepartment" type="primary" icon="md-add">新增</Button>
                <Button v-if="isAuth('paypoint:paypointdepartment:delete')" :disabled="selectedList.length === 0" @click="deletePaypointDepartment()" type="primary" icon="ios-trash-outline">删除</Button>
                <Button @click="exportPaypointDepartment" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="adminName">
                        {{row.adminUser.teaName}}
                    </template>
                    <template slot-scope="{ row }" slot="adminIdNum">
                        {{row.adminUser.teaCode}}
                    </template>
                    <template slot-scope="{ row }" slot="operName">
                        {{row.operUser.teaName}}
                    </template>
                    <template slot-scope="{ row }" slot="operIdNum">
                        {{row.operUser.teaCode}}
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('paypoint:paypointdepartment:info')"   type="primary" size="small" @click="viewPaypointDepartment(row)">查看</Button>
                            <Button v-if="isAuth('paypoint:paypointdepartment:update')" type="primary" size="small" @click="editPaypointDepartment(row)">编辑</Button>
                            <Button v-if="isAuth('paypoint:paypointdepartment:delete')" type="error"   size="small" @click="deletePaypointDepartment(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <PaypointDepartmentForm ref="paypointDepartmentForm" @update="getPaypointDepartmentList" />
        <PaypointDepartmentView ref="paypointDepartmentView" />
    </div>
</template>

<script>
import api from '@/api/paypoint/paypointdepartment'
import PaypointDepartmentForm from './components/paypointdepartment-form'
import PaypointDepartmentView from './components/paypointdepartment-view'
export default {
  name: 'PaypointDepartment-manage',
  components: { PaypointDepartmentForm, PaypointDepartmentView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: '',
        operName: '',
        adminName: ''
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
          title: '名称',
          key: 'name',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '管理员证件号',
          slot: 'adminIdNum',
          minWidth: 100
        },
        {
          title: '管理员',
          slot: 'adminName',
          minWidth: 100
        },
        {
          title: '操作员证件号',
          slot: 'operIdNum',
          minWidth: 100
        },
        {
          title: '操作员',
          slot: 'operName',
          minWidth: 100
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 150,
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
      this.getPaypointDepartmentList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getPaypointDepartmentList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getPaypointDepartmentList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getPaypointDepartmentList () {
      this.loading = true
      api.getPaypointDepartmentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportPaypointDepartment () {
      this.$refs.table.exportCsv({
        filename: '薪酬绩点部门列表'
      })
    },
    addPaypointDepartment () {
      this.$refs.paypointDepartmentForm.addPaypointDepartment()
    },
    viewPaypointDepartment (v) {
      this.$refs.paypointDepartmentView.viewPaypointDepartment(v.id)
    },
    editPaypointDepartment (v) {
      this.$refs.paypointDepartmentForm.editPaypointDepartment(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deletePaypointDepartment (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deletePaypointDepartment(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
