<template>
  <div class="search">
    <Card>
        <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="60" class="search-form">
          <Form-item label="学生姓名" prop="createUserName">
            <Input type="text" v-model="searchForm.createUserName" clearable placeholder="请输入学生姓名" style="width:170px"/>
          </Form-item>
          <Form-item label="学生学号" prop="stuCode">
            <Input type="text" v-model="searchForm.stuCode" clearable placeholder="请输入学生学号" style="width:170px"/>
          </Form-item>
          <Form-item label="学生班级" prop="gradeName">
            <Input type="text" v-model="searchForm.gradeName" clearable placeholder="请输入学生班级" style="width:170px"/>
          </Form-item>
          <Form-item label="导师姓名" prop="teacherName">
            <Input type="text" v-model="searchForm.teacherName" clearable placeholder="请输入导师姓名" style="width:170px"/>
          </Form-item>
          <Form-item label="标签名称" prop="tagName" >
            <Input type="text" v-model="searchForm.tagName" clearable placeholder="请输入标签名称" style="width:170px"/>
          </Form-item>
          <Form-item label="工作省份" prop="adsWorking">
            <Input type="text" v-model="searchForm.adsWorking" clearable placeholder="请输入工作省份" style="width:170px"/>
          </Form-item>
          <Form-item label="单位部门" prop="unit">
            <Input type="text" v-model="searchForm.unit" clearable placeholder="请输入单位/部门" style="width:170px"/>
          </Form-item>
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form>
        <Row class="operation btn_group">
          <i-Col span="24">
            <Button v-if="isAuth('schoolfellow:schoolfellowinfo:save')" @click="addSchoolfellowInfo" type="primary" icon="md-add">新增</Button>
            <Button  @click="onModalImport" type="primary" icon="ios-download-outline">导入</Button>
            <Button v-if="isAuth('schoolfellow:schoolfellowinfo:delete')" :disabled="selectedList.length === 0" @click="deleteSchoolfellowInfo()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button @click="exportSchoolfellowInfo" v-if="false" :loading="exportLoading" type="primary" icon="ios-download-outline">导出</Button>
          </i-Col>
        </Row>
      <Modal title="标签" v-model="formModalVisile" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" >
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
          </FormItem>
          <FormItem label="标签" prop="tag">
             <Tag checkable :checked="item.checked" @on-change="tagChange" color="success" v-for="(item,index) in tagList" :key="index" :name="item.id" >{{item.tagName}}</Tag>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseLibraryComment">提交</Button>
        </div>
      </Modal>
        <Modal title="导入院友信息" v-model="modalImport" class-name="vertical-center-modal popup">
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
          <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="action">
              <ButtonGroup>
                <Button v-if="isAuth('schoolfellow:schoolfellowinfo:info')"   type="primary" size="small" @click="viewSchoolfellowInfo(row)" style=" margin-bottom:2px">查看</Button>
                <Button v-if="isAuth('schoolfellow:schoolfellowinfo:update')" type="primary" size="small" @click="editSchoolfellowInfo(row)" style="margin-bottom:2px">编辑</Button>
                <!--  <Button  type="primary" size="small" @click="cation(row)" style=" margin-bottom:2px" >人员信息更新</Button> -->
                <Button  type="primary" size="small" @click="openSchedule(row)" >标签</Button>
                <!-- <Button  type="primary" size="small" @click="cation2(row)">标签信息更新</Button> -->
                <!-- <Button v-if="isAuth('schoolfellow:schoolfellowinfo:delete')" type="error"   size="small" @click="deleteSchoolfellowInfo(row)">删除</Button> -->
              </ButtonGroup>
            </template>
          </Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
        </Row>
      </Card>

      <SchoolfellowInfoForm ref="schoolfellowInfoForm" @on-save="handleSearch" @on-update="getSchoolfellowInfoList" />
      <SchoolfellowInfoView ref="schoolfellowInfoView" />
      <!-- <SchoolfellowInfoTag ref="SchoolfellowInfoTag"/> -->
  </div>
</template>

<script>
import apiTag from '@/api/schoolfellow/schoolfellowtag'
import api from '@/api/schoolfellow/schoolfellowinfo'
import SchoolfellowInfoForm from './components/schoolfellowinfo-form'
import SchoolfellowInfoView from './components/schoolfellowinfo-view'
// import SchoolfellowInfoTag from './components/schoolfellowinfo-tag'
import url from '_conf/url'
import Tables from '_c/tables'
import { getToken } from '@/libs/util'
export default {
  name: 'SchoolfellowInfo-manage',
  components: { SchoolfellowInfoForm, SchoolfellowInfoView, Tables },
  data () {
    return {
      actionUrl: url + 'schoolfellow/schoolfellowinfo/importExcel',
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
          title: '创建人姓名',
          key: 'createUserName',
          minWidth: 50
        },
        {
          title: '更新人姓名',
          key: 'updateUserName',
          minWidth: 50
        },
        {
          title: '学号',
          key: 'stuCode',
          minWidth: 50
        },
        {
          title: '学生姓名',
          key: 'stuName',
          minWidth: 50
        },
        {
          title: '班级',
          key: 'className',
          minWidth: 50
        },
        {
          title: '标签',
          key: 'tag',
          minWidth: 50
        },
        {
          title: '导师',
          key: 'teacherName',
          minWidth: 50
        },
        {
          title: '工作省份',
          key: 'adsWorking',
          minWidth: 50
        },
        {
          title: '单位/部门',
          key: 'unit',
          minWidth: 50
        },
        {
          title: '岗位',
          key: 'post',
          minWidth: 50
        },
        {
          title: '级别',
          key: 'rank',
          minWidth: 50
        },
        {
          title: '工作部门性质',
          key: 'nature',
          minWidth: 120
        },
        {
          title: '电话',
          key: 'phone',
          minWidth: 50
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 50
        },
        {
          title: '通讯地址',
          key: 'adsContact',
          minWidth: 50
        },
        {
          title: '校验信息',
          key: 'msg',
          minWidth: 160
        }
      ],
      submitLoading: false,
      tagList: [],
      openScheduleData: '',
      formModalVisile: false,
      loading: true,
      exportLoading: false,
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        adsWorking: undefined,
        stuCode: undefined,
        gradeName: undefined,
        teacherName: undefined,
        tagName: undefined,
        unit: undefined
      },
      dataForm: {
        tag: '',
        // openingDate: undefined,
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
        // {
        //   title: '创建人姓名',
        //   key: 'createUserName',
        //   minWidth: 100,
        //   ellipsis: true,
        //   tooltip: true
        // },
        // {
        //   title: '更新人姓名',
        //   key: 'updateUserName',
        //   minWidth: 100,
        //   ellipsis: true,
        //   tooltip: true
        // },
        {
          title: '学号',
          key: 'stuCode',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '学生姓名',
          key: 'stuName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '年级',
          key: 'gradeName',
          minWidth: 100
        },
        {
          title: '标签',
          key: 'tag',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '导师',
          key: 'teacherName',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '工作省份',
          key: 'adsWorking',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '单位/部门',
          key: 'unit',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '岗位',
          key: 'post',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        // {
        //   title: '级别',
        //   key: 'rank',
        //   minWidth: 100,
        //   ellipsis: true,
        //   tooltip: true
        // },
        {
          title: '工作部门性质',
          key: 'nature',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '电话',
          key: 'phone',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        // {
        //   title: '邮箱',
        //   key: 'email',
        //   minWidth: 100,
        //   ellipsis: true,
        //   tooltip: true
        // },
        {
          title: '通讯地址',
          key: 'adsContact',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注信息',
          key: 'infoDesc',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '更改沟通信息',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row)
                    this.$router.push({ name: 'schoolfellow/schoolfellowcommunication', params: { stuName: params.row.stuName, stuCode: params.row.stuCode, schoolfellowInfoId: params.row.id } })
                    console.log('23332 :', params.row.id)
                  }
                }
              }, '更改详情')
          }
        },
        {
          title: '更改工作信息',
          key: 'gotoPos',
          minWidth: 120,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    console.log('2222 :', params.row)
                    this.$router.push({ name: 'schoolfellow/schoolfellowjobupdate', params: { stuName: params.row.stuName, stuCode: params.row.stuCode, schoolfellowInfoId: params.row.id } })
                    console.log('23332 :', params.row.id)
                  }
                }
              }, '更改详情')
          }
        },
        // {
        //   title: '更改标签',
        //   key: 'gotoPos',
        //   minWidth: 100,
        //   className: 'font_color',
        //   render: (h, params) => {
        //     return h('div',
        //       {
        //         on: {
        //           click: (val) => {
        //             console.log('2222 :', params.row)
        //             this.$router.push({ name: 'schoolfellow/schoolfellowtag', params: { schoolfellowInfoId: params.row.id } })
        //             console.log('23332 :', params.row.id)
        //           }
        //         }
        //       }, '更改详情')
        //   }
        // },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 180
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
      console.log(JSON.stringify(row), 'qqq')
      console.log('----' + this.openScheduleData.id)
      this.formModalVisile = true
    },
    loadTagList () {
      apiTag.getSchoolfellowTagList().then(res => {
        this.tagList = res.page.list
        console.log(this.tagList)
        this.tagList.forEach(item => {
          item.checked = false
        })
      })
    },
    initTagList () {
      if (this.tagList) {
        this.tagList.forEach(item => {
          item.checked = false
          console.log(this.tagList, '111')
        })
      }
      this.dataForm.tag = ''
    },
    tagChange (checked, name) {
      let item = this.tagList.find(item => item.id === name)

      item.checked = checked

      // console.log(arr1, '222333')
      let arr1 = this.tagList.filter(item => item.checked && item.tagName)
      console.log(arr1, '333')
      this.dataForm.tag = arr1.map(item => item.tagName).join(',')
      console.log(this.dataForm.tag, '222')
    },
    cancel () {
      this.formModalVisile = false
    },
    saveCaseLibraryComment () {
      // this.$refs.dataForm.validate(valid => {
      //   if (valid) {
      this.submitLoading = true
      // 新增保存
      Object.assign(this.dataForm, { id: this.openScheduleData.id })

      console.log(this.dataForm.tag, '22333')
      let data = Object.assign({}, this.dataForm)
      api.updatetagSchoolfellowInfo(data).then(res => {
        this.$Message.success('操作成功！')
        this.formModalVisile = false
        this.handleSearch()
      }).finally(() => {
        this.submitLoading = false
      })
    },
    onModalImport () {
      this.$refs.uploadLibrary.clearFiles()
      this.ImportStuResult = []
      this.ImportStuResultMsg = ''
      this.modalImport = true
    },
    handleBeforeUpload () {
      this.$refs.uploadLibrary.clearFiles()
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
        this.modalImport = false
        this.handleSearch()
        console.log(response.fileVo.url, '222000')
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
      link.setAttribute('download', '导入院友信息')
      document.body.appendChild(link)
      link.click()
      this.modalImport = false
      document.body.removeChild(link)
    },
    // cation (params) {
    //   console.log(params)
    //   console.log(params.stuCode)
    //   this.$router.push({name: 'schoolfellow/schoolfellowcommunication', params: { stuCode: params.stuCode, stuName: params.stuName }})
    // },
    // cation1 (params) {
    //   console.log(params)
    //   this.$router.push({name: 'schoolfellow/schoolfellowjobupdate', params: { stuCode: params.stuCode, stuName: params.stuName }})
    // },
    // cation2 (params) {
    //   this.$router.push({name: 'schoolfellow/schoolfellowtag', params: { stuCode: params.stuCode, stuName: params.stuName }})
    // },
    init () {
      this.getSchoolfellowInfoList()
      this.adjustTableHeight()
      this.loadTagList()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getSchoolfellowInfoList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getSchoolfellowInfoList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    // addCaseLibraryComment (row) {
    //   // this.curCase =
    //   this.$refs.SchoolfellowInfoTag.addCaseLibraryComment(row)
    // },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getSchoolfellowInfoList () {
      this.loading = true
      api.getSchoolfellowInfoList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    exportSchoolfellowInfo () {
      this.$refs.table.exportCsv({
        filename: '校友信息表列表'
      })
    },
    addSchoolfellowInfo () {
      this.$refs.schoolfellowInfoForm.addSchoolfellowInfo()
    },
    viewSchoolfellowInfo (v) {
      this.$refs.schoolfellowInfoView.viewSchoolfellowInfo(v.id)
    },
    editSchoolfellowInfo (v) {
      this.$refs.schoolfellowInfoForm.editSchoolfellowInfo(v.id)
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteSchoolfellowInfo (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteSchoolfellowInfo(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
