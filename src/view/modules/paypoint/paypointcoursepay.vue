<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <Form-item label="批次" prop="batchId">
                  <Select v-model="searchForm.batchId" placeholder="请选择" clearable filterable @on-change="handleSearch" style="width: 180px">
                    <Option v-for="(item,index) in batchList" :key="index" :value="item.id">{{item.name}}</Option>
                  </Select>
                </Form-item>
                <Form-item label="姓名" prop="teaName">
                  <Input type="text" v-model="searchForm.teaName" clearable placeholder="请输入姓名" style="width: 180px" />
                </Form-item>
                <Form-item label="摘要" prop="summary">
                  <Input type="text" v-model="searchForm.summary" clearable placeholder="请输入摘要" style="width: 180px" />
                </Form-item>
                <Form-item label="记录状态" prop="recordStatus">
                  <Select v-model="searchForm.recordStatus" clearable @on-change="handleSearch" placeholder="请选择" style="width: 180px;">
                    <Option :value="0">记录</Option>
                    <Option :value="1">教师已确认</Option>
                    <Option :value="2">主管已审核</Option>
                  </Select>
                </Form-item>
                <Form-item style="margin-left: -70px;">
                  <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                  <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <Col span="24">
                  <Button v-if="isAuth('paypoint:paypointcoursepay:save')" @click="addPaypointCoursePay" type="primary" icon="md-add">新增</Button>
                  <Button v-if="isAuth('paypoint:paypointcoursepay:delete')" :disabled="selectedList.length === 0" @click="deletePaypointCoursePay()" type="primary" icon="ios-trash-outline">删除</Button>
                  <Button v-if="isAuth('paypoint:paypointcoursepay:sendteacherconfirm')" :loading="exportLoading1" @click="send2teacher" :disabled="selectedList.length === 0" type="primary" icon="ios-people-outline">发送教师确认</Button>
                  <Button v-if="isAuth('paypoint:paypointcoursepay:sendleaderconfirm')" :loading="exportLoading2" @click="send2leader" :disabled="selectedList.length === 0" type="primary" icon="ios-people-outline">发送主管审核</Button>
                  <Button v-if="isAuth('paypoint:paypointcoursepay:teacherconfirm')" :loading="exportLoading11" @click="teacherConfirm" :disabled="selectedList.length === 0" type="primary" icon="ios-people-outline">教师确认</Button>
                  <Button v-if="isAuth('paypoint:paypointcoursepay:leaderconfirm')" :loading="exportLoading22" @click="leaderConfirm" :disabled="selectedList.length === 0" type="primary" icon="ios-people-outline">主管审核</Button>
                  <Button @click="exportData" :loading="exportLoading3" type="primary" icon="ios-download-outline">导出</Button>
                  <Button @click="importData" type="primary" icon="ios-cloud-upload-outline">导入</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="recordStatus">
                        <Tag :color="row.recordStatus | recordStatusColor">{{row.recordStatus | recordStatusInfo}}</Tag>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('paypoint:paypointcoursepay:info')"   type="primary" size="small" @click="viewPaypointCoursePay(row)">查看</Button>
                            <Button v-if="isAuth('paypoint:paypointcoursepay:update')" type="primary" size="small" @click="editPaypointCoursePay(row)">编辑</Button>
                            <Button v-if="isAuth('paypoint:paypointcoursepay:delete')" type="error"   size="small" @click="deletePaypointCoursePay(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <PaypointCoursePayForm ref="paypointCoursePayForm" @update="getPaypointCoursePayList" />
        <PaypointCoursePayView ref="paypointCoursePayView" />

        <ExcelUpload ref="excelUpload" @on-upload="importRecord" @on-load="preImportHandle" :inTemplate="{name: '课酬导入模板', url: 'http://info.sppm.tsinghua.edu.cn/sppmtest/file/template/paypoint-coursepay.xlsx'}"/>

    </div>
</template>

<script>
import api from '@/api/paypoint/paypointcoursepay'
import batchapi from '@/api/paypoint/paypointbatch'
import PaypointCoursePayForm from './components/paypointcoursepay-form'
import PaypointCoursePayView from './components/paypointcoursepay-view'
import ExcelUpload from '@/view/components/excel-upload'
import UploadUtil from './components/paypoint-upload'
export default {
  name: 'PaypointCoursePay-manage',
  components: { PaypointCoursePayForm, PaypointCoursePayView, ExcelUpload },
  data () {
    return {
      loading: true,
      exportLoading1: false,
      exportLoading2: false,
      exportLoading11: false,
      exportLoading22: false,
      exportLoading3: false,
      selectedList: [],
      batchList: [],
      searchForm: {
        page: 1,
        limit: 10,
        batchId: null,
        teaName: '',
        summary: '',
        recordStatus: null
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
          title: '批次名称',
          key: 'batchName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '批次编码',
          key: 'batchCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '时间',
          key: 'serviceDate',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '摘要',
          key: 'summary',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '姓名',
          key: 'teacherName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '服务内容',
          key: 'serviceContent',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '选课人数',
          key: 'attendCount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '课酬系数',
          key: 'payFactor',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '中/英文',
          key: 'langInfo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '薪酬标准',
          key: 'payStandard',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '本次薪酬计数',
          key: 'curPayCount',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '本次薪酬金额',
          key: 'curPayAmount',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '记录人',
          key: 'createUserName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '部门',
          key: 'departmentName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '记录时间',
          key: 'createTime',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '记录状态',
          slot: 'recordStatus',
          minWidth: 120
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 160
        }
      ]
    }
  },
  filters: {
    recordStatusInfo (val) {
      if (val === 0) {
        return '录入'
      } else if (val === 1) {
        return '教师已确认'
      } else if (val === 2) {
        return '主管已审核'
      }

      return '未知'
    },
    recordStatusColor (val) {
      if (val === 0) {
        return 'default'
      } else if (val === 1) {
        return 'primary'
      } else if (val === 2) {
        return 'success'
      }

      return ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getPaypointCoursePayList()
      this.adjustTableHeight()
      this.loadBatchList()
    },
    loadBatchList () {
      batchapi.getPaypointBatchDataList({ category: 0, coursepayBatch: 1 }).then(res => {
        this.batchList = res.list
      })
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getPaypointCoursePayList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getPaypointCoursePayList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getPaypointCoursePayList () {
      this.loading = true
      api.getPaypointCoursePayList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportData () {
      this.exportLoading3 = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getPaypointCoursePayList(params).then(res => {
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).finally(() => {
        this.exportLoading3 = false
      })
    },
    importData () {
      this.$refs.excelUpload.initUpload()
    },
    preImportHandle (records, fileName) {
      UploadUtil.handleDate(records)
    },
    importRecord (records, fileName) {
      console.log('records:', records, ', filename:', fileName)
      UploadUtil.importCoursePay(records, this.$refs.excelUpload).then(() => {
        this.handleSearch()
      }, (msg) => {
        this.$Message.error(msg)
      })
    },
    addPaypointCoursePay () {
      this.$refs.paypointCoursePayForm.addPaypointCoursePay()
    },
    viewPaypointCoursePay (v) {
      this.$refs.paypointCoursePayView.viewPaypointCoursePay(v.id)
    },
    editPaypointCoursePay (v) {
      this.$refs.paypointCoursePayForm.editPaypointCoursePay(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deletePaypointCoursePay (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deletePaypointCoursePay(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    send2teacher () {
      let ids = this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定将${ids.length + '条记录发送老师确认吗'}吗?</p>`,
        onOk: () => {
          this.exportLoading1 = true
          api.send2teacher(ids).then(res => {
            this.$Message.success('发送成功!')
            this.getPaypointCoursePayList()
          }).finally(() => {
            this.exportLoading1 = false
          })
        }
      })
    },
    teacherConfirm () {
      let ids = this.selectedList.map(item => item.id)
      this.exportLoading11 = true
      api.teacherConfirm(ids).then(res => {
        this.$Message.success('确认成功!')
        this.getPaypointCoursePayList()
      }).finally(() => {
        this.exportLoading11 = false
      })
    },
    send2leader () {
      let ids = this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定将${ids.length + '条记录发送主管审核吗'}吗?</p>`,
        onOk: () => {
          this.exportLoading2 = true
          api.send2leader(ids).then(res => {
            this.$Message.success('发送成功!')
            this.getPaypointCoursePayList()
          }).finally(() => {
            this.exportLoading2 = false
          })
        }
      })
    },
    leaderConfirm () {
      let ids = this.selectedList.map(item => item.id)
      this.exportLoading22 = true
      api.leaderConfirm(ids).then(res => {
        this.$Message.success('审核成功!')
        this.getPaypointCoursePayList()
      }).finally(() => {
        this.exportLoading22 = false
      })
    }
  }
}
</script>
