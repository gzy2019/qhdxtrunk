<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="岗位名称" prop="postName">
            <Input v-model="searchForm.postName" :clearable="true" style="width: 170px" placeholder="请输入岗位名称"></Input>
          </Form-item>
          <Form-item label="岗位部门" prop="departmentId">
            <DepartmentSelect v-model="searchForm.departmentId" clearable style="width: 170px" placeholder="请选择岗位部门"></DepartmentSelect>
          </Form-item>
          <Form-item label="负责教师" prop="teacherId">
            <TeacherSelect v-model="searchForm.teacherId" :clearable="true" style="width: 170px"></TeacherSelect>
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
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
      <Row>
        <Form ref="dataForm" :model="dataForm" :label-width="110" :rules="dataFormValidate">
          <Col span="12">
          <FormItem label="岗位名称" prop="postName">
            <Input type="text" v-model="dataForm.postName" clearable placeholder="请输入岗位名称" />
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="岗位性质" prop="postType">
            <Input type="text" v-model="dataForm.postType" clearable placeholder="请输入岗位性质" />
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="设岗部门" prop="departmentId">
            <DepartmentSelect v-model="dataForm.departmentId" clearable></DepartmentSelect>
          </FormItem>
          </Col>
          <Col span="12">
          <Form-item label="负责教师" prop="teacherId">
            <TeacherSelect v-model="dataForm.teacherId" :clearable="true"></TeacherSelect>
          </Form-item>
          </Col>
          <Col span="12">
          <FormItem label="联系方式" prop="managerMobile">
            <Input type="text" v-model="dataForm.managerMobile" clearable placeholder="请输入联系方式" />
          </FormItem>
          </Col>
          <Col span="12">
          <Form-item label="岗位数量" prop="postCount">
            <InputNumber :max="100" :min="1" v-model="dataForm.postCount" style="width:100%"></InputNumber>
          </Form-item>
          </Col>
          <Col span="24">
          <FormItem label="关联学生类别" prop="typeList">
            <DicSelect v-model="dataForm.typeList" dtype="student-type" clearable multiple></DicSelect>
          </FormItem>
          </Col>
          <Col span="24">
          <Form-item label="岗位工作" prop="postDesc">
            <Input type='textarea' v-model="dataForm.postDesc" :clearable="true"></Input>
          </Form-item>
          </Col>
          <Col span="24">
          <Form-item label="岗位要求" prop="postCondition">
            <Input type='textarea' v-model="dataForm.postCondition" :clearable="true"></Input>
          </Form-item>
          </Col>
        </Form>
      </Row>
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
import api from '@/api/declare-ta/post-admin'
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
        postName: undefined,
        departmentId: undefined,
        teacherId: undefined,
        studentType: undefined
      },
      dataForm: {
        postName: '',
        postType: '',
        departmentId: undefined,
        teacherId: '',
        managerMobile: '',
        typeList: [],
        postCount: 1,
        postDesc: '',
        postCondition: ''
      },
      dataFormValidate: {
        postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        postType: [{ required: true, message: '岗位性质不能为空', trigger: 'blur' }],
        departmentId: [{ type: 'number', required: true, message: '设岗部门不能为空', trigger: 'blur' }],
        teacherId: [{ type: 'number', required: true, message: '负责人不能为空', trigger: 'blur' }],
        typeList: [{ type: 'array', min: 1, required: true, message: '关联学生类别不能为空', trigger: 'blur' }],
        postCount: [{ type: 'number', min: 1, required: true, message: '岗位数量不能为空', trigger: 'blur' }]
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
          title: '岗位类型',
          key: 'postType',
          minWidth: 100
        },
        {
          title: '部门',
          key: 'departmentName',
          minWidth: 100
        },
        {
          title: '联系人',
          key: 'teacherName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '联系方式',
          key: 'managerMobile',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
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
          minWidth: 100
        },
        {
          title: '岗位描述',
          key: 'postDesc',
          ellipsis: true,
          tooltip: true,
          minWidth: 140
        },
        {
          title: '岗位要求',
          key: 'postCondition',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },

        {
          title: '查看报名结果',
          key: 'gotoDetail',
          minWidth: 120,
          className: 'font-color-purple',
          render: (h, params) => {
            return h('a',
              {
                props: {
                  href: 'javascript:void(0)'
                },
                on: {
                  click: (val) => {
                    this.$router.push({ name: 'declare-ta/record', params: { batchId: this.batchId, postType: '1', postId: params.row.id, postName: params.row.postName } })
                  }
                }
              }, '查看报名结果')
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
                'Icon',
                {
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
                'Icon',
                {
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
      console.log(newVal, oldVal, '3333')
      this.getPostAdminList()
    }
  },
  methods: {
    init () {
      this.getPostAdminList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getPostAdminList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getPostAdminList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getPostAdminList () {
      if (!this.batchId) return
      this.loading = true
      this.searchForm.batchId = this.batchId
      console.log(this.searchForm.batchId,'231w')
      api.getPostAdminList(this.searchForm).then(res => {
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
      api.getPostAdminList(params).then(res => {
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
          api.deletePostAdmin(ids).then(res => {
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
