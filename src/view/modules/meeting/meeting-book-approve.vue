<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm"  @keydown.enter.native="handleSearch" inline :label-width="60" class="search-form" >
        <Form-item label="预订人" prop="bookBy">
          <Input type="text"  v-model="searchForm.bookBy" clearable placeholder="请输入预订人" style="width: 180px"/>
        </Form-item>
        <Form-item label="部门" prop="departmentIdPath">
          <DepartmentSelect ref="departmentSelect" :changeOnSelect="true" @on-change="handleSearch" v-model="searchForm.departmentIdPath" />
        </Form-item>
        <Form-item label="日期" prop="useDate">
          <IDatePicker :clearable="true" type="date" v-model="searchForm.useDate" format="yyyy-MM-dd"/>
        </Form-item>
        <Form-item label="会议名称" prop="name">
          <Input
            type="text"
            v-model="searchForm.name"
            clearable
            placeholder="请输入会议名称"
            style="width: 180px"
          />
        </Form-item>
        <Form-item label="审核状态" prop="approveStatus">
          <Select
            v-model="searchForm.approveStatus"
            @on-change="handleSearch"
            placeholder="请选择"
            clearable
            style="width: 180px"
          >
            <Option :value="0">未审核</Option>
            <Option :value="1">审核通过</Option>
            <Option :value="2">审核拒绝</Option>
          </Select>
        </Form-item>
        <Form-item label="会议室" prop="meetingRoomId">
          <Select
            v-model="searchForm.meetingRoomId"
            @on-change="handleSearch"
            placeholder="请选择"
            clearable
            style="width: 180px"
          >
            <Option
              v-for="(item,index) in meetingRoomList"
              :key="index"
              :value="item.id"
            >{{item.name}}</Option>
          </Select>
        </Form-item>
        <Form-item style="margin-left: -60px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <Col span="24">
          <Button
            :disabled="selectedList.length === 0"
            @click="approvePrepare()"
            type="primary"
            icon="ios-trash-outline"
          >批量审核</Button>
        </Col>
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
          <template slot-scope="{ row }" slot="approveStatus">
            <Tag
              :color="row.approveStatus | approveStatusColor"
            >{{row.approveStatus | approveStatusInfo}}</Tag>
          </template>
          <template slot-scope="{ row }" slot="haveDispute">
            <Tag v-if="!row.haveDispute" color="success">否</Tag>
            <Tag v-else color="error">是</Tag>
          </template>
          <template slot-scope="{ row }" slot="useTime">
            <template v-if="row.serialDate">
              <Tooltip
                max-width="180"
                :content="`${row.beginDate}至${row.endDate};${getWeekDaysInfo(row.weekDays)};${row.useTimeDesc}`"
              >{{row.beginDate}} 至 {{row.endDate}}</Tooltip>
            </template>
            <template v-else>{{row.beginDate}} {{row.useTimeDesc}}</template>
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

    <Modal
      title="预定审批"
      v-model="approveModalVisible"
      :mask-closable="false"
      :width="600"
      class-name="vertical-center-modal"
    >
      <Form ref="approveForm" :model="approveForm" :label-width="100">
        <FormItem label="审批意见" prop="approveStatus">
          <RadioGroup v-model="approveForm.approveStatus">
            <Radio :label="1">通过</Radio>
            <Radio :label="2">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="拒绝原因" prop="approveMemo" v-if="approveForm.approveStatus === 2">
          <Input
            type="text"
            v-model="approveForm.approveMemo"
            :maxlength="200"
            placeholder="请输入拒绝原因"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveApproveStatus">提交</Button>
      </div>
    </Modal>

    <BookForm ref="bookform" @update="getMeetingRoomBookList" />
  </div>
</template>

<script>
import IDatePicker from '@/view/components/idate-picker'
import DepartmentSelect from '@/view/components/department-select'
import api from '@/api/meeting/meetingroombook'
import BookForm from './components/book-form'
const dayMap = {
  2: '星期一',
  3: '星期二',
  4: '星期三',
  5: '星期四',
  6: '星期五',
  7: '星期六',
  1: '星期日'
}
export default {
  name: 'meeting-book-list',
  components: { BookForm, DepartmentSelect, IDatePicker },
  data () {
    return {
      submitLoading: false,
      loading: true,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      meetingRoomList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: '',
        bookBy: '',
        departmentIdPath: null,
        useDate: null,
        approveStatus: undefined,
        meetingRoomId: undefined
      },
      approveModalVisible: false,
      approveForm: {
        ids: [],
        approveStatus: 0,
        approveMemo: ''
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
          title: '会议名称',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '会议室',
          key: 'meetingRoomName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '使用时间',
          slot: 'useTime',
          minWidth: 190
        },
        {
          title: '会议类型',
          key: 'meetingTypeStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '预定人',
          key: 'bookBy',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '联系方式',
          key: 'contact',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '审核状态',
          slot: 'approveStatus',
          minWidth: 120
        },
        {
          title: '审核时间',
          key: 'approveTime',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否违约',
          slot: 'haveDispute',
          minWidth: 100
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 150,
          render: (h, params) => {
            let btns = []
            btns.push(
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.viewMeetingRoomBook(params.row)
                    }
                  }
                },
                '查看'
              )
            )
            if (params.row.approveStatus === 0) {
              btns.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.approvePrepare(params.row)
                      }
                    }
                  },
                  '审核'
                )
              )
            }

            return h('div', btns)
          }
        }
      ]
    }
  },
  filters: {
    approveStatusInfo (val) {
      if (val === 0) {
        return '未审核'
      } else if (val === 1) {
        return '审核通过'
      } else if (val === 2) {
        return '审核拒绝'
      }
      return '未知'
    },
    approveStatusColor (val) {
      if (val === 0) {
        return 'default'
      } else if (val === 1) {
        return 'success'
      } else if (val === 2) {
        return 'error'
      }
      return ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getMeetingRoomBookList()
      this.adjustTableHeight()
      this.loadMeetingRoomList()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 230
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMeetingRoomBookList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMeetingRoomBookList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMeetingRoomBookList () {
      this.loading = true
      let param = Object.assign({}, this.searchForm)
      if (param.departmentIdPath) param.departmentIdPath = param.departmentIdPath + ''
      param.checkapprove = true
      api.getMeetingRoomBookList(param).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    loadMeetingRoomList () {
      api.getMeetingRoomList().then(res => {
        this.meetingRoomList = res.list
      })
    },
    getWeekDaysInfo (val) {
      let arr = val.split(',')
      let strArr = []
      Object.keys(dayMap).forEach(key => {
        if (arr.includes(key + '')) {
          strArr.push(dayMap[key])
        }
      })

      return strArr.join(',')
    },
    cancel () {
      this.approveModalVisible = false
    },
    viewMeetingRoomBook (v) {
      this.$refs.bookform.viewBook(v.id)
    },
    editMeetingRoomBook (v) {
      this.$refs.bookform.editBook(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    approvePrepare (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.approveForm.ids = ids
      this.approveForm.approveStatus = 1
      this.approveForm.approveMemo = ''
      this.approveModalVisible = true
    },
    saveApproveStatus () {
      this.submitLoading = true
      api.approveMeetingRoomBook(this.approveForm).then(res => {
        this.approveModalVisible = false
        this.submitLoading = false
        this.$Message.success('审批成功!')
        this.getMeetingRoomBookList()
      }).cach(e => {
        this.submitLoading = false
        this.approveModalVisible = false
      })
    },
    cancelMeetingRoomBook (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定取消${
          ids.length > 1 ? ids.length + '条预订' : '此预订'
        }吗?</p>`,
        onOk: () => {
          api.cancelMeetingRoomBook(ids).then(res => {
            this.$Message.success('取消成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
