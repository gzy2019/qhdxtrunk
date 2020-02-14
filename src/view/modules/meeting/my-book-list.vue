<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="会议名称" prop="name">
          <Input type="text" v-model="searchForm.name" clearable placeholder="请输入会议名称" style="width: 150px" />
        </Form-item>
        <Form-item label="审核状态" prop="approveStatus">
          <Select v-model="searchForm.approveStatus" @on-change="handleSearch" placeholder="请选择" clearable style="width: 150px">
            <Option :value=0>未审核</Option>
            <Option :value=1>审核通过</Option>
            <Option :value=2>审核拒绝</Option>
          </Select>
        </Form-item>
        <Form-item label="会议室" prop="meetingRoomId">
          <Select v-model="searchForm.meetingRoomId" @on-change="handleSearch" placeholder="请选择" clearable style="width: 150px">
            <Option v-for="(item,index) in meetingRoomList" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <Col span="24">
          <Button :disabled="selectedList.length === 0" @click="cancelMeetingRoomBook()" type="primary" icon="ios-trash-outline">批量取消</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="approveStatus">
              <Tag :color="row.approveStatus | approveStatusColor">{{row.approveStatus | approveStatusInfo}}</Tag>
          </template>
          <template slot-scope="{ row }" slot="haveDispute">
              <Tag  v-if="!row.haveDispute" color="success">否</Tag>
              <Tag v-else color="error">是</Tag>
          </template>
          <template slot-scope="{ row }" slot="useTime">
              <template v-if="row.serialDate">
                <Tooltip max-width="180" :content="`${row.beginDate}至${row.endDate};${getWeekDaysInfo(row.weekDays)};${row.useTimeDesc}`">
                  {{row.beginDate}} 至 {{row.endDate}}
                </Tooltip>
              </template>
              <template v-else>
                {{row.beginDate}} {{row.useTimeDesc}}
              </template>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <BookForm ref="bookform" @update="getMeetingRoomBookList" />
  </div>
</template>

<script>
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
  components: { BookForm },
  data () {
    return {
      loading: true,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      meetingRoomList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: '',
        approveStatus: undefined,
        meetingRoomId: undefined
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
          title: '联系方式',
          key: 'contact',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '审核状态',
          slot: 'approveStatus',
          minWidth: 100
        },
        {
          title: '审核时间',
          key: 'approveTime',
          minWidth: 100,
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
          minWidth: 180,
          render: (h, params) => {
            let btns = []
            btns.push(h(
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
            ))
            if (params.row.approveStatus === 0) {
              btns.push(h(
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
                      this.editMeetingRoomBook(params.row)
                    }
                  }
                },
                '修改'
              ))
            }
            btns.push(h(
              'Button',
              {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.cancelMeetingRoomBook(params.row)
                  }
                }
              },
              '取消'
            ))
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
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
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
      api.getMineBookList(this.searchForm).then(res => {
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
      this.formModalVisible = false
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
    cancelMeetingRoomBook (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定取消${ids.length > 1 ? ids.length + '条预订' : '此预订'}吗?</p>`,
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
