<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="批次名称" prop="projectName">
          <Input v-model="searchForm.projectName" placeholder="请输入批次名称" class="wth" clearable />
        </Form-item>
        <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
        <Button @click="handleClear" style="margin-left:5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
        <Button @click="addProject" type="primary" icon="md-add">新增</Button>
        <Button :disabled="selectedList.length === 0" type="primary" @click="deleteProject" icon="ios-trash-outline">批量删除</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" a size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change="handlePageSize" show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable="false" :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <Form-item label="批次名称" prop="projectName">
          <Input :disabled="!editable" v-model="dataForm.projectName" placeholder="请输入批次名称" clearable />
        </Form-item>
        <FormItem label="报名开始日期" prop="projectApplyStartTime">
          <IDatePicker :disabled="!editable" v-model="dataForm.projectApplyStartTime" placeholder="选择报名开始日期" style="width:100%" />
        </FormItem>
        <FormItem label="报名截止日期" prop="projectApplyEndTime">
          <IDatePicker :disabled="!editable" v-model="dataForm.projectApplyEndTime" placeholder="选择报名截止日期" style="width:100%" />
        </FormItem>
        <FormItem label="入学日期" prop="projectStartTime">
          <IDatePicker :disabled="!editable" v-model="dataForm.projectStartTime" placeholder="选择入学日期" style="width:100%" />
        </FormItem>
        <FormItem label="启用/禁用" prop="projectOpenFlag">
          <i-switch :disabled="!editable" v-model="dataForm.projectOpenFlag" size="large">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveProject">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import IDatePicker from '@/view/components/idate-picker'
import api from '@/api/master/apply-project'
export default {
  name: 'researchArea',
  components: {
    Tables,
    DicSelect,
    IDatePicker
  },
  data () {
    return {
      loading: false,
      modalView: false,
      formModalVisible: false,
      modalTitle: '',
      editable: true,
      searchForm: {
        page: 1,
        limit: 10,
        projectName: ''
      },
      dataForm: {
        projectName: '',
        projectApplyStartTime: '',
        projectApplyEndTime: '',
        projectStartTime: '',
        projectOpenFlag: false
      },
      dataFormValidate: {
        projectName: [
          { required: true, message: '批次名称不能为空', trigger: 'blur' }
        ],
        projectApplyStartTime: [
          { required: true, message: '报名开始日期不能为空', trigger: 'blur' }
        ],
        projectApplyEndTime: [
          { required: true, message: '报名截止日期不能为空', trigger: 'blur' }
        ],
        projectStartTime: [
          { required: true, message: '入学日期不能为空', trigger: 'blur' }
        ]
      },
      userFormValidate: {},
      submitLoading: false,
      selectedList: [],
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '批次名称',
          key: 'projectName',
          minWidth: 130,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名开始日期',
          key: 'projectApplyStartTime',
          minWidth: 130,
          sortable: true
        },
        {
          title: '报名结束日期',
          key: 'projectApplyEndTime',
          minWidth: 130,
          sortable: true
        },
        {
          title: '入学日期',
          key: 'projectStartTime',
          minWidth: 120,
          sortable: true
        },
        {
          title: '已申请人数',
          key: 'projectApplyNum',
          minWidth: 120,
          sortable: true
        },
        {
          title: '已报名人数',
          key: 'projectSubmitNum',
          minWidth: 120,
          sortable: true
        },
        {
          title: '面试通过人数',
          key: 'projectInterviewNum',
          minWidth: 130,
          sortable: true
        },
        {
          title: '查看报考学生',
          key: 'gotoApply',
          minWidth: 110,
          className: 'font_color',
          render: (h, params) => {
            return h(
              'div',
              {
                on: {
                  click: val => {
                    this.$router.push({
                      name: 'master-vol/application/application-status',
                      params: { projectId: params.row.id }
                    })
                  }
                }
              },
              '查看详情'
            )
          }
        },
        {
          title: '启用/禁用',
          key: 'projectOpenFlag',
          minWidth: 120,
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.projectOpenFlag
              },
              on: {
                'on-change': val => {
                  this.changeStatus(params.row, val)
                },
                input: val => {
                  params.row.projectOpenFlag = val
                }
              }
            })
          }
        },
        {
          title: '创建日期',
          key: 'createTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 130,
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
                      this.viewProject(params.row)
                    }
                  }
                },
                '查看'
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
                      this.editProject(params.row)
                    }
                  }
                },
                '修改'
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
      }
    }
  },
  methods: {
    init () {
      this.getProjectList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getProjectList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getProjectList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getProjectList () {
      this.loading = true
      api.getProjectList(this.searchForm).then(res => {
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
    addProject () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
      this.modalView = false
      this.editable = true
    },
    editProject (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      Object.keys(this.dataForm).forEach(key => {
        this.dataForm[key] = entity[key]
      })
      this.formModalVisible = true
      this.modalView = false
      this.editable = true
    },
    viewProject (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      Object.keys(this.dataForm).forEach(key => {
        this.dataForm[key] = entity[key]
      })
      this.formModalVisible = true
      this.modalView = true
      this.editable = false
    },
    changeStatus (obj, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          api
            .updateProject({
              id: obj.id,
              projectOpenFlag: value2
            })
            .then(res => {
              this.$Message.success('修改成功！')
              obj.projectOpenFlag = value2
            })
        },
        onCancel: () => {
          obj.projectOpenFlag = !value2
        }
      })
    },
    saveProject () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveProject(this.dataForm).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            })
          } else {
            api.updateProject(this.dataForm).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteProject () {
      let ids = this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteProject(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
