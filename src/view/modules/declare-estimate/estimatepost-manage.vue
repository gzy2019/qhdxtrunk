<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="批次" prop="batchId">
          <Select v-model="searchForm.batchId" clearable style="width:170px" @on-change="handleSearch">
            <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <Form-item label="课程名称" prop="courseName">
          <Input type="text" v-model="searchForm.courseName" clearable placeholder="请输入课程名称" style="width: 170px" />
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <Col span="24">
          <Button
            v-if="isAuth('declare:estimatepost:save')"
            @click="addEstimatePost"
            type="primary"
            icon="md-add"
          >新增</Button>
          <Button
            v-if="isAuth('declare:estimatepost:delete')"
            :disabled="selectedList.length === 0"
            @click="deleteEstimatePost()"
            type="primary"
            icon="ios-trash-outline"
          >删除</Button>
          <Button
            @click="exportEstimatePost"
            :loading="exportLoading"
            type="primary"
            icon="ios-download-outline"
          >导出</Button>
          <Button @click="importData" type="primary" icon="ios-cloud-upload-outline">导入</Button>
        </Col>
      </Row>
      <Row>
        <Table
          :loading="loading"
          ref="table"
          size="small"
          border
          stripe
          :data="pageData.list"
          :columns="columns"
          @on-selection-change="selectionChangeHandle"
        >
          <template slot-scope="{ row }" slot="action" label-position="right">
            <Dropdown :transfer="true">
              <Icon type="ios-more" />
              <DropdownMenu slot="list">
                <DropdownItem :divided="false" v-if="isAuth('declare:estimatepost:info')">
                  <div @click="viewEstimatePost(row)">
                    <Icon type="ios-eye" />查看
                  </div>
                </DropdownItem>
                <DropdownItem :divided="true" v-if="isAuth('declare:estimatepost:update')">
                  <div @click="editEstimatePost(row)">
                    <Icon type="ios-create" />编辑
                  </div>
                </DropdownItem>
                <DropdownItem :divided="true" v-if="isAuth('declare:estimatepost:delete')">
                  <div @click="deleteEstimatePost(row)">
                    <Icon type="ios-trash" />删除
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <ButtonGroup v-if="false">
              <Button
                v-if="isAuth('declare:estimatepost:info')"
                type="primary"
                size="small"
                @click="viewEstimatePost(row)"
              >查看</Button>
              <Button
                v-if="isAuth('declare:estimatepost:update')"
                type="primary"
                size="small"
                @click="editEstimatePost(row)"
              >编辑</Button>
              <Button
                v-if="isAuth('declare:estimatepost:delete')"
                type="error"
                size="small"
                @click="deleteEstimatePost(row)"
              >删除</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page
          :total="pageData.totalCount"
          current.sync="searchForm.page"
          :current="searchForm.page"
          :page-size="searchForm.limit"
          @on-change="changePage"
          @on-page-size-change="handlePageSize"
          show-total
          show-sizer
        ></Page>
      </Row>
    </Card>

    <EstimatePostForm ref="estimatePostForm" @update="getEstimatePostList" />
    <ExcelUpload ref="excelUpload" @on-upload="importRecord" @on-load="preImportHandle" :inTemplate="{name: '三助评估岗位导入模板', url: 'http://info.sppm.tsinghua.edu.cn/sppmtest/file/template/estimate-post.xlsx'}"/>
  </div>
</template>

<script>
import api from '@/api/declare-estimate/estimatepost'
import ExcelUpload from '@/view/components/excel-upload'
import EstimatePostForm from './estimatepost-form'
import UploadUtil from './components/post-upload'
export default {
  name: 'EstimatePost-manage',
  components: { EstimatePostForm, ExcelUpload },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      batchList: [],
      searchForm: {
        page: 1,
        limit: 10,
        courseName: '',
        batchId: null
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
          title: '岗位/课程名称',
          key: 'courseName',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生姓名',
          key: 'studentName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生电话',
          key: 'studentPhone',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生邮箱',
          key: 'studentEmail',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学号',
          key: 'studentCode',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '老师姓名',
          key: 'teacherName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '岗位备注',
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
          minWidth: 100
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getEstimatePostList()
      this.adjustTableHeight()
      this.loadEstimateBatchList()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 230
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getEstimatePostList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getEstimatePostList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getEstimatePostList () {
      this.loading = true
      api.getEstimatePostList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    loadEstimateBatchList () {
      api.getEstimateBatchList(this.searchForm).then(res => {
        this.batchList = res.list
      })
    },
    exportEstimatePost () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getEstimatePostList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    importData () {
      if (!this.searchForm.batchId) {
        this.$Message.warning('请选择批次')
        return false
      }
      this.$refs.excelUpload.initUpload()
      UploadUtil.init(this.searchForm.batchId)
    },
    preImportHandle (records, fileName) {

    },
    importRecord (records, fileName) {
      console.log('records:', records, ', filename:', fileName)
      UploadUtil.importRecords(records, this.$refs.excelUpload).then(() => {
        this.handleSearch()
      }, (msg) => {
        this.$Message.error(msg)
      })
    },
    addEstimatePost () {
      this.$refs.estimatePostForm.addEstimatePost(this.searchForm.batchId)
    },
    viewEstimatePost (v) {
      this.$refs.estimatePostForm.viewEstimatePost(v.id)
    },
    editEstimatePost (v) {
      this.$refs.estimatePostForm.editEstimatePost(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteEstimatePost (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.deleteEstimatePost(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
