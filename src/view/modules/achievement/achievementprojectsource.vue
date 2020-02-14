<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="80" class="search-form">
                <Form-item label="项目名称" prop="name">
                    <Input type="text" v-model="searchForm.name" clearable placeholder="请输入项目名称" style="width: 200px" />
                </Form-item>
                <Form-item label="项目编号" prop="projectCode">
                    <Input type="text" v-model="searchForm.projectCode" clearable placeholder="请输入项目编号" style="width: 200px" />
                </Form-item>
                <Form-item label="活动类型" prop="activityType">
                    <Input type="text" v-model="searchForm.activityType" clearable placeholder="请输入活动类型" style="width: 200px" />
                </Form-item>
                <Form-item label="项目负责人" prop="personInCharge">
                    <Input type="text" v-model="searchForm.personInCharge" clearable placeholder="请输入项目负责人" style="width: 200px" />
                </Form-item>
                <Form-item label="组件形式" prop="actionWay">
                    <Input type="text" v-model="searchForm.actionWay" clearable placeholder="请输入组件形式" style="width: 200px" />
                </Form-item>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <i-Col span="24">
                <Button v-if="isAuth('achievement:achievementprojectsource:delete')" :disabled="selectedList.length === 0" @click="deleteAchievementProjectSource()" type="primary" icon="ios-trash-outline">批量删除</Button>
                <Button v-if="isAuth('achievement:achievementprojectsource:delete')" @click="deleteAchievementProjectSourceAll()" type="primary" icon="ios-trash-outline">删除全部</Button>
                <Button @click="exportAchievementProjectSource" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                <Button v-if="isAuth('achievement:achievementprojectsource:save')" @click="importData" type="primary" icon="ios-cloud-upload-outline">导入</Button>
                </i-Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('achievement:achievementprojectsource:info') && false"   type="primary" size="small" @click="viewAchievementProjectSource(row)">查看</Button>
                            <Button v-if="isAuth('achievement:achievementprojectsource:delete')" type="error"   size="small" @click="deleteAchievementProjectSource(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <ExcelUpload ref="excelUpload" @on-upload="importRecord" :inTemplate="{name: '科研项目导入模板', url: 'http://info.sppm.tsinghua.edu.cn/sppmtest/file/template/template-achievement-project.xlsx'}"/>

    </div>
</template>

<script>
import api from '@/api/achievement/achievementprojectsource'
import ExcelUpload from '@/view/components/excel-upload'

export default {
  name: 'AchievementProjectSource-manage',
  components: { ExcelUpload },
  data () {
    return {
      loading: true,
      exportLoading: false,
      tableHeight: 330,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: '',
        projectCode: undefined,
        activityType: undefined,
        personInCharge: undefined,
        actionWay: undefined
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
          title: '项目编号',
          key: 'projectCode',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否在研',
          key: 'inResearch',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目名称（中文）',
          key: 'nameCn',
          minWidth: 140,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目名称（英文）',
          key: 'nameEn',
          minWidth: 140,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '一级课题编号',
          key: 'firstSubjectCode',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '活动类型',
          key: 'activityType',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '组织形式',
          key: 'actionWay',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目负责人',
          key: 'personInCharge',
          minWidth: 110,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '所属单位',
          key: 'belongOrg',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目类别',
          key: 'projectType',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目来源',
          key: 'projectSource',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '合同金额',
          key: 'contractMoney',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '合同币种',
          key: 'currency',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '甲方付科研费',
          key: 'partyaPaied',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '委托方单位名称',
          key: 'delegatorName',
          minWidth: 130,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '合同状态',
          key: 'contractStatus',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '合同签署日期',
          key: 'contractDate',
          minWidth: 130,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '预算状态',
          key: 'budgetStatus',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目起始日期',
          key: 'beginDate',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '项目结束日期',
          key: 'endDate',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '院系字段一',
          key: 'schoolField1',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '院系字段二',
          key: 'schoolField2',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '院系字段三',
          key: 'schoolField3',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '院系备注',
          key: 'schoolMemo',
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
    init () {
      this.getAchievementProjectSourceList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getAchievementProjectSourceList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getAchievementProjectSourceList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getAchievementProjectSourceList () {
      this.loading = true
      api.getAchievementProjectSourceList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportAchievementProjectSource () {
      this.$refs.table.exportCsv({
        filename: '科研项目列表'
      })
    },
    addAchievementProjectSource () {

    },
    viewAchievementProjectSource (v) {

    },
    editAchievementProjectSource (v) {

    },
    importData () {
      this.$refs.excelUpload.initUpload()
    },
    importRecord (records, fileName) {
      console.log('records:', records, ', filename:', fileName)
      this.$refs.excelUpload.updateImportStatus(true)
      let handleRecord = (index) => {
        let item = records[index]
        let obj = {
          projectCode: item['项目编号'],
          inResearch: item['是否在研'],
          nameCn: item['项目名称(中文)'],
          nameEn: item['项目名称(英文)'],
          firstSubjectCode: item['一级课题编号'],
          activityType: item['活动类型'],
          actionWay: item['组织形式'],
          personInCharge: item['项目负责人'],
          belongOrg: item['所属单位'],
          projectType: item['项目类别'],
          projectSource: item['项目来源'],
          contractMoney: item['合同额度'],
          currency: item['币种'],
          contractText: item['合同原件'],
          partyaPaied: item['甲方付科研费'],
          delegatorName: item['委托方单位名称'],
          contractStatus: item['合同状态'],
          contractDate: item['合同签署日期'],
          budgetStatus: item['预算状态'],
          beginDate: item['项目起始日期'],
          endDate: item['项目结束日期'],
          schoolField1: item['院系字段一'],
          schoolField2: item['院系字段二'],
          schoolField3: item['院系字段三'],
          schoolMemo: item['院系备注']
        }
        api.saveAchievementProjectSource(obj).then(res => {
          this.$refs.excelUpload.removeRecord(item)
        }).finally(() => {
          if (index === records.length - 1) {
            this.$refs.excelUpload.updateImportStatus(false)
            this.handleSearch()
          } else {
            handleRecord(index + 1)
          }
        })
      }

      if (records && records.length) {
        handleRecord(0)
      }
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteAchievementProjectSource (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteAchievementProjectSource(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    deleteAchievementProjectSourceAll () {
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除所有此记录吗?</p>`,
        onOk: () => {
          api.deleteAchievementProjectSourceAll().then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
