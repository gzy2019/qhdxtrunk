<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="学生姓名" prop="stuName">
            <Input type="text" v-model="searchForm.stuName" clearable placeholder="请输入学生姓名" style="width: 200px" />
          </Form-item>
          <Form-item style="margin-left: -70px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <Col span="24">
            <Button  @click="onModalImport" type="primary" icon="ios-download-outline">导入</Button>
            <Button v-if="isAuth('publicService:researchworkerpublicserviceinfo:save')" @click="addResearchworkerPublicserviceInfo" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('publicService:researchworkerpublicserviceinfo:delete')" :disabled="selectedList.length === 0" @click="deleteResearchworkerPublicserviceInfo()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportResearchworkerPublicserviceInfo" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
        </Row>
        <Modal title="导入信息" v-model="modalImport" class-name="vertical-center-modal popup" :width="500">
          <div>
            <Row>
              <i-Col span="12">
                <Upload ref="uploadLibrary" :action="actionUrl" :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess" :show-upload-list="true" :with-credentials="true"
                :data="paramsImportStuType">
                  <Button icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </i-Col>
              <!-- <i-Col span="12">
                <Button class="template_btn" @click="downloadTeplate()">下载模板</Button>
              </i-Col> -->
            </Row>
            <p>{{ImportStuResultMsg}}</p>
            <tables v-if="ImportStuResult.length>0" size="small" v-model="ImportStuResult" :columns="columnsImportStuResult"></tables>
          </div>
          <div slot="footer">
            <Button @click="modalImport = false">关闭</Button>
            <!-- <Button type="primary" :loading="submitLoading" @click="modalImport = false">保存</Button> -->
          </div>
        </Modal>
        <Row>
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('publicService:researchworkerpublicserviceinfo:info')"   type="primary" size="small" @click="viewResearchworkerPublicserviceInfo(row)">查看</Button>
                <Button v-if="isAuth('publicService:researchworkerpublicserviceinfo:update')" type="primary" size="small" @click="editResearchworkerPublicserviceInfo(row)">编辑</Button>
                <Button v-if="isAuth('publicService:researchworkerpublicserviceinfo:delete')" type="error"   size="small" @click="deleteResearchworkerPublicserviceInfo(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <ResearchworkerPublicserviceInfoForm ref="researchworkerPublicserviceInfoForm" @on-save="handleSearch" @on-update="getResearchworkerPublicserviceInfoList" />
      <ResearchworkerPublicserviceInfoView ref="researchworkerPublicserviceInfoView" />
  </div>
</template>

<script>
import api from '@/api/publicService/researchworkerpublicserviceinfo'
import ResearchworkerPublicserviceInfoForm from './components/researchworkerpublicserviceinfo-form'
import ResearchworkerPublicserviceInfoView from './components/researchworkerpublicserviceinfo-view'
import url from '_conf/url'
import Tables from '_c/tables'
import { getToken } from '@/libs/util'
export default {
  name: 'ResearchworkerPublicserviceInfo-manage',
  components: { ResearchworkerPublicserviceInfoForm, ResearchworkerPublicserviceInfoView, Tables },
  data () {
    return {
      actionUrl: url + 'publicService/researchworkerpublicserviceinfo/importExcel',
      paramsImportStuType: {
        BusinessType: 'IMPORTSTUTYPE',
        token: getToken()
      },
      url: '',
      modalImport: false,
      ImportStuResult: [],
      ImportStuResultMsg: '',
      columnsImportStuResult: [
        {
          title: '学生姓名',
          key: 'cssciName',
          minWidth: 30
        },
        {
          title: '学生学号',
          key: 'cssciNum',
          minWidth: 60
        },
        {
          title: '服务名称',
          key: 'serviceId',
          minWidth: 60
        },
        {
          title: '服务内容',
          key: 'serviceDesc',
          minWidth: 60
        },
        {
          title: '服务时长',
          key: 'serviceTime',
          minWidth: 60
        },
        {
          title: '校验信息',
          key: 'msg',
          minWidth: 160
        }
      ],
      loading: true,
      exportLoading: false,
      tableHeight: 330,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        stuName: undefined
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
          title: '服务内容',
          key: 'serviceDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '服务时长',
          key: 'serviceTime',
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
    onModalImport () {
      this.$refs.uploadLibrary.clearFiles()
      this.ImportStuResult = []
      this.ImportStuResultMsg = ''
      this.modalImport = true
    },
    handleBeforeUpload () {
      this.$refs.uploadLibrary.clearFiles()
      // this.$refs.uploadStuClass.clearFiles()
      this.ImportStuResultMsg = ''
      this.ImportStuResult = []
      // this.$Message.error('数据格式不正确！请用xlsx或xls格式')
      console.log('handleBeforeUpload', 1111)
    },
    handleUploadSuccess (response, file, fileList) {
      // this.url = response.fileVo.url
      console.log(response,'3334')
      if (response.code === 200) {
        this.ImportStuResult = []
        this.ImportStuResultMsg = '导入成功'
        this.$Message.success('数据导入成功！')
        this.modalImport = false
        this.handleSearch()
      } else {
        this.$Message.error('数据导入失败！')
        this.ImportStuResultMsg = '导入失败'
        this.ImportStuResult = response.data
      }
      console.log(this.ImportStuResult, '2222')
      console.log('handleUploadSuccess=', JSON.stringify(response.data))
    },
    init () {
      this.getResearchworkerPublicserviceInfoList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getResearchworkerPublicserviceInfoList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getResearchworkerPublicserviceInfoList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getResearchworkerPublicserviceInfoList () {
      this.loading = true
      let stuCode = this.$route.params.stuCode
      this.searchForm.stuCode = stuCode
      let serviceId = this.$route.params.serviceId
      this.searchForm.serviceId = serviceId
      api.getResearchworkerPublicserviceInfoList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportResearchworkerPublicserviceInfo () {
      this.$refs.table.exportCsv({
        filename: '公共服务信息列表'
      })
    },
    addResearchworkerPublicserviceInfo () {
      this.$refs.researchworkerPublicserviceInfoForm.addResearchworkerPublicserviceInfo()
    },
    viewResearchworkerPublicserviceInfo (v) {
      this.$refs.researchworkerPublicserviceInfoView.viewResearchworkerPublicserviceInfo(v.id)
    },
    editResearchworkerPublicserviceInfo (v) {
      this.$refs.researchworkerPublicserviceInfoForm.editResearchworkerPublicserviceInfo(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteResearchworkerPublicserviceInfo (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteResearchworkerPublicserviceInfo(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
