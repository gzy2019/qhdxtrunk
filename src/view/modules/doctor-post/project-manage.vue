<template>
  <div class="search">
    <Card>
      <Form
        ref="searchForm"
        :model="searchForm"
        @keydown.enter.native="handleSearch"
        inline
        :label-width="70"
        class="search-form"
      >
        <Form-item label="批次名称" prop="projectName">
          <Input
            type="text"
            v-model="searchForm.projectName"
            clearable
            placeholder="请输入批次名称"
            style="width: 170px"
          />
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <i-col span="24">
          <Button
            v-if="isAuth('doctorpost:doctorpostproject:save')"
            @click="addDoctorPostProject"
            type="primary"
            icon="md-add"
          >新增</Button>
          <Button
            v-if="isAuth('doctorpost:doctorpostproject:delete')"
            :disabled="selectedList.length === 0"
            @click="deleteDoctorPostProject()"
            type="primary"
            icon="ios-trash-outline"
          >删除</Button>
          <Button
            @click="exportDoctorPostProject"
            v-if="false"
            :loading="exportLoading"
            type="primary"
            icon="ios-download-outline"
          >导出</Button>
        </i-col>
      </Row>
      <Row>
        <Table
          :loading="loading"
          ref="table"
          size="small"
          border
          stripe
          :data="pageData.list"
          :columns="columns"
          @on-selection-change="selectionChangeHandle"
        >
          <template slot-scope="{ row }" slot="action">
            <ButtonGroup>
              <Button
                v-if="isAuth('doctorpost:doctorpostproject:info')"
                type="primary"
                size="small"
                @click="viewDoctorPostProject(row)"
              >查看</Button>
              <Button
                v-if="isAuth('doctorpost:doctorpostproject:update')"
                type="primary"
                size="small"
                @click="editDoctorPostProject(row)"
              >编辑</Button>
              <Button
                v-if="isAuth('doctorpost:doctorpostproject:delete')"
                type="error"
                size="small"
                @click="deleteDoctorPostProject(row)"
              >删除</Button>
            </ButtonGroup>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page
          :total="pageData.totalCount"
          current.sync="searchForm.page"
          :current="searchForm.page"
          :page-size="searchForm.limit"
          @on-change="changePage"
          @on-page-size-change="handlePageSize"
          show-total
          show-sizer
        ></Page>
      </Row>
    </Card>

    <DoctorPostProjectForm ref="doctorPostProjectForm" @update="getDoctorPostProjectList" />
  </div>
</template>

<script>
import api from '@/api/doctorpost/doctorpostproject'
import DoctorPostProjectForm from './project-form'
export default {
  name: 'DoctorPostProject-manage',
  components: { DoctorPostProjectForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        projectName: ''
      },
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
          title: '批次名称',
          key: 'projectName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '开始日期',
          key: 'projectStartTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '结束时间',
          key: 'projectEndTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申报开关',
          key: 'projectOpenFlag',
          minWidth: 100,
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
          title: '备注',
          key: 'projectMemo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 150
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getDoctorPostProjectList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 230
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDoctorPostProjectList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDoctorPostProjectList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getDoctorPostProjectList () {
      this.loading = true
      api.getDoctorPostProjectList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportDoctorPostProject () {
      this.$refs.table.exportCsv({
        filename: '博士后招聘批次表列表'
      })
    },
    addDoctorPostProject () {
      this.$refs.doctorPostProjectForm.addDoctorPostProject()
    },
    viewDoctorPostProject (v) {
      this.$refs.doctorPostProjectForm.viewDoctorPostProject(v.id)
    },
    editDoctorPostProject (v) {
      this.$refs.doctorPostProjectForm.editDoctorPostProject(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    changeStatus (obj, status) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          api
            .updateDoctorPostProject({
              id: obj.id,
              projectOpenFlag: status
            })
            .then(res => {
              this.$Message.success('修改成功！')
              obj.projectOpenFlag = status
            })
        },
        onCancel: () => {
          obj.projectOpenFlag = !status
        }
      })
    },
    deleteDoctorPostProject (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.deleteDoctorPostProject(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
