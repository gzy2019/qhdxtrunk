<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="招生批次" prop="batchId">
          <Select v-model="searchForm.batchId" style="width:170px" @on-change="handleSearch">
            <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
          </Select>
        </Form-item>
        <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
        <Button @click="handleClear" style="margin-left:5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addProjectTeacher" type="primary" icon="md-add">新增</Button>
          <Button :disabled="selectedList.length === 0" type="primary" @click="deleteProjectTeacher" icon="ios-trash-outline">批量删除</Button>
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
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <Form-item label="研究方向" prop="applyDirection">
          <DicSelect v-model="dataForm.applyDirection" dtype="apply-direction" :clearable="true" style="width:100%"></DicSelect>
        </Form-item>
        <Form-item label="导师" prop="teacherId">
          <TeacherSelect v-model="dataForm.teacherId" :clearable="true"></TeacherSelect>
        </Form-item>
        <Form-item label="招生名额" prop="applyLimitNum">
          <InputNumber :max="100" :min="1" v-model="dataForm.applyLimitNum" style="width:100%"></InputNumber>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveProjectTeacher">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import dicUtil from '@/libs/dicUtil'
import TeacherSelect from '@/view/components/teacher-select'
import apiProject from '@/api/doctor/apply-project'
import api from '@/api/doctor/apply-project-teacher'
export default {
  name: 'researchArea',
  components: {
    Tables, DicSelect, TeacherSelect
  },
  data () {
    return {
      loading: false,
      Prohibit: false,
      modalView: false,
      Successful: false,
      formModalVisible: false,
      switch1: '',
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        batchId: ''
      },
      dataForm: {
        batchId: undefined,
        applyDirection: '',
        teacherId: undefined,
        applyLimitNum: 1
      },
      dataFormValidate: {
        applyDirection: [{ required: true, message: '招生方向不能为空', trigger: 'blur' }],
        teacherId: [{ type: 'number', required: true, message: '导师姓名不能为空', trigger: 'blur' }],
        applyLimitNum: [{ type: 'number', required: true, message: '招生名额不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      selectedList: [],
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        { title: '姓名', key: 'teacherName', minWidth: 130, ellipsis: true, tooltip: true },
        { title: '研究方向', key: 'applyDirectionStr', minWidth: 130 },
        { title: '招生名额', key: 'applyLimitNum', minWidth: 140 },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 130,
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
                      this.editProjectTeacher(params.row)
                    }
                  }
                },
                '修改'
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
                      this.deleteProjectTeacher(params.row)
                    }
                  }
                },
                params.row.status === 0 ? '启用' : '禁用'
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      projectList: []
    }
  },
  methods: {
    init () {
      apiProject.getProjectList().then(res => {
        this.projectList = res.page.list
        if (this.projectList.length > 0) { this.searchForm.batchId = this.projectList[0].id }
        this.getProjectTeacherList()
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getProjectTeacherList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getProjectTeacherList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getProjectTeacherList () {
      this.loading = true
      api.getProjectTeacherList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          dicUtil.setDicName(res.page.list, [
            { type: 'apply-direction', key: 'applyDirection' }
          ])
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addProjectTeacher () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.formModalVisible = true
    },
    editProjectTeacher (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.formModalVisible = true
    },
    testOnChange (value, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          value.projectOpenFlag = value2
        },
        onCancel: () => {
          value.projectOpenFlag = !value2
        }
      })
    },
    saveProjectTeacher () {
      console.log(this.dataForm, 'fghjkl')
      this.dataForm.batchId = this.searchForm.batchId
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveProjectTeacher(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.handleSearch()
              }
            })
          } else {
            api.updateProjectTeacher(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
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
    deleteProjectTeacher (row) {
      let ids = this.selectedList.map(item => item.id)
      if (row && row.id) {
        ids = [row.id]
      }
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteProjectTeacher(ids).then(res => {
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
