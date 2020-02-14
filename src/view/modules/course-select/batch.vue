<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="选课批次" prop="batchTitle">
          <Input type="text" v-model="searchForm.batchTitle" clearable placeholder="请输入选课批次名称" style="width: 170px" />
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left:5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addBatch" v-if="isAuth('mpa:mpacbatch:save')" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('mpa:mpacbatch:delete')" :disabled="selectedList.length === 0" @click="deleteBatch()">批量删除</Button>
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="选课批次" prop="batchTitle">
          <Input type="text" v-model="dataForm.batchTitle" clearable placeholder="请输入批次名称" />
        </FormItem>
        <FormItem label="选课时间" prop="batchDate">
          <IDatePicker v-model="dataForm.batchDate" type="daterange" clearable placeholder="选择学生选课开放时间" split-panels style="width:100%"></IDatePicker>
        </FormItem>
        <FormItem label="是否开启" prop="batchOpenFlag">
          <i-switch v-model="dataForm.batchOpenFlag" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="关联可选班级" prop="classListArr">
          <ClassSelect v-model="dataForm.classListArr" :clearable="true"  multiple></ClassSelect>
        </FormItem>
        <FormItem label="备注" prop="batchDesc">
          <Input v-model="dataForm.batchDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveBatch">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/mpac-batch'
import ClassSelect from '@/view/components/class-select'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'batch',
  components: {
    Tables, ClassSelect, IDatePicker
  },
  data () {
    return {
      loading: true,
      exportLoading: false,
      modalType: 0,
      dataModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        username: '',
        status
      },
      dataForm: {
        batchTitle: '',
        batchDate: [],
        batchOpenFlag: true,
        classListArr: [],
        classList: [],
        batchDesc: ''
      },
      dataFormValidate: {
        batchTitle: [{ required: true, message: '批次标题不能为空', trigger: 'blur' }],
        batchDate: [{ type: 'array', len: 2, required: true, message: '选课时间不能为空', trigger: 'blur' }],
        classListArr: [{ type: 'array', min: 1, required: true, message: '关联可选班级不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '批次标题',
          key: 'batchTitle',
          ellipsis: true,
          tooltip: true,
          minWidth: 80
        },
        {
          title: '开始时间',
          key: 'batchStartTime',
          minWidth: 100
        },
        {
          title: '结束时间',
          key: 'batchEndTime',
          minWidth: 100
        },
        {
          title: '备注',
          key: 'batchDesc',
          ellipsis: true,
          tooltip: true,
          minWidth: 80
        },
        {
          title: '申报开关',
          key: 'batchOpenFlag',
          minWidth: 80,
          render: (h, params) => {
            return h('i-switch',
              {
                props: {
                  value: params.row.batchOpenFlag
                },
                on: {
                  'on-change': (val) => {
                    this.changeFlag(params.row, val)
                  },
                  input: (val) => {
                    params.row.batchOpenFlag = val
                  }
                }
              })
          }
        },
        {
          title: '查看申请情况',
          key: 'gotoDetail',
          minWidth: 120,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    this.$router.push({ name: 'course-select/application-result', params: { batchId: params.row.id } })
                  }
                }
              }, '查看申请情况')
          }
        },
        {
          title: '课程设置',
          key: 'gotoCourse',
          minWidth: 80,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    this.$router.push({ name: 'course-select/course-set', params: { batchId: params.row.id } })
                  }
                }
              }, '课程设置')
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:mpacbatch:update')) {
              btns.push(h(
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
                      this.editBatch(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            if (this.isAuth('mpa:mpacbatch:delete')) {
              btns.push(h(
                'Icon',
                {
                  props: {
                    type: 'ios-trash-outline',
                    size: '20'
                  },
                  on: {
                    click: () => {
                      this.deleteBatch(params.row)
                    }
                  }
                },
                params.row.status === 0 ? '启用' : '禁用'
              ))
            }
            return h('div', btns)
          }
        }
      ],
      selectedList: [],
      pageData: {
        totalCount: 0,
        list: []
      }
    }
  },
  methods: {
    init () {
      this.getMpacbatchList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpacbatchList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpacbatchList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getMpacbatchList () {
      this.loading = true
      api.getMpacbatchList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.pageData.list.map(item => {
          item.batchDate = []
          item.batchDate.push(item.batchStartTime)
          item.batchDate.push(item.batchEndTime)
        })
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpacbatchList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    changeFlag (obj, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          api.updateMpacbatchOpenFlag({
            id: obj.id,
            batchOpenFlag: value2
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('操作成功！')
              obj.batchOpenFlag = value2
            }
          })
        },
        onCancel: () => {
          obj.batchOpenFlag = !value2
        }
      })
    },
    addBatch () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    editBatch (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      this.dataForm.classListArr = []
      this.dataForm.classList && this.dataForm.classList.map(item => {
        this.dataForm.classListArr.push(item.id)
      })
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    saveBatch () {
      this.dataForm.classList = []
      this.dataForm.classListArr.map(item => {
        this.dataForm.classList.push({
          id: item
        })
      })
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.batchStartTime = this.dataForm.batchDate[0]
          this.dataForm.batchEndTime = this.dataForm.batchDate[1]
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMpacbatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.dataModalVisible = false
              this.handleSearch()
            })
          } else {
            api.updateMpacbatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.dataModalVisible = false
              this.handleSearch()
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteBatch (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMpacbatch(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
