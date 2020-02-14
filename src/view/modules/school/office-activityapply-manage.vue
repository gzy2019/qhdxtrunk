<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <Form-item label="活动名称" style="width:160px">
                  <Input type="text" v-model="searchForm.contactsId" placeholder="请输入活动名称"  style="width: 160px" clearable/>
                </Form-item>
                <Form-item label="报名类型" prop="userType" style="margin-left:70px">
                  <Select v-model="searchForm.userType" style="width:160px;" clearable>
                  <Option v-for="item in userTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item label="审核状态" prop="name">
                  <Select v-model="searchForm.applyAuditStatus" style="width:160px" clearable>
                  <Option v-for="item in applyAuditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item style="margin-left: -60px;">
                  <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                  <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <i-Col span="24">
                  <Button v-if="isAuth('activity:officeactivityapply:save')" @click="addOfficeActivityApply" type="primary" icon="md-add">报名</Button>
                  <Button type="primary" @click="enrollOfficeActivityNotice(row)" :disabled="selectedList.length === 0" icon="md-checkmark">同意</Button>
                  <Button type="primary" @click="declineOfficeActivityNotice(row)" :disabled="selectedList.length === 0" icon="md-close">拒绝</Button>
                  <Button v-if="isAuth('activity:officeactivityapply:delete')"  @click="deleteOfficeActivityApply()" :disabled="selectedList.length === 0" type="primary" icon="ios-trash-outline">删除</Button>
                  <Button @click="exportOfficeActivityApply" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </i-Col>
            </Row>
            <Row>
              <Table :loading="loading" ref="table"   size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                <template slot-scope="{ row }" slot="action">
                  <ButtonGroup>
                    <Button v-if="isAuth('activity:officeactivityapply:info')" type="primary" size="small" @click="viewOfficeActivityApply(row)">查看</Button>
                    <Button v-if="isAuth('activity:officeactivityapply:update')" type="primary" size="small" @click="editOfficeActivityApply(row)">编辑</Button>
                    <Button v-if="isAuth('activity:officeactivityapply:delete')" type="error"   size="small" @click="deleteOfficeActivityApply(row)">删除</Button>
                  </ButtonGroup>
                </template>
              </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>
        <OfficeActivityApplyForm ref="officeActivityApplyForm" @update="getOfficeActivityApplyList" />
        <OfficeActivityApplyView ref="officeActivityApplyView" />
    </div>
</template>
<script>
import api from '@/api/activity/officeactivityapply'
import OfficeActivityApplyForm from './components/officeactivityapply-form'
import OfficeActivityApplyView from './components/officeactivityapply-view'
export default {
  name: 'OfficeActivityApply-manage',
  components: { OfficeActivityApplyForm, OfficeActivityApplyView },
  data () {
    return {
      userTypeList: [{ value: 0, label: '学生' }, { value: 1, label: '教师' }, { value: 2, label: '学生&教师' }],
      applyAuditStatusList: [{value: 0, label: '申请中'}, {value: 1, label: '已同意'}],
      loading: true,
      exportLoading: false,
      tableHeight: 330,
      selectedList: [],
      applyIds: [],
      searchForm: {
        page: 1,
        limit: 10,
        contactsId: undefined,
        applyAuditStatus: undefined,
        userType: undefined
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
          key: 'activityTitle',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名类型',
          key: 'userTypeDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名姓名',
          key: 'userName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名结束时间',
          key: 'applyEndDate',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名留言',
          key: 'applyMsg',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '审核状态',
          key: 'applyAuditStatusDesc',
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
      this.getOfficeActivityApplyList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getOfficeActivityApplyList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getOfficeActivityApplyList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getOfficeActivityApplyList () {
      this.loading = true
      let activityId = this.$route.params.activityId
      this.searchForm.activityId = activityId
      console.log('object :', this.searchForm)
      api.getOfficeActivityApplyList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    enrollOfficeActivityNotice (list1) {
      this.enrollList = list1
      this.$Modal.confirm({
        title: '确认同意',
        content: `<p>您确定同意吗?</p>`,
        onOk: () => {
          let ids = []
          for (let i in this.selectedList) {
            ids.push(this.selectedList[i].id)
          }
          api.updateOfficeActivityApply({applyAuditStatus: '1', ids: ids}).then(res => {
            this.$Message.success('同意成功')
            this.handleSearch()
          })
        }
      })
    },
    declineOfficeActivityNotice (list2) {
      this.enrollList = list2
      this.$Modal.confirm({
        title: '确认拒绝',
        content: `<p>您确定拒绝吗?</p>`,
        onOk: () => {
          let ids = []
          for (let i in this.selectedList) {
            ids.push(this.selectedList[i].id)
          }
          api.updateOfficeActivityApply({applyAuditStatus: '2', ids: ids}).then(res => {
            console.log('object :', {applyAuditStatus: '2', ids: ids})
            this.$Message.success('已拒绝')
            this.handleSearch()
          })
        }
      })
    },
    exportOfficeActivityApply () {
      this.$refs.table.exportCsv({
        filename: '活动报名表列表'
      })
    },
    addOfficeActivityApply () {
      this.$refs.officeActivityApplyForm.addOfficeActivityApply()
    },
    viewOfficeActivityApply (v) {
      this.$refs.officeActivityApplyView.viewOfficeActivityApply(v.id)
    },
    editOfficeActivityApply (v) {
      this.$refs.officeActivityApplyForm.editOfficeActivityApply(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
      console.log(JSON.stringify(this.selectedList))
    },
    deleteOfficeActivityApply (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteOfficeActivityApply(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
