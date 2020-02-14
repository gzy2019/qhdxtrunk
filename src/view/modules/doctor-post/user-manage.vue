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
        <FormItem label="姓名" prop="userName">
          <Input
            type="text"
            v-model="searchForm.userName"
            clearable
            placeholder="请输入姓名"
            style="width:100%"
          />
        </FormItem>
        <FormItem label="手机号" prop="userMobile">
          <Input
            type="text"
            v-model="searchForm.userMobile"
            clearable
            placeholder="请输入手机号"
            style="width:100%"
          />
        </FormItem>
        <FormItem label="性别" prop="userSex">
          <DicSelect v-model="searchForm.userSex" dtype="sex" :clearable="true" style="width:100%"></DicSelect>
        </FormItem>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <i-col span="24">
          <Button
            v-if="isAuth('doctorpost:doctorpostuser:save')"
            @click="addDoctorPostUser"
            type="primary"
            icon="md-add"
          >新增</Button>
          <Button
            v-if="isAuth('doctorpost:doctorpostuser:delete')"
            :disabled="selectedList.length === 0"
            @click="deleteDoctorPostUser()"
            type="primary"
            icon="ios-trash-outline"
          >删除</Button>
          <Button
            @click="exportDoctorPostUser"
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
                v-if="isAuth('doctorpost:doctorpostuser:info')"
                type="primary"
                size="small"
                @click="viewDoctorPostUser(row)"
              >查看</Button>
              <Button
                v-if="isAuth('doctorpost:doctorpostuser:update')"
                type="primary"
                size="small"
                @click="editDoctorPostUser(row)"
              >编辑</Button>
              <Button
                v-if="isAuth('doctorpost:doctorpostuser:delete')"
                type="error"
                size="small"
                @click="deleteDoctorPostUser(row)"
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

    <DoctorPostUserForm ref="doctorPostUserForm" @update="getDoctorPostUserList" />
  </div>
</template>

<script>
import api from '@/api/doctorpost/doctorpostuser'
import DicSelect from '@/view/components/dic-select'
import DoctorPostUserForm from './user-form'
export default {
  name: 'DoctorPostUser-manage',
  components: { DoctorPostUserForm, DicSelect },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        userName: '',
        userMobile: '',
        userSex: ''
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
          title: '姓名',
          key: 'userName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '手机号',
          key: 'userMobile',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '邮箱',
          key: 'userEmail',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '性别',
          key: 'userSexStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 100
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getDoctorPostUserList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 230
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDoctorPostUserList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDoctorPostUserList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getDoctorPostUserList () {
      this.loading = true
      api.getDoctorPostUserList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportDoctorPostUser () {
      this.$refs.table.exportCsv({
        filename: '博士后用户招聘注册表列表'
      })
    },
    addDoctorPostUser () {
      this.$refs.doctorPostUserForm.addDoctorPostUser()
    },
    viewDoctorPostUser (v) {
      this.$refs.doctorPostUserForm.viewDoctorPostUser(v.id)
    },
    editDoctorPostUser (v) {
      this.$refs.doctorPostUserForm.editDoctorPostUser(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteDoctorPostUser (row) {
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
          api.deleteDoctorPostUser(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
