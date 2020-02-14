<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="招生批次" prop="applicantProjectId">
            <Select v-model="searchForm.applicantProjectId" style="width:200px" @on-change="handleSearch">
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
            </Select>
          </Form-item>
          <Form-item label="提交状态" prop="applicantStatus">
            <Select v-model="searchForm.applicantStatus" placeholder="请选择" clearable style="width: 200px">
              <Option :value=0>未提交</Option>
              <Option :value=1>已提交</Option>
            </Select>
          </Form-item>
          <Form-item label="评审状态" prop="applicantScoreStatus">
            <Select v-model="searchForm.applicantScoreStatus" placeholder="请选择" clearable style="width: 200px">
              <Option :value=0>未打分</Option>
              <Option :value=1>部分打分</Option>
              <Option :value=2>全部打分</Option>
            </Select>
          </Form-item>
          </Col>
          <Form-item label="发送时间区间" prop="username">
            <IDatePicker type="daterange" v-model="searchForm.dateRange"  split-panels placeholder="发送时间" style="width: 200px" />
          </Form-item>
          <Button @click="handleSearch" type="primary" class="Purple_border" style="margin-left:15px">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
        </Form>
        <Row>
          <Col span="24" class="operation btn_group">
            <Button v-if="false" type="primary" :disabled="selectedList.length === 0">批量发送面试邀请</Button>
            <Button type="primary" :disabled="selectedList.length === 0" @click="downloadFiles">批量下载附件</Button>
            <Button type="primary" :loading="exportExcelLoading1" :disabled="selectedList.length === 0 || exportExcelLoading2" @click="excelExport(true)">Excel导出选中</Button>
            <Button type="primary" :loading="exportExcelLoading2" :disabled="exportExcelLoading1" @click="excelExport(false)">Excel导出所有</Button>
          </Col>
        </Row>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <ApplicantInfo ref="applicantInfo" v-show="applicantInfoVisible" />

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/master/applicant'
import apiProject from '@/api/master/apply-project'
import ApplicantInfo from '@/view/modules/master-vol/components/applicant-info'
import IDatePicker from '@/view/components/idate-picker'
import { turn2NewPage } from '@/libs/util'
export default {
  name: 'applicationStatus',
  components: {
    Tables, ApplicantInfo, IDatePicker
  },
  data () {
    return {
      exportExcelLoading1: false,
      exportExcelLoading2: false,
      loading: false,
      modalViewDetail: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        dateRange: [],
        applicantProjectId: undefined,
        applicantStatus: undefined,
        applicantScoreStatus: undefined
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
          title: '提交状态',
          key: 'applicantStatusDesc',
          minWidth: 120
        },
        {
          title: '评审状态',
          key: 'applicantScoreStatusDesc',
          minWidth: 120,
          sortable: true
        },
        {
          title: '面试结果',
          key: 'results',
          minWidth: 120,
          sortable: true
        },
        {
          title: '提交时间',
          key: 'modifyTime',
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
              h(
                'Icon',
                {
                  props: {
                    type: 'md-download',

                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.previewData(params.row)
                    }
                  }
                },
                '下载'
              ),
              h(
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
              )
            ])
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
  methods: {
    init () {
      apiProject.getProjectList({
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
      this.$refs.searchForm.resetFields()
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
      api.getMasterApplicantList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    previewData (row) {
      let url = '/master/apply/applicant/export_pdf?preview=true&applicantId=' + row.id
      turn2NewPage(url)
    },
    downloadFiles () {
      let params = 'a=a'
      this.selectedList.map((item, index) => {
        params += '&applicantIds=' + item.id
      })
      let url = '/master/apply/applicant/export_files?' + params
      turn2NewPage(url)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    viewDetail (param) {
      this.applicantInfoVisible = true
      this.$refs.applicantInfo.init(param.id)
    },
    excelExport (selected) {
      let params = {}
      if (selected) {
        let ids = this.selectedList.map(item => item.id)
        params = { ids: ids }
      } else {
        params = this.searchForm
      }
      if (selected) {
        this.exportExcelLoading1 = true
      } else {
        this.exportExcelLoading2 = true
      }
      api.exportApplicant2Excel(params).then(res => {
        if (selected) {
          this.exportExcelLoading1 = false
        } else {
          this.exportExcelLoading2 = false
        }
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        if (selected) {
          this.exportExcelLoading1 = false
        } else {
          this.exportExcelLoading2 = false
        }
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
