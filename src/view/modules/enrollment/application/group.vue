<template>
  <div class="body-content">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="招生批次" prop="projectId">
          <Select v-model="searchForm.projectId" style="width:170px">
            <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.projectName }}</Option>
        </Select>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
      </Form>
      <Row class="operation btn_group" style="margin-bottom: 10px;">
        <Col span="24">
          <Button :disabled="!searchForm.projectId" v-if="isAuth('mpa:mpaagroup:save')" @click="addMpaaGroup" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('mpa:mpaagroup:delete')" :disabled="selectedList.length === 0" @click="deleteMpaaGroup" type="primary" icon="ios-trash-outline">删除</Button>
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" border stripe v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"></tables>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
        <FormItem label="分组名称" prop="name">
          <Input type="text" v-model="dataForm.name" clearable :maxlength="100" placeholder="请输入分组名称" />
        </FormItem>
        <FormItem label="报名学生" prop="studentList">
            <Tag v-for="(item,index) in dataForm.studentList" :key="index" :closable="!modalView" @on-close="handleStudentDelete">{{item.studentName}}</Tag>
            <Button v-show="!modalView" type="dashed" icon="ios-add" size="small" @click="popupStudentSelect"></Button>
        </FormItem>
        <FormItem label="评审老师" prop="teacherList">
            <Tag v-for="(item,index) in dataForm.teacherList" :key="index" :closable="!modalView" @on-close="handleTeacherDelete">{{item.teacherName}}</Tag>
            <Button v-show="!modalView" type="dashed" icon="ios-add" size="small" @click="popupTeacherSelect"></Button>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMpaaGroup">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <!-- 选择学生 start-->
    <MemberSelect modalTitle="选择学生" :modalVisible="studentSelectVisible" :orgData="studentData" :selectedData="selectedStudentData" @on-close="studentSelectVisible = false" @on-change="studentSelectChange"/>
    <!-- 选择学生 end-->
    <!-- 选择老师 start-->
    <MemberSelect modalTitle="选择老师" :modalVisible="teacherSelectVisible" :orgData="teacherData" :selectedData="selectedTeacherData" @on-close="teacherSelectVisible = false" @on-change="teacherSelectChange"/>
    <!-- 选择老师 end-->
    <!-- 分组成绩 start-->
    <ViewScore modalTitle="查看成绩" :modalVisible="groupScoreVisible" :studentList="scoreStudentList" :teacherList="scoreTeacherList" :scoreList="scoreList" @on-close="groupScoreVisible = false"/>
    <!-- 分组成绩 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/mpaa/group'
import MemberSelect from '@/view/components/applicant-group/member'
import ViewScore from '@/view/components/applicant-group/view-score'
import projectApi from '@/api/mpaa/project'
export default {
  name: 'MpaaGroup-manage',
  components: {
    Tables, MemberSelect, ViewScore
  },
  data () {
    return {
      exportLoading: false,
      loading: true,
      // tableHeight: 330,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      projectList: [],
      searchForm: {
        page: 1,
        limit: 10,
        projectId: ''
      },
      studentList: [],
      teacherList: [],
      studentSelectVisible: false,
      teacherSelectVisible: false,
      groupScoreVisible: false,
      curGroup: {},
      groupScoreList: [],
      dataForm: {
        projectId: '',
        name: '',
        studentList: [],
        teacherList: [],
        id: undefined
      },
      dataFormValidate: {
        projectId: [
          { required: true, message: '批次ID不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' }
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
          title: '分组名称',
          key: 'name',
          minWidth: 100
        },
        {
          title: '评审教师',
          key: 'teacherStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '组内学生',
          key: 'studentStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:mpaagroup:info')) {
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
                      this.viewMpaaGroup(params.row)
                    }
                  }
                },
                '查看'
              ))
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
                      this.viewMpaaGroupScore(params.row)
                    }
                  }
                },
                '成绩'
              ))
            }
            if (this.isAuth('mpa:mpaagroup:update')) {
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
                      this.editMpaaGroup(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            return h('div', btns)
          }
        }
      ]
    }
  },
  computed: {
    studentData () {
      return this.studentList.map(item => {
        let obj = {
          key: item.id,
          label: item.applicantName || '' + item.id,
          description: '',
          disabled: item.applicantStatus === 0
        }
        return obj
      })
    },
    selectedStudentData () {
      return this.dataForm.studentList.map(item => item.applicantId)
    },
    teacherData () {
      return this.teacherList.map(item => {
        let obj = {
          key: item.id,
          label: item.teaName || '' + item.id,
          description: ''
        }
        return obj
      })
    },
    selectedTeacherData () {
      return this.dataForm.teacherList.map(item => item.teacherId)
    },
    scoreStudentList () {
      if (!this.curGroup || !this.curGroup.studentList || !this.curGroup.studentList.length) {
        return []
      }
      return this.curGroup.studentList.map(item => {
        return {
          studentId: item.applicantId,
          studentName: item.studentName
        }
      })
    },
    scoreTeacherList () {
      if (!this.curGroup || !this.curGroup.teacherList || !this.curGroup.teacherList.length) {
        return []
      }
      return this.curGroup.teacherList.map(item => {
        return {
          teacherId: item.teacherId,
          teacherName: item.teacherName
        }
      })
    },
    scoreList () {
      if (!this.groupScoreList || !this.groupScoreList.length) {
        return []
      }
      return this.groupScoreList.map(item => {
        return {
          studentId: item.applicantId,
          teacherId: item.teacherId,
          studentName: item.studentName,
          score: item.score
        }
      })
    }
  },
  watch: {
    'searchForm.projectId' () {
      this.handleSearch()
      this.loadTeacherList()
    }
  },
  mounted () {
    this.init()
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 400
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
    loadGroupScoreList (v) {
      let param = {
        groupId: v.id,
        section: 1
      }
      api.getMpaaGroupScoreInfo(param).then(res => {
        this.groupScoreList = res.list
      })
    },
    loadStudentList () {
      if (!this.searchForm.projectId) return
      let param = {
        projectId: this.searchForm.projectId,
        curGroupId: this.dataForm.id
      }
      api.selectStudent(param).then(res => {
        this.studentList = res.list
      })
    },
    loadTeacherList () {
      if (!this.searchForm.projectId) return
      let param = {
        projectId: this.searchForm.projectId
      }
      api.selectTeacher(param).then(res => {
        this.teacherList = res.list
      })
    },
    studentSelectChange (targetList) {
      let list = targetList.map(item => {
        return {
          applicantId: item.key,
          studentName: item.label
        }
      })
      this.studentSelectVisible = false
      this.dataForm.studentList = list
    },
    teacherSelectChange (targetList) {
      let list = targetList.map(item => {
        return {
          teacherId: item.key,
          teacherName: item.label
        }
      })
      this.teacherSelectVisible = false
      this.dataForm.teacherList = list
    },
    popupStudentSelect () {
      this.studentSelectVisible = true
    },
    popupTeacherSelect () {
      this.teacherSelectVisible = true
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpaaGroupList()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpaaGroupList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMpaaGroupList () {
      this.loading = true
      api.getMpaaGroupList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 400
        this.pageData.list.forEach(item => {
          if (item.studentList && item.studentList.length) {
            let arr = item.studentList.map(iitem => iitem.studentName)
            item.studentStr = arr.join(',')
          }
          if (item.teacherList && item.teacherList.length) {
            let arr = item.teacherList.map(iitem => iitem.teacherName)
            item.teacherStr = arr.join(',')
          }
        })
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpaaGroupList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    addMpaaGroup () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.dataForm.projectId = this.searchForm.projectId
      this.loadStudentList()
      this.modalView = false
      this.formModalVisible = true
    },
    viewMpaaGroup (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      let entity = Object.assign({}, v)
      Object.keys(this.dataForm).forEach(key => {
        this.dataForm[key] = entity[key]
      })
      this.formModalVisible = true
      this.modalView = true
    },
    viewMpaaGroupScore (v) {
      this.curGroup = v
      this.loadGroupScoreList(v)
      this.groupScoreVisible = true
    },
    editMpaaGroup (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.modalView = false
      this.formModalVisible = true
      this.dataForm.id = v.id
      this.loadStudentList()
      api.getMpaaGroupInfo(v.id).then(res => {
        let entity = res.mpaaGroup
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
    },
    saveMpaaGroup () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMpaaGroup(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            })
          } else {
            api.updateMpaaGroup(
              this.dataForm
            ).then(res => {
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
    deleteMpaaGroup () {
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
          api.deleteMpaaGroup(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    handleStudentDelete (e, name) {
      let index = this.dataForm.studentList.findIndex(item => item.studentName === name)
      this.dataForm.studentList.splice(index, 1)
    },
    handleTeacherDelete (e, name) {
      let index = this.dataForm.teacherList.findIndex(item => item.teacherName === name)
      this.dataForm.teacherList.splice(index, 1)
    }
  }
}
</script>
