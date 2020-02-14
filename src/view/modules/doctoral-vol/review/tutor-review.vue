<template>
  <div class="body-content">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="招生批次" prop="applicantProjectId">
          <Select v-model="searchForm.applicantProjectId" style="width:200px">
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
          <Button @click="submitAll(true)" :disabled="!recommendable" type="primary" icon="ios-save-outline" style="margin-left: 10px;">提交优先推荐名单(剩余{{leftRecommendCount4Select}}人)</Button>
          <Button @click="submitAll(false)" :disabled="!recommendable" type="primary" icon="ios-save-outline" style="margin-left: 10px;">提交普通推荐名单(剩余{{leftRecommendCount4Select}}人)</Button>
        </Col>
      </Row>
      <Row class="operation btn_Score" style="margin-bottom: 10px;">
        <Col span="24">
          <Alert>
            <template slot="desc">您好，您当前可接受学生人数为
              <span style="color:red">{{applyLimit}}</span>人，你可以推荐<span style="color:red">{{recommendLimit}}</span>名学生进入推荐名单，请谨慎操作！
            </template>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="applicantName">
            <Tag color="default">{{row.applicantName}}</Tag>
          </template>
          <template slot-scope="{ row }" slot="applicantNo">
            <Tag color="default">{{row.applicantNo}}</Tag>
          </template>
          <template slot-scope="{ row }" slot="recommended">
            <template v-if="row.recommended">
              <Tag v-if="row.priorityRecommended" color="primary">优先推荐</Tag>
              <Tag v-else color="success">普通推荐</Tag>
            </template>
            <template v-else>
              <Tag color="default">未推荐</Tag>
            </template>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page" style="margin-top: 10px;">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' :page-size-opts=[100,200,300] show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
        <FormItem label="姓名" prop="studentName">
          <Input type="text" v-model="dataForm.studentName" :maxlength="100" readonly />
        </FormItem>
        <FormItem label="申请号" prop="applicantNo">
          <Input type="text" v-model="dataForm.applicantNo" :maxlength="100" readonly />
        </FormItem>
        <FormItem label="分数" prop="score">
          <InputNumber :min="0" :max="100" v-model="dataForm.score"  />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <ApplicantInfo ref="applicantInfo" v-show="applicantInfoVisible" />

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/doctor/apply-score-detail'
import applicantApi from '@/api/doctor/applicant'
import projectApi from '@/api/doctor/apply-project'
import ApplicantInfo from '@/view/modules/doctoral-vol/components/applicant-info'
export default {
  name: 'applyscoredetail-manage',
  components: {
    Tables, ApplicantInfo, api
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      applicantInfoVisible: false,
      tableHeight: 330,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      projectList: [],
      projectTeacher: null,
      recommendRadio: 1,
      searchForm: {
        page: 1,
        limit: 100,
        auditFlag: true, // 只有通过评审的学生才能显示
        applicantProjectId: ''
      },
      dataForm: {
        section: undefined,
        volunteerId: undefined,
        studentName: '',
        applicantNo: '',
        score: 80,
        groupId: '',
        applicantId: '',
        projectId: ''
      },
      dataFormValidate: {
        score: [
          { type: 'number', required: true, message: '分数不能为空', trigger: 'blur' }
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
          title: '姓名',
          slot: 'applicantName',
          minWidth: 100
        },
        {
          title: '申请号',
          slot: 'applicantNo',
          minWidth: 100
        },
        {
          title: '推荐状况',
          minWidth: 100,
          slot: 'recommended'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('doctor:applyscoredetail:info')) {
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
                      this.viewApplicantInfo(params.row)
                    }
                  }
                },
                '查看'
              ))
            }
            return h('div', btns)
          }
        }
      ]
    }
  },
  watch: {
    'searchForm.applicantProjectId' () {
      this.handleSearch()
      let project = this.projectList.find((item, index, array) => {
        return item.id === this.searchForm.applicantProjectId
      })
      this.recommendRadio = project.recommendRadio
      if (!this.time4score) this.$Message.info('该批次还未开启打分')
    }
  },
  computed: {
    time4score () {
      let project = this.projectList.find(item => item.id === this.searchForm.applicantProjectId)
      let ret = project && project.projectSupervisorScoreFlag
      return ret
    },
    recommendable () {
      let leftTotal = this.leftRecommendCount
      if (this.notRecommendList.length > 0) {
        let length2 = this.notRecommendList.length
        leftTotal = leftTotal - length2
      }
      return this.notRecommendList.length > 0 && this.leftRecommendCount > 0 && leftTotal >= 0
    },
    notRecommendList () {
      return this.selectedList.filter(item => !item.recommended)
    },
    leftRecommendCount () {
      let length = this.pageData.list.filter(item => item.recommended).length
      let leftCount = this.recommendLimit - length

      return leftCount > 0 ? leftCount : 0
    },
    leftRecommendCount4Select () {
      let leftTotal = this.leftRecommendCount
      if (this.notRecommendList.length > 0) {
        let length2 = this.notRecommendList.length
        leftTotal = leftTotal - length2
      }

      return leftTotal > 0 ? leftTotal : 0
    },
    applyLimit () {
      if (this.projectTeacher) {
        return this.projectTeacher.applyLimitNum || 0
      }
      return 0
    },
    recommendLimit () {
      return this.applyLimit * this.recommendRadio
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
      // 这里导师只能查看自己相关的批次
      projectApi.getProjectData4Tutor().then(res => {
        this.projectList = res.list
        if (this.projectList.length) {
          this.searchForm.applicantProjectId = this.projectList[0].id
          this.recommendRadio = this.projectList[0].recommendRadio
        } else {
          this.searchForm.applicantProjectId = ''
        }
      })
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getApplyDetailList()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getApplyDetailList()
    },
    getApplyDetailList () {
      if (!this.searchForm.applicantProjectId) {
        return
      }
      this.loading = true
      applicantApi.getDoctorApplicantlist4Tutor(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.projectTeacher = res.projectTeacher
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      applicantApi.getDoctorApplicantlist4Tutor(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportApplyScoreDetail () {
      this.$refs.table.exportCsv({
        filename: '评审成绩列表'
      })
    },
    viewApplicantInfo (v) {
      this.applicantInfoVisible = true
      this.$refs.applicantInfo.init(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    submitAll (priorityFlag) {
      let objList = []
      this.notRecommendList.map(item => {
        let obj = {}
        obj.applicantId = item.id
        obj.priorityRecommend = priorityFlag
        objList.push(obj)
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>名单提交后，不可修改，您确认提交${objList.length}人名单吗?</p>`,
        onOk: () => {
          applicantApi.saveApplicantRecomment4Tutor(objList).then(res => {
            this.$Message.success('提交成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
