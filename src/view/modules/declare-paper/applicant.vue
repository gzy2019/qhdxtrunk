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
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <Col span="24">
        <Button :loading="exportLoading" @click="exportMpadApplicant" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="openFlag1">
            <Tag :color="`${row.openFlag1 ? 'primary' : 'error' }`">{{ row.openFlag1 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag2">
            <Tag :color="`${row.openFlag2 ? 'primary' : 'error' }`">{{ row.openFlag2 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag3">
            <Tag :color="`${row.openFlag3 ? 'primary' : 'error' }`">{{ row.openFlag3 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag4">
            <Tag :color="`${row.openFlag4 ? 'primary' : 'error' }`">{{ row.openFlag4 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag5">
            <Tag :color="`${row.openFlag5 ? 'primary' : 'error' }`">{{ row.openFlag5 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag6">
            <Tag :color="`${row.openFlag6 ? 'primary' : 'error' }`">{{ row.openFlag6 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag7">
            <Tag :color="`${row.openFlag7 ? 'primary' : 'error' }`">{{ row.openFlag7 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag8">
            <Tag :color="`${row.openFlag8 ? 'primary' : 'error' }`">{{ row.openFlag8 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="openFlag9">
            <Tag :color="`${row.openFlag9 ? 'primary' : 'error' }`">{{ row.openFlag9 ? '是' : '否' }}</Tag>
          </template>
          <template slot-scope="{ row }" slot="applicantStatus">
            <Tag v-show="!row.applicantStatus" color="default">暂存</Tag>
            <Tag v-show="row.applicantStatus" color="primary">提交</Tag>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="800" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="240" :rules="dataFormValidate">
        <Row>
          <Col span="12">
          <FormItem label="姓名" prop="studentName" style="margin-bottom:12px;">
            {{dataForm.studentName}}
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="学号" prop="studentCode" style="margin-bottom:12px;">
            {{dataForm.studentCode}}
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="学生类别" prop="studentType" style="margin-bottom:12px;">
            {{dataForm.studentType}}
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="导师" prop="teacherName" style="margin-bottom:12px;">
            {{dataForm.teacherName}}
          </FormItem>
          </Col>
          <FormItem label="" class="grayline">
            <Divider />
          </FormItem>
          <Col span="12">
          <FormItem label="是否完成培养方案学分要求" prop="openFlag1">
            <i-switch v-model="dataForm.openFlag1" :true-value="1" :false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="是否提交个人培养计划" prop="openFlag2">
            <i-switch v-model="dataForm.openFlag2" :true-value="1" :false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="是否提交开题计划表" prop="openFlag3">
            <i-switch v-model="dataForm.openFlag3" :true-value="1" :false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="开题通过日期" prop="subjectPassTime">
              <IDatePicker type="date" v-model="dataForm.subjectPassTime" placeholder="请选择开题通过日期" />
            </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="是否发表文章或提交拟发表文章" prop="openFlag4">
            <i-switch v-model="dataForm.openFlag4" :true-value="1" :false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </Col>
          <Col span="12" v-if="false">
          <FormItem label="是否完成学术活动及小结" prop="openFlag5">
            <i-switch v-model="dataForm.openFlag5" :true-value="1" :false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="是否提交学术活动记录表" prop="openFlag6">
            <i-switch v-model="dataForm.openFlag6" :true-value="1" :false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </Col>
          <Col span="12" v-if="false">
            <FormItem label="是否完成预答辩(博士生)" prop="openFlag7">
              <i-switch v-model="dataForm.openFlag7" :true-value="1" :false-value="0">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否发表与学位论文相关的学术论文" prop="openFlag8">
              <i-switch v-model="dataForm.openFlag8" :true-value="1" :false-value="0">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="本学期是否有在修课程" prop="openFlag9">
              <i-switch v-model="dataForm.openFlag9" :true-value="1" :false-value="0">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="" class="grayline">
          <Divider />
        </FormItem>
        <FormItem label="论文题目" prop="paperTitle">
          <Input type="text" v-model="dataForm.paperTitle" clearable :maxlength="100" placeholder="请输入论文提目" />
        </FormItem>
        <Row>
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
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMpadApplicant">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/mpad/mpadapplicant'
import projectApi from '@/api/mpad/mpadproject'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'MpadApplicant-manage',
  components: { IDatePicker },
  data () {
    return {
      loading: true,
      exportLoading: false,
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
      dataForm: {
        projectId: '',
        project: {},
        studentId: '',
        studentName: '',
        studentCode: '',
        studentType: '',
        teacherId: '',
        teacherName: '',
        subjectPassTime: '',
        paperTitle: '',
        mobile: '',
        email: '',
        openFlag1: '',
        openFlag2: '',
        openFlag3: '',
        openFlag4: '',
        openFlag5: '',
        openFlag6: '',
        openFlag7: '',
        openFlag8: '',
        openFlag9: '',
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
        paperTitle: [
          { required: true, message: '论文题目不能为空', trigger: 'blur' }
        ],
        subjectPassTime: [
          { required: true, message: '开题通过日期不能为空', trigger: 'blur' }
        ],
        openFlag1: [
          { required: true, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag2: [
          { required: true, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag3: [
          { required: true, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag4: [
          { required: true, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag5: [
          { required: false, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag6: [
          { required: true, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag7: [
          { required: false, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag8: [
          { required: true, type: 'number', message: '此项不能为空', trigger: 'change' }
        ],
        openFlag9: [
          { required: true, type: 'number', message: '此项不能为空', trigger: 'change' }
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
          title: '学号',
          key: 'studentCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生类型',
          key: 'studentType',
          minWidth: 100,
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
          title: '论文题目',
          key: 'paperTitle',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '联系方式',
          key: 'mobile',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 100,
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
          title: '是否完成培养方案学分要求',
          slot: 'openFlag1',
          minWidth: 200,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否提交个人培养计划',
          slot: 'openFlag2',
          minWidth: 190,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否提交开题计划表',
          slot: 'openFlag3',
          minWidth: 180,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '开题通过日期',
          key: 'subjectPassTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否发表文章或提交拟发表文章',
          slot: 'openFlag4',
          minWidth: 210,
          ellipsis: true,
          tooltip: true
        },
        // {
        //   title: '是否完成学术活动及小结',
        //   slot: 'openFlag5',
        //   minWidth: 190,
        //   ellipsis: true,
        //   tooltip: true
        // },
        {
          title: '是否提交学术活动记录表',
          slot: 'openFlag6',
          minWidth: 190,
          ellipsis: true,
          tooltip: true
        },
        // {
        //   title: '是否完成预答辩(博士生)',
        //   slot: 'openFlag7',
        //   minWidth: 160,
        //   ellipsis: true,
        //   tooltip: true
        // },
        {
          title: '是否发表与学位论文相关的学术论文',
          slot: 'openFlag8',
          minWidth: 230,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '本学期是否有在修课程',
          slot: 'openFlag9',
          minWidth: 200,
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
            if (this.isAuth('mpa:mpadapplicant:info')) {
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
                      this.viewMpadApplicant(params.row)
                    }
                  }
                },
                '查看'
              ))
            }
            if (this.isAuth('mpa:mpadapplicant:update')) {
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
                      this.editMpadApplicant(params.row)
                    }
                  }
                },
                '编辑'
              ))
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
      this.loadProjectList()
      this.adjustTableHeight()
    },
    loadProjectList () {
      projectApi.getMpadProjectSelectList().then(res => {
        this.projectList = res.list
        if (this.projectList.length > 0) {
          this.searchForm.projectId = this.projectList[0].id
        }
        this.handleSearch()
      })
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpadApplicantList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpadApplicantList()
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
    getMpadApplicantList () {
      this.loading = true
      api.getMpadApplicantList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportMpadApplicant () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpadApplicantList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    addMpadApplicant () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewMpadApplicant (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      api.getMpadApplicantInfo(v.id).then(res => {
        let entity = res.mpadApplicant
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editMpadApplicant (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      api.getMpadApplicantInfo(v.id).then(res => {
        let entity = res.mpadApplicant
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.modalView = false
      this.formModalVisible = true
    },
    saveMpadApplicant () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMpadApplicant(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMpadApplicant(
              this.dataForm
            ).then(res => {
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
    deleteMpadApplicant (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMpadApplicant(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
<style>
.grayline {
  margin-bottom: 23px !important;
}
.grayline .ivu-divider-horizontal {
  margin: 0px 0 !important;
}
.grayline .ivu-form-item-content {
  margin-left: 0 !important;
}
</style>
