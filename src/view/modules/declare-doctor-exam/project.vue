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
      <Row class="operation btn_group">
        <Col span="24">
        <Button v-if="isAuth('mpa:mpaeproject:save')" @click="addMpaeProject" type="primary" icon="md-add">新增</Button>
        <Button v-if="isAuth('mpa:mpaeproject:delete')" :disabled="selectedList.length === 0" @click="deleteMpaeProject()" type="primary" icon="ios-trash-outline">删除</Button>
        <Button @click="exportMpaeProject" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
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
        <FormItem label="考试时间" prop="examTime">
          <IDatePicker :disabled="modalView" type="date" v-model="dataForm.examTime" placeholder="请输入考试时间" />
        </FormItem>
        <FormItem label="申报时间" prop="projectTime">
          <IDatePicker :disabled="modalView" type="daterange" v-model="dataForm.projectTime" placeholder="请输入申报截止时间" />
        </FormItem>
        <FormItem label="年度" prop="year">
          <Select :disabled="modalView" v-model="dataForm.year">
            <Option :value="2019">2019</Option>
            <Option :value="2020">2020</Option>
            <Option :value="2021">2021</Option>
            <Option :value="2022">2022</Option>
            <Option :value="2023">2023</Option>
            <Option :value="2024">2024</Option>
          </Select>
        </FormItem>
        <FormItem label="申报说明" prop="memo">
          <Input :disabled="modalView" type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="dataForm.memo" clearable :maxlength="500" placeholder="请输入申报说明" />
        </FormItem>
        <FormItem label="开放班级" prop="classList">
          <Select :disabled="modalView" v-model="dataForm.classList" filterable multiple>
            <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.className }}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用" prop="openFlag">
          <i-switch :disabled="modalView" v-model="dataForm.openFlag" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMpaeProject">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/mpae/mpaeproject'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'MpaeProject-manage',
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
        examTime: '',
        projectTime: [],
        year: 2019,
        memo: '',
        openFlag: 1,
        classList: [],
        id: undefined
      },
      dataFormValidate: {
        title: [
          { required: true, message: '申报标题不能为空', trigger: 'blur' }
        ],
        projectTime: [{ type: 'array', len: 2, required: true, message: '申报时间不能为空', trigger: 'blur' }],
        year: [
          { required: true, type: 'number', message: '年度不能为空', trigger: 'blur' }
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
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '考试时间',
          key: 'examTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申报开始时间',
          key: 'startTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '申报截止时间',
          key: 'endTime',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否启动',
          slot: 'openFlag',
          minWidth: 80,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '年度',
          key: 'year',
          minWidth: 80,
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
          align: 'center',
          fixed: 'right',
          minWidth: 180,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:mpaeproject:info')) {
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
                      this.viewMpaeProject(params.row)
                    }
                  }
                },
                '查看'
              ))
            }
            if (this.isAuth('mpa:mpaeproject:update')) {
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
                      this.editMpaeProject(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            if (this.isAuth('mpa:mpaeproject:delete')) {
              btns.push(h(
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
                      this.deleteMpaeProject(params.row)
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
      this.getMpaeProjectList()
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
      this.getMpaeProjectList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpaeProjectList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMpaeProjectList () {
      this.loading = true
      api.getMpaeProjectList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.pageData.list.map(item => {
          item.projectTime = []
          item.projectTime.push(item.startTime)
          item.projectTime.push(item.endTime)
        })
        this.adjustTableHeight()
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportMpaeProject () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpaeProjectList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    addMpaeProject () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewMpaeProject (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      api.getMpaeProjectInfo(v.id).then(res => {
        let entity = res.mpaeProject
        if (entity.classList) entity.classList = entity.classList.map(item => item.id)
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.dataForm.projectTime = []
        this.dataForm.projectTime.push(entity.startTime)
        this.dataForm.projectTime.push(entity.endTime)
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editMpaeProject (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      api.getMpaeProjectInfo(v.id).then(res => {
        let entity = res.mpaeProject
        if (entity.classList) entity.classList = entity.classList.map(item => item.id)
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.dataForm.projectTime = []
        this.dataForm.projectTime.push(entity.startTime)
        this.dataForm.projectTime.push(entity.endTime)
      })
      this.modalView = false
      this.formModalVisible = true
    },
    saveMpaeProject () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          data.classList = this.classList.filter(item => this.dataForm.classList.includes(item.id))
          data.startTime = this.dataForm.projectTime[0]
          data.endTime = this.dataForm.projectTime[1]
          // 新增保存
          if (!data.id) {
            api.saveMpaeProject(data).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMpaeProject(
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
    deleteMpaeProject (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMpaeProject(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
