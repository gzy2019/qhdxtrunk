<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="课程名" prop="postName">
            <Input v-model="searchForm.postName" :clearable="true" style="width: 170px" placeholder="请输入课程名"></Input>
          </Form-item>
          <Form-item label="课程号" prop="postCourseNum">
            <Input v-model="searchForm.postCourseNum" :clearable="true" style="width: 170px" placeholder="请输入课程号"></Input>
          </Form-item>
          <Form-item label="任课教师" prop="teacherId">
            <TeacherSelect v-model="searchForm.teacherId" placeholder="请选择任课教师" :clearable="true" style="width: 170px"></TeacherSelect>
          </Form-item>
          <Form-item label="学生类别" prop="studentType">
            <DicSelect v-model="searchForm.studentType" dtype="student-type" placeholder="请选择学生类别" :clearable="true" style="width: 170px"></DicSelect>
          </Form-item>
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left:5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addPost" type="primary" icon="md-add">新增</Button>
          <Button :disabled="selectedList.length === 0" @click="deletePost">批量删除</Button>
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="110" :rules="dataFormValidate">
        <FormItem label="课程名" prop="postName">
          <Input type="text" v-model="dataForm.postName" clearable placeholder="请输入课程名" />
        </FormItem>
        <FormItem label="课程号" prop="postCourseNum">
          <Input type="text" v-model="dataForm.postCourseNum" clearable placeholder="请输入课程号" />
        </FormItem>
        <FormItem label="任课教师" prop="teacherId">
          <TeacherSelect type="text" v-model="dataForm.teacherId" clearable placeholder="请选择任课教师"></TeacherSelect>
        </FormItem>
        <FormItem label="关联学生类别" prop="typeList">
          <DicSelect v-model="dataForm.typeList" dtype="student-type" multiple placeholder="请选择学生类别" :clearable="true" style="width:100%"></DicSelect>
        </FormItem>
        <Form-item label="岗位数量" prop="postCount">
          <InputNumber :max="100" :min="1" v-model="dataForm.postCount" style="width:100%"></InputNumber>
        </Form-item>
        <Form-item label="上课时间" prop="courseSchedule">
          <Input v-model="dataForm.courseSchedule" :clearable="true"></Input>
        </Form-item>
        <Form-item label="上课周数" prop="courseWeek">
          <Input v-model="dataForm.courseWeek" :clearable="true"></Input>
        </Form-item>
        <Form-item label="备注" prop="postDesc">
          <Input type='textarea' v-model="dataForm.postDesc" :clearable="true"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="savePost">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <!--导出 start-->
    <Modal title="" v-model="modalExport" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认导出选中的数据？</p>
      <div slot="footer">
        <Button @click="modalExport = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="modalExport = false">保存</Button>
      </div>
    </Modal>
    <!--导出 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/declare-ta/post-assistant'
import TeacherSelect from '@/view/components/teacher-select'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'postAssistant',
  components: {
    Tables,
    TeacherSelect,
    DicSelect
  },
  props: {
    batchId: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      exportLoading: false,
      loading: false,
      modalExport: false,
      modalDelete: false,
      modalType: 0,
      dataModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        postName: '',
        postCourseNum: '',
        teacherId: '',
        studentType: ''
      },
      dataForm: {
        postName: '',
        postCourseNum: '',
        teacherId: '',
        typeList: [],
        postCount: 1,
        courseSchedule: '',
        courseWeek: '',
        postDesc: ''
      },
      dataFormValidate: {
        postName: [{ required: true, message: '课程名不能为空', trigger: 'blur' }],
        postCourseNum: [{ required: true, message: '课程号不能为空', trigger: 'blur' }],
        teacherId: [{ type: 'number', required: true, message: '任课教师不能为空', trigger: 'blur' }],
        typeList: [{ type: 'array', min: 1, required: true, message: '学生类别不能为空', trigger: 'blur' }],
        postCount: [{ type: 'number', min: 1, required: true, message: '岗位数量不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [{
        type: 'selection',
        width: 45,
        align: 'center'
      },
      {
        title: '课程名',
        key: 'postName',
        ellipsis: true,
        tooltip: true,
        minWidth: 100
      },
      {
        title: '课程号',
        key: 'postCourseNum',
        minWidth: 100
      },
      {
        title: '任课教师',
        key: 'teacherName',
        minWidth: 100
      },
      {
        title: '学生类别',
        key: 'typeListStr',
        ellipsis: true,
        tooltip: true,
        minWidth: 100
      },
      {
        title: '岗位数量',
        key: 'postCount',
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      {
        title: '上课时间',
        key: 'courseSchedule',
        ellipsis: true,
        tooltip: true,
        minWidth: 100
      },
      {
        title: '上课周数',
        key: 'courseWeek',
        ellipsis: true,
        tooltip: true,
        minWidth: 100
      },
      {
        title: '上课描述',
        key: 'postDesc',
        ellipsis: true,
        tooltip: true,
        minWidth: 140
      },
      {
        title: '查看申报结果',
        key: 'gotoDetail',
        minWidth: 120,
        className: 'font-color-purple',
        render: (h, params) => {
          return h('a', {
            props: {
              href: 'javascript:void(0)'
            },
            on: {
              click: (val) => {
                this.$router.push({ name: 'declare-ta/record', params: { batchId: this.batchId, postType: '0', postId: params.row.id, postName: params.row.postName } })
              }
            }
          }, '查看申报结果')
        }
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
              'Icon', {
                props: {
                  type: 'ios-create-outline',
                  size: '20'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editPost(params.row)
                  }
                }
              },
              '编辑'
            ),
            h(
              'Icon', {
                props: {
                  type: 'ios-trash-outline',
                  size: '20'
                },
                on: {
                  click: () => {
                    this.deletePost(params.row)
                  }
                }
              }
            )
          ])
        }
      }
      ],
      selectedList: [],
      pageData: {
        totalCount: 0,
        list: []
      }
    }
  },
  watch: {
    batchId (newVal, oldVal) {
      this.getPostAssistantList()
    }
  },
  methods: {
    init () {
      this.getPostAssistantList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getPostAssistantList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getPostAssistantList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getPostAssistantList () {
      if (!this.batchId) return
      this.loading = true
      this.searchForm.batchId = this.batchId
      api.getPostAssistantList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
        }
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getPostAssistantList(params).then(res => {
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
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    editPost (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    savePost () {
      this.dataForm.batchId = this.batchId
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.savePostAssistant(
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
            api.updatePostAssistant(
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
    },
    deletePost (v) {
      let ids = []
      if (v.id) {
        ids.push(v.id)
      } else {
        ids = this.selectedList.map(item => item.id)
      }
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deletePostAssistant(ids).then(res => {
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
<style>
.font-color-purple a {
  color: rgb(130, 47, 142) !important;
  font-weight: bold
}
</style>
