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
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" border stripe ref="table" size="small" :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="standardScore">
              <font style="font-weight:bold;">85</font>
          </template>
          <template slot-scope="{ row }" slot="score">
              <font @click="showScoreDetail(row)" style="cursor: pointer;font-weight:bold;color:green;">{{row.score}}</font>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 评审详情 start-->
    <Modal title="评审详情" v-model="reviewDetails" :mask-closable='false' :width="960" scrollable class-name="vertical-center-modal details_com" :styles="{top: '20px'}">
      <Spin size="large" fix v-if="scoreLoading"></Spin>
      <Form :label-width="108" inline>
        <Row>
          <!--学生信息 start-->
          <Col span="24" class="popup_title">
          <p>
            <Icon type="ios-list" />学生信息</p>
          <Divider />
          </Col>
          <Col span="24">
            <FormItem label="姓名：">
              {{applicantScoreInfo.applicantName}}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="面试申请号：">
              {{applicantScoreInfo.applicantNo}}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="报考批次：">
              {{applicantScoreInfo.project.projectName}}
            </FormItem>
          </Col>
          <!--学生信息 end-->
          <!--报考志愿 start-->
          <Col span="24" class="popup_title">
            <p>
              <Icon type="ios-list" />报考志愿</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="志愿：" v-for="(item,index) in applicantScoreInfo.volunteerList" :key="index">
              第{{getCNOrder(index)}}志愿
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="研究方向：" v-for="(item,index) in applicantScoreInfo.volunteerList" :key="index + 10">
              {{item.projectTeacher.applyDirectionStr}}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="导师姓名：" v-for="(item,index) in applicantScoreInfo.volunteerList" :key="index + 20">
              {{item.projectTeacher.teacherName}}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="评审成绩：" v-for="(item,index) in applicantScoreInfo.volunteerList" :key="index + 30">
              {{item.score}}
            </FormItem>
          </Col>
          <!--报考志愿 end-->
          <!--评审成绩 start-->
          <Col span="24" class="popup_title">
            <p>
              <Icon type="ios-list" />评审成绩</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="标准分：">85</FormItem>
          </Col>
          <Col span="24">
            <FormItem v-for="(item,index) in applicantScoreInfo.scoreList" :key="index" :label="`${item.teacherName}:`">
              {{item.score}}
            </FormItem>
          </Col>
          <!--评审成绩 end-->

        </Row>
      </Form>
      <div slot="footer">
        <Button@click="reviewDetails=false">关闭</Button>
      </div>
    </Modal>
    <!-- 评审详情 end-->

    <ApplicantInfo ref="applicantInfo" v-show="applicantInfoVisible" />
  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/doctor/applicant'
import projectApi from '@/api/doctor/apply-project'
import ApplicantInfo from '@/view/modules/doctoral-vol/components/applicant-info'
export default {
  name: 'review',
  components: {
    Tables, ApplicantInfo
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      applicantInfoVisible: false,
      reviewDetails: false,
      projectList: [],
      searchForm: {
        page: 1,
        limit: 10,
        projectId: undefined
      },
      selectedList: [],
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
          minWidth: 120

        },
        {
          title: '标准分',
          slot: 'standardScore',
          minWidth: 120
        },
        {
          title: '分数详情',
          slot: 'score',
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

                    }
                  }
                },
                '下载'
              ),
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
      scoreLoading: false,
      applicantScoreInfo: {
        project: {}
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
    getCNOrder (index) {
      let strArr = ['一', '二', '三', '四', '五', '六', '七']
      if (strArr.length > index) return strArr[index]
      return index
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
      this.getReviewList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getReviewList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getReviewList () {
      this.loading = true
      api.getDoctorReviewList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData.list = res.list
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getDoctorReviewList(params).then(res => {
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
    cancel () {
      this.formModalVisible = false
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    showScoreDetail (row) {
      this.reviewDetails = true
      this.scoreLoading = true
      api.getDoctorApplicantScoreInfo(row.id).then(res => {
        this.applicantScoreInfo = res.applyApplicant
        this.scoreLoading = false
      }).catch(e => {
        this.scoreLoading = false
      })
    }
  }
}
</script>
