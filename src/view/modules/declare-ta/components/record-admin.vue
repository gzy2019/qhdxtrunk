<template>
  <div class="search">
    <Card>
      <Alert type="warning" class="tips" v-show="postId">以下结果为岗位管理中岗位[{{postName}}]查看申报结果的数据,如果查询全部请点击清除按钮</Alert>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="岗位名称" prop="postName">
          <Input v-model="searchForm.postName" :clearable="true" style="width: 162px;" placeholder="请输入岗位名称"></Input>
        </Form-item>
        <Form-item label="岗位部门" prop="departmentId">
          <DepartmentSelect v-model="searchForm.departmentId" clearable style="width: 162px;"></DepartmentSelect>
        </Form-item>
        <Form-item label="负责教师" prop="teacherId" >
          <TeacherSelect v-model="searchForm.teacherId" :clearable="true" style="width: 162px;"></TeacherSelect>
        </Form-item>
          <Form-item label="学生姓名" prop="stuName">
            <Input v-model="searchForm.stuName" :clearable="true" placeholder="请输入学生姓名"></Input>
        </Form-item>
        <Form-item label="学生号" prop="stuCode">
            <Input v-model="searchForm.stuCode" :clearable="true" placeholder="请输入学生号"></Input>
        </Form-item>
        <Form-item label="申报状态" prop="recordStatus">
          <Select v-model="searchForm.recordStatus" :clearable="true" @on-change="handleSearch" style="width: 162px;">
              <Option v-for="item in statusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addPost" type="primary" icon="md-add">新增</Button>
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 申报详情 start-->
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' footer-hide :width="800" class-name="vertical-center-modal">
      <Form v-if="dataModalVisible" ref="dataForm" :model="dataForm" :label-width="95" inline>
        <Divider orientation="left"><Icon type="ios-person-outline" />岗位信息</Divider>
        <Row>
          <Col span="8">
            <FormItem label="岗位名称:">
              {{dataForm.postName}}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="岗位性质:">
              {{dataForm.postType}}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="设岗部门:">
              {{dataForm.departmentName}}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="关联学生类别:">
              <Tooltip max-width="300" :content="dataForm.postAdmin && dataForm.postAdmin.typeListStr">
                <span style="width:150px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{dataForm.postAdmin && dataForm.postAdmin.typeListStr}}</span>
              </Tooltip>
            </FormItem>
          </Col>
          <Col span="8">
            <Form-item label="负责教师:">
              {{dataForm.teacherName}}
            </Form-item>
            </Col>
          <Col span="8">
            <Form-item label="岗位数量:">
              {{dataForm.postCount}}
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <Form-item label="岗位工作:">
              {{dataForm.postContent}}
            </Form-item>
          </Col>
          <Col span="16">
            <Form-item label="岗位要求:">
              {{dataForm.postCondition}}
            </Form-item>
          </Col>
        </Row>
        <Divider orientation="left"><Icon type="ios-person-outline" />学生信息</Divider>
        <Row>
          <Col span="8">
            <Form-item label="姓名:">
              {{dataForm.studentName}}
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="学号:">
              {{dataForm.studentCode}}
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="手机:">
              {{dataForm.student && dataForm.student.mobile}}
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="邮箱:">
              {{dataForm.student && dataForm.student.email}}
            </Form-item>
          </Col>
        </Row>
        <Divider orientation="left"><Icon type="ios-person-outline" />申报情况</Divider>
        <Row>
          <Col span="8">
            <Form-item label="申报状态:">
              {{dataForm.recordStatusDesc}}
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="申报时间:">
              {{dataForm.createTime}}
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="确认时间:">
              {{dataForm.modifyTime}}
            </Form-item>
          </Col>
        </Row>
      </Form>
    </Modal>

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/declare-ta/record'
import DicSelect from '@/view/components/dic-select'
import TeacherSelect from '@/view/components/teacher-select'
import DepartmentSelect from '@/view/components/department-select'
export default {
  name: 'postAdmin',
  components: {
    Tables, DicSelect, TeacherSelect, DepartmentSelect
  },
  props: {
    batchId: {
      type: Number,
      default: undefined
    },
    postId: {
      type: Number,
      default: undefined
    },
    postName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      modalType: 0,
      dataModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        postType: 1,
        postName: '',
        departmentId: undefined,
        teacherId: undefined,
        stuCode: '',
        stuName: '',
        recordStatus: undefined
      },
      dataForm: {
        postName: '',
        postType: '',
        departmentId: undefined,
        teacherId: '',
        managerMobile: '',
        typeList: [],
        postCount: 1,
        postContent: '',
        postCondition: '',
        typeListStr: ''
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '岗位名称',
          key: 'postName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '岗位数量',
          key: 'postCount',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '负责教师',
          key: 'teacherName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '设岗部门',
          key: 'departmentName',
          minWidth: 100
        },
        {
          title: '学生姓名',
          key: 'studentName',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '学生号',
          key: 'studentCode',
          ellipsis: true,
          tooltip: true,
          minWidth: 140
        },
        {
          title: '申报时间',
          key: 'createTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 90
        },
        {
          title: '批复时间',
          key: 'modifyTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 90
        },
        {
          title: '申报状态',
          key: 'recordStatusDesc',
          ellipsis: true,
          tooltip: true,
          minWidth: 90
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
                'Icon',
                {
                  props: {
                    type: 'ios-eye-outline',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showDetail(params.row)
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      statusArr: [
        { value: '0', label: '申请中' },
        { value: '1', label: '已确认' },
        { value: '2', label: '已拒绝' },
        { value: '3', label: '管理员指定' },
        { value: '4', label: '暂存' }
      ]
    }
  },
  watch: {
    batchId (newVal, oldVal) {
      this.getRecordList()
    },
    postId: {
      immediate: true,
      handler () {
        this.searchForm.postId = this.postId
      }
    },
    postName: {
      immediate: true,
      handler () {
        this.searchForm.postName = this.postName
      }
    }
  },
  methods: {
    init () {
      this.getRecordList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getRecordList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.postId = undefined
      this.searchForm.postId = undefined
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getRecordList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getRecordList () {
      if (!this.batchId) return
      this.loading = true
      this.searchForm.batchId = this.batchId
      api.getRecordList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          this.pageData.list.map(item => {
            item.postName = item.postAdmin && item.postAdmin.postName
            item.postCount = item.postAdmin && item.postAdmin.postCount
            item.postContent = item.postAdmin && item.postAdmin.postContent
            item.postCondition = item.postAdmin && item.postAdmin.postCondition
            item.teacherName = item.postAdmin && item.postAdmin.teacherName
            item.departmentName = item.postAdmin && item.postAdmin.departmentName
            item.studentName = item.student && item.student.stuName
            item.studentCode = item.student && item.student.stuCode
          })
        }
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      params.exportAdmin = true
      api.getRecordList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    addPost () {
      console.log('111');
      this.modalTitle = '新增'
      // this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.dataModalVisible = true
    },
    showDetail (v) {
      this.modalTitle = '申报详情'
      // this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      this.dataModalVisible = true
    },
    savePost () {
      this.dataForm.batchId = this.batchId
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.savePostAdmin(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.dataModalVisible = false
                this.handleSearch()
              }
            })
          } else {
            api.updatePostAdmin(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.dataModalVisible = false
                this.handleSearch()
              }
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style  scoped>
.ivu-form-item{
  margin-bottom: 10px;
}
</style>
