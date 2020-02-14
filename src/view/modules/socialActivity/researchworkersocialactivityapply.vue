<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="申请小组" prop="applyGroup">
            <Input type="text" v-model="searchForm.applyGroup" clearable placeholder="请输入申请小组" style="width: 170px" />
          </Form-item>
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
            <!-- <Button v-if="isAuth('socialActivity:researchworkersocialactivityapply:save')" @click="addResearchworkerSocialactivityApply" type="primary" icon="md-add">新增</Button> -->
            <Button v-if="isAuth('socialActivity:researchworkersocialactivityapply:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerSocialactivityApply()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerSocialactivityApply" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
      <Modal title="评论" v-model="formModalVisible" :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100">
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
          </FormItem>
          <FormItem label="活动评论" prop="activityDesc">
            <Input type="text" v-model="dataForm.activityDesc" :maxlength="100" placeholder="请输入活动评论" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerSocialactivityApply">提交</Button>
        </div>
      </Modal>
      <Modal title="审核" v-model="formModalVisibe" :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100">
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData1.id" :maxlength="100" placeholder="" />
          </FormItem>
          <FormItem label="申请小组" prop="applyGroup">
            <Select v-model="dataForm.applyGroup" clearable>
              <Option v-for="item in tagList" :value="item" :key="item">{{ item }}</Option>
            </Select>
             <!-- <Tag v-model="dataForm.applyGroup" checkable :checked="item.checked"
             @on-change="tagChange" color="success" v-for="(item,index) in tagList"
             :key="index" :name="item.id" >{{item.activityGroups}}</Tag> -->
            <!-- <Input type="text" v-model="dataForm.applyGroup" :maxlength="100" placeholder="请输入申请小组" /> -->
          </FormItem>
          <FormItem label="审核结果" prop="confirmResult">
            <Select v-model="dataForm.confirmResult" clearable>
              <Option v-for="item in confirmResultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerSocialactivityApply1">提交</Button>
        </div>
      </Modal>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('socialActivity:researchworkersocialactivityapply:info')"   type="primary" size="small" @click="viewResearchworkerSocialactivityApply(row)">查看</Button>
                <Button  type="primary" size="small" @click="openSchedule1(row)" >审核</Button>
                <Button  type="primary" size="small" @click="openSchedule(row)" >评论</Button>
                <!-- <Button v-if="isAuth('socialActivity:researchworkersocialactivityapply:update')" type="primary" size="small" @click="editResearchworkerSocialactivityApply(row)">编辑</Button> -->
                <Button v-if="isAuth('socialActivity:researchworkersocialactivityapply:delete')" type="error"   size="small" @click="deleteResearchworkerSocialactivityApply(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerSocialactivityApplyForm ref="researchworkerSocialactivityApplyForm" @on-save="handleSearch" @on-update="getResearchworkerSocialactivityApplyList" />
      <ResearchworkerSocialactivityApplyView ref="researchworkerSocialactivityApplyView" />
  </div>
</template>

<script>
import api1 from '@/api/socialActivity/researchworkersocialactivityinfo'
import api from '@/api/socialActivity/researchworkersocialactivityapply'
import IDatePicker from '@/view/components/idate-picker'
import ResearchworkerSocialactivityApplyForm from './components/researchworkersocialactivityapply-form'
import ResearchworkerSocialactivityApplyView from './components/researchworkersocialactivityapply-view'
export default {
  name: 'ResearchworkerSocialactivityApply-manage',
  components: { ResearchworkerSocialactivityApplyForm, ResearchworkerSocialactivityApplyView, IDatePicker },
  data () {
    return {
      submitLoading: false,
      formModalVisible: false,
      formModalVisibe: false,
      confirmResultList: [{value: 1, label: '通过'}, {value: 2, label: '未通过'}],
      openScheduleData: '',
      openScheduleData1: '',
      loading: true,
      exportLoading: false,
      selectedList: [],
      tagList: [],
      searchForm: {
        page: 1,
        limit: 10,
        activityId: undefined,
        stuName: undefined
      },
      dataForm: {
        applyGroup: '',
        activityDesc: undefined,
        confirmResult: undefined,
        // confirmDate: '',
        // commentDate: '',
        id: undefined
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
          title: '学生学号',
          key: 'stuCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申请小组',
          key: 'applyGroup',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动评论',
          key: 'activityDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '审核结果',
          key: 'confirmResultDesc',
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
    openSchedule1 (row) {
      this.openScheduleData = Object.assign({}, row)
      console.log(JSON.stringify(row), 'qqqw')
      console.log('----' + this.openScheduleData.id)
      api1.getResearchworkerSocialactivityInfoInfo(row.activityId).then(res => {
        console.log(res, 'wqwww')
        this.tagList = res.researchworkerSocialactivityInfo.activityGroups
      })
      this.formModalVisibe = true
    },
    init () {
      this.getResearchworkerSocialactivityApplyList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerSocialactivityApplyList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerSocialactivityApplyList()
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
      this.formModalVisibe = false
    },
    getResearchworkerSocialactivityApplyList () {
      this.loading = true
      let activityId = this.$route.params.activityId
      this.searchForm.activityId = activityId
      api.getResearchworkerSocialactivityApplyList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerSocialactivityApply () {
      this.$refs.table.exportCsv({
        filename: '社会实践申请列表'
      })
    },
    addResearchworkerSocialactivityApply () {
      this.$refs.researchworkerSocialactivityApplyForm.addResearchworkerSocialactivityApply()
    },
    viewResearchworkerSocialactivityApply (v) {
      this.$refs.researchworkerSocialactivityApplyView.viewResearchworkerSocialactivityApply(v.id)
    },
    editResearchworkerSocialactivityApply (v) {
      this.$refs.researchworkerSocialactivityApplyForm.editResearchworkerSocialactivityApply(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    saveResearchworkerSocialactivityApply () {
      this.dataForm.stuName = this.openScheduleData.stuName
      this.dataForm.stuCode = this.openScheduleData.stuCode
      this.dataForm.activityId = this.openScheduleData.activityId
      this.dataForm.id = this.openScheduleData.id
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let time = new Date()
          let year = time.getFullYear()
          let month = time.getMonth()
          let day = time.getDate()

          // 获取时分秒
          let h = time.getHours()
          let m = time.getMinutes()
          let s = time.getSeconds()

          // 检查是否小于10
          // h = check(h)
          // m = check(m)
          // s = check(s)
          let commentTime = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
          // 新增保存
          this.dataForm.commentDate = commentTime
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          api.updateResearchworkerSocialactivityApply(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.handleSearch()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    saveResearchworkerSocialactivityApply1 () {
      this.dataForm.stuName = this.openScheduleData.stuName
      this.dataForm.stuCode = this.openScheduleData.stuCode
      this.dataForm.activityId = this.openScheduleData.activityId
      this.dataForm.id = this.openScheduleData.id
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let time = new Date()
          let year = time.getFullYear()
          let month = time.getMonth()
          let day = time.getDate()

          // 获取时分秒
          let h = time.getHours()
          let m = time.getMinutes()
          let s = time.getSeconds()

          // 检查是否小于10
          // h = check(h)
          // m = check(m)
          // s = check(s)
          let commentTime = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
          // 新增保存
          this.dataForm.confirmDate = commentTime
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          api.updateResearchworkerSocialactivityApply(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisibe = false
            this.handleSearch()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    deleteResearchworkerSocialactivityApply (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerSocialactivityApply(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
