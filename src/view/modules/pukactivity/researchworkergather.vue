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
            <Button @click="back" type="primary">返回</Button>
            <!-- <Button v-if="isAuth('pukactivity:researchworkergather:save')" @click="addResearchworkerGather" type="primary" icon="md-add">新增</Button> -->
            <Button v-if="isAuth('pukactivity:researchworkergather:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerGather()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerGather" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Modal title="总结" v-model="formModalVisible" :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100">
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
          </FormItem>
           <FormItem label="总结" prop="gatherInfo">
            <Input type="text" v-model="dataForm.gatherInfo" :maxlength="300" placeholder="请输入总结" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerGather">提交</Button>
        </div>
      </Modal>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button  type="primary" size="small" @click="openSchedule(row)" >总结</Button>
                <Button v-if="isAuth('pukactivity:researchworkergather:info')"   type="primary" size="small" @click="viewResearchworkerGather(row)">查看</Button>
                <!-- <Button v-if="isAuth('pukactivity:researchworkergather:update')" type="primary" size="small" @click="editResearchworkerGather(row)">编辑</Button> -->
                <Button v-if="isAuth('pukactivity:researchworkergather:delete')" type="error"   size="small" @click="deleteResearchworkerGather(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerGatherForm ref="researchworkerGatherForm" @on-save="handleSearch" @on-update="getResearchworkerGatherList" />
      <ResearchworkerGatherView ref="researchworkerGatherView" />
  </div>
</template>

<script>
import api from '@/api/pukactivity/researchworkergather'
import ResearchworkerGatherForm from './components/researchworkergather-form'
import ResearchworkerGatherView from './components/researchworkergather-view'
export default {
  name: 'ResearchworkerGather-manage',
  components: { ResearchworkerGatherForm, ResearchworkerGatherView },
  data () {
    return {
      formModalVisible: false,
      submitLoading: false,
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
        gatherInfo: '',
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
          title: '旷签天数(天)',
          key: 'absentCount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '请假天数(天)',
          key: 'leaveCount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '总结',
          key: 'gatherInfo',
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
    back () {
      this.$router.push({name: 'pukactivity/researchworkeractivity'})
    },
    openSchedule (row) {
      this.openScheduleData = Object.assign({}, row)
      console.log(row)
      console.log('----' + this.openScheduleData.id)
      this.formModalVisible = true
    },
    init () {
      this.getResearchworkerGatherList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerGatherList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerGatherList()
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
    getResearchworkerGatherList () {
      this.loading = true
      let activityId = this.$route.params.activityId
      this.searchForm.activityId = activityId
      api.getResearchworkerGatherList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerGather () {
      this.$refs.table.exportCsv({
        filename: '129汇总表列表'
      })
    },
    addResearchworkerGather () {
      this.$refs.researchworkerGatherForm.addResearchworkerGather()
    },
    viewResearchworkerGather (v) {
      this.$refs.researchworkerGatherView.viewResearchworkerGather(v.id)
    },
    editResearchworkerGather (v) {
      this.$refs.researchworkerGatherForm.editResearchworkerGather(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    saveResearchworkerGather () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          this.dataForm.stuId = this.openScheduleData.stuId
          this.dataForm.stuName = this.openScheduleData.stuName
          this.dataForm.id = this.openScheduleData.id
          let data = Object.assign({}, this.dataForm)
          api.updateResearchworkerGather(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.handleSearch()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    deleteResearchworkerGather (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerGather(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
