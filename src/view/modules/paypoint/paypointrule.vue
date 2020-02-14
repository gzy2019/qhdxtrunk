<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <FormItem label="部门名称" prop="paypointDepartmentId">
                  <Select v-model="searchForm.paypointDepartmentId" clearable @on-change="handleSearch" placeholder="请选择" style="width: 200px;">
                    <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="绩点分类">
                  <Cascader
                    style="width: 200px;"
                    clearable @on-change="handleCascader"
                    :transfer="true"
                    :change-on-select="true"
                    :data="categoryList"
                  />
                </FormItem>
                <FormItem label="统计分类">
                  <Select v-model="searchForm.statsCategory" clearable @on-change="handleSearch" placeholder="请选择" style="width: 200px;">
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                  </Select>
                </FormItem>
                <Form-item label="服务内容" prop="title">
                    <Input type="text" v-model="searchForm.title" clearable placeholder="请输入服务内容" style="width: 200px" />
                </Form-item>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <Col span="24">
                <Button v-if="isAuth('paypoint:paypointrule:save')" @click="addPaypointRule" type="primary" icon="md-add">新增</Button>
                <Button v-if="isAuth('paypoint:paypointrule:delete')" :disabled="selectedList.length === 0" @click="deletePaypointRule()" type="primary" icon="ios-trash-outline">删除</Button>
                <Button @click="exportPaypointRule" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="department">
                        {{row.department.name}}
                    </template>
                    <template slot-scope="{ row }" slot="category">
                        {{row.category.name}}
                    </template>
                    <template slot-scope="{ row }" slot="ruleCategory">
                        {{row.ruleCategory | ruleCategoryInfo}}
                    </template>
                    <template slot-scope="{ row }" slot="action">
                      <ButtonGroup>
                        <Button v-if="isAuth('paypoint:paypointrule:info')"   type="primary" size="small" @click="viewPaypointRule(row)">查看</Button>
                        <Button v-if="isAuth('paypoint:paypointrule:update')" type="primary" size="small" @click="editPaypointRule(row)">编辑</Button>
                        <Button v-if="isAuth('paypoint:paypointrule:delete')" type="error"   size="small" @click="deletePaypointRule(row)">删除</Button>
                      </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
              <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <PaypointRuleForm ref="paypointRuleForm" @update="getPaypointRuleList" />
        <PaypointRuleView ref="paypointRuleView" />
    </div>
</template>

<script>
import api from '@/api/paypoint/paypointrule'
import departmentapi from '@/api/paypoint/paypointdepartment'
import categoryapi from '@/api/paypoint/paypointcategory'
import PaypointRuleForm from './components/paypointrule-form'
import PaypointRuleView from './components/paypointrule-view'
export default {
  name: 'PaypointRule-manage',
  components: { PaypointRuleForm, PaypointRuleView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      departmentList: [],
      categoryList: [],
      searchForm: {
        page: 1,
        limit: 10,
        paypointDepartmentId: null,
        title: '',
        categoryIdPath: [],
        statsCategory: ''
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
          title: '部门',
          slot: 'department',
          minWidth: 160,
          sortable: true,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '分类',
          slot: 'category',
          sortable: true,
          minWidth: 160
        },
        {
          title: '类型',
          slot: 'ruleCategory',
          sortable: true,
          minWidth: 100
        },
        {
          title: '编码',
          key: 'code',
          minWidth: 120,
          sortable: true,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '服务内容',
          key: 'title',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '计量单位',
          key: 'unit',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '薪酬标准',
          key: 'payStandard',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '绩点标准',
          key: 'pointStandard',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '说明',
          key: 'memo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '统计分类',
          key: 'statsCategory',
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
    ruleCategoryInfo (val) {
      if (val === 0) {
        return '课酬'
      } else if (val === 1) {
        return '公共服务'
      } else if (val === 2) {
        return '其它'
      }

      return ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadDepartmentList()
      this.loadCategoryList()
      this.getPaypointRuleList()
      this.adjustTableHeight()
    },
    loadDepartmentList () {
      departmentapi.getPaypointDepartmentDataList().then(res => {
        this.departmentList = res.list
      })
    },
    loadCategoryList () {
      categoryapi.getPaypointCategoryTree().then(res => {
        this.categoryList = res.list
      })
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getPaypointRuleList()
      this.selectedList = []
    },
    handleCascader (currentValue) {
      this.searchForm.categoryIdPath = currentValue
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getPaypointRuleList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getPaypointRuleList () {
      this.loading = true
      let params = Object.assign({}, this.searchForm)
      if (params.categoryIdPath && params.categoryIdPath.length) {
        params.categoryIdPath = params.categoryIdPath[params.categoryIdPath.length - 1]
      } else {
        delete params.categoryIdPath
      }
      api.getPaypointRuleList(params).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportPaypointRule () {
      this.$refs.table.exportCsv({
        filename: '薪酬绩点规则列表'
      })
    },
    addPaypointRule () {
      this.$refs.paypointRuleForm.addPaypointRule()
    },
    viewPaypointRule (v) {
      this.$refs.paypointRuleView.viewPaypointRule(v.id)
    },
    editPaypointRule (v) {
      this.$refs.paypointRuleForm.editPaypointRule(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deletePaypointRule (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deletePaypointRule(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
