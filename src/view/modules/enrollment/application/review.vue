<template>
  <div class="body-content">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="招生批次" prop="projectId">
          <Select v-model="searchForm.projectId" style="width:170px">
            <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
          </Select>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
      </Form>
      <Row class="operation btn_Score" style="margin-bottom: 10px;">
        <Col span="24">
          <Button @click="exportMpaaScore" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="standardScore">
              <font style="font-weight:bold;">{{row.score}}</font>
          </template>
          <template slot-scope="{ row }" slot="score">
              <Button size="small" type="primary" @click="viewMpaaScore(row)">查看打分</Button>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 评审详情 start-->
    <Modal title="评审成绩" v-model="formModalVisible" :mask-closable='false' :width="800" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="scoreLoading"></Spin>
      <Form ref="searchForm" :model="searchForm" inline :label-width="120" class="review_detail">
        <Row>
          <Col span="24" class="popup_title">
          <p>
            <Icon type="ios-list" />学生信息</p>
          <Divider />
          </Col>
          <Col span="24">
            <FormItem label="姓名">
              {{scoreInfo.applicantName}}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="面试申请号">
              {{scoreInfo.applicantNo}}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="报考批次">
              {{scoreInfo.project.projectName}}
            </FormItem>
          </Col>

          <Col span="24" class="popup_title">
            <p>
              <Icon type="ios-list" />评审成绩</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="标准分">{{scoreInfo.score}}</FormItem>
          </Col>
          <Col span="24">
            <FormItem v-for="(item,index) in scoreInfo.scoreList" :key="index" :label="`${item.teacherName}:`">
              {{item.score}}
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="cancel">关闭</Button>
      </div>
    </Modal>
    <!--评审详情 end-->

    <!-- 查看报名详情 -->
    <ApplicantInfo ref="applicantInfo" v-show="applicantInfoVisible" />

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/mpaa/score'
import applicantApi from '@/api/mpaa/applicant'
import projectApi from '@/api/mpaa/project'
import ApplicantInfo from '@/view/modules/enrollment/components/applicant-info'
export default {
  name: 'mpaascore-review',
  components: {
    Tables, ApplicantInfo
  },
  data () {
    return {
      exportLoading: false,
      loading: true,
      // tableHeight: 330,
      formModalVisible: false,
      applicantInfoVisible: false,
      scoreLoading: false,
      selectedList: [],
      projectList: [],
      searchForm: {
        page: 1,
        limit: 500,
        projectId: ''
      },
      scoreInfo: {
        project: {},
        scoreList: []
      },
      pageData: {
        totalCount: 0,
        list: []
      },
      columns: [
        {
          title: '姓名',
          key: 'studentName',
          minWidth: 100
        },
        {
          title: '申请号',
          key: 'applicantNo',
          minWidth: 100
        },
        {
          title: '标准分',
          slot: 'standardScore',
          minWidth: 100
        },
        {
          title: '分数',
          slot: 'score',
          minWidth: 100
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:applicant:info')) {
              btns.push(h(
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
                      this.viewMpaaApplicant(params.row)
                    }
                  }
                },
                '报名详情'
              ))
            }
            return h('div', btns)
          }
        }
      ]
    }
  },
  watch: {
    'searchForm.projectId' () {
      this.handleSearch()
    }
  },
  mounted () {
    this.init()
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
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
      this.getMpaaScoreList()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpaaScoreList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMpaaScoreList () {
      this.loading = true
      api.getMpaaScoreList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
      })
    },
    exportMpaaScore () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpaaScoreList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    cancel () {
      this.formModalVisible = false
    },
    viewMpaaScore (v) {
      this.formModalVisible = true
      this.scoreLoading = true
      applicantApi.getMpaApplicantScoreInfo(v.applicantId).then(res => {
        this.scoreInfo = res.scoreInfo
        this.scoreInfo.score = v.score
        this.scoreLoading = false
      }).catch(e => {
        this.scoreLoading = false
      })
    },
    viewMpaaApplicant (v) {
      this.applicantInfoVisible = true
      this.$refs.applicantInfo.init(v.applicantId)
    }
  }
}
</script>
<style scoped>
.review_detail .ivu-form-item {
  margin-bottom: 5px !important;
}
</style>
