<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="选课批次" prop="batchId">
            <Select v-model="searchForm.batchId" style="width:200px" @on-change="handleSearch">
              <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <Form-item label="课程" prop="courseName">
          <Input type="text" v-model="searchForm.courseName" clearable placeholder="请输入课程名称" style="width: 200px" />
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
          <!-- <Button @click="addUser" v-if="isAuth('sys:user:save')">查看本批次情况</Button> -->
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 单批次选课 start-->
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="1170" scrollable class-name="vertical-center-modal popup information" :styles="{top: '20px'}" style="display:">
      <Row class="search">
        <Form ref="dataForm" :model="dataForm" inline :label-width="90" :rules="dataFormValidate">
          <Col span="24" style="margin:10px 0 20px ;text-align:center;font-size:16px">2017级集中班选课-选课名单</Col>
          <Col span="12">
          <Form-item label="学生证件号" prop="batchheader">
            <Input type="text" v-model="dataForm.studentCode" clearable placeholder="请输入证件号" style="width: 160px" />
          </Form-item>
          <Form-item label="是否预定教材" prop="batchheader">
            <Select v-model="dataForm.status" placeholder="请选择" clearable style="width: 160px">
              <Option value=1>是</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6" class="btn_group">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear">清除</Button>
          </Col>
        </Form>
      </Row>
      <Row>
        <tables ref="table" size="small" v-model="userData" :columns="columns2" />
      </Row>
      <Row type="flex" justify="end" class="page" style="margin-top:2vh">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
      <div slot="footer">
        <Button @click="dataModalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading">保存</Button>
      </div>
    </Modal>
    <!-- 单批次选课 end-->

    <!-- 单科选课新增 start-->
    <Modal :title="modalTitle" v-model="courseModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
        <FormItem label="学生证件号" prop="studentCode">
          <Input type="text" v-model="dataForm.studentCode" clearable placeholder="请输入学生证件号" />
        </FormItem>
        <FormItem label="学生姓名" prop="studentName">
          <Input type="text" v-model="dataForm.studentName" clearable placeholder="请输入学生姓名" />
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input type="text" v-model="dataForm.mobile" clearable placeholder="请输入手机号" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input type="text" v-model="dataForm.email" clearable placeholder="请输入邮箱" />
        </FormItem>
        <FormItem label="选课时间" prop="username">
          <DatePicker type="datetime" placeholder="选择选课时间" style="width: 100%"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="courseModalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading">保存</Button>
      </div>
    </Modal>
    <!-- 单科选课新增 end-->

    <!-- 单科选课 start-->
    <Modal :title="modalTitle" v-model="courseModalVisible2" :mask-closable='false' :width="1170" scrollable class-name="vertical-center-modal popup information" :styles="{top: '20px'}">
      <Row class="search">
        <Form ref="dataForm" :model="dataForm" inline :label-width="90" :rules="dataFormValidate">
          <Form-item label="课程名称：" prop="batchheader">
            电子财务
          </Form-item>
          <Form-item label="教师名称：" prop="batchheader">
            刘青
          </Form-item>
          <Form-item label="上课时间：" prop="batchheader">
            周六9:30-12:00
          </Form-item>
          <Form-item label="上课地点：" prop="batchheader">
            学院231
          </Form-item>
          <Col span="6">
            <Form-item label="学生证件号" prop="batchheader">
              <Input type="text" v-model="searchForm.batchheader" clearable placeholder="请输入证件号" style="width: 160px" />
            </Form-item>
          </Col>
          <Col span="6" class="btn_group">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleSearch">清除</Button><!-- icon="ios-trash-outline"-->
          </Col>
        </Form>
        <Col span="24" class="operation btn_group">
          <Button @click="addUser" type="primary" icon="md-add">新增</Button>
          <Button >批量删除</Button>
          <Button @click="addUser" v-if="isAuth('sys:user:save')">修改</Button>
        </Col>
      </Row>
      <Row>
        <tables ref="table" size="small" v-model="userData" :columns="columns3" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
      <div slot="footer">
        <Button @click="courseModalVisible2=false">取消</Button>
        <Button type="primary" :loading="submitLoading">保存</Button>
      </div>
    </Modal>
    <!-- 单科选课 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import TeacherSelect from '@/view/components/teacher-select'
import apiBatch from '@/api/mpac-batch'
import apiCourse from '@/api/mpac-batch-course'
export default {
  name: 'applicationResult',
  components: {
    Tables, TeacherSelect
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      submitLoading: false,
      modalTitle: '',
      modalType: 0,
      dataModalVisible: false,
      courseModalVisible: false,
      courseModalVisible2: false,
      searchForm: {
        page: 1,
        limit: 10,
        batchId: '',
        courseName: '',
        teacherId: this.$store.state.user.teacherId,
        statFlag: true
      },
      dataForm: {
        userId: '',
        studentCode: '',
        studentName: '',
        schoolName: '',
        special: '',
        mobile: '',
        email: 1,
        studentcategory: ''
      },
      dataFormValidate: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
      },
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '课程',
          key: 'courseName',
          minWidth: 80
        },
        {
          title: '课程号',
          key: 'courseCode',
          sortable: true,
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '课程序号',
          key: 'courseOrderNum',
          sortable: true,
          minWidth: 120,
          className: 'font_color'
        },
        {
          title: '教师',
          key: 'teacherName',
          minWidth: 80
        },
        {
          title: '容量',
          key: 'courseCapacity',
          sortable: true,
          minWidth: 80
        },
        {
          title: '已报人数',
          key: 'courseSelectedCount',
          sortable: true,
          minWidth: 80
        },
        {
          title: '预定教材数',
          key: 'materialSelectedCount',
          minWidth: 80
        }
      ],
      columns2: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '课程',
          key: 'course',
          minWidth: 80
        },
        {
          title: '教师',
          key: 'teacher',
          minWidth: 80
        },
        {
          title: '学生证件号',
          key: 'certificate',
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '学生姓名',
          key: 'name',
          minWidth: 80
        },
        {
          title: '本科学校',
          key: 'school',
          minWidth: 80
        },
        {
          title: '本科专业',
          key: 'major',
          minWidth: 80
        },
        {
          title: '手机号',
          key: 'number',
          minWidth: 80
        },
        {
          title: '邮箱',
          key: 'mail',
          minWidth: 80
        },
        {
          title: '提交选课时间',
          key: 'coursedate',
          minWidth: 120
        },
        {
          title: '是否预定教材',
          key: 'material',
          minWidth: 120
        }
      ],
      columns3: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '学生证件号',
          key: 'certificate',
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '学生姓名',
          key: 'name',
          minWidth: 80
        },
        {
          title: '本科学校',
          key: 'school',
          minWidth: 80
        },
        {
          title: '本科专业',
          key: 'major',
          minWidth: 80
        },
        {
          title: '手机号',
          key: 'number',
          minWidth: 80
        },
        {
          title: '邮箱',
          key: 'mail',
          minWidth: 80
        },
        {
          title: '提交选课时间',
          key: 'coursedate',
          minWidth: 120
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Icon',
                {
                  props: {
                    type: 'ios-create-outline',

                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Icon',
                {
                  props: {
                    type: 'ios-trash-outline',
                    size: '20'
                  },
                  on: {
                    click: () => {
                      this.updateUserStatus(params.row)
                    }
                  }
                },
                params.row.status === 0 ? '启用' : '禁用'
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      userData: [],
      batchList: []
    }
  },
  methods: {
    addUser () {
      console.log('test')
    },
    init () {
      // this.getMpacbatchList()
      apiBatch.getMpacbatchListAll().then(res => {
        this.batchList = res.list
        if (this.batchList.length > 0) { this.searchForm.batchId = this.batchList[0].id }
        this.getMpacBatchCourseList()
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpacBatchCourseList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpacBatchCourseList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getMpacBatchCourseList () {
      this.loading = true
      apiCourse.getMpacBatchCourseList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      apiCourse.getMpacBatchCourseList(params).then(res => {
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
