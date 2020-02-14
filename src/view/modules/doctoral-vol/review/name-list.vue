<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="招生批次" prop="projectId">
          <Select v-model="searchForm.projectId" style="width:170px">
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
          </Select>
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_Score" style="margin-bottom: 10px;">
        <Col span="24">
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" border stripe ref="table" size="small" :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="priorityRecommended">
            <Tag :color="row.priorityRecommended ? 'primary' :'default' ">{{row.priorityRecommended?'是':'否'}}</Tag>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!--推荐详情 start-->
    <Modal title="推荐详情" v-model="recommendModel" :width="400" class-name="vertical-center-modal details_com">
      <CellGroup>
        <Cell v-for="(item, index) in recommendDetailList" :key="index" :title="item.teacherName" :extra="item.priorityRecommend?'优先推荐':'普通推荐'" />
      </CellGroup>
      <div slot="footer">
        <Button type="primary" @click="recommendModel = false">确定</Button>
      </div>
    </Modal>
    <!--推荐详情 end-->

    <ApplicantInfo ref="applicantInfo" v-show="applicantInfoVisible" />

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/doctor/applicant'
import projectApi from '@/api/doctor/apply-project'
import ApplicantInfo from '@/view/modules/doctoral-vol/components/applicant-info'
export default {
  name: 'recommend-list',
  components: {
    Tables, ApplicantInfo
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      applicantInfoVisible: false,
      recommendModel: false,
      modalTitle: '',
      projectList: [],
      searchForm: {
        page: 1,
        limit: 10,
        projectId: undefined
      },
      dataForm: {
        projectName: '',
        projectApplyStartTime: '',
        projectApplyEndTime: '',
        projectStartTime: '',
        projectOpenFlag: true
      },
      dataFormValidate: {
        projectName: [{ required: true, message: '报考方向不能为空', trigger: 'blur' }],
        projectApplyStartTime: [{ required: true, message: '报名开始日期不能为空', trigger: 'blur' }],
        projectApplyEndTime: [{ required: true, message: '报名截止日期不能为空', trigger: 'blur' }],
        projectStartTime: [{ required: true, message: '入学日期不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      selectList: [],
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'applicantName',
          minWidth: 100
        },
        {
          title: '面试申请号',
          key: 'applicantNo',
          minWidth: 120,
          className: 'font_color'
        },
        {
          title: '是否优先推荐',
          slot: 'priorityRecommended',
          minWidth: 120,
          className: 'font_color'
        },
        {
          title: '推荐详情',
          key: 'recommendedDetail',
          minWidth: 120,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: () => {
                    this.showRecommendList(params.row)
                  }
                }
              }, '查看推荐详情')
          }
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
                      this.viewApplicantInfo(params.row)
                    }
                  }
                },
                '查看'
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      recommendDetailList: []
    }
  },
  watch: {
    'searchForm.projectId' () {
      this.handleSearch()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadProjectList()
    },
    loadProjectList () {
      projectApi.getProjectData().then(res => {
        this.projectList = res.list
        if (this.projectList.length) {
          this.searchForm.projectId = this.projectList[0].id
        } else {
          this.searchForm.projectId = ''
        }
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getRecommendList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getRecommendList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getRecommendList () {
      this.loading = true
      api.getDoctorRecommendList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.data
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getDoctorRecommendList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    viewApplicantInfo (v) {
      this.applicantInfoVisible = true
      this.$refs.applicantInfo.init(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    showRecommendList (obj) {
      api.getApplicantRecommentTutorList({applicantId: obj.id}).then(res => {
        this.recommendDetailList = res.page.list
        this.recommendModel = true
      })
    }
  }
}
</script>
<style scoped>
.details_com .ivu-form-item-content {
  width: 100px !important;
}
</style>
