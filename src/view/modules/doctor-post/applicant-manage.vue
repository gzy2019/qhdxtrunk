<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="批次" prop="applicantProjectId">
            <Select v-model="searchForm.applicantProjectId" style="width:200px" @on-change="handleSearch">
            <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
            </Select>
        </Form-item>
        <Form-item label="提交状态" prop="applicantStatus">
            <Select v-model="searchForm.applicantStatus" placeholder="请选择" @on-change="handleSearch" clearable style="width: 200px">
            <Option :value=0>未提交</Option>
            <Option :value=1>已提交</Option>
            </Select>
        </Form-item>
        <Form-item label="初选状态" prop="handleStatus">
            <Select v-model="searchForm.handleStatus" placeholder="请选择" @on-change="handleSearch" clearable style="width: 200px">
            <Option :value=0>未处理</Option>
            <Option :value=1>选定</Option>
            <Option :value=2>拒绝</Option>
            </Select>
        </Form-item>
        <Form-item label="提交时间区间" prop="username">
            <IDatePicker type="daterange" v-model="searchForm.dateRange" split-panels placeholder="提交时间" style="width: 200px" />
        </Form-item>
            <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
        </Form>
        <Row>
          <i-col span="24" class="operation btn_group">
            <Button type="primary" :disabled="selectedList.length === 0" icon="ios-edit-outline" @click="changeHandleStatusBatch">批量处理</Button>
            <Button type="primary" :loading="exportLoading" icon="ios-download-outline" @click="excelExport">导出所有</Button>
          </i-col>
        </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="teacherName">
                <span v-if="row.teacher && row.teacher.postTeacher">{{row.teacher.postTeacher.teacherName}}</span>
            </template>
            <template slot-scope="{ row }" slot="applyDirection">
                <span v-if="row.teacher && row.teacher.postTeacher">{{row.teacher.postTeacher.applyDirectionStr}}</span>
            </template>
            <template slot-scope="{ row }" slot="applicantStatus">
                <Tag :color="row.applicantStatus | applicantStatusColor">{{row.applicantStatusDesc}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="handleStatus">
                <div title="点击修改" v-if="isAuth('doctorpost:doctorpostapplicant:update')">
                    <Button @click="changeHandleStatus(row)" size="small" :type="row.handleStatus | handleStatusColor">{{row.handleStatusDesc}}</Button>
                </div>
                <div v-else>
                    <Button size="small" :type="row.handleStatus | handleStatusColor">{{row.handleStatusDesc}}</Button>
                </div>
            </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <ApplicantInfo ref="applicantInfo" v-show="applicantInfoVisible" />

    <Modal
        title="修改选定状态"
        v-model="handleStatusModal"
        :width="500"
        class-name="vertical-center-modal"
    >
        <Form ref="handleStatusForm" :model="handleStatusForm" :label-width="100">
            <FormItem label="选定状态">
                <Select v-model="handleStatusForm.handleStatus" style="width:200px">
                    <Option :value="0">未处理</Option>
                    <Option :value="1">通过</Option>
                    <Option :value="2">拒绝</Option>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="handleStatusModal = false">取消</Button>
            <Button type="primary" :loading="submitLoading" v-if="handleStatusForm.ids" @click="saveHandleStatusBatch">提交</Button>
            <Button type="primary" :loading="submitLoading" v-else @click="saveHandleStatus">提交</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
import api from '@/api/doctorpost/doctorpostapplicant'
import apiProject from '@/api/doctorpost/doctorpostproject'
import ApplicantInfo from '@/view/modules/doctor-post/components/applicant-info'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'applicationStatus',
  components: {
    ApplicantInfo, IDatePicker
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      modalViewDetail: false,
      handleStatusModal: false,
      handleStatusForm: {
        ids: undefined,
        id: undefined,
        handleStatus: ''
      },
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        dateRange: [],
        applicantName: '',
        applicantProjectId: undefined,
        applicantStatus: undefined,
        handleStatus: undefined
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'applicantName',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '面试申请号',
          key: 'applicantNo',
          minWidth: 150,
          className: 'font_color'
        },
        {
          title: '完成比例(%)',
          key: 'fillProgressPercent',
          minWidth: 150,
          className: 'font_color'
        },
        {
          title: '提交状态',
          slot: 'applicantStatus',
          minWidth: 100
        },
        {
          title: '选定状态',
          slot: 'handleStatus',
          minWidth: 100
        },
        {
          title: '导师姓名',
          slot: 'teacherName',
          minWidth: 100
        },
        {
          title: '研究方向',
          slot: 'applyDirection',
          minWidth: 100
        },
        {
          title: '提交时间',
          key: 'submitTime',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h('Tooltip', {
                props: {
                  content: '查看详情',
                  transfer: true
                }
              }, [h(
                'Icon',
                {
                  props: {
                    type: 'ios-eye-outline',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.viewDetail(params.row)
                    }
                  }
                },
                '查看'
              )]
              )])
          }
        }
      ],
      data2: [
        {
          title: '学生管理',
          expand: true,
          children: [
            {
              title: '学生管理',
              expand: true,
              children: [
                {
                  title: '学生管理'
                },
                {
                  title: '学生管理'
                }
              ]
            }
          ]
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      applicantInfoVisible: false,
      selectedList: [],
      projectList: []
    }
  },
  filters: {
    applicantStatusColor (val) {
      if (val === 1) {
        return 'primary'
      }
      return 'default'
    },
    handleStatusColor (val) {
      if (val === 1) {
        return 'primary'
      } else if (val === 2) {
        return 'error'
      }

      return 'default'
    }
  },
  methods: {
    init () {
      apiProject.getDoctorPostProjectList({
        limit: 300
      }).then(res => {
        this.projectList = res.page.list
        if (this.$route.params.projectId) {
          this.searchForm.applicantProjectId = this.$route.params.projectId
        } else if (this.projectList.length > 0) { this.searchForm.applicantProjectId = this.projectList[0].id }
        this.getApplicantList()
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getApplicantList()
    },
    handleClear () {
      let batchId = this.searchForm.applicantProjectId
      this.$refs.searchForm.resetFields()
      this.searchForm.dateRange = []
      this.searchForm.applicantProjectId = batchId
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getApplicantList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getApplicantList () {
      this.loading = true
      let params = Object.assign({}, this.searchForm)
      if (params.dateRange.length) {
        params.createTimeBegin = params.dateRange[0]
        params.createTimeEnd = params.dateRange[1]
        delete params.dateRange
      }
      api.getDoctorPostApplicantList(params).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    changeHandleStatus (item) {
      this.handleStatusModal = true
      this.handleStatusForm.id = item.id
      this.handleStatusForm.ids = ''
      this.handleStatusForm.handleStatus = item.handleStatus
    },
    changeHandleStatusBatch (item) {
      this.handleStatusModal = true
      let ids = this.selectedList.map(item => item.id)
      this.handleStatusForm.id = ''
      this.handleStatusForm.ids = ids.join(',')
      this.handleStatusForm.handleStatus = 1
    },
    saveHandleStatusBatch () {
      this.submitLoading = true
      api.handleDoctorPostApplicant(this.handleStatusForm).then(res => {
        this.handleStatusModal = false
        this.$Message.success('修改成功')
        this.getApplicantList()
      }).finally(() => {
        this.submitLoading = false
      })
    },
    saveHandleStatus () {
      this.submitLoading = true
      api.updateDoctorPostApplicant(this.handleStatusForm).then(res => {
        this.handleStatusModal = false
        this.$Message.success('修改成功')
        this.getApplicantList()
      }).finally(() => {
        this.submitLoading = false
      })
    },
    viewDetail (param) {
      this.applicantInfoVisible = true
      this.$refs.applicantInfo.init(param.id)
    },
    excelExport () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getDoctorPostApplicantList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped>
.words p {
  font-size: 12px;
}
.words span {
  color: red;
}
</style>
