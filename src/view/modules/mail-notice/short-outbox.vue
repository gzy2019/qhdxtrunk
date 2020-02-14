<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="手机号" prop="smsPhone">
            <Input type="text" v-model="searchForm.smsPhone" clearable placeholder="请输入手机号" style="width: 165px" />
          </Form-item>
          <Form-item label="发送状态" prop="smsStatus">
            <Select v-model="searchForm.smsStatus" clearable @on-change="handleSearch" style="width:200px">
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
        <Row class="operation btn_group">
          <Col span="24" class="operation btn_group">
            <Button @click="eport = true" type="primary">导出所有</Button>
          </Col>
        </Row>

        <Row>
          <Col span="24">
            <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" />
          </Col>
        </Row>
        <Row>
          <Col span="24" type="flex" justify="end" class="page" style="text-align:right">
            <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change="handlePageSize" show-total show-sizer></Page>
          </Col>
        </Row>
    </Card>

    <!--导出 start-->
    <Modal title v-model="eport" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认导出所有数据？</p>
      <div slot="footer">
        <Button @click="eport = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="exportData">确定</Button>
      </div>
    </Modal>
    <!--导出 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import IDatePicker from '@/view/components/idate-picker'
import api from '@/api/msg'
export default {
  name: 'shortOutbox',
  components: {
    Tables,
    DicSelect,
    IDatePicker
  },
  data () {
    return {
      loading: false,
      searchForm: {
        smsPhone: '',
        smsStatus: '',
        dateRange: [],
        page: 1,
        limit: 10
      },
      eport: false,
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '状态',
          width: 90,
          key: 'smsStatus',
          render: (h, params) => {
            return h('div', params.row.smsStatus === '1' ? '成功' : '失败')
          }
        },
        {
          title: '手机号',
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
          key: 'smsPhone'
        },
        {
          title: '收件人',
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
          key: 'smsReceiver'
        },
        {
          title: '发送内容',
          minWidth: 350,
          ellipsis: true,
          tooltip: true,
          key: 'smsContent'
        },
        {
          title: '时间',
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          key: 'createTime'
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      exportLoading: false
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
      api.getSmsOutList(this.searchForm).then(res => {
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
    },
    exportData () {
      this.eport = false
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getSmsOutList(params).then(res => {
        this.exportLoading = false
        this.submitLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.submitLoading = false
        this.exportLoading = false
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
