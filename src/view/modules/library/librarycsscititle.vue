<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
          <Form-item label="期刊名称" prop="cssciName">
            <Input type="text" v-model="searchForm.cssciName" clearable placeholder="请输入期刊名称" style="width: 170px" />
          </Form-item>
          <Form-item style="margin-left: -60px;">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px">清除</Button>
          </Form-item>
        </Form>
        <Row class="operation btn_group">
          <i-Col span="24">
            <Button v-if="isAuth('library:librarycsscititle:save')" @click="addLibraryCssciTitle" type="primary" icon="md-add">新增</Button>
            <Button  @click="onModalImport" type="primary" icon="ios-download-outline">导入</Button>
            <Button v-if="isAuth('library:librarycsscititle:delete')" :disabled="selectedList.length === 0" @click="deleteLibraryCssciTitle()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportLibraryCssciTitle" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </i-Col>
        </Row>
        <Modal title="导入书籍信息" v-model="modalImport" class-name="vertical-center-modal popup">
          <div>
            <Row>
              <i-Col span="12">
                <Upload ref="uploadLibrary" :action="actionUrl" :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess" :show-upload-list="true" :with-credentials="true"
                :data="paramsImportStuType">
                  <Button icon="ios-cloud-upload-outline">选择文件</Button>
                </Upload>
              </i-Col>
              <i-Col span="12">
                <Button class="template_btn" @click="downloadTeplate()">下载模板</Button>
              </i-Col>
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
          <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('library:librarycsscititle:info')"   type="primary" size="small" @click="viewLibraryCssciTitle(row)">查看</Button>
                <Button v-if="isAuth('library:librarycsscititle:update')" type="primary" size="small" @click="editLibraryCssciTitle(row)">编辑</Button>
                <Button v-if="isAuth('library:librarycsscititle:delete')" type="error"   size="small" @click="deleteLibraryCssciTitle(row)">删除</Button>
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <LibraryCssciTitleForm ref="libraryCssciTitleForm" @on-save="handleSearch" @on-update="getLibraryCssciTitleList" />
      <LibraryCssciTitleView ref="libraryCssciTitleView" />
  </div>
</template>

<script>
import api from '@/api/library/librarycsscititle'
import LibraryCssciTitleForm from './components/librarycsscititle-form'
import LibraryCssciTitleView from './components/librarycsscititle-view'
import url from '_conf/url'
import Tables from '_c/tables'
import { getToken } from '@/libs/util'

export default {
  name: 'LibraryCssciTitle-manage',
  components: { LibraryCssciTitleForm, LibraryCssciTitleView, Tables },
  data () {
    return {
      actionUrl: url + 'library/librarycsscidetail/import',
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
          title: '期刊名称',
          key: 'cssciName',
          minWidth: 30
        },
        {
          title: '期刊号',
          key: 'cssciNum',
          minWidth: 60
        },
        {
          title: '期刊年份',
          key: 'cssciTime',
          minWidth: 100
          // classId: 'font_color'
        },
        {
          title: '摘要',
          key: 'abstract1',
          minWidth: 160
        },
        {
          title: '校验信息',
          key: 'msg',
          minWidth: 160
        }
      ],
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        cssciName: undefined
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
          title: '期刊名称',
          key: 'cssciName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '期刊查看',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row)
                    this.$router.push({ name: 'library/librarycsscidetail', params: { cssciTitleId: params.row.id } })
                    console.log('23332 :', params.row.id)
                  }
                }
              }, '查看详情')
          }
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
      if (response.code === 200) {
        this.ImportStuResult = []
        this.ImportStuResultMsg = '导入成功'
        this.$Message.success('数据导入成功！')
      } else {
        this.$Message.error('数据导入失败！')
        this.ImportStuResultMsg = '导入失败'
        this.ImportStuResult = response.data
      }
      console.log(this.ImportStuResult, '2222')
      console.log('handleUploadSuccess=', JSON.stringify(response.data))
    },
    // 下载导入模版
    downloadTeplate () {
      // let url = response.fileVo.url
      // console.log(response) "http://192.168.1.143:9081/upload/library/2019121/135bf050-96c6-4691-a239-143f56992be8.xlsx"
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = this.url
      console.log(this.url, '223')
      link.setAttribute('download', '导入书籍模板')
      document.body.appendChild(link)
      link.click()
      this.modalImport = false
      document.body.removeChild(link)
    },
    init () {
      this.getLibraryCssciTitleList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getLibraryCssciTitleList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getLibraryCssciTitleList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getLibraryCssciTitleList () {
      this.loading = true
      api.getLibraryCssciTitleList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportLibraryCssciTitle () {
      this.$refs.table.exportCsv({
        filename: '期刊目录列表'
      })
    },
    addLibraryCssciTitle () {
      this.$refs.libraryCssciTitleForm.addLibraryCssciTitle()
    },
    viewLibraryCssciTitle (v) {
      this.$refs.libraryCssciTitleView.viewLibraryCssciTitle(v.id)
    },
    editLibraryCssciTitle (v) {
      this.$refs.libraryCssciTitleForm.editLibraryCssciTitle(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteLibraryCssciTitle (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteLibraryCssciTitle(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
