<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="研究所">
            <Select v-model="searchForm.research" clearable style="width:200px" >
            <Option v-for="item in researchList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button @click="handleSearch" type="primary" icon="ios-search" style="margin-left:20px">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
          <Button
            @click="exportEstimatePost"
            :loading="exportLoading"
            type="primary"
            icon="ios-download-outline"
          >导出</Button>
        </Form>

        <Table ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
        </Table>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/declare/declareopeninginfo'
export default {
  name: 'DeclareOpeningInfo-undeclared',
  data () {
    return {
      formModalVisible: false,
      exportLoading: false,
      tableHeight: 300,
      selectedList: [],
      loading: false,
      researchList: [
        { value: 'A', label: '政治与公共政策研究所' },
        { value: 'B', label: '政府管理与创新研究所' },
        { value: 'C', label: '国际发展与全球治理研究所' },
        { value: 'D', label: '社会组织与社会治理研究所' }
      ],
      searchForm: {
        page: 1,
        limit: 10,
        research: []
      },
      pageData: {
        totalCount: 0,
        list: []
      },
      columns: [
        {
          title: '学号',
          key: 'stuCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '姓名',
          key: 'stuName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '手机',
          key: 'mobile',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        }
        // {
        //   title: '操作',
        //   slot: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   minWidth: 150
        // }
      ]
    }
  },
  mounted () {

  },
  methods: {
    init () {
      this.declineDeclareOpeningApply()
      this.getDeclareOpeningApplyList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.declineDeclareOpeningApply()
      this.selectedList = []
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.getDeclareOpeningApplyList()
      this.handleSearch()
    },
    cancel () {
      this.formModalVisible = false
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.declineDeclareOpeningApply()
      this.getDeclareOpeningApplyList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    exportEstimatePost () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getDeclareOpeningInfoList2(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    getDeclareOpeningApplyList () {
      this.loading = true
      api.getDeclareOpeningInfoList2(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    declineDeclareOpeningApply () {
      this.loading = true
      api.getDeclareOpeningInfoList2(this.searchForm).then(res => {
        this.pageData = res.page
        Object.keys(this.pageData).forEach(key => {
          this.pageData[key] = page[key]
          console.log(this.searchForm)
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    }
  }
}
</script>
