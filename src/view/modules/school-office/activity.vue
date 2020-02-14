<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="项目名称" prop="projectName">
          <Input v-model="searchForm.projectName" placeholder="请输入项目名称" class="wth" clearable />
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
        <Form-item label="发起人" prop="projectName">
          <Input :disabled="!editable" v-model="dataForm.projectName" placeholder="请输入批次名称" clearable />
        </Form-item>
        <FormItem label="标题" prop="caption">
          <IDatePicker :disabled="!editable" v-model="dataForm.caption" placeholder="选择报名开始日期" style="width:100%" />
        </FormItem>
        <FormItem label="活动分类" prop="activity">
          <IDatePicker :disabled="!editable" v-model="dataForm.activity" placeholder="选择报名截止日期" style="width:100%" />
        </FormItem>
        <FormItem label="举办日期" prop="preferredTime">
          <IDatePicker :disabled="!editable" v-model="dataForm.preferredTime" placeholder="选择举办日期" style="width:100%" />
        </FormItem>
        <FormItem label="举办内容" prop="UGC">
         <Input v-model="searchForm.UGC" placeholder="请输入举办内容" type="textarea" class="wth" clearable />
        </FormItem>
        <FormItem label="报名开始日期" prop="Registration">
          <IDatePicker :disabled="!editable" v-model="dataForm.Registration" placeholder="选择开始日期" style="width:100%" />
        </FormItem>
        <FormItem label="是否需要报名" prop="projectOpenFlag">
          <i-switch :disabled="!editable" v-model="dataForm.projectOpenFlag" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="报名结束日期" prop="Closingdate">
          <IDatePicker :disabled="!editable" v-model="dataForm.Closingdate" placeholder="选择结束日期" style="width:100%" />
        </FormItem>
        <FormItem label="群发邮件" prop="projectOpenFlag">
          <i-switch :disabled="!editable" v-model="dataForm.email" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
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
        caption: '',
        activity: '',
        preferredTime: '',
        UGC: '',
        Registration: '',
        Closingdate: '',
        email: false,
        projectOpenFlag: false
      },
      dataFormValidate: {
        projectName: [
          { required: true, message: '发起人不能为空', trigger: 'blur' }
        ],
        caption: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        activity: [
          { required: true, message: '活动不能为空', trigger: 'blur' }
        ],
        preferredTime: [
          { required: true, message: '举办日期不能为空', trigger: 'blur' }
        ],
        UGC: [
          { required: true, message: '举办内容不能为空', trigger: 'blur' }
        ],
        Registration: [
          { required: true, message: '报名开始日期不能为空', trigger: 'blur' }
        ],
        Closingdate: [
          { required: true, message: '报名结束日期不能为空', trigger: 'blur' }
        ],
    
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
          title: '题目',
          key: 'caption',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动分类',
          key: 'activity',
          minWidth: 110,
          sortable: true
        },
        {
          title: '举办时间',
          key: 'preferredTime',
          minWidth: 110,
          sortable: true
        },
        {
          title: '是否需要报名',
          key: 'projectOpenFlag',
          minWidth: 130,
          sortable: true
        },
        {
          title: '报名起始时间',
          key: 'Registration',
          minWidth: 130,
          sortable: true
        },
        {
          title: '报名截止时间',
          key: 'Closingdate',
          minWidth: 130,
          sortable: true
        },
        {
          title: '发起人',
          key: 'projectName',
          minWidth: 130,
          sortable: true
        },
        {
          title: '详细内容',
          key: 'UGC',
          minWidth: 110,
          sortable: true
        },
        {
          title: '活动状态',
          key: 'createTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
        }, 
        {
          title: '报名情况  ',
          key: 'createTime',
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          
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
      this.modalTitle = '新增';
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
      this.modalView = false
      this.editable = true
    },
    editProject (v) {
      this.modalTitle = '编辑';
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
      this.modalTitle = '查看';
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
