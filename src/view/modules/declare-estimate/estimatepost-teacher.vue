<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="批次" prop="batchId">
          <Select v-model="searchForm.batchId" style="width:200px" @on-change="handleSearch">
            <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <Form-item label="课程名称" prop="courseName">
          <Input type="text" v-model="searchForm.courseName" clearable placeholder="请输入课程名称" style="width: 200px" />
        </Form-item>
        <Form-item label="填写状态" prop="teacherEstimateStatus">
          <Select v-model="searchForm.teacherEstimateStatus" clearable style="width:200px" @on-change="handleSearch">
            <Option value="1">未填写</Option>
            <Option value="2">已填写</Option>
          </Select>
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
      <Alert style="text-align: center;">三助评估开始时间：{{curBatch.teacherStartTime}} - {{curBatch.teacherEndTime}} 申报开放状态: {{curBatch.batchOpenFlag ? '开放' : '关闭'}}</Alert>
      <Row>
        <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="teacherStatus">
            <Tag v-if="!row.teacherEstimate" color="default">未填写</Tag>
            <Tag v-else color="primary">已填写</Tag>
          </template>
          <template slot-scope="{ row }" slot="action">
            <ButtonGroup>
              <Button v-if="isAuth('declare:estimatepost:info')" type="primary" size="small" @click="viewEstimatePost(row)">查看</Button>
              <Button :disabled="!curBatch.teacherTimeWindowOpen" v-if="curBatch.batchOpenFlag && isAuth('declare:estimatepost:update')" type="primary" size="small" @click="editEstimatePost(row)">评估</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change="handlePageSize" show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable="false" :width="700" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="formLoading"></Spin>
      <Form :label-width="120" inline>
        <FormItem label="课程名">{{estimateDetail.courseName}}</FormItem>
        <FormItem label="教师姓名">{{estimateDetail.teacherName}}</FormItem>
      </Form>
      <Form :label-width="120" inline>
        <FormItem label="学生姓名">{{estimateDetail.studentName}}</FormItem>
        <FormItem label="学生学号">{{estimateDetail.studentCode}}</FormItem>
        <FormItem label="学生电话">{{estimateDetail.studentPhone}}</FormItem>
        <FormItem label="学生邮箱">{{estimateDetail.studentEmail}}</FormItem>
      </Form>
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="老师评估" prop="teacherEstimate">
          <Input type="textarea" :rows="6" :readonly="modalView" :clearable="!modalView" v-model="dataForm.teacherEstimate" :maxlength="2000" placeholder="请输入评估内容" />
        </FormItem>
        <FormItem label="分数" prop="teacherScore">
          <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.teacherScore" :maxlength="50" placeholder="请输入分数" />
        </FormItem>
        <FormItem label="上传打分表" prop="scoreAttachment">
          <IUpload :disabled="modalView" v-model="dataForm.scoreAttachment" :defaultList="dataForm.defaultFileList" :onlyone="false" :multiple="true" :maxSize="20480" />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="formModalVisible = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveEstimatePost">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import api from '@/api/declare-estimate/estimatepost'
import IUpload from '@/view/components/iupload'
export default {
  name: 'EstimatePost-teacher',
  components: { IUpload },
  data () {
    return {
      loading: true,
      tableHeight: 330,
      selectedList: [],
      batchList: [],
      curBatch: {},
      searchForm: {
        page: 1,
        limit: 10,
        courseName: '',
        studentName: '',
        studentCode: '',
        teacherEstimateStatus: '',
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
          title: '填写状态',
          slot: 'teacherStatus',
          minWidth: 100
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 180
        }
      ],
      formModalVisible: false,
      modalView: false,
      formLoading: false,
      modalTitle: '',
      estimateDetail: {},
      dataForm: {
        teacherEstimate: '',
        teacherScore: '',
        scoreAttachment: [],
        defaultFileList: undefined,
        id: undefined
      },
      dataFormValidate: {
        teacherEstimate: [
          { required: true, message: '评估内容不能为空', trigger: 'blur' }
        ],
        teacherScore: [
          { required: true, message: '分数不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    'searchForm.batchId': {
      handler () {
        this.curBatch =
          this.batchList.find(item => item.id === this.searchForm.batchId) ||
          {}
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
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
      let batchId = this.searchForm.batchId
      this.$refs.searchForm.resetFields()
      this.searchForm.batchId = batchId
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
        if (this.batchList.length > 0) {
          this.searchForm.batchId = this.batchList[0].id
        }
        this.getEstimatePostList()
      })
    },
    exportEstimatePost () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
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
    viewEstimatePost (v) {
      this.modalTitle = '申报详情'
      this.$refs.dataForm.resetFields()
      this.formLoading = true
      this.dataForm.defaultFileList = []
      api.getEstimatePostInfo(v.id).then(res => {
        let entity = res.estimatePost
        Object.keys(this.dataForm).forEach(key => {
          if (key === 'scoreAttachment' && entity[key]) {
            entity[key] = JSON.parse(entity[key])
          }
          this.dataForm[key] = entity[key]
        })
        if (this.dataForm.scoreAttachment) {
          this.dataForm.defaultFileList = JSON.parse(
            JSON.stringify(this.dataForm.scoreAttachment)
          )
        }
        this.estimateDetail = Object.assign({}, entity)
        this.formLoading = false
      })
        .catch(e => {
          this.formLoading = false
        })
      this.formModalVisible = true
      this.modalView = true
    },
    editEstimatePost (v) {
      this.modalTitle = '老师评估'
      this.$refs.dataForm.resetFields()
      this.formLoading = true
      this.dataForm.defaultFileList = []
      api.getEstimatePostInfo(v.id).then(res => {
        let entity = res.estimatePost
        Object.keys(this.dataForm).forEach(key => {
          if (key === 'scoreAttachment' && entity[key]) {
            entity[key] = JSON.parse(entity[key])
          }
          this.dataForm[key] = entity[key]
        })
        if (this.dataForm.scoreAttachment) {
          this.dataForm.defaultFileList = JSON.parse(
            JSON.stringify(this.dataForm.scoreAttachment)
          )
        }
        this.estimateDetail = Object.assign({}, entity)
        this.formLoading = false
      })
        .catch(e => {
          this.formLoading = false
        })
      this.formModalVisible = true
      this.modalView = false
    },
    saveEstimatePost () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          if (data.scoreAttachment) {
            data.scoreAttachment = JSON.stringify(data.scoreAttachment)
          }
          api.updateEstimatePost(data).then(res => {
            this.submitLoading = false
            this.$Message.success('保存成功！')
            this.formModalVisible = false
            this.getEstimatePostList()
          }).catch(e => {
            this.submitLoading = false
            this.getEstimatePostList()
          })
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    }
  }
}
</script>
