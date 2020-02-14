<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <Form-item label="名称" prop="name">
                    <Input type="text" v-model="searchForm.name" clearable placeholder="请输入名称" style="width: 170px" />
                </Form-item>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <Col span="24">
                <Button v-if="isAuth('msg:msgtemplate:save')" @click="addMsgTemplate" type="primary" icon="md-add">新增</Button>
                <Button v-if="isAuth('msg:msgtemplate:delete')" :disabled="selectedList.length === 0" @click="deleteMsgTemplate()" type="primary" icon="ios-trash-outline">删除</Button>
                <Button @click="exportMsgTemplate" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="type">
                        <Tag>{{row.type | typeInfo}}</Tag>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('msg:msgtemplate:info')"   type="primary" size="small" @click="viewMsgTemplate(row)">查看</Button>
                            <Button v-if="isAuth('msg:msgtemplate:update')" type="primary" size="small" @click="editMsgTemplate(row)">编辑</Button>
                            <Button v-if="isAuth('msg:msgtemplate:delete')" type="error"   size="small" @click="deleteMsgTemplate(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <MsgTemplateForm ref="msgTemplateForm" @update="getMsgTemplateList" />
        <MsgTemplateView ref="msgTemplateView" />
    </div>
</template>

<script>
import api from '@/api/msg'
import MsgTemplateForm from './components/msgtemplate-form'
import MsgTemplateView from './components/msgtemplate-view'
export default {
  name: 'MsgTemplate-manage',
  components: { MsgTemplateForm, MsgTemplateView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: ''
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
          title: '名称',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '编码',
          key: 'code',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '类型',
          slot: 'type',
          minWidth: 100
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
  filters: {
    typeInfo (val) {
      if (val === 'sms') return '短信'
      if (val === 'email') return '邮件'
      return '未知'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getMsgTemplateList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMsgTemplateList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMsgTemplateList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMsgTemplateList () {
      this.loading = true
      api.getMsgTemplateList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportMsgTemplate () {
      this.$refs.table.exportCsv({
        filename: '短信邮件模板列表'
      })
    },
    addMsgTemplate () {
      this.$refs.msgTemplateForm.addMsgTemplate()
    },
    viewMsgTemplate (v) {
      this.$refs.msgTemplateView.viewMsgTemplate(v.id)
    },
    editMsgTemplate (v) {
      this.$refs.msgTemplateForm.editMsgTemplate(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteMsgTemplate (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMsgTemplate(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
