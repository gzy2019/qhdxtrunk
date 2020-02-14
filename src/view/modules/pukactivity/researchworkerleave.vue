<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="学生姓名" prop="stuName">
            <Input type="text" v-model="searchForm.stuName" clearable placeholder="请输入学生姓名" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('pukactivity:researchworkerleave:save')" @click="addResearchworkerLeave" type="primary">旷签</Button>
            <Button v-if="isAuth('pukactivity:researchworkerleave:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerLeave()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerLeave" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Modal title="请假" v-model="formModalVisible" :width="600" class-name="vertical-center-modal">
          <Spin size="large" fix v-if="loading"></Spin>
          <Form ref="dataForm" :model="dataForm" :label-width="100">
            <FormItem label="id" prop="openingDate" v-show="false">
              <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
            </FormItem>
            <FormItem label="请假结果" prop="leaveResult">
              <Select v-model="dataForm.leaveResult" clearable>
                <Option v-for="item in confirmResultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Form>
          <div slot="footer">
              <Button @click="cancel">取消</Button>
              <Button type="primary" :loading="submitLoading" @click="saveResearchworkerLeave">提交</Button>
          </div>
        </Modal>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('pukactivity:researchworkerleave:info')"   type="primary" size="small" @click="viewResearchworkerLeave(row)">查看</Button>
                <Button  type="primary" size="small" @click="openSchedule(row)" >请假</Button>
                <Button v-if="isAuth('pukactivity:researchworkerleave:update')" type="primary" size="small" @click="editResearchworkerLeave(row)">编辑</Button>
                <Button v-if="isAuth('pukactivity:researchworkerleave:delete')" type="error"   size="small" @click="deleteResearchworkerLeave(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerLeaveForm ref="researchworkerLeaveForm" @on-save="handleSearch" @on-update="getResearchworkerLeaveList" />
      <ResearchworkerLeaveView ref="researchworkerLeaveView" />
  </div>
</template>

<script>
import api from '@/api/pukactivity/researchworkerleave'
import ResearchworkerLeaveForm from './components/researchworkerleave-form'
import ResearchworkerLeaveView from './components/researchworkerleave-view'
export default {
  name: 'ResearchworkerLeave-manage',
  components: { ResearchworkerLeaveForm, ResearchworkerLeaveView },
  data () {
    return {
      formModalVisible: false,
      submitLoading: false,
      confirmResultList: [{value: 1, label: '通过'}, {value: 2, label: '未通过'}],
      openScheduleData: '',
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        stuName: undefined
      },
      dataForm: {
        leaveResult: '',
        id: null
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
          title: '学生姓名',
          key: 'stuName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生ID',
          key: 'stuId',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '请假内容',
          key: 'leaveInfo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '请假结果',
          key: 'leaveResultDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '旷签(天)',
          key: 'absentDay',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注',
          key: 'infoDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 180
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    openSchedule (row) {
      this.openScheduleData = Object.assign({}, row)
      console.log('----' + this.openScheduleData.id)
      this.formModalVisible = true
    },
    init () {
      this.getResearchworkerLeaveList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerLeaveList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerLeaveList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    cancel () {
      this.formModalVisible = false
    },
    getResearchworkerLeaveList () {
      this.loading = true
      let activityId = this.$route.params.activityId
      this.searchForm.activityId = activityId
      api.getResearchworkerLeaveList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerLeave () {
      this.$refs.table.exportCsv({
        filename: '129请假或旷签表列表'
      })
    },
    addResearchworkerLeave () {
      this.$refs.researchworkerLeaveForm.addResearchworkerLeave()
    },
    viewResearchworkerLeave (v) {
      this.$refs.researchworkerLeaveView.viewResearchworkerLeave(v.id)
    },
    editResearchworkerLeave (v) {
      this.$refs.researchworkerLeaveForm.editResearchworkerLeave(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    saveResearchworkerLeave () {
      this.dataForm.stuName = this.openScheduleData.stuName
      this.dataForm.stuId = this.openScheduleData.stuId
      this.dataForm.activityId = this.openScheduleData.activityId
      this.dataForm.id = this.openScheduleData.id
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          api.updateResearchworkerLeave(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.handleSearch()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    deleteResearchworkerLeave (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerLeave(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
