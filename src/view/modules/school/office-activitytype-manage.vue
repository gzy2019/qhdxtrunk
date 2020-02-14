<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <Form-item label="分类名称" prop="name">
                    <Input type="text" v-model="searchForm.typeName" clearable placeholder="请输入分类名称" style="width:170px" />
                </Form-item>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <i-col span="24">
                    <Button v-if="isAuth('activity:officeactivitytype:save')" @click="addOfficeActivityType" type="primary" icon="md-add">新增</Button>
                    <Button v-if="isAuth('activity:officeactivitytype:delete')" :disabled="selectedList.length === 0" @click="deleteOfficeActivityType()" type="primary" icon="ios-trash-outline">删除</Button>
                    <Button @click="exportOfficeActivityType" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </i-col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('activity:officeactivitytype:info')" type="primary" size="small" @click="viewOfficeActivityType(row)">查看</Button>
                            <Button v-if="isAuth('activity:officeactivitytype:update')" type="primary" size="small" @click="editOfficeActivityType(row)">编辑</Button>
                            <Button v-if="isAuth('activity:officeactivitytype:delete')" type="error" size="small" @click="deleteOfficeActivityType(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>
        <OfficeActivityTypeForm ref="officeActivityTypeForm" @update="getOfficeActivityTypeList" />
        <OfficeActivityTypeView ref="officeActivityTypeView" />
    </div>
</template>
<script>
import api from '@/api/activity/officeactivitytype'
import OfficeActivityTypeForm from './components/officeactivitytype-form'
import OfficeActivityTypeView from './components/officeactivitytype-view'
export default {
  name: 'OfficeActivityType-manage',
  components: { OfficeActivityTypeForm, OfficeActivityTypeView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        typeName: undefined
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
          title: '分类名称',
          key: 'typeName',
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
    init () {
      this.getOfficeActivityTypeList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getOfficeActivityTypeList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getOfficeActivityTypeList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getOfficeActivityTypeList () {
      this.loading = true
      api.getOfficeActivityTypeList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportOfficeActivityType () {
      this.$refs.table.exportCsv({
        filename: '活动分类表列表'
      })
    },
    addOfficeActivityType () {
      this.$refs.officeActivityTypeForm.addOfficeActivityType()
    },
    viewOfficeActivityType (v) {
      this.$refs.officeActivityTypeView.viewOfficeActivityType(v.id)
    },
    editOfficeActivityType (v) {
      this.$refs.officeActivityTypeForm.editOfficeActivityType(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteOfficeActivityType (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteOfficeActivityType(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
