<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="报名状态">
            <Select v-model="searchForm.applyStatus" style="width:170px" clearable>
            <Option v-for="item in applyStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <FormItem label="开题时间" prop="openingDate">
            <IDatePicker type="date" v-model="searchForm.openingDate" format="yyyy-MM-dd" placeholder="请输入开题时间" clearable style="width:170px"/>
          </FormItem>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
      <Modal title="驳回" v-model="formModalVisible" :width="600" class-name="vertical-center-modal">
        <Form ref="dataForm" :model="dataForm" :label-width="100">
          <FormItem label="id" prop="openingDate1" v-show="false">
            <Input type="text" v-model="openScheduleData1.id" :maxlength="100" placeholder="" clearable/>
          </FormItem>
          <FormItem label="备注" prop="stuDesc">
            <Input type="text" v-model="dataForm.stuDesc" style="width:200px" :maxlength="100" placeholder="请输入备注" clearable/>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="declineDeclareOpeningApply()">提交</Button>
        </div>
      </Modal>
      <Modal title="开题安排" v-model="formModalVisibe" :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" >
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
          </FormItem>
          <FormItem label="开题时间" prop="openingDate">
            <IDatePicker type="date" v-model="dataForm.openingDate" format="yyyy-MM-dd" placeholder="请输入开题时间" clearable/>
          </FormItem>
          <FormItem label="开题地点" prop="openingAds">
            <Input type="text" v-model="dataForm.openingAds" :maxlength="100" placeholder="请输入开题地点" clearable/>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveDeclareOpeningApply">提交</Button>
        </div>
      </Modal>
        <Row class="operation btn_group">
          <i-Col span="24">
            <Button v-if="isAuth('declare:declareopeningapply:save')" @click="addDeclareOpeningApply" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('declare:declareopeningapply:delete')" :disabled="selectedList.length === 0" @click="deleteDeclareOpeningApply()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button type="primary" @click="enrollDeclareOpeningApply(row)" :disabled="selectedList.length === 0" icon="md-checkmark">同意</Button>
            <Button type="primary" @click="nrollDeclareOpeningApply(row)" :disabled="selectedList.length === 0" icon="ios-undo-outline">撤销</Button>
            <Button @click="exportDeclareOpeningApply" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </i-Col>
        </Row>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('declare:declareopeningapply:info')"   type="primary" size="small" @click="viewDeclareOpeningApply(row)">查看</Button>
                <!-- <Button v-if="isAuth('declare:declareopeningapply:update')" type="primary" size="small" @click="editDeclareOpeningApply(row)">编辑</Button> -->
                <Button type="primary" @click="openSchedule(row)" size="small">开题安排</Button>
                <Button type="error" @click="openSchedule1(row)" size="small">驳回</Button>
                <Button v-if="isAuth('declare:declareopeningapply:delete')" type="error"   size="small" @click="deleteDeclareOpeningApply(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <DeclareOpeningApplyForm ref="declareOpeningApplyForm" @update="getDeclareOpeningApplyList" />
      <DeclareOpeningApplyView ref="declareOpeningApplyView" />

  </div>
</template>

<script>
import api from '@/api/declare/declareopeningapply'
import DeclareOpeningApplyForm from './components/declareopeningapply-form'
import DeclareOpeningApplyView from './components/declareopeningapply-view'
import IDatePicker from '@/view/components/idate-picker'

export default {
  name: 'DeclareOpeningApply-manage',
  components: {
    DeclareOpeningApplyForm,
    DeclareOpeningApplyView,
    IDatePicker
  },
  data () {
    return {
      formModalVisibe: false,
      formModalVisible: false,
      loading: true,
      exportLoading: false,
      selectedList: [],
      openScheduleData: '',
      openScheduleData1: '',
      applyStatusList: [
        { value: 0, label: '申请中' },
        { value: 1, label: '撤销' },
        { value: 2, label: '同意' },
        { value: 3, label: '驳回' }
      ],
      dataForm: {
        stuDesc: undefined,
        openingDate: undefined,
        openingAds: undefined,
        id: null
      },
      searchForm: {
        page: 1,
        limit: 10,
        name: undefined,
        openingDate: undefined,
        applyStatus: []
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
          title: '学生姓名',
          key: 'stuName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学号',
          key: 'stuCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申报名称',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '开题地点',
          key: 'openingAds',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '开题时间',
          key: 'openingDate',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '报名状态',
          key: 'applyStatusDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注',
          key: 'stuDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 230
        }
      ],
      submitLoading: false
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
    openSchedule1 (row) {
      this.openScheduleData1 = Object.assign({}, row)
      console.log(JSON.stringify(row))
      console.log('----' + this.openScheduleData1.id)
      this.formModalVisible = true
    },
    init () {
      console.log('11111')
      this.getDeclareOpeningApplyList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDeclareOpeningApplyList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDeclareOpeningApplyList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    cancel () {
      this.formModalVisibe = false
      this.formModalVisible = false
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getDeclareOpeningApplyList () {
      let activityId = this.$route.params.activityId
      this.searchForm.activityId = activityId
      this.loading = true
      api.getDeclareOpeningApplyList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportDeclareOpeningApply () {
      this.$refs.table.exportCsv({
        filename: '开题申报申请表列表'
      })
    },
    addDeclareOpeningApply () {
      this.$refs.declareOpeningApplyForm.addDeclareOpeningApply()
    },
    viewDeclareOpeningApply (v) {
      this.$refs.declareOpeningApplyView.viewDeclareOpeningApply(v.id)
    },
    // editDeclareOpeningApply (v) {
    //   this.$refs.declareOpeningApplyForm.editDeclareOpeningApply(v.id)
    // },
    selectionChangeHandle (list) {
      this.selectedList = list
      console.log(this.selectedList)
    },
    declineDeclareOpeningApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          Object.assign(this.dataForm, { id: this.openScheduleData1.id })
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          console.log(data.id, 'qqqq')
          api.updateDeclareOpeningApply({ 'applyStatus': 3, 'stuDesc': this.dataForm.stuDesc, 'id': data.id }).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            // this.$emit('update')
            this.handleSearch()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    saveDeclareOpeningApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          Object.assign(this.dataForm, { id: this.openScheduleData.id })
          // console.log(this.dataForm)
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          api.updateDeclareOpeningApply(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisibe = false
            this.handleSearch()
            // this.$emit('update')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    enrollDeclareOpeningApply () {
      let params = []
      this.selectedList.map(item => {
        let param = {}
        param.id = item.id
        param.applyStatus = 2
        params.push(param)
      })
      this.submitLoading = true
      // 新增保存
      api.updateDeclareOpeningApply1(params).then(res => {
        this.submitLoading = false
        if (res.code === 200) {
          this.$Message.success('操作成功！')
          this.dataModalVisible = false
          this.handleSearch()
        }
      })
    },
    nrollDeclareOpeningApply () {
      let params = []
      this.selectedList.map(item => {
        let param = {}
        param.id = item.id
        param.applyStatus = 1
        params.push(param)
      })
      this.submitLoading = true
      // 新增保存
      api.updateDeclareOpeningApply1(params).then(res => {
        this.submitLoading = false
        if (res.code === 200) {
          this.$Message.success('操作成功！')
          this.dataModalVisible = false
          this.handleSearch()
        }
      })
    },
    deleteDeclareOpeningApply (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteDeclareOpeningApply(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
