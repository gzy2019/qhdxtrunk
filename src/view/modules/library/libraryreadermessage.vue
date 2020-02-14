<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="标题" prop="msgTitle">
            <Input type="text" v-model="searchForm.msgTitle" clearable placeholder="请输入标题" style="width: 160px" />
          </Form-item>
          <Form-item label="回复状态" prop="commentStatus">
            <Select v-model="searchForm.commentStatus" style="width:160px" clearable>
              <Option v-for="item in commentStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="留言类型" prop="msgType">
            <Select v-model="searchForm.msgType" style="width:160px" clearable>
              <Option v-for="item in msgTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left: -60px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Modal title="回复" v-model="formModalVisibe" :width="600" class-name="vertical-center-modal">
          <Spin size="large" fix v-if="loading"></Spin>
          <Form ref="dataForm" :model="dataForm" :label-width="100" >
            <FormItem label="id" prop="openingDate" v-show="false">
              <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
            </FormItem>
            <FormItem label="留言回复" prop="comment">
              <Input type="text" v-model="dataForm.comment" :maxlength="250" placeholder="请输入留言回复" />
            </FormItem>
          </Form>
          <div slot="footer">
              <Button @click="cancel">取消</Button>
              <Button type="primary" @click="saveDeclareOpeningApply">提交</Button>
          </div>
        </Modal>
        <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('library:libraryreadermessage:save')" @click="addLibraryReaderMessage" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('library:libraryreadermessage:delete')" :disabled="selectedList.length === 0" @click="deleteLibraryReaderMessage()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportLibraryReaderMessage" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('library:libraryreadermessage:info')"   type="primary" size="small" @click="viewLibraryReaderMessage(row)">查看</Button>
                <Button type="primary" size="small" @click="openSchedule(row)">回复</Button>
                <!-- <Button v-if="isAuth('library:libraryreadermessage:update')" type="primary" size="small" @click="editLibraryReaderMessage(row)">编辑</Button> -->
                <!-- <Button v-if="isAuth('library:libraryreadermessage:delete')" type="error"   size="small" @click="deleteLibraryReaderMessage(row)">删除</Button> -->
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <LibraryReaderMessageForm ref="libraryReaderMessageForm" @on-save="handleSearch" @on-update="getLibraryReaderMessageList" />
      <LibraryReaderMessageView ref="libraryReaderMessageView" />
  </div>
</template>

<script>
import api from '@/api/library/libraryreadermessage'
import LibraryReaderMessageForm from './components/libraryreadermessage-form'
import LibraryReaderMessageView from './components/libraryreadermessage-view'
export default {
  name: 'LibraryReaderMessage-manage',
  components: { LibraryReaderMessageForm, LibraryReaderMessageView },
  data () {
    return {
      loading: true,
      exportLoading: false,
      formModalVisibe: false,
      selectedList: [],
      openScheduleData: '',
      commentStatusList: [
        {value: '0', label: '未回复'},
        {value: '1', label: '已回复'}
      ],
      msgTypeList: [
        {value: '0', label: '咨询'},
        {value: '1', label: '建议'}
      ],
      searchForm: {
        page: 1,
        limit: 10,
        msgTitle: undefined,
        commentStatus: undefined,
        msgType: undefined
      },
      dataForm: {
        comment: undefined,
        commentTime: undefined,
        commentStatus: undefined,
        id: null
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
          title: '读者姓名',
          key: 'readerName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '标题',
          key: 'msgTitle',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '内容',
          key: 'msgInfo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '留言时间',
          key: 'createTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '留言类型',
          key: 'msgType',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '留言回复',
          key: 'comment',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '回复时间',
          key: 'commentTime',
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
    openSchedule (row) {
      this.openScheduleData = Object.assign({}, row)
      console.log(JSON.stringify(row))
      console.log('----' + this.openScheduleData.id)
      this.formModalVisibe = true
    },
    init () {
      this.getLibraryReaderMessageList()
      this.adjustTableHeight()
      console.log(new Date().toLocaleDateString())
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getLibraryReaderMessageList()
      this.selectedList = []
    },
    cancel () {
      this.formModalVisibe = false
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getLibraryReaderMessageList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getLibraryReaderMessageList () {
      this.loading = true
      api.getLibraryReaderMessageList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportLibraryReaderMessage () {
      this.$refs.table.exportCsv({
        filename: '读者留言列表'
      })
    },
    addLibraryReaderMessage () {
      this.$refs.libraryReaderMessageForm.addLibraryReaderMessage()
    },
    viewLibraryReaderMessage (v) {
      this.$refs.libraryReaderMessageView.viewLibraryReaderMessage(v.id)
    },
    editLibraryReaderMessage (v) {
      this.$refs.libraryReaderMessageForm.editLibraryReaderMessage(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    saveDeclareOpeningApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          Object.assign(this.dataForm, {id: this.openScheduleData.id})
          // console.log(this.dataForm)
          // let commentTime = new Date().toLocaleDateString().replace(/\//g, '-')
          let time = new Date()
          let year = time.getFullYear()
          let month = time.getMonth()
          let day = time.getDate()

          // 获取时分秒
          let h = time.getHours()
          let m = time.getMinutes()
          let s = time.getSeconds()

          // 检查是否小于10
          // h = check(h)
          // m = check(m)
          // s = check(s)
          let commentTime = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
          // 新增保存
          this.dataForm.commentTime = commentTime
          this.dataForm.commentStatus = 1
          console.log(this.dataForm.commentTime)
          let data = Object.assign({}, this.dataForm)
          api.updateLibraryReaderMessage(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisibe = false
            this.handleSearch()
            // this.$emit('update')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    }
    // deleteLibraryReaderMessage (row) {
    //   let ids = row ? [row.id] : this.selectedList.map(item => item.id)
    //   this.$Modal.confirm({
    //     title: '确认提示',
    //     content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
    //     onOk: () => {
    //       api.deleteLibraryReaderMessage(ids).then(res => {
    //         this.$Message.success('删除成功!')
    //         this.handleSearch()
    //       })
    //     }
    //   })
    // }
  }
}
</script>
