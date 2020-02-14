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
        <Form-item label="导师姓名" prop="teacherName">
          <Input
            type="text"
            v-model="searchForm.teacherName"
            clearable
            placeholder="请输入导师姓名"
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
            v-if="isAuth('doctorpost:doctorpostteacher:save')"
            @click="addDoctorPostTeacher"
            type="primary"
            icon="md-add"
          >新增</Button>
          <Button
            v-if="isAuth('doctorpost:doctorpostteacher:delete')"
            :disabled="selectedList.length === 0"
            @click="deleteDoctorPostTeacher()"
            type="primary"
            icon="ios-trash-outline"
          >删除</Button>
          <Button
            @click="exportDoctorPostTeacher"
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
                v-if="isAuth('doctorpost:doctorpostteacher:info')"
                type="primary"
                size="small"
                @click="viewDoctorPostTeacher(row)"
              >查看</Button>
              <Button
                v-if="isAuth('doctorpost:doctorpostteacher:update')"
                type="primary"
                size="small"
                @click="editDoctorPostTeacher(row)"
              >编辑</Button>
              <Button
                v-if="isAuth('doctorpost:doctorpostteacher:delete')"
                type="error"
                size="small"
                @click="deleteDoctorPostTeacher(row)"
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
    <DoctorPostTeacherForm ref="doctorPostTeacherForm" @update="getDoctorPostTeacherList" />
  </div>
</template>

<script>
import api from '@/api/doctorpost/doctorpostteacher'
import DoctorPostTeacherForm from './teacher-form'
export default {
  name: 'DoctorPostTeacher-manage',
  components: { DoctorPostTeacherForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        teacherName: ''
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
          title: '研究方向',
          key: 'applyDirectionStr',
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
          title: '联合导师姓名',
          key: 'teacher2Name',
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
      this.getDoctorPostTeacherList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 230
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDoctorPostTeacherList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDoctorPostTeacherList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getDoctorPostTeacherList () {
      this.loading = true
      api.getDoctorPostTeacherList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportDoctorPostTeacher () {
      this.$refs.table.exportCsv({
        filename: '博士后导师表列表'
      })
    },
    addDoctorPostTeacher () {
      this.$refs.doctorPostTeacherForm.addDoctorPostTeacher()
    },
    viewDoctorPostTeacher (v) {
      this.$refs.doctorPostTeacherForm.viewDoctorPostTeacher(v.id)
    },
    editDoctorPostTeacher (v) {
      this.$refs.doctorPostTeacherForm.editDoctorPostTeacher(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteDoctorPostTeacher (row) {
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
          api.deleteDoctorPostTeacher(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
