<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="申报批次" prop="projectId">
          <Select v-model="searchForm.projectId" style="width:170px" @on-change="handleSearch">
            <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
        </Form-item>
        <Form-item label="学生姓名" prop="studentName">
          <Input type="text" v-model="searchForm.studentName" clearable placeholder="请输入学生姓名" style="width: 170px" />
        </Form-item>
        <Form-item style="margin-left: -70px">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <Col span="24">
        <Button :loading="exportLoading" @click="exportMpaeApplicant" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="subjectList">{{row.subjectList.map(item => item.name).join(' ')}}</template>
          <template slot-scope="{ row }" slot="startTime">{{row.project.startTime}}</template>
          <template slot-scope="{ row }" slot="year">{{row.project.year}}</template>
          <template slot-scope="{ row }" slot="applicantStatus">
            <Tag v-show="!row.applicantStatus" color="default">暂存</Tag>
            <Tag v-show="row.applicantStatus" color="primary">提交</Tag>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change="handlePageSize" show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable="false" :width="800" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="150" :rules="dataFormValidate">
        <Row>
          <Col span="12">
            <FormItem label="批次">{{dataForm.project.title}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="年度">{{dataForm.project.year}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="考试时间">{{dataForm.project.examTime}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="申报开始时间">{{dataForm.project.startTime}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="申报截止时间">{{dataForm.project.endTime}}</FormItem>
          </Col>
          <FormItem label class="grayline">
            <Divider />
          </FormItem>
          <Col span="12">
            <FormItem label="姓名" prop="studentName">{{dataForm.studentName}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="学号" prop="studentCode">{{dataForm.studentCode}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="学生类别" prop="studentType">{{dataForm.studentType}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="导师" prop="teacherName">{{dataForm.teacherName}}</FormItem>
          </Col>
          <FormItem label class="grayline">
            <Divider />
          </FormItem>
          <Col span="12">
          <FormItem label="联系方式" prop="mobile">
            <Input type="text" v-model="dataForm.mobile" clearable :maxlength="100" placeholder="请输入联系方式" />
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="电子邮箱" prop="email">
            <Input type="text" v-model="dataForm.email" clearable :maxlength="100" placeholder="请输入电子邮箱" />
          </FormItem>
          </Col>
        </Row>
        <FormItem label="报考科目" prop="subjectList">
          <CheckboxGroup v-model="dataForm.subjectList">
            <Checkbox v-for="(item,index) in subjectList" :key="index" :label="item.id">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMpaeApplicant">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import api from '@/api/mpae/mpaeapplicant'
import projectApi from '@/api/mpae/mpaeproject'
export default {
  name: 'MpaeApplicant-manage',
  data () {
    return {
      loading: true,
      exportLoading: false,
      // tableHeight: 230,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        studentName: '',
        projectId: null
      },
      subjectList: [],
      dataForm: {
        projectId: '',
        project: {},
        subjectList: [],
        studentId: '',
        studentName: '',
        studentCode: '',
        studentType: '',
        teacherId: '',
        teacherName: '',
        mobile: '',
        email: '',
        id: undefined
      },
      dataFormValidate: {
        mobile: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        subjectList: [
          {
            required: true,
            type: 'array',
            message: '申报科目不能为空',
            trigger: 'blur'
          }
        ]
      },
      submitLoading: false,
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
          title: '学生姓名',
          key: 'studentName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生编号',
          key: 'studentCode',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生类型',
          key: 'studentType',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '导师姓名',
          key: 'teacherName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申报状态',
          slot: 'applicantStatus',
          minWidth: 140,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '考试科目',
          slot: 'subjectList',
          minWidth: 150
        },
        {
          title: '申报时间',
          key: 'createTime',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '考试时间',
          slot: 'startTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '年度',
          slot: 'year',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 140,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:mpaeapplicant:info')) {
              btns.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.viewMpaeApplicant(params.row)
                      }
                    }
                  },
                  '查看'
                )
              )
            }
            if (this.isAuth('mpa:mpaeapplicant:update')) {
              btns.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editMpaeApplicant(params.row)
                      }
                    }
                  },
                  '编辑'
                )
              )
            }

            return h('div', btns)
          }
        }
      ],
      projectList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadSubjectList()
      this.loadProjectList()
      this.adjustTableHeight()
    },
    loadProjectList () {
      projectApi.getMpaeProjectSelectList().then(res => {
        this.projectList = res.list
        if (this.projectList.length > 0) {
          this.searchForm.projectId = this.projectList[0].id
        }
        this.handleSearch()
      })
    },
    loadSubjectList () {
      api.getMpaeSubjectList().then(res => {
        this.subjectList = res.list
      })
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpaeApplicantList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpaeApplicantList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      let pid = this.searchForm.projectId
      this.$refs.searchForm.resetFields()
      this.searchForm.projectId = pid
      this.handleSearch()
    },
    getMpaeApplicantList () {
      this.loading = true
      api.getMpaeApplicantList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportMpaeApplicant () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpaeApplicantList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    addMpaeApplicant () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewMpaeApplicant (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      api.getMpaeApplicantInfo(v.id).then(res => {
        let entity = res.mpaeApplicant
        if (entity.subjectList) {
          entity.subjectList = entity.subjectList.map(item => item.id)
        }
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editMpaeApplicant (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      api.getMpaeApplicantInfo(v.id).then(res => {
        let entity = res.mpaeApplicant
        if (entity.subjectList) {
          entity.subjectList = entity.subjectList.map(item => item.id)
        }
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.modalView = false
      this.formModalVisible = true
    },
    saveMpaeApplicant () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          data.subjectList = this.subjectList.filter(item =>
            data.subjectList.includes(item.id)
          )
          // 新增保存
          if (!data.id) {
            api.saveMpaeApplicant(data).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMpaeApplicant(data).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteMpaeApplicant (row) {
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
          api.deleteMpaeApplicant(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
