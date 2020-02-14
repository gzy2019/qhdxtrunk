<template>
  <div class="search">
    <Card>
          <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="发信人" prop="smsSender">
              <Input type="text" v-model="searchForm.smsSender" clearable placeholder="请输入发信人姓名" style="width: 165px" />
            </Form-item>
            <Form-item label="手机号" prop="smsPhone">
              <Input type="text" v-model="searchForm.smsPhone" clearable placeholder="请输入发信人手机号" style="width: 165px" />
            </Form-item>
            <Form-item label="接收时间" prop="dateRange">
              <IDatePicker type="datetimerange" format="yyyy-MM-dd" v-model="searchForm.dateRange" split-panels placeholder="请选择接收时间" style="width: 200px" />
            </Form-item>
            <Form-item style="margin-left: -70px;">
              <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
              <Button @click="handleClear" style="margin-left: 5px">清除</Button>
            </Form-item>
          </Form>
          <Row>
            <Col span="24" class="operation btn_group">
              <Button @click="eport = true" type="primary">导出所有</Button>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns"></tables>
            </Col>
          </Row>
          <Row>
            <Col span="24" type="flex" justify="end" class="page" style="text-align:right">
              <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Col>
          </Row>
    </Card>

    <!--导出 start-->
    <Modal title="" v-model="eport" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认导出所有数据？</p>
      <div slot="footer">
        <Button @click="eport = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="exportData">保存</Button>
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
  name: 'shortInbox',
  components: {
    Tables, DicSelect, IDatePicker
  },
  data () {
    return {
      loading: false,
      modalType: 0,
      eport: false,
      searchForm: {
        smsSender: '',
        smsPhone: '',
        dateRange: [],
        page: 1,
        limit: 10
      },
      submitLoading: false,
      selectList: [],
      selectCount: 0,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '发送内容',
          minWidth: 350,
          ellipsis: true,
          tooltip: true,
          key: 'smsContent'
        },
        {
          title: '手机号',
          minWidth: 100,
          key: 'smsPhone'
        },
        {
          title: '发信人',
          minWidth: 60,
          ellipsis: true,
          tooltip: true,
          key: 'smsSender'
        },
        {
          title: '用户发送时间',
          minWidth: 120,
          key: 'moTime'
        },
        {
          title: '系统接收时间',
          minWidth: 120,
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
      api.getSmsInList(this.searchForm).then(res => {
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
      api.getSmsInList(params).then(res => {
        this.submitLoading = false
        this.exportLoading = false
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
