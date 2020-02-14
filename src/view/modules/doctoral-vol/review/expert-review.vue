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
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" :height="tableHeight" size="small" border stripe v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"></tables>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
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
  name: 'doctor-expert-review',
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
      searchForm: {
        page: 1,
        limit: 10,
        section: 2,
        projectId: ''
      },
      dataForm: {
        section: undefined,
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
          key: 'applicantName',
          minWidth: 100
        },
        {
          title: '申请号',
          key: 'applicantNo',
          minWidth: 100
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
      let ret = project && project.projectExpertScoreFlag
      return ret
    }
  },
  mounted () {
    this.init()
    this.adjustTableHeight()
  },
  methods: {
    init () {
      this.loadProjectList()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
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
      api.getScoreDetailList4SectionTwo(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.data
        this.adjustTableHeight()
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getScoreDetailList4SectionTwo(params).then(res => {
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
    editApplyScoreDetail (v) {
      this.modalTitle = '打分'
      this.$refs.dataForm.resetFields()
      this.modalView = false
      this.formModalVisible = true
      let entity = Object.assign({}, v)

      this.dataForm.applicantId = entity.id
      this.dataForm.groupId = entity.groupId
      this.dataForm.applicantNo = entity.applicantNo
      this.dataForm.projectId = this.searchForm.projectId
      this.dataForm.studentName = entity.applicantName
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
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>名单提交后，不可修改，您确认提交名单吗?</p>',
        onOk: () => {

        }
      })
    }
  }
}
</script>
