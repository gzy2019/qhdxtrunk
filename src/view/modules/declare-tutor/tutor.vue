<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
        <Form-item label="导师姓名" prop="teaName">
          <Input type="text" v-model="searchForm.teaName" clearable placeholder="请输入导师姓名" style="width: 170px" />
        </Form-item>
        <Form-item label="导师证件号" prop="teaCode">
          <Input type="text" v-model="searchForm.teaCode" clearable placeholder="请输入导师证件号" style="width: 170px" />
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button v-if="isAuth('declare:declaretutordesc:save')" @click="addTutor" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('declare:declaretutordesc:delete')" :disabled="selectedList.length === 0" @click="deleteTutor()">批量删除</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="90" :rules="dataFormValidate">
        <FormItem label="导师姓名" prop="teacherId">
          <TeacherSelect v-model="dataForm.teacherId" :clearable="true"  @on-change="getTeacherDetail"></TeacherSelect>
        </FormItem>
        <Col span="12" v-show="dataForm.teacherId">
          <FormItem label="证件号">
            {{teacherItem.teaCode}}
          </FormItem>
          <FormItem label="导师类别">
            {{teacherItem.supervisorTypeStr}}
          </FormItem>
        </Col>
        <Col span="12" v-show="dataForm.teacherId">
          <FormItem label="联系方式">
            {{teacherItem.mobile}}
          </FormItem>
          <FormItem label="邮箱">
            {{teacherItem.email}}
          </FormItem>
        </Col>
        <FormItem label="导师简介" prop="teacherDesc">
          <Input v-model="dataForm.teacherDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写导师简介"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveTutor">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/declare-tutor/tutor'
import apiTeacher from '@/api/teacher'
import TeacherSelect from '@/view/components/teacher-select'
export default {
  name: 'Tutor',
  components: {
    Tables, TeacherSelect
  },
  data () {
    const validateTutor = (rule, value, callback) => {
      api.validateDuplicated(this.dataForm).then(res => {
        if (!res.result) {
          callback(new Error('导师姓名不允许重复添加'))
        } else {
          callback()
        }
      })
    }
    return {
      loading: true,
      modalType: 0,
      dataModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        teaName: '',
        teaCode: ''
      },
      dataForm: {
        teacherId: undefined,
        teacherDesc: ''
      },
      teacherItem: {
      },
      dataFormValidate: {
        teacherId: [{ type: 'number', required: true, message: '导师不能为空', trigger: 'blur' },
          { validator: validateTutor, required: true, trigger: 'blur' }],
        teacherDesc: [{ required: true, message: '导师描述不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '导师姓名',
          key: 'teacherName',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '导师证件号',
          sortable: true,
          key: 'teacherCode',
          minWidth: 120
        },
        {
          title: '导师类型',
          sortable: true,
          key: 'supervisorTypeStr',
          minWidth: 120
        },
        {
          title: '联系方式',
          key: 'mobile',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '邮箱',
          key: 'email',
          ellipsis: true,
          tooltip: true,
          minWidth: 180
        },
        {
          title: '导师简介',
          key: 'teacherDesc',
          minWidth: 200,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('declare:declaretutordesc:update')) {
              btns.push(h(
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
                      this.editTutor(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            if (this.isAuth('declare:declaretutordesc:delete')) {
              btns.push(h(
                'Icon',
                {
                  props: {
                    type: 'ios-trash-outline',
                    size: '20'
                  },
                  on: {
                    click: () => {
                      this.deleteTutor(params.row)
                    }
                  }
                },
                '删除'
              ))
            }
            return h('div', btns)
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
  methods: {
    init () {
      this.getTutorList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getTutorList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getTutorList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getTutorList () {
      this.loading = true
      api.getTutorList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          this.pageData.list.map(item => {
            item.teacherName = item.teacher.teaName
            item.teacherCode = item.teacher.teaCode
            item.mobile = item.teacher.mobile
            item.email = item.teacher.email
            item.supervisorTypeStr = item.teacher.supervisorTypeStr
          })
        }
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    dateChange1 (value, d) {
      this.dataForm.TutorStartTime = value
    },
    dateChange2 (value, d) {
      this.dataForm.TutorEndTime = value
    },
    testOnChange (value, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          value.TutorOpenFlag = value2
        },
        onCancel: () => {
          value.TutorOpenFlag = !value2
        }
      })
    },
    getTeacherDetail (obj) {
      if (obj) {
        apiTeacher.getTeacherInfo(parseInt(obj)).then(res => {
          this.teacherItem = res.allTeacher
        })
      }
    },
    addTutor () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    editTutor (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.getTeacherDetail(this.dataForm.teacherId)
      this.modalView = false
      this.dataModalVisible = true
    },
    saveTutor () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveTutor(
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
            api.updateTutor(
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
    deleteTutor (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteTutor(ids).then(res => {
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
