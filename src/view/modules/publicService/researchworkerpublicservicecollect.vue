<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <FormItem label="服务批次" prop="serviceId">
            <Select v-model="searchForm.serviceId" clearable style="width:170px">
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.serviceName }}</Option>
            </Select>
          </FormItem>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <!-- <Button v-if="isAuth('publicService:researchworkerpublicservicecollect:save')" @click="addResearchworkerPublicserviceCollect" type="primary" icon="md-add">新增</Button> -->
            <Button v-if="isAuth('publicService:researchworkerpublicservicecollect:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerPublicserviceCollect()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerPublicserviceCollect" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Modal title="结果" v-model="formModalVisible" :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100">
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
          </FormItem>
          <FormItem label="信息备注" prop="infoDesc">
            <Input type="textarea" v-model="dataForm.infoDesc" clearable :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入信息备注" />
          </FormItem>
          <FormItem label="结果" prop="result">
            <Select v-model="dataForm.result" clearable>
              <Option v-for="item in resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerPublicserviceCollect">提交</Button>
        </div>
      </Modal>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <!-- <Button v-if="isAuth('publicService:researchworkerpublicservicecollect:info')"   type="primary" size="small" @click="viewResearchworkerPublicserviceCollect(row)">查看</Button> -->
                <Button  type="primary" size="small" @click="openSchedule(row)" >录入结果</Button>
                <!-- <Button v-if="isAuth('publicService:researchworkerpublicservicecollect:update')" type="primary" size="small" @click="editResearchworkerPublicserviceCollect(row)">编辑</Button> -->
                <Button v-if="isAuth('publicService:researchworkerpublicservicecollect:delete')" type="error"   size="small" @click="deleteResearchworkerPublicserviceCollect(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerPublicserviceCollectForm ref="researchworkerPublicserviceCollectForm" @on-save="handleSearch" @on-update="getResearchworkerPublicserviceCollectList" />
      <ResearchworkerPublicserviceCollectView ref="researchworkerPublicserviceCollectView" />
  </div>
</template>

<script>
import apiProject from '@/api/publicService/researchworkerpublicservice'
import api from '@/api/publicService/researchworkerpublicservicecollect'
import ResearchworkerPublicserviceCollectForm from './components/researchworkerpublicservicecollect-form'
import ResearchworkerPublicserviceCollectView from './components/researchworkerpublicservicecollect-view'
export default {
  name: 'ResearchworkerPublicserviceCollect-manage',
  components: { ResearchworkerPublicserviceCollectForm, ResearchworkerPublicserviceCollectView },
  data () {
    return {
      projectList: [],
      formModalVisible: false,
      submitLoading: false,
      openScheduleData: [],
      loading: true,
      exportLoading: false,
      resultList: [{value: 1, label: '通过'}, {value: 2, label: '未通过'}],
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        serviceId: undefined
      },
      dataForm: {
        infoDesc: '',
        result: '',
        id: undefined
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
          title: '学生学号',
          key: 'stuCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '信息备注',
          key: 'infoDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '服务总时长',
          key: 'countTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '服务信息',
          key: 'gotoPos',
          minWidth: 120,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row.serviceId)
                    this.$router.push({ name: 'publicService/researchworkerpublicserviceinfo', params: { stuCode: params.row.stuCode, serviceId: params.row.serviceId } })
                    console.log('23332 :', params.row.id)
                  }
                }
              }, '服务详情')
          }
        },
        {
          title: '结果',
          key: 'resultDesc',
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
  watch: {
    'searchForm.serviceId': {
      immediate: true,
      handler (newVal, oldVal) {
        console.log(newVal, oldVal, '3333')
        this.getResearchworkerPublicserviceCollectList()
      }
    }
  },
  methods: {
    openSchedule (row) {
      this.openScheduleData = Object.assign({}, row)
      console.log(JSON.stringify(row), 'qqq')
      console.log('----' + this.openScheduleData.id)
      this.formModalVisible = true
    },
    init () {
      apiProject.getResearchworkerPublicserviceList({ limit: 1000 }).then(res => {
        console.log(res, '2232')
        this.projectList = res.page.list
        if (this.projectList.length > 0) {
          this.searchForm.serviceId = this.projectList[0].id
        }
      })
      this.getResearchworkerPublicserviceCollectList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerPublicserviceCollectList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerPublicserviceCollectList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    cancel () {
      this.formModalVisible = false
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getResearchworkerPublicserviceCollectList () {
      this.loading = true
      // this.searchForm.serviceId = this.serviceId
      api.getResearchworkerPublicserviceCollectList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        // this.columns.key = res.page.list[1].result1.result
        this.adjustTableHeight()
      })
    },
    exportResearchworkerPublicserviceCollect () {
      this.$refs.table.exportCsv({
        filename: '公共服务信息汇总列表'
      })
    },
    addResearchworkerPublicserviceCollect () {
      this.$refs.researchworkerPublicserviceCollectForm.addResearchworkerPublicserviceCollect()
    },
    viewResearchworkerPublicserviceCollect (v) {
      this.$refs.researchworkerPublicserviceCollectView.viewResearchworkerPublicserviceCollect(v.id)
    },
    editResearchworkerPublicserviceCollect (v) {
      this.$refs.researchworkerPublicserviceCollectForm.editResearchworkerPublicserviceCollect(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    saveResearchworkerPublicserviceCollect () {
      this.dataForm.stuName = this.openScheduleData.stuName
      this.dataForm.stuCode = this.openScheduleData.stuCode
      this.dataForm.serviceId = this.openScheduleData.serviceId
      this.dataForm.countTime = this.openScheduleData.countTime
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          api.saveResearchworkerPublicserviceCollect(data).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.handleSearch()
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    deleteResearchworkerPublicserviceCollect (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerPublicserviceCollect(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
