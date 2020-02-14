<template>
  <div class="body-content">
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
          <Button @click="exportApplyScoreDetail" type="primary" icon="ios-download-outline">导出所有</Button>
          <Button @click="submitAll" :disabled="!recommendable" type="primary" icon="ios-save-outline" style="margin-left: 10px;">提交推荐名单(剩余{{leftRecommendCount4Select}}人)</Button>
        </Col>
      </Row>
      <Row class="operation btn_Score" style="margin-bottom: 10px;">
        <Col span="24">
          <Alert>
            <template slot="desc">您好，请尽快审核以下学生材料，进行评分（百分制）。您当前可接受学生人数为
            <span style="color:red">{{applyLimit}}</span>人，以下学生的前<span style="color:red">{{recommendLimit}}</span>名将进入推荐名单，请谨慎评审！
            评审结束后，请点击下方按钮提交推荐名单！（分数相同时，按姓名排序进行提交。）
            </template>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="applicantName">
              <Tag color="default">{{row.applyApplicant.applicantName}}</Tag>
          </template>
          <template slot-scope="{ row }" slot="applicantNo">
              <Tag color="default">{{row.applyApplicant.applicantNo}}</Tag>
          </template>
          <template slot-scope="{ row }" slot="recommended">
              <Tag v-if="row.recommended" color="success">已推荐</Tag>
              <Tag v-else color="default">未推荐</Tag>
          </template>
        </Table>
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
        <Button type="primary" :loading="submitLoading" @click="saveApplyScoreDetail">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <ApplicantInfo ref="applicantInfo" v-show="applicantInfoVisible" />

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/doctor/apply-score-detail'
import projectApi from '@/api/doctor/apply-project'
import ApplicantInfo from '@/view/modules/doctoral-vol/components/applicant-info'
export default {
  name: 'applyscoredetail-manage',
  components: {
    Tables, ApplicantInfo
  },
  data () {
    return {
      loading: true,
      applicantInfoVisible: false,
      tableHeight: 330,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      projectList: [],
      projectTeacher: null,
      searchForm: {
        page: 1,
        limit: 500,
        section: 1,
        projectId: ''
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
          title: '是否推荐',
          minWidth: 100,
          slot: 'recommended'
        },
        {
          title: '分数',
          key: 'score',
          minWidth: 100
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
            if (this.isAuth('doctor:applyscoredetail:update')) {
              btns.push(h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !this.time4score
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editApplyScoreDetail(params.row)
                    }
                  }
                },
                '打分'
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
      if (!this.time4score) this.$Message.info('该批次还未开启打分')
    }
  },
  computed: {
    time4score () {
      let project = this.projectList.find(item => item.id === this.searchForm.projectId)
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
      return this.applyLimit * 3
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
      this.getApplyScoredetailList()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getApplyScoredetailList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getApplyScoredetailList () {
      this.loading = true
      api.getScoreDetailList4SectionOne(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.projectTeacher = res.projectTeacher
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
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
      this.$refs.applicantInfo.init(v.applicantId)
    },
    editApplyScoreDetail (v) {
      this.modalTitle = '打分'
      this.$refs.dataForm.resetFields()
      this.modalView = false
      this.formModalVisible = true
      let entity = Object.assign({}, v)
      this.dataForm.volunteerId = entity.id
      this.dataForm.applicantId = entity.applyApplicant.id
      this.dataForm.applicantNo = entity.applyApplicant.applicantNo
      this.dataForm.projectId = this.searchForm.projectId
      this.dataForm.studentName = entity.applyApplicant.applicantName
      this.dataForm.section = this.searchForm.section
      this.dataForm.score = entity.score || 80
    },
    saveApplyScoreDetail () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          api.saveApplyScoreDetail(
            this.dataForm
          ).then(res => {
            this.submitLoading = false
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.handleSearch()
          }).catch(res => {
            this.submitLoading = false
          })
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deletApplyScoreDetail () {
      if (this.selectedList.length === 0) {
        this.$Message.info('请选择一条记录')
        return
      }
      let ids = []
      this.selectedList.map(item => {
        ids.push(item.id)
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deletApplyScoreDetail(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    submitAll () {
      let ids = this.notRecommendList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>名单提交后，不可修改，您确认提交${ids.length}人名单吗?</p>`,
        onOk: () => {
          api.submitRecommend(ids).then(res => {
            this.$Message.success('提交成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
