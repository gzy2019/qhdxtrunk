<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="申报标题" prop="title">
          <Input type="text" v-model="searchForm.title" clearable placeholder="请输入申报标题" style="width: 170px" />
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button v-if="isAuth('mpa:mpadproject:save')" @click="addMpadProject" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('mpa:mpadproject:delete')" :disabled="selectedList.length === 0" @click="deleteMpadProject()" type="primary" icon="ios-trash-outline">删除</Button>
          <Button @click="exportMpadProject" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table"  size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
            <template slot-scope="{ row }" slot="openFlag">
                <Tag :color="`${row.openFlag ? 'primary' : 'error' }`">{{ row.openFlag ? '是' : '否' }}</Tag>
            </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="550" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
        <FormItem label="申报标题" prop="title">
          <Input type="text" :disabled="modalView" v-model="dataForm.title" clearable :maxlength="100" placeholder="请输入申报标题" />
        </FormItem>
        <FormItem label="学生开始时间" prop="startTime">
          <IDatePicker type="date" :disabled="modalView" v-model="dataForm.startTime" placeholder="请输入学生开始时间" />
        </FormItem>
        <FormItem label="学生结束时间" prop="endTime">
          <IDatePicker type="date" :disabled="modalView" v-model="dataForm.endTime" placeholder="请输入学生结束时间" />
        </FormItem>
        <FormItem label="申报说明" prop="memo">
          <Input v-model="dataForm.memo" :disabled="modalView" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="500" placeholder="请输入申报说明" />
        </FormItem>
        <FormItem label="开放班级" prop="classList">
          <Select v-model="dataForm.classList" :disabled="modalView" filterable multiple>
            <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.className }}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用" prop="openFlag">
          <i-switch v-model="dataForm.openFlag" :disabled="modalView" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMpadProject">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/mpad/mpadproject'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'MpadProject-manage',
  components: { IDatePicker },
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
        title: ''
      },
      classList: [],
      dataForm: {
        title: '',
        startTime: '',
        endTime: '',
        memo: '',
        openFlag: 1,
        classList: [],
        id: undefined
      },
      dataFormValidate: {
        title: [
          { required: true, message: '申报标题不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '学生开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '学生结束时间不能为空', trigger: 'blur' }
        ],
        classList: [
          { type: 'array', min: 1, required: true, message: '开放班级不能为空', trigger: 'blur' }
        ]
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
          title: '申报标题',
          key: 'title',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '开始时间',
          key: 'startTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '结束时间',
          key: 'endTime',
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
          title: '申报说明',
          key: 'memo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:mpadproject:info')) {
              btns.push(h(
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
                      this.viewMpadProject(params.row)
                    }
                  }
                },
                '查看'
              ))
            }
            if (this.isAuth('mpa:mpadproject:update')) {
              btns.push(h(
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
                      this.editMpadProject(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            if (this.isAuth('mpa:mpadproject:delete')) {
              btns.push(h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '0px'
                  },
                  on: {
                    click: () => {
                      this.deleteMpadProject(params.row)
                    }
                  }
                },
                '删除'
              ))
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
      this.loadClassList()
      this.getMpadProjectList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    loadClassList () {
      api.getClassList().then(res => {
        this.classList = res.list
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpadProjectList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpadProjectList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMpadProjectList () {
      this.loading = true
      api.getMpadProjectList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.adjustTableHeight()
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportMpadProject () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpadProjectList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    addMpadProject () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewMpadProject (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      api.getMpadProjectInfo(v.id).then(res => {
        let entity = res.mpadProject
        if (entity.classList) entity.classList = entity.classList.map(item => item.id)
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editMpadProject (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      api.getMpadProjectInfo(v.id).then(res => {
        let entity = res.mpadProject
        if (entity.classList) entity.classList = entity.classList.map(item => item.id)
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.modalView = false
      this.formModalVisible = true
    },
    saveMpadProject () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          data.classList = this.classList.filter(item => this.dataForm.classList.includes(item.id))
          // 新增保存
          if (!data.id) {
            api.saveMpadProject(
              data
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMpadProject(
              data
            ).then(res => {
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
    deleteMpadProject (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMpadProject(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
