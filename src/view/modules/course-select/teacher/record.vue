<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="选课批次" prop="batchId">
            <Select v-model="searchForm.batchId" style="width:200px">
              <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <Form-item label="学生" prop="studentName">
          <Input v-model="searchForm.studentName" :clearable="true" style="width: 200px"></Input>
        </Form-item>
        <Button @click="handleSearch" type="primary">搜索</Button>
        <Button @click="handleClear" style="margin-left:5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

  </div>
</template>

<script>
import Tables from '_c/tables'
import TeacherSelect from '@/view/components/teacher-select'
import apiBatch from '@/api/mpac-batch'
import apiCourseStu from '@/api/mpac-course-student'
export default {
  name: 'applicationView',
  components: {
    Tables, TeacherSelect
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      modalType: 0,
      userModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        batchId: '',
        studentId: '',
        teacherId: this.$store.state.user.teacherId,
        materialNeedFlag: undefined
      },
      userForm: {
        userId: '',
        username: '',
        email: '',
        mobile: '',
        avator: '',
        status: 1,
        studentcategory: ''
      },
      userFormValidate: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        studentcategory: [{ required: true, type: 'array', min: 1, message: '角色不能为空', trigger: 'change' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '课程',
          key: 'courseName',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '课程号',
          key: 'courseCode',
          sortable: true,
          minWidth: 100
        },
        {
          title: '课程序号',
          key: 'courseOrderNum',
          sortable: true,
          minWidth: 120
        },
        {
          title: '学生证件号',
          key: 'studentCode',
          minWidth: 120,
          className: 'font_color'
        },
        {
          title: '学生姓名',
          key: 'studentName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '本科学校',
          key: 'stuSchoolUndergraduate',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '本科专业',
          key: 'stuSubjectUndergraduate',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 80
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 80
        },
        {
          title: '提交选课时间',
          key: 'createTime',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 160
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      batchList: []
    }
  },
  methods: {
    init () {
      // this.getMpacbatchList()
      apiBatch.getMpacbatchListAll().then(res => {
        this.batchList = res.list
        if (this.batchList.length > 0) { this.searchForm.batchId = this.batchList[0].id }
        this.getMpacCourseStuList()
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpacCourseStuList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpacCourseStuList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getMpacCourseStuList () {
      this.loading = true
      apiCourseStu.getMpacCourseStudentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.pageData.list.map(item => {
          item.courseName = item.course.courseName
          item.courseCode = item.course.courseCode
          item.courseOrderNum = item.course.courseOrderNum
          item.studentName = item.student.stuName
          item.studentCode = item.student.stuCode
          item.mobile = item.student.mobile
          item.email = item.student.email
          item.stuSchoolUndergraduate = item.student.stuSchoolUndergraduate
          item.stuSubjectUndergraduate = item.student.stuSubjectUndergraduate
        })
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      apiCourseStu.getMpacCourseStudentList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    }
  },
  mounted () {
    this.init()
  }
}
</script>
