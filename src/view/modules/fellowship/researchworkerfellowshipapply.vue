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
            <!-- <Button v-if="isAuth('fellowship:researchworkerfellowshipapply:save')" @click="addResearchworkerFellowshipApply" type="primary" icon="md-add">奖励项目</Button> -->
            <Button @click="back" type="primary">返回</Button>
            <Button v-if="isAuth('fellowship:researchworkerfellowshipapply:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerFellowshipApply()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerFellowshipApply" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Modal title="结果" v-model="formModalVisible"  :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100">
           <FormItem label="id" prop="openingDate1" v-show="false">
            <Input type="text" v-model="openScheduleData1.id" :maxlength="100" placeholder="" clearable/>
          </FormItem>
          <FormItem label="奖学金的结果" prop="fellowshipResult">
            <Input type="text" v-model="dataForm.fellowshipResult" :maxlength="100" placeholder="请输入奖学金的结果" />
          </FormItem>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerFellowshipApply">提交</Button>
        </div>
      </Modal>
        <Row>
          <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button type="primary" @click="downloadCase(row)" size="small">资料下载</Button>
                <Button type="primary" @click="openSchedule1(row)" size="small">录入结果</Button>
                <!-- <Button v-if="isAuth('fellowship:researchworkerfellowshipapply:info')"   type="primary" size="small" @click="viewResearchworkerFellowshipApply(row)">查看</Button> -->
                <!-- <Button v-if="isAuth('fellowship:researchworkerfellowshipapply:update')" type="primary" size="small" @click="editResearchworkerFellowshipApply(row)">编辑</Button> -->
                <!-- <Button v-if="isAuth('fellowship:researchworkerfellowshipapply:delete')" type="error"   size="small" @click="deleteResearchworkerFellowshipApply(row)">删除</Button> -->
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerFellowshipApplyForm ref="researchworkerFellowshipApplyForm" @on-save="handleSearch" @on-update="getResearchworkerFellowshipApplyList" />
      <ResearchworkerFellowshipApplyView ref="researchworkerFellowshipApplyView" />
  </div>
</template>

<script>
import api from '@/api/fellowship/researchworkerfellowshipapply'
import api1 from '@/api/fellowship/researchworkerfellowshipresult'

import ResearchworkerFellowshipApplyForm from './components/researchworkerfellowshipapply-form'
import ResearchworkerFellowshipApplyView from './components/researchworkerfellowshipapply-view'
export default {
  name: 'ResearchworkerFellowshipApply-manage',
  components: { ResearchworkerFellowshipApplyForm, ResearchworkerFellowshipApplyView },
  data () {
    return {
      openScheduleData1: '',
      formModalVisible: false,
      submitLoading: false,
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        stuName: undefined
      },
      dataForm: {
        stuName: '',
        stuCode: '',
        fellowshipResult: '',
        fellowshipInfoId: '',
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
          title: '学生结果',
          key: 'fellowshipResult',
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
      this.$router.push({name: 'fellowship/researchworkerfellowshipinfo'})
    },
    downloadCase (item) {
      console.log(item)
      if (item.stuApplyInfo) {
        let stuApplyInfo = JSON.parse(item.stuApplyInfo)
        let url = stuApplyInfo[0].url
        console.log(url, '1111')
        if (url) {
          window.open(url)
        }
        // }
      }
    },
    init () {
      this.getResearchworkerFellowshipApplyList()
      this.adjustTableHeight()
    },
    cancel () {
      this.formModalVisible = false
    },
    openSchedule1 (row) {
      this.openScheduleData1 = Object.assign({}, row)
      console.log(JSON.stringify(row))
      console.log('----' + this.openScheduleData1.id)
      this.formModalVisible = true
    },
    saveResearchworkerFellowshipApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let fellowshipInfoId = this.$route.params.fellowshipInfoId
          this.dataForm.fellowshipInfoId = fellowshipInfoId
          this.dataForm.stuName = this.openScheduleData1.stuName
          this.dataForm.stuCode = this.openScheduleData1.stuCode
          let data = Object.assign({}, this.dataForm)
          api1.saveResearchworkerFellowshipResult(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.getResearchworkerFellowshipApplyList()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerFellowshipApplyList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerFellowshipApplyList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getResearchworkerFellowshipApplyList () {
      this.loading = true
      let fellowshipInfoId = this.$route.params.fellowshipInfoId
      this.searchForm.fellowshipInfoId = fellowshipInfoId
      api.getResearchworkerFellowshipApplyList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerFellowshipApply () {
      this.$refs.table.exportCsv({
        filename: '奖学金申请表列表'
      })
    },
    addResearchworkerFellowshipApply () {
      this.$refs.researchworkerFellowshipApplyForm.addResearchworkerFellowshipApply()
    },
    viewResearchworkerFellowshipApply (v) {
      this.$refs.researchworkerFellowshipApplyView.viewResearchworkerFellowshipApply(v.id)
    },
    editResearchworkerFellowshipApply (v) {
      this.$refs.researchworkerFellowshipApplyForm.editResearchworkerFellowshipApply(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteResearchworkerFellowshipApply (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerFellowshipApply(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
