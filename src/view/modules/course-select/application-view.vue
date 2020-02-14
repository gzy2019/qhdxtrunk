<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="选课批次" prop="batchId">
            <Select v-model="searchForm.batchId" style="width:160px">
              <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
            </Select>
          </Form-item>
          <Form-item label="课程名称" prop="courseName">
            <Input type="text" v-model="searchForm.courseName" clearable placeholder="请输入课程名称" style="width: 160px" />
          </Form-item>
          <Form-item label="课程号" prop="courseCode">
            <Input type="text" v-model="searchForm.courseCode" clearable placeholder="请输入课程号" style="width: 160px" />
          </Form-item>
          <Form-item label="课程序号" prop="courseOrderNum">
            <Input type="text" v-model="searchForm.courseOrderNum" clearable placeholder="请输入课程序号" style="width: 160px" />
          </Form-item>
          <Form-item label="教师" prop="teacherId">
            <TeacherSelect v-model="searchForm.teacherId" :clearable="true" style="width:160px"></TeacherSelect>
          </Form-item>
          <Form-item label="学生" prop="studentName">
            <Input v-model="searchForm.studentName" :clearable="true" style="width:160px" placeholder="请输入学生"></Input>
          </Form-item>
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
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
import apiCourse from '@/api/mpac-batch-course'
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
        teacherId: '',
        studentName: '',
        courseName: '',
        courseCode: '',
        courseOrderNum: '',
        materialNeedFlag: undefined
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
          minWidth: 120
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 160
        },
        {
          title: '提交选课时间',
          key: 'createTime',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 180
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
        if (this.$route.params.batchId) {
          this.searchForm.batchId = this.$route.params.batchId
        } else if (this.batchList.length > 0) {
          this.searchForm.batchId = this.batchList[0].id
        }
        if (this.$route.params.courseId) {
          this.searchForm.courseId = this.$route.params.courseId
          apiCourse.getMpacBatchCourseInfo(this.$route.params.courseId).then(res => {
            this.getMpacCourseStuList()
            this.searchForm.courseName = res.mpacBatchCourse.courseName
            this.searchForm.courseCode = res.mpacBatchCourse.courseCode
            this.searchForm.courseOrderNum = res.mpacBatchCourse.courseOrderNum
            this.searchForm.teacherId = res.mpacBatchCourse.teacherId
          })
        } else {
          this.getMpacCourseStuList()
        }
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      delete this.searchForm.courseId
      this.getMpacCourseStuList()
    },
    handleClear () {
      let batchId = this.searchForm.batchId
      this.$refs.searchForm.resetFields()
      this.searchForm.batchId = batchId
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
