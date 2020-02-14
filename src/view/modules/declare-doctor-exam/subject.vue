<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="科目名称" prop="name">
          <Input type="text" v-model="searchForm.name" clearable placeholder="请输入科目名称" style="width: 170px" />
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
        <Col span="24">
        <Button v-if="isAuth('mpa:mpaesubject:save')" @click="addMpaeSubject" type="primary" icon="md-add">新增</Button>
        <Button v-if="isAuth('mpa:mpaesubject:delete')" :disabled="selectedList.length === 0" @click="deleteMpaeSubject()" type="primary" icon="ios-trash-outline">删除</Button>
        <Button @click="exportMpaeSubject" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="openFlag">
            <Tag :color="`${row.openFlag ? 'primary' : 'error' }`">{{ row.openFlag ? '是' : '否' }}</Tag>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change="handlePageSize" show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable="false" :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
        <FormItem label="科目名称" prop="name">
          <Input type="text" v-model="dataForm.name" clearable :maxlength="100" placeholder="请输入科目名称" />
        </FormItem>
        <FormItem label="是否启用" prop="openFlag">
          <i-switch v-model="dataForm.openFlag" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMpaeSubject">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import api from '@/api/mpae/mpaesubject'
export default {
  name: 'MpaeSubject-manage',
  data () {
    return {
      exportLoading: false,
      loading: true,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: ''
      },
      dataForm: {
        name: '',
        openFlag: 1,
        id: undefined
      },
      dataFormValidate: {
        name: [{ required: true, message: '科目名称不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
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
          title: '科目名称',
          key: 'name',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否启动',
          slot: 'openFlag',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:mpaesubject:info')) {
              btns.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.viewMpaeSubject(params.row)
                      }
                    }
                  },
                  '查看'
                )
              )
            }
            if (this.isAuth('mpa:mpaesubject:update')) {
              btns.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editMpaeSubject(params.row)
                      }
                    }
                  },
                  '编辑'
                )
              )
            }
            if (this.isAuth('mpa:mpaesubject:delete')) {
              btns.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.deleteMpaeSubject(params.row)
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
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getMpaeSubjectList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpaeSubjectList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpaeSubjectList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMpaeSubjectList () {
      this.loading = true
      api.getMpaeSubjectList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportMpaeSubject () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpaeSubjectList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    addMpaeSubject () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewMpaeSubject (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      let entity = Object.assign({}, v)
      Object.keys(this.dataForm).forEach(key => {
        this.dataForm[key] = entity[key]
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editMpaeSubject (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = Object.assign({}, v)
      Object.keys(this.dataForm).forEach(key => {
        this.dataForm[key] = entity[key]
      })
      this.modalView = false
      this.formModalVisible = true
    },
    saveMpaeSubject () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMpaeSubject(this.dataForm).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMpaeSubject(this.dataForm).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteMpaeSubject (row) {
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
          api.deleteMpaeSubject(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
