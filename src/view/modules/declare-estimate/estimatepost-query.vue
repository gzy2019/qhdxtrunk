<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="批次名称" prop="batchId">
          <Select v-model="searchForm.batchId" clearable style="width:200px" @on-change="handleSearch">
            <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <Form-item label="课程名称" prop="courseName">
          <Input type="text" v-model="searchForm.courseName" clearable placeholder="请输入课程名称" style="width: 200px" />
        </Form-item>
        <Form-item label="任教老师" prop="teacherName">
          <Input type="text" v-model="searchForm.teacherName" clearable placeholder="请输入任教老师" style="width: 200px" />
        </Form-item>
        <Form-item label="学生姓名" prop="studentName">
          <Input type="text" v-model="searchForm.studentName" clearable placeholder="请输入学生姓名" style="width: 200px" />
        </Form-item>
        <Form-item label="学号" prop="studentCode">
          <Input type="text" v-model="searchForm.studentCode" clearable placeholder="请输入学号" style="width: 200px" />
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <Col span="24">
        <Button @click="exportEstimatePost" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        <Button @click="exportEstimatePostAttachment" :loading="exportLoading2" type="primary" icon="ios-download-outline">导出所有材料</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="studentStatus">
            <Tag v-if="!row.studentEstimate" color="default">未填写</Tag>
            <Tag v-else color="primary">已填写</Tag>
          </template>
          <template slot-scope="{ row }" slot="teacherStatus">
            <Tag v-if="!row.teacherEstimate" color="default">未填写</Tag>
            <Tag v-else color="primary">已填写</Tag>
          </template>
          <template slot-scope="{ row }" slot="action">
            <ButtonGroup>
              <Button v-if="isAuth('declare:estimatepost:info')" type="primary" size="small" @click="viewEstimateDetail(row)">查看评估详情</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <EstimatePostForm ref="estimatePostForm" @update="getEstimatePostList" />

    <Modal title="查看评估详情" v-model="estimateModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
      <Tabs value="name1">
        <TabPane label="老师评估" name="name1">
          <Form :label-width="120" inline>
            <FormItem label="课程名">
              {{estimateDetail.courseName}}
            </FormItem>
            <FormItem label="教师姓名">
              {{estimateDetail.teacherName}}
            </FormItem>
          </Form>
          <Form :label-width="120" inline>
            <FormItem label="学生姓名">
              {{estimateDetail.studentName}}
            </FormItem>
            <FormItem label="学生学号">
              {{estimateDetail.studentCode}}
            </FormItem>
            <FormItem label="学生电话">
              {{estimateDetail.studentPhone}}
            </FormItem>
            <FormItem label="学生邮箱">
              {{estimateDetail.studentEmail}}
            </FormItem>
          </Form>

          <Form :label-width="120">
            <FormItem label="老师评估">
              <Input type="textarea" :rows="6" :readonly="true" v-model="estimateDetail.teacherEstimate" />
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="学生自评" name="name2">
          <Form :label-width="120" inline>
            <FormItem label="课程名">
              {{estimateDetail.courseName}}
            </FormItem>
            <FormItem label="教师姓名">
              {{estimateDetail.teacherName}}
            </FormItem>
          </Form>

          <Form :label-width="120">
            <FormItem label="学生自评">
              <Input type="textarea" :rows="8" :readonly="true" v-model="estimateDetail.studentEstimate" />
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>

  </div>
</template>

<script>
import api from '@/api/declare-estimate/estimatepost'
import EstimatePostForm from './estimatepost-form'
export default {
  name: 'EstimatePost-query',
  components: { EstimatePostForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      exportLoading2: false,
      estimateModalVisible: false,
      estimateDetail: {},
      selectedList: [],
      batchList: [],
      searchForm: {
        page: 1,
        limit: 10,
        courseName: '',
        studentName: '',
        teacherName: '',
        studentCode: '',
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
          title: '老师姓名',
          key: 'teacherName',
          minWidth: 100,
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
          title: '学号',
          key: 'studentCode',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生自评状态',
          slot: 'studentStatus',
          minWidth: 120
        },
        {
          title: '老师评估状态',
          slot: 'teacherStatus',
          minWidth: 120
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
      this.getEstimatePostList()
      this.adjustTableHeight()
      this.loadEstimateBatchList()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 350
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
      params.exportQuery = true
      api.getEstimatePostList(params)
        .then(res => {
          this.exportLoading = false
          let data = res.data
          this.turn2NewPage(this.$config.downloadExcelUrl, data)
        })
        .catch(e => {
          this.exportLoading = false
        })
    },
    exportEstimatePostAttachment () {
      this.exportLoading2 = true
      let params = Object.assign({}, this.searchForm)
      api.exportEstimatePostAttachment(params)
        .then(res => {
          this.exportLoading2 = false
          let data = res.data
          this.turn2NewPage(this.$config.downloadZipUrl, data)
        })
        .catch(e => {
          this.exportLoading2 = false
        })
    },
    addEstimatePost () {
      this.$refs.estimatePostForm.addEstimatePost(this.searchForm.batchId)
    },
    viewEstimatePost (v) {
      this.$refs.estimatePostForm.viewEstimatePost(v.id)
    },
    viewEstimateDetail (v) {
      this.estimateModalVisible = true
      api.getEstimatePostInfo(v.id).then(res => {
        this.estimateDetail = res.estimatePost
      })
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
