<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="招生批次" prop="projectId">
          <Select v-model="searchForm.projectId" style="width:200px">
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
          </Select>
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_Score" style="margin-bottom: 10px;">
        <Col span="24">
          <Button @click="exportRecommendList" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" border stripe ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
    </Card>

    <!--分数详情 start-->
    <Modal title="分数详情" v-model="scoreDetailVisible" :width="860" class-name="vertical-center-modal details_com" :styles="{top: '20px'}">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate" inline>
        <Form-item label="志愿">
          第一志愿
        </Form-item>
        <FormItem label="志愿">
          第二志愿
        </FormItem>
        <FormItem label="志愿">
          第三志愿
        </FormItem>
        <FormItem label="研究方向">
          社会治理
        </FormItem>
        <FormItem label="研究方向">
          社会治理
        </FormItem>
        <FormItem label="研究方向">
          社会治理
        </FormItem>
        <FormItem label="导师姓名">
          刘青青
        </FormItem>
        <FormItem label="导师姓名">
          刘青青
        </FormItem>
        <FormItem label="导师姓名">
          刘青青
        </FormItem>
        <FormItem label="评审成绩">
          86
        </FormItem>
        <FormItem label="评审成绩">
          86
        </FormItem>
        <FormItem label="评审成绩">
          86
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="scoreDetailVisible = false">取消</Button>
        <Button type="primary" @click="scoreDetailVisible = false">确定</Button>
      </div>
    </Modal>
    <!--分数详情 end-->

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
      loading: false,
      applicantInfoVisible: false,
      scoreDetailVisible: false,
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
          title: '分数',
          key: 'score',
          minWidth: 100
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
      }
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
        if (res.code === 200) {
          this.pageData.list = res.list
        }
      })
    },
    viewApplicantInfo (v) {
      this.applicantInfoVisible = true
      this.$refs.applicantInfo.init(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    exportRecommendList () {

    }
  }
}
</script>
<style scoped>
.details_com .ivu-form-item-content {
  width: 100px !important;
}
</style>
