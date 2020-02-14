<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="75" class="search-form">
                <Form-item label="Title" prop="title">
                    <Input type="text" v-model="searchForm.title" clearable placeholder="请输入Title" style="width: 180px" />
                </Form-item>
                <Form-item label="displayName" prop="displayName">
                    <Input type="text" v-model="searchForm.displayName" clearable placeholder="请输入DisplayName" style="width: 180px" />
                </Form-item>
                <Form-item label="journal" prop="journal">
                    <Input type="text" v-model="searchForm.journal" clearable placeholder="请输入Journal" style="width: 180px" />
                </Form-item>

                <Form-item style="margin-left: -80px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleClear" style="margin-left: 5px">清除</Button>
                </Form-item>
            </Form>
            <Row class="operation btn_group">
                <Col span="24">
                    <Button v-if="isAuth('achievement:achievementpapersource:delete')" :disabled="selectedList.length === 0" @click="deleteAchievementPaperSource()" type="primary" icon="ios-trash-outline">批量删除</Button>
                    <Button v-if="isAuth('achievement:achievementpapersource:delete')" @click="deleteAchievementPaperSourceAll()" type="primary" icon="ios-trash-outline">删除全部</Button>
                    <Button @click="exportAchievementPaperSource" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
                    <Button v-if="isAuth('achievement:achievementpapersource:save')" @click="importData" type="primary" icon="ios-cloud-upload-outline">导入</Button>
                </Col>
            </Row>
            <Row>
                <Table :loading="loading" ref="table" :height="tableHeight" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
                    <template slot-scope="{ row }" slot="isGenerate">
                        <Tag :color="row.paperId ? 'success' : 'default'">{{row.paperId ? '是' : '否'}}</Tag>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <ButtonGroup>
                            <Button v-if="isAuth('achievement:achievementpapersource:info') && false"   type="primary" size="small" @click="viewAchievementPaperSource(row)">查看</Button>
                            <Button v-if="isAuth('achievement:achievementinfo:save') && !row.paperId"   type="primary" size="small" @click="generateAchievementInfo(row)">生成成果</Button>
                            <Button v-if="isAuth('achievement:achievementpapersource:delete')" type="error"   size="small" @click="deleteAchievementPaperSource(row)">删除</Button>
                        </ButtonGroup>
                    </template>
                </Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
            </Row>
        </Card>

        <ExcelUpload ref="excelUpload" @on-upload="importRecord" :inTemplate="{name: '图书馆学者论文导入模板', url: 'http://info.sppm.tsinghua.edu.cn/sppmtest/file/template/template-achievement-paper.xlsx'}"/>

        <AchievementInfoForm ref="achievementInfoForm" @update="getAchievementPaperSourceList" />

    </div>
</template>

<script>
import api from '@/api/achievement/achievementpapersource'
import ExcelUpload from '@/view/components/excel-upload'
import AchievementInfoForm from './achievementinfo-form'
export default {
  name: 'AchievementPaperSource-manage',
  components: { ExcelUpload, AchievementInfoForm },
  data () {
    return {
      loading: true,
      exportLoading: false,
      tableHeight: 330,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        title: '',
        displayName: undefined,
        journal: undefined
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
          title: 'Title',
          key: 'title',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Authors',
          key: 'authors',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'DisplayName',
          key: 'displayName',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Journal',
          key: 'journal',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Collection',
          key: 'collection',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'ISSN',
          key: 'issn',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'ISBN',
          key: 'isbn',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Published',
          key: 'published',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Volumn',
          key: 'volumn',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Issue',
          key: 'issue',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Pages',
          key: 'pages',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'DOI',
          key: 'doi',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'DocumentType',
          key: 'documentType',
          minWidth: 130,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Tag',
          key: 'tag',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'WosID',
          key: 'wosId',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'WOS-S',
          key: 'wosS',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'EID',
          key: 'eid',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'FileName',
          key: 'fileName',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'OI',
          key: 'oi',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'RI',
          key: 'ri',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Languages',
          key: 'languages',
          minWidth: 110,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Impact',
          key: 'impact',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'SCI_NUMBER',
          key: 'sciNumber',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'HotPaper',
          key: 'hotPaper',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'ESIMostCited',
          key: 'esiMostCited',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: 'Incites',
          key: 'incites',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否生成成果',
          slot: 'isGenerate',
          align: 'center',
          fixed: 'right',
          minWidth: 110
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
      this.getAchievementPaperSourceList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getAchievementPaperSourceList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getAchievementPaperSourceList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    generateAchievementInfo (item) {
      this.$refs.achievementInfoForm.addAchievementInfo(item.id)
    },
    getAchievementPaperSourceList () {
      this.loading = true
      api.getAchievementPaperSourceList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportAchievementPaperSource () {
      this.$refs.table.exportCsv({
        filename: '图书馆学者论文列表'
      })
    },
    addAchievementPaperSource () {

    },
    viewAchievementPaperSource (v) {

    },
    editAchievementPaperSource (v) {

    },
    importData () {
      this.$refs.excelUpload.initUpload()
    },
    importRecord (records, fileName) {
      console.log('records:', records, ', filename:', fileName)
      // 读取老师证件号，并校验老师是否存在
      let segs = fileName.split('_')
      let code = segs.find(item => !isNaN(item) && item.length > 6)
      if (!code) {
        this.$Message.error('无法读取老师证件号，请检查文件名')
        return
      }
      let teacherId = 0
      let handleRecord = (index) => {
        let item = records[index]
        let obj = {
          teacherId: teacherId,
          title: item['Title'],
          authors: item['Authors'],
          displayName: item['DisplayName'],
          journal: item['Journal'],
          collection: item['Collection'],
          issn: item['ISSN'],
          isbn: item['ISBN'],
          published: item['Published'],
          volumn: item['Volume'],
          issue: item['Issue'],
          pages: item['Pages'],
          doi: item['DOI'],
          documentType: item['DocumentType'],
          tag: item['Tag'],
          wosId: item['WosID'],
          wosS: item['WOS-S'],
          eid: item['EID'],
          fileName: item['FileName'],
          oi: item['OI'],
          ri: item['RI'],
          languages: item['Languages'],
          impact: item['Impact'],
          sciNumber: item['SCI_NUMBER'],
          hotPaper: item['HotPaper'],
          esiMostCited: item['ESIMostCited'],
          incites: item['Incites']
        }
        api.saveAchievementPaperSource(obj).then(res => {
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
      this.$refs.excelUpload.updateImportStatus(true)
      api.getTeacherInfo(code).then(res => {
        if (res.teacher && res.teacher.id) {
          teacherId = res.teacher.id
          if (records && records.length) {
            this.$refs.excelUpload.updateImportStatus(true)
            handleRecord(0)
          } else {
            this.$refs.excelUpload.updateImportStatus(false)
          }
        } else {
          this.$Message.error('老师证件号不存在，请检查文件名')
          this.$refs.excelUpload.updateImportStatus(false)
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteAchievementPaperSource (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteAchievementPaperSource(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    deleteAchievementPaperSourceAll () {
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除所有记录吗?</p>`,
        onOk: () => {
          api.deleteAchievementPaperSourceAll().then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
