<template>
  <div class="search">
    <Card>
      <Row>
        <Col span="6">
          <Tree :data="channelList" @on-select-change="channelSelectHandle" />
        </Col>
        <Col span="18">
          <Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
            <Form-item label="标题" prop="contentTitle" style="margin-bottom:20px">
              <Input
                type="text"
                v-model="searchForm.contentTitle"
                clearable
                placeholder="请输入标题"
                style="width: 170px"
              />
            </Form-item>
            <Form-item v-if="false" label="是否草稿" prop="draftFlag" style="margin-bottom:20px">
              <i-switch v-model="searchForm.draftFlag" />
            </Form-item>
            <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
            <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
          </Form>
          <Col span="24" class="operation btn_group">
            <Button
              @click="addCmsContent"
              v-if="isAuth('sys:cmscontent:save')"
              type="primary"
              icon="md-add"
            >新增</Button>
            <Button
              :disabled="selectedList.length === 0"
              v-if="isAuth('sys:cmscontent:delete')"
              @click="deleteCmsContent()"
            >批量删除</Button>
          </Col>
          <Col span="24">
            <tables
              :loading="loading"
              :height="tableHeight"
              ref="table"
              size="small"
              v-model="pageData.list"
              :columns="columns"
              @on-selection-change="selectionChangeHandle"
            />
          </Col>
        </Col>
        <Col span="24" type="flex" justify="end" class="page" style="text-align:right">
          <Page
            :total="pageData.totalCount"
            current.sync="searchForm.page"
            :current="searchForm.page"
            :page-size="searchForm.limit"
            @on-change="changePage"
            @on-page-size-change="handlePageSize"
            show-total
            show-sizer
          ></Page>
        </Col>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal
      :title="modalTitle"
      v-model="formModalVisible"
      :mask-closable="false"
      :width="800"
      class-name="vertical-center-modal"
      :styles="{top: '20px'}"
    >
      <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
        <FormItem label="所属栏目" prop="channelIdPath">
          <Cascader
            :transfer="true"
            v-model="dataForm.channelIdPath"
            :change-on-select="true"
            :data="channelList"
          />
        </FormItem>
        <FormItem label="标题" prop="contentTitle">
          <Input type="text" v-model="dataForm.contentTitle" clearable placeholder="请输入标题" />
        </FormItem>
        <FormItem label="跳转链接" prop="href">
          <Input
            type="text"
            v-model="dataForm.href"
            clearable
            placeholder="请输入链接, 如 http://www.baidu.com"
          />
        </FormItem>
        <FormItem label="内容" prop="contentDesc">
          <Editor :cache="false" v-model="dataForm.contentDesc"></Editor>
        </FormItem>
        <FormItem label="上传附件" prop="contentFileUrls">
          <IUpload
            v-model="dataForm.contentFileUrls"
            :defaultList="dataForm.defaultFileList"
            :onlyone="false"
            :multiple="true"
            :maxSize="20480"
          />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button type="default" @click="formModalVisible = false">取消</Button>
        <Button type="primary" @click="saveCmsContent" :loading="submitLoading">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import IUpload from '@/view/components/iupload'
import Editor from '@/components/editor/'
import api from '@/api/cms-content'
export default {
  name: 'contManage',
  components: {
    Tables,
    Editor,
    IUpload
  },
  data () {
    return {
      loading: false,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      channelList: [],
      tableHeight: 300,
      searchForm: {
        channelIdPath: null,
        contentTitle: '',
        draftFlag: false,
        status: '',
        page: 1,
        limit: 10
      },
      dataForm: {
        channelId: '',
        channelIdPath: [],
        contentTitle: '',
        href: '',
        priority: 10,
        contentDesc: '',
        contentFileUrls: [],
        defaultFileList: undefined,
        id: null
      },
      pageData: {
        totalCount: 0,
        list: []
      },
      dataFormValidate: {
        channelIdPath: [
          {
            required: true,
            type: 'array',
            message: '栏目不能为空',
            trigger: 'blur'
          }
        ],
        contentTitle: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        href: [{ type: 'url', message: '跳转链接格式不正确', trigger: 'blur' }],
        contentDesc: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false,
      selectedList: [],
      selectCount: 0,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '标题',
          key: 'contentTitle',
          minWidth: 80
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 120
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('sys:cmscontent:info')) {
              btns.push(
                h(
                  'Icon',
                  {
                    props: {
                      type: 'ios-eye-outline',
                      size: '20'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.viewCmsContent(params.row)
                      }
                    }
                  },
                  '查看'
                )
              )
            }
            if (this.isAuth('sys:cmscontent:update')) {
              btns.push(
                h(
                  'Icon',
                  {
                    props: {
                      type: 'ios-create-outline',
                      size: '20'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editCmsContent(params.row)
                      }
                    }
                  },
                  '编辑'
                )
              )
              btns.push(
                h(
                  'Icon',
                  {
                    props: {
                      type: 'md-arrow-up',
                      size: '20'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.setTopContent(params.row)
                      }
                    }
                  },
                  '置顶'
                )
              )
              btns.push(
                h(
                  'Icon',
                  {
                    props: {
                      type: 'md-arrow-down',
                      size: '20'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.cancelTopContent(params.row)
                      }
                    }
                  },
                  '取消置顶'
                )
              )
            }
            if (this.isAuth('sys:cmscontent:save')) {
              btns.push(
                h(
                  'Icon',
                  {
                    props: {
                      type: 'ios-copy-outline',
                      size: '20'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.copyCmsContent(params.row)
                      }
                    }
                  },
                  '复制'
                )
              )
            }
            if (this.isAuth('sys:cmscontent:delete')) {
              btns.push(
                h(
                  'Icon',
                  {
                    props: {
                      type: 'ios-trash-outline',
                      size: '20'
                    },
                    on: {
                      click: () => {
                        this.deleteCmsContent(params.row)
                      }
                    }
                  },
                  '删除'
                )
              )
            }
            return h('div', btns)
          }
        }
      ],
      editorText: '直接初始化值', // 双向同步的变量
      editorTextCopy: '' // content-change 事件回掉改变的对象
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadChannelList()
      this.adjustTableHeight()
      this.handleSearch()
    },
    loadChannelList () {
      api.getCmsChannelTree().then(res => {
        this.channelList = res.list
      })
    },
    adjustTableHeight () {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.table.$el.offsetTop - 250
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getContentList()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getContentList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getContentList () {
      this.loading = true
      api.getCmsContentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    addCmsContent () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.dataForm.defaultFileList = []
      this.modalView = false
      this.formModalVisible = true
    },
    handleItem (entity, key) {
      if (key === 'contentFileUrls' && entity[key]) {
        entity[key] = JSON.parse(entity[key])
      }
      if (key === 'channelIdPath' && entity[key]) {
        let val = JSON.parse(entity[key])
        val = val.map(item => parseInt(item))
        entity[key] = val
      }
    },
    viewCmsContent (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      api.getCmsContentInfo(v.id).then(res => {
        let entity = res.cmsContent
        Object.keys(this.dataForm).forEach(key => {
          this.handleItem(entity, key)
          this.dataForm[key] = entity[key]
        })
        if (this.dataForm.contentFileUrls) {
          this.dataForm.defaultFileList = JSON.parse(
            JSON.stringify(this.dataForm.contentFileUrls)
          )
        }
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editCmsContent (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      api.getCmsContentInfo(v.id).then(res => {
        let entity = res.cmsContent
        Object.keys(this.dataForm).forEach(key => {
          this.handleItem(entity, key)
          this.dataForm[key] = entity[key]
        })
        if (this.dataForm.contentFileUrls) {
          this.dataForm.defaultFileList = JSON.parse(
            JSON.stringify(this.dataForm.contentFileUrls)
          )
        }
      })
      this.modalView = false
      this.formModalVisible = true
    },
    saveCmsContent () {
      if (this.dataForm.channelIdPath && this.dataForm.channelIdPath.length) {
        let curChannelId = this.dataForm.channelIdPath[this.dataForm.channelIdPath.length - 1]
        this.dataForm.channelId = curChannelId || null
      }
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          if (data.channelIdPath) {
            data.channelIdPath = data.channelIdPath.map(item => item + '')
            data.channelIdPath = JSON.stringify(data.channelIdPath)
          }
          if (data.contentFileUrls) {
            data.contentFileUrls = JSON.stringify(data.contentFileUrls)
          }
          // 新增保存
          if (!data.id) {
            api
              .saveCmsContent(data)
              .then(res => {
                this.submitLoading = false
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.handleSearch()
              })
              .catch(e => {
                this.submitLoading = false
              })
          } else {
            api
              .updateCmsContent(data)
              .then(res => {
                this.submitLoading = false
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.handleSearch()
              })
              .catch(e => {
                this.submitLoading = false
              })
          }
        }
      })
    },
    deleteCmsContent (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.deleteCmsContent(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    copyCmsContent (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定复制${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.copyCmsContent(ids).then(res => {
            this.$Message.success('复制成功!')
            this.handleSearch()
          })
        }
      })
    },
    setTopContent (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })

      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定置顶${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.setTopContent(ids).then(res => {
            this.$Message.success('置顶成功!')
            this.handleSearch()
          })
        }
      })
    },
    cancelTopContent (row) {
      let ids = row
        ? [row.id]
        : this.selectedList.map(item => {
          return item.id
        })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定取消置顶${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.cancelTopContent(ids).then(res => {
            this.$Message.success('取消置顶成功!')
            this.handleSearch()
          })
        }
      })
    },
    channelSelectHandle (arr, node) {
      console.log('arr===', arr)
      this.searchForm.channelIdPath = node.value + ''
      this.handleSearch()
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    }
  }
}
</script>
