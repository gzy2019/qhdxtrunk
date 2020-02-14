<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="80" class="search-form">
                  <Form-item label="活动名称">
                  <Input type="text" v-model="searchForm.activityTitle" clearable placeholder="请输入活动名称" style="width: 180px" />
                  </Form-item>
                  <Form-item label="活动时间">
                  <IDatePicker type="daterange" split-panels clearable v-model="searchForm.activityTime" format="yyyy-MM-dd" placeholder="请输入活动时间" style="width:180px"/>
                  </Form-item>
                  <Form-item label="活动状态">
                    <Select v-model="searchForm.activityStatus" style="width:180px" clearable>
                    <Option v-for="item in activityTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </Form-item>
                    <Form-item label="创建人">
                    <TeacherSelect v-model="searchForm.contactsId" dtype="position-title" :clearable="true" style="width:180px"></TeacherSelect>
                    </Form-item>
                    <Form-item style="margin-left: -70px;">
                      <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                      <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                    </Form-item>
            </Form>
            <Row class="operation btn_group">
              <i-col span="24">
                <Button v-if="isAuth('activity:officeactivitynotice:save')" @click="addOfficeActivityNotice" type="primary" icon="md-add">新增</Button>
                <Button v-if="isAuth('activity:officeactivitynotice:delete')" :disabled="selectedList.length === 0" @click="deleteOfficeActivityNotice()" type="primary" icon="ios-trash-outline">删除</Button>
                <Button @click="exportOfficeActivityNotice" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
              </i-col>
            </Row>
            <Row>
              <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                <template slot-scope="{ row }" slot="action">
                  <ButtonGroup>
                    <Button v-if="isAuth('activity:officeactivitynotice:info')" type="primary" size="small" @click="viewOfficeActivityNotice(row)">查看</Button>
                    <Button v-if="isAuth('activity:officeactivitynotice:update')" type="primary" size="small" @click="editOfficeActivityNotice(row)">编辑</Button>
                    <Button type="error"   size="small" @click="endOfficeActivityNotice(row)">结束</Button>
                    <Button v-if="isAuth('activity:officeactivitynotice:delete')" type="error"   size="small" @click="deleteOfficeActivityNotice(row)">删除</Button>
                  </ButtonGroup>
                </template>
              </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
              <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>
        <OfficeActivityNoticeForm ref="officeActivityNoticeForm" @update="getOfficeActivityNoticeList" />
        <OfficeActivityNoticeView ref="officeActivityNoticeView" />
    </div>
</template>
<script>
import api from '@/api/activity/officeactivitynotice'
import TeacherSelect from '@/view/components/teacher-select'
import IDatePicker from '@/view/components/idate-picker'
import OfficeActivityNoticeForm from './components/officeactivitynotice-form'
import OfficeActivityNoticeView from './components/officeactivitynotice-view'
export default {
  name: 'OfficeActivityNotice-manage',
  components: { OfficeActivityNoticeForm, OfficeActivityNoticeView, TeacherSelect, IDatePicker },
  data () {
    return {
      loading: true,
      exportLoading: false,
      tableHeight: 330,
      selectedList: [],
      activityTimeList: [{ value: 0, label: '进行中' }, { value: 1, label: '已结束' }],
      searchForm: {
        page: 1,
        limit: 10,
        activityTitle: undefined,
        typeId: undefined,
        student: undefined,
        activityTime: [],
        activityStatus: undefined,
        createUserId: undefined

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
          title: '创建人',
          key: 'teaName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动名称',
          key: 'activityTitle',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动说明',
          key: 'activityContent',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动状态',
          key: 'activityStatusDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名范围',
          key: 'applyTypeDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名时间',
          key: 'startDate',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名人数',
          key: 'applyNum',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '未审核',
          key: 'unCheckedNum',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名详情',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    // console.log('object :', params.row)
                    this.$router.push({ name: 'school/office-activityapply-manage', params: { activityId: params.row.id } })
                    console.log(this.activityId)
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
          minWidth: 200
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getOfficeActivityNoticeList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getOfficeActivityNoticeList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getOfficeActivityNoticeList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.searchForm.activityTitle = []
      this.handleSearch()
    },

    getOfficeActivityNoticeList () {
      let param = Object.assign({}, this.searchForm)
      if (this.searchForm && this.searchForm.activityTime.length >= 2) {
        param.startDate = this.searchForm.activityTime[0]
        param.endDate = this.searchForm.activityTime[1]
        delete param.activityTime
      }
      this.loading = true
      api.getOfficeActivityNoticeList(param).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
        this.pageData.list.map(item => {
          item.batchDate = []
          item.batchDate.push(item.batchStartTime)
          item.batchDate.push(item.batchEndTime)
          item.applyDate = []
          item.applyDate.push(item.applyStartTime)
          item.applyDate.push(item.applyEndTime)
        })
      })
    },
    exportOfficeActivityNotice () {
      this.$refs.table.exportCsv({
        filename: '活动通知表列表'
      })
    },
    addOfficeActivityNotice () {
      this.$refs.officeActivityNoticeForm.addOfficeActivityNotice()
    },
    viewOfficeActivityNotice (v) {
      this.$refs.officeActivityNoticeView.viewOfficeActivityNotice(v.id)
    },

    editOfficeActivityNotice (v) {
      this.$refs.officeActivityNoticeForm.editOfficeActivityNotice(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    endOfficeActivityNotice (v) {
      // this.enrollList = list2
      this.$Modal.confirm({
        title: '确认结束',
        content: `<p>您确定结束吗?</p>`,
        onOk: () => {
          v.activityStatus = '1'
          api.updateOfficeActivityNotice(v).then(res => {
            this.$Message.success('已结束')
            this.handleSearch()
          })
        }
      })
    },
    deleteOfficeActivityNotice (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteOfficeActivityNotice(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
