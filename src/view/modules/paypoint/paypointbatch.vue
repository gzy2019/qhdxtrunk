<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="80" class="search-form">
                <Form-item label="批次名称" prop="name">
                    <Input type="text" v-model="searchForm.name" clearable placeholder="请输入批次名称" style="width: 200px" />
                </Form-item>
                <FormItem label="部门" prop="paypointDepartmentId">
                  <Select v-model="searchForm.paypointDepartmentId" clearable @on-change="handleSearch" placeholder="请选择" style="width: 200px;">
                    <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="类型">
                  <Select v-model="searchForm.category" clearable @on-change="handleSearch" placeholder="请选择" style="width: 200px;">
                    <Option :value="0">课酬</Option>
                    <Option :value="1">公共服务</Option>
                    <Option :value="2">其它</Option>
                  </Select>
                </FormItem>
                <FormItem label="是否发放">
                  <Select v-model="searchForm.joinStats" clearable @on-change="handleSearch" placeholder="请选择" style="width: 200px;">
                    <Option :value="1">是</Option>
                    <Option :value="0">否</Option>
                  </Select>
                </FormItem>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <Col span="24">
                  <Button v-if="isAuth('paypoint:paypointbatch:save')" @click="addPaypointBatch" type="primary" icon="md-add">新增</Button>
                  <Button v-if="isAuth('paypoint:paypointbatch:delete')" :disabled="selectedList.length === 0" @click="deletePaypointBatch()" type="primary" icon="ios-trash-outline">删除</Button>
                  <Button v-if="isAuth('paypoint:paypointbatch:save')" @click="copyBatch" :disabled="selectedList.length === 0" :loading="copyLoading" type="primary" icon="ios-edit-outline">复制</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="departmentName">
                        {{row.department.name}}
                    </template>
                    <template slot-scope="{ row }" slot="sendFlag">
                        {{row.sendFlag ? '是' : '否'}}
                    </template>
                    <template slot-scope="{ row }" slot="joinStats">
                        {{row.joinStats ? '是' : '否'}}
                    </template>
                    <template slot-scope="{ row }" slot="category">
                        {{row.category | categoryInfo}}
                    </template>
                    <template slot-scope="{ row }" slot="statsCategory">
                        {{row.statsCategory | statsCategoryInfo}}
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('paypoint:paypointbatch:info')"   type="primary" size="small" @click="viewPaypointBatch(row)">查看</Button>
                            <Button v-if="isAuth('paypoint:paypointbatch:update')" type="primary" size="small" @click="editPaypointBatch(row)">编辑</Button>
                            <Button v-if="isAuth('paypoint:paypointbatch:delete')" type="error"   size="small" @click="deletePaypointBatch(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <PaypointBatchForm ref="paypointBatchForm" @update="getPaypointBatchList" />
        <PaypointBatchView ref="paypointBatchView" />
    </div>
</template>

<script>
import api from '@/api/paypoint/paypointbatch'
import departmentapi from '@/api/paypoint/paypointdepartment'
import PaypointBatchForm from './components/paypointbatch-form'
import PaypointBatchView from './components/paypointbatch-view'
export default {
  name: 'PaypointBatch-manage',
  components: { PaypointBatchForm, PaypointBatchView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      copyLoading: false,
      selectedList: [],
      departmentList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: '',
        paypointDepartmentId: '',
        category: '',
        sendFlag: null
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
          title: '部门名称',
          slot: 'departmentName',
          minWidth: 150
        },
        {
          title: '批次名称',
          key: 'name',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '编码',
          key: 'code',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '薪酬合计',
          key: 'payTotal',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '绩点合计',
          key: 'pointTotal',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否已发放',
          slot: 'sendFlag',
          minWidth: 100
        },
        {
          title: '参与人事工作量统计',
          slot: 'joinStats',
          minWidth: 150
        },
        {
          title: '类型',
          slot: 'category',
          minWidth: 100
        },
        {
          title: '参与统计类型',
          slot: 'statsCategory',
          minWidth: 120
        },
        {
          title: '说明',
          key: 'memo',
          minWidth: 100,
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
  filters: {
    categoryInfo (val) {
      if (val === 0) {
        return '课酬'
      } else if (val === 1) {
        return '公共服务'
      } else if (val === 2) {
        return '其它'
      }

      return '未知'
    },
    statsCategoryInfo (val) {
      if (val === 0) {
        return '授课统计'
      } else if (val === 1) {
        return '指导学生统计'
      } else if (val === 2) {
        return '公共服务统计'
      } else if (val === 3) {
        return '培训部统计'
      }

      return '未知'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadDepartmentList()
      this.getPaypointBatchList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    loadDepartmentList () {
      departmentapi.getPaypointDepartmentDataList().then(res => {
        this.departmentList = res.list
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getPaypointBatchList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getPaypointBatchList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getPaypointBatchList () {
      this.loading = true
      api.getPaypointBatchList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportPaypointBatch () {
      this.$refs.table.exportCsv({
        filename: '薪酬绩点批次列表'
      })
    },
    copyBatch () {
      let ids = this.selectedList.map(item => item.id)
      this.copyLoading = true
      api.copyPaypointBatch(ids).then(res => {
        this.$Message.success('复制成功!')
        this.handleSearch()
      }).finally(() => {
        this.copyLoading = false
      })
    },
    addPaypointBatch () {
      this.$refs.paypointBatchForm.addPaypointBatch()
    },
    viewPaypointBatch (v) {
      this.$refs.paypointBatchView.viewPaypointBatch(v.id)
    },
    editPaypointBatch (v) {
      this.$refs.paypointBatchForm.editPaypointBatch(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deletePaypointBatch (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deletePaypointBatch(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
