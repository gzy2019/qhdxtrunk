<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="名称" prop="name">
            <Input type="text" v-model="searchForm.name" clearable placeholder="请输入名称" style="width: 200px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('qa:qaform:save')" @click="addQaForm" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('qa:qaform:delete')" :disabled="selectedList.length === 0" @click="deleteQaForm()" type="primary" icon="ios-trash-outline">删除</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" highlight-row @on-current-change="currentChangeHandle" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="instCount">
              <Tag color="green">{{row.instCount || 0}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="enable">
              <Tag :color="row.enable ? 'green' : 'orange'">{{row.enable ? '启用' : '停用' }}</Tag>
            </template>
            <template slot-scope="{ row }" slot="qaType">
              <Tag :color="row.qaType === 1 ? 'green' : 'orange'">{{row.qaType === 1 ? '问卷' : '投票' }}</Tag>
            </template>
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('qa:qaform:info')" type="primary" size="small" @click="previewForm(row)">预览</Button>
                <Button v-if="isAuth('qa:qaform:info')" type="primary" size="small" @click="viewStats(row)">统计</Button>
                <Button v-if="isAuth('qa:qaform:info')" type="primary" size="small" @click="exportData(row)">导出</Button>
                <Button v-if="isAuth('qa:qaform:update')" type="primary" size="small" @click="selectReceiver(row)">发送</Button>
                <Button v-if="isAuth('qa:qaform:update')" type="primary" size="small" @click="editQaForm(row)">编辑</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <QaFormForm ref="qaFormForm" @on-save="handleSearch" @on-update="getQaFormList" />
      <QaFormView ref="qaFormView" />
      <DFormReady ref="dFormReady" />

      <!--收件人弹出框 start-->
    <Modal title="发送问卷" v-model="receiverModalVisible" :fullscreen="false" :width="650" class-name="vertical-center-modal" :styles="{top: '20px'}">
      <div class="receiverSelectVisible_cont" style="position:relative;">
        <Tabs v-if="receiverModalVisible">
          <TabPane label="学生" style="max-height:460px;overflow:auto;">
            <StudentTree @on-check-change="onStudentSelectCheck"/>
          </TabPane>
          <TabPane label="教师" style="max-height:460px;overflow:auto;">
            <TeacherTree @on-check-change="onTeacherSelectCheck"/>
          </TabPane>
        </Tabs>

      </div>
      <div slot="footer">
        <Button type="primary" :disabled="tmpReceiverList.length === 0" :loading="submitLoading" @click="sendQaForm">发送</Button>
      </div>
    </Modal>
    <!--收件人弹出框 end-->
  </div>
</template>

<script>
import api from '@/api/qa/qaform'
import DFormReady from './design-components/dform-ready'
import QaFormForm from './components/qaform-form'
import QaFormView from './components/qaform-view'
import TeacherTree from '@/view/components/teacher-tree'
import StudentTree from '@/view/components/student-tree'
export default {
  name: 'QaForm-manage',
  components: { QaFormForm, QaFormView, DFormReady, TeacherTree, StudentTree },
  data () {
    return {
      loading: true,
      exportLoading: false,
      receiverModalVisible: false,
      submitLoading: false,
      tmpReceiverList: [],
      publishForm: {},
      tableHeight: 330,
      selectedList: [],
      currentRow: null,
      searchForm: {
        page: 1,
        limit: 10,
        name: ''
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
          title: '问卷标题',
          key: 'title',
          minWidth: 200,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '提交数量',
          slot: 'instCount',
          minWidth: 100
        },
        {
          title: '类型',
          slot: 'qaType',
          minWidth: 100
        },
        {
          title: '状态',
          slot: 'enable',
          minWidth: 100
        },
        {
          title: '开始时间',
          key: 'beginDate',
          minWidth: 100
        },
        {
          title: '结束时间',
          key: 'endDate',
          minWidth: 100
        },
        {
          title: '问卷说明',
          key: 'memo',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 250
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getQaFormList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getQaFormList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getQaFormList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getQaFormList () {
      this.loading = true
      api.getQaFormList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    addQaForm () {
      this.$refs.qaFormForm.addQaForm()
    },
    viewStats (v) {
      this.$refs.qaFormView.viewQaForm(v.id)
    },
    editQaForm (v) {
      this.$refs.qaFormForm.editQaForm(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    currentChangeHandle (curRow, oldRow) {
      this.currentRow = curRow
    },
    previewForm (v) {
      this.$refs.dFormReady.init(v.id)
    },
    exportData (v) {
      if (!v.id) {
        return false
      }
      let params = { formId: v.id }
      api.exportQaFormStats(params).then(res => {
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      })
    },
    onStudentSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          list.push({
            name: item.title,
            mobile: item.mobile,
            email: item.email,
            type: 'student',
            id: item.id
          })
        })
        let otherList = this.tmpReceiverList.filter(item => item.type !== 'student')
        this.tmpReceiverList = [...otherList, ...list]
      }
    },
    onTeacherSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          list.push({
            name: item.title,
            mobile: item.mobile,
            email: item.email,
            type: 'tea',
            id: item.id
          })
        })
        let otherList = this.tmpReceiverList.filter(item => item.type !== 'tea')
        this.tmpReceiverList = [...otherList, ...list]
      }
    },
    selectReceiver (v) {
      this.receiverModalVisible = true
      this.tmpReceiverList = []
      this.publishForm.formId = v.id
      this.publishForm.emails = []
      this.publishForm.emailNames = []
    },
    sendQaForm () {
      if (!this.tmpReceiverList.length) {
        this.$Message.error('请选择问卷接收对象')
        return false
      }
      this.submitLoading = true
      this.publishForm.emails = this.tmpReceiverList.map(item => item.email)
      this.publishForm.emailNames = this.tmpReceiverList.map(item => item.name)
      api.publishaForm(this.publishForm).then(res => {
        this.$Message.success('问卷发送成功')
        this.receiverModalVisible = false
      }).finally(() => {
        this.submitLoading = false
      })
    },
    deleteQaForm (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteQaForm(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
