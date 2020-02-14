<template>
  <div class="search">
    <Card>
          <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="接收人" prop="mailReceiver">
              <Input type="text" v-model="searchForm.mailReceiver" clearable placeholder="请输入接收人" style="width: 165px" />
            </Form-item>
            <Form-item label="发送状态" prop="mailStatus">
              <Select v-model="searchForm.mailStatus" clearable @on-change="handleSearch" style="width:200px">
                  <Option value="1">成功</Option>
                  <Option value="0">失败</Option>
              </Select>
            </Form-item>
            <Form-item label="发送时间" prop="dateRange">
              <IDatePicker v-model="searchForm.dateRange" format="yyyy-MM-dd" type="datetimerange" split-panels placeholder="发送时间" style="width: 200px"></IDatePicker>
            </Form-item>
            <Form-item style="margin-left: -70px;">
              <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
              <Button @click="handleClear" style="margin-left: 5px">清除</Button>
            </Form-item>
          </Form>
          <Row>
            <Col span="24">
              <Table ref="selection" :loading="loading" :columns="columns4" :data="pageData.list"></Table>
            </Col>
          </Row>
          <Row>
            <Col span="24" type="flex" justify="end" class="page" style="text-align:right">
              <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Col>
          </Row>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import IDatePicker from '@/view/components/idate-picker'
import api from '@/api/msg'
export default {
  name: 'mailOutbox',
  components: {
    Tables, IDatePicker, DicSelect
  },
  data () {
    return {
      searchForm: {
        page: 1,
        limit: 10,
        mailReceiver: '',
        mailStatus: '',
        dateRange: []
      },
      loading: false,
      columns4: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '状态',
          width: 90,
          key: 'mailStatus',
          render: (h, params) => {
            return h('div', params.row.mailStatus === '1' ? '成功' : '失败')
          }
        },
        {
          title: '接收邮箱',
          minWidth: 180,
          key: 'mailReceiver',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '接收人',
          minWidth: 180,
          key: 'mailReceiverName',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '发送内容',
          minWidth: 300,
          key: 'mailContent',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '时间',
          minWidth: 160,
          ellipsis: true,
          tooltip: true,
          key: 'createTime'
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      }
    }
  },
  methods: {
    init () {
      this.getDataList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDataList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getDataList () {
      this.loading = true
      api.getMailOutList(this.searchForm).then(res => {
        console.log('res=', JSON.stringify(res))
        this.pageData = res.page
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$Message.error(err)
      })
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDataList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
