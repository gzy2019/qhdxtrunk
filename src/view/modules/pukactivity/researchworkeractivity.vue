<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="活动名称" prop="activityName">
            <Input type="text" v-model="searchForm.activityName" clearable placeholder="请输入活动名称" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('pukactivity:researchworkeractivity:save')" @click="addResearchworkerActivity" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('pukactivity:researchworkeractivity:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerActivity()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerActivity" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Modal title="添加人员" v-model="formModalVisibe" :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100">
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData1.id" :maxlength="100" placeholder="" />
          </FormItem>
          <FormItem label="添加人员" prop="msgGroupMember">
            <Tag v-for="(item, index) in dataForm.msgGroupMember" color="primary" :closable="true" @on-close="deleteMember(index)" :key="index">{{item.stuName}}</Tag>
            <Button icon="ios-add" type="dashed" size="small" @click="addpersonnel=true">添加人员</Button>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerGather">提交</Button>
        </div>
      </Modal>
      <Modal v-model="addpersonnel" title="选择对象" @on-ok="completeSelect" @on-cancel="addpersonnel=false">
        <Tabs v-if="addpersonnel">
          <TabPane label="学生">
            <div>
              <Input prefix="ios-search" placeholder="快速查找" style="width: 50%" />
            </div>
            <StudentTree @on-check-change="onStudentSelectCheck"/>
          </TabPane>
        </Tabs>
      </Modal>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button  type="primary" size="small" @click="openSchedule1(row)" >添加人员</Button>
                <Button v-if="isAuth('pukactivity:researchworkeractivity:info')"   type="primary" size="small" @click="viewResearchworkerActivity(row)">查看</Button>
                <Button v-if="isAuth('pukactivity:researchworkeractivity:update')" type="primary" size="small" @click="editResearchworkerActivity(row)">编辑</Button>
                <Button v-if="isAuth('pukactivity:researchworkeractivity:delete')" type="error"   size="small" @click="deleteResearchworkerActivity(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerActivityForm ref="researchworkerActivityForm" @on-save="handleSearch" @on-update="getResearchworkerActivityList" />
      <ResearchworkerActivityView ref="researchworkerActivityView" />
  </div>
</template>

<script>
import api from '@/api/pukactivity/researchworkeractivity'
import api1 from '@/api/pukactivity/researchworkergather'
import StudentTree from '@/view/components/student-tree'

import ResearchworkerActivityForm from './components/researchworkeractivity-form'
import ResearchworkerActivityView from './components/researchworkeractivity-view'
export default {
  name: 'ResearchworkerActivity-manage',
  components: { ResearchworkerActivityForm, ResearchworkerActivityView, StudentTree },
  data () {
    return {
      formModalVisibe: false,
      submitLoading: false,
      openScheduleData1: '',
      addpersonnel: false,
      receiverSelectVisible: false,
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        activityName: undefined
      },
      dataForm: {
        msgGroupMember: '',
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
          title: '活动名称',
          key: 'activityName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动详情',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row)
                    this.$router.push({ name: 'pukactivity/researchworkergather', params: { activityId: params.row.id } })
                    console.log('23332 :', params.row.id)
                  }
                }
              }, '查看详情')
          }
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
    onStudentSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          console.log(item, 'item')
          if (item.type === 'student') {
            list.push({
              name: item.label,
              // mobile: item.mobile,
              // email: item.email,
              // type: 'student',
              id: item.id
            })
          }
        })
        // let teaList = this.tmpReceiverList.filter(item => item.type === 'tea')
        this.tmpReceiverList = [...list]
      }
    },
    completeSelect () {
      let groupMemberArr = []
      this.tmpReceiverList.forEach(item => {
        console.log(item)
        groupMemberArr.push({
          stuId: item.id,
          stuName: item.name,
          activityId: this.openScheduleData.id
          // mobile: item.mobile,
          // email: item.email,
          // msgGroupMemberType: item.type
        })
      })
      this.dataForm.msgGroupMember = [...groupMemberArr]
    },
    deleteMember (index) {
      this.dataForm.msgGroupMember.splice(index, 1)
    },
    openSchedule1 (row) {
      this.openScheduleData = Object.assign({}, row)
      console.log(JSON.stringify(row), 'qqqw')
      console.log('----' + this.openScheduleData.id)
      this.formModalVisibe = true
    },
    init () {
      this.getResearchworkerActivityList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerActivityList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerActivityList()
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
      this.formModalVisibe = false
    },
    getResearchworkerActivityList () {
      this.loading = true
      api.getResearchworkerActivityList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    saveResearchworkerGather () {
      if (this.submitLoading) return
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          console.log(data)
          // data.msgGroupMember = JSON.parse(data.msgGroupMember)
          // 新增保存
          if (!data.id) {
            api1.saveResearchworkerGather1(
              data.msgGroupMember
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisibe = false
              this.handleSearch()
              this.msgGroupMember = []
            })
          } else {
            api1.updateResearchworkerGather(
              data
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisibe = false
              this.handleSearch()
            })
          }
        }
      })
    },
    exportResearchworkerActivity () {
      this.$refs.table.exportCsv({
        filename: '129批次表列表'
      })
    },
    addResearchworkerActivity () {
      this.$refs.researchworkerActivityForm.addResearchworkerActivity()
    },
    viewResearchworkerActivity (v) {
      this.$refs.researchworkerActivityView.viewResearchworkerActivity(v.id)
    },
    editResearchworkerActivity (v) {
      this.$refs.researchworkerActivityForm.editResearchworkerActivity(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteResearchworkerActivity (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerActivity(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
