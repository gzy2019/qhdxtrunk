<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="120" class="search-form">
        <Form-item label="申报批次名称" prop="batchName">
          <Input type="text" v-model="searchForm.batchName" clearable placeholder="请输入申报批次名称" style="width: 170px" />
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addBatch" type="primary" icon="md-add">新增</Button>
          <Button @click="deleteBatchs">批量删除</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="批次名称" prop="batchName">
          <Input type="text" v-model="dataForm.batchName" clearable placeholder="请输入批次名称" />
        </FormItem>
        <FormItem label="学生申报时间" prop="studentDate">
          <IDatePicker v-model="dataForm.studentDate" clearable type="daterange" split-panels placeholder="学生申报时间" style="width:100%"></IDatePicker>
        </FormItem>
        <FormItem label="教师确认时间" prop="teacherDate">
          <IDatePicker v-model="dataForm.teacherDate" clearable type="daterange" split-panels placeholder="教师确认时间" style="width:100%"></IDatePicker>
        </FormItem>
        <FormItem label="岗位报名上限" prop="batchEnrollLimit">
          <InputNumber :max="100" :precision="0" :min="1" v-model="dataForm.batchEnrollLimit" style="width:100%" placeholder="请输入岗位报名上限"></InputNumber>
        </FormItem>
        <FormItem label="岗位参与上限" prop="batchConfirmLimit">
          <InputNumber :max="100" :precision="0" :min="1" v-model="dataForm.batchConfirmLimit" style="width:100%" placeholder="请输入岗位参与上限"></InputNumber>
        </FormItem>
        <FormItem label="是否开启" prop="batchOpenFlag">
          <i-switch v-model="dataForm.batchOpenFlag" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveBatch">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <!--导出 start-->
    <Modal title="" v-model="modalExport" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认导出选中的数据？</p>
      <div slot="footer">
        <Button @click="modalExport = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="modalExport = false">保存</Button>
      </div>
    </Modal>
    <!--导出 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/declare-ta/batch'
import DicSelect from '@/view/components/dic-select'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'batch',
  components: {
    Tables, DicSelect, IDatePicker
  },
  data () {
    return {
      loading: true,
      modalExport: false,
      modalDelete: false,
      modalType: 0,
      dataModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        batchName: ''
      },
      dataForm: {
        batchName: '',
        studentDate: [],
        teacherDate: [],
        batchOpenFlag: true,
        batchConfirmLimit: 1,
        batchEnrollLimit: 1
      },
      dataFormValidate: {
        batchName: [{ required: true, message: '批次名称不能为空', trigger: 'blur' }],
        studentDate: [{ type: 'array', len: 2, required: true, message: '学生申报时间不能为空', trigger: 'blur' }],
        teacherDate: [{ type: 'array', len: 2, required: true, message: '教师确认时间不能为空', trigger: 'blur' }],
        batchEnrollLimit: [{ type: 'number', required: true, message: '岗位报名上限不能为空', trigger: 'blur' }],
        batchConfirmLimit: [{ type: 'number', required: true, message: '岗位参与上限不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '批次名称',
          key: 'batchName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '学生开始时间',
          key: 'studentStartDate',
          minWidth: 120
        },
        {
          title: '学生截止时间',
          key: 'studentEndDate',
          minWidth: 120
        },
        {
          title: '教师开始时间',
          key: 'teacherStartDate',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '教师截止时间',
          key: 'teacherEndDate',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '岗位报名上限',
          key: 'batchEnrollLimit',
          minWidth: 120
        },
        {
          title: '岗位参与上限',
          key: 'batchConfirmLimit',
          minWidth: 120
        },
        {
          title: '申报开关',
          key: 'batchOpenFlag',
          minWidth: 100,
          render: (h, params) => {
            return h('i-switch',
              {
                props: {
                  value: params.row.batchOpenFlag
                },
                on: {
                  'on-change': (val) => {
                    this.testOnChange(params.row, val)
                  },
                  input: (val) => {
                    params.row.batchOpenFlag = val
                  }
                }
              })
          }
        },
        {
          title: '岗位详情',
          key: 'gotoPost',
          minWidth: 100,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    this.$router.push({ name: 'declare-ta/post', params: { batchId: params.row.id } })
                  }
                }
              }, '查看详情')
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
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
                      this.editBatch(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
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
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      }
    }
  },
  methods: {
    init () {
      this.getBatchList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getBatchList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getBatchList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getBatchList () {
      this.loading = true
      api.getBatchList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          // 时间区间需要转换为数组
          this.pageData.list.map(item => {
            item.teacherDate = []
            item.teacherDate.push(item.teacherStartDate)
            item.teacherDate.push(item.teacherEndDate)
            item.studentDate = []
            item.studentDate.push(item.studentStartDate)
            item.studentDate.push(item.studentEndDate)
          })
        }
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    testOnChange (obj, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          api.updateBatch({
            id: obj.id,
            batchOpenFlag: value2
          }).then(res => {
            this.submitLoading = false
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
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    saveBatch () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 从数组中获取具体的开始和结束时间
          this.dataForm.studentStartDate = this.dataForm.studentDate[0]
          this.dataForm.studentEndDate = this.dataForm.studentDate[1]
          this.dataForm.teacherStartDate = this.dataForm.teacherDate[0]
          this.dataForm.teacherEndDate = this.dataForm.teacherDate[1]
          // 新增保存
          if (!this.dataForm.id) {
            api.saveBatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.dataModalVisible = false
                this.handleSearch()
              }
            })
          } else {
            api.updateBatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.dataModalVisible = false
                this.handleSearch()
              }
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteBatch (obj) {
      let ids = []
      ids.push(obj.id)

      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteBatch(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    deleteBatchs () {
      if (this.selectedList.length === 0) {
        this.$Message.info('请选择一条记录')
        return
      }
      let ids = []
      this.selectedList.map(item => {
        ids.push(item.id)
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteBatch(ids).then(res => {
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
<style lang='less'>
.input_item {
  div{
    display:inline-block
  }
  margin: 0 0 10px;
  position: relative;
}
.input_item .icon {
  position: absolute;
  top: -1px;
  right: 37px;
  font-size: 20px;
  margin: -5px 0 0 0;
}
</style>
