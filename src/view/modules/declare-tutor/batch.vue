<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
            <Form-item label="申报批次名称" prop="batchName">
              <Input type="text" v-model="searchForm.batchName" clearable placeholder="请输入申报批次名称" style="width: 170px" />
            </Form-item>
            <Form-item label="申报年度" prop="batchYear">
              <IDatePicker v-model="searchForm.batchYear" type="year" clearable format="yyyy" placeholder="选择申报年度" style="width: 170px"></IDatePicker>
            </Form-item>
            <Button @click="handleSearch" type="primary" icon="ios-search" style="margin-left:15px">搜索</Button>
            <Button @click="handleClear">清除</Button><!-- icon="ios-trash-outline"-->
        </Form>
        <Col span="24" class="operation btn_group">
          <Button @click="addBatch" type="primary" icon="md-add">新增</Button>
          <Button @click="deleteBatch">批量删除</Button>
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
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal" :styles="{top: '20px'}">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="批次名称" prop="batchName">
          <Input type="text" v-model="dataForm.batchName" clearable placeholder="请输入批次名称" />
        </FormItem>
        <FormItem label="申报年度" prop="batchYear">
          <IDatePicker v-model="dataForm.batchYear" type="year" format="yyyy" placeholder="请选择申报年度" style="width:100%"></IDatePicker>
        </FormItem>
        <FormItem label="学生申报时间" prop="studentDate">
          <IDatePicker v-model="dataForm.studentDate" clearable type="daterange" split-panels placeholder="请选择学生申报时间" style="width:100%"></IDatePicker>
        </FormItem>
        <FormItem label="导师申报时间" prop="tutorDate">
          <IDatePicker v-model="dataForm.tutorDate" clearable type="daterange" split-panels placeholder="请选择导师申报时间" style="width:100%"></IDatePicker>
        </FormItem>
        <FormItem label="是否开启" prop="batchOpenFlag">
          <i-switch v-model="dataForm.batchOpenFlag" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="开放申报类型" prop="batchRuleList">
          <div class="input_item" v-for="(item, index) in dataForm.batchRuleList" :key="index">
            <div v-show="index==0">
              <div style="width: 140px;margin-right:5px;">导师申报类型</div>
              <div style="width: 140px;margin-right:5px;">本批次报名上限</div>
              <div style="width: 140px;margin-right:5px;">本批次辅导上限</div>
            </div>
            <DicSelect v-model="item.declareTutorType" dtype="declare-tutor-type" placeholder="请选择规则类型" :clearable="true" style="width:140px;margin-right:5px;"></DicSelect>
            <InputNumber :min=1 v-model="item.batchRuleEnrollLimit" clearable placeholder="本批次报名上限" style="width: 140px;margin-right:5px;" />
            <InputNumber :min=1 v-model="item.batchRuleLimit" clearable placeholder="本批次辅导上限" style="width: 140px;margin-right:5px;" />
            <Icon type="ios-close-circle-outline" class="icon" :style="{top:(index==0?'42px':'10px')}" @click="removeItem(index)"/>
          </div>
          <Button type="dashed" @click.native="addItem" icon="md-add">新增类型</Button>
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
import api from '@/api/declare-tutor/batch'
import ClassSelect from '@/view/components/class-select'
import DicSelect from '@/view/components/dic-select'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'batch',
  components: {
    Tables, ClassSelect, DicSelect, IDatePicker
  },
  data () {
    const validateDuplicated = (rule, value, callback) => {
      if (this.dataForm.batchRuleList.length === 0) {
        callback(new Error('至少选择一项申报规则类型'))
      } else {
        let arr = this.dataForm.batchRuleList.filter(item => item.declareTutorType === value)
        if (arr.length > 1) {
          callback(new Error('申报规则类型不能重复'))
        } else {
          callback()
        }
      }
    }
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
        batchName: '',
        batchYear: ''
      },
      dataForm: {
        batchName: '',
        batchYear: '',
        studentDate: [],
        tutorDate: [],
        batchOpenFlag: true,
        batchRuleList: []
      },
      batchRuleItem: {
        declareTutorType: '',
        batchRuleEnrollLimit: 3,
        batchRuleLimit: 3
      },
      dataFormValidate: {
        batchName: [{ required: true, message: '批次名称不能为空', trigger: 'blur' }],
        batchYear: [{ required: true, message: '申报年度不能为空', trigger: 'blur' }],
        studentDate: [{ type: 'array', len: 2, required: true, message: '学生申报时间不能为空', trigger: 'blur' }],
        tutorDate: [{ type: 'array', len: 2, required: true, message: '教师申报时间不能为空', trigger: 'blur' }],
        batchRuleList: [
          { type: 'array',
            defaultField: {
              type: 'object',
              fields: {
                declareTutorType: [{ type: 'string', required: true, message: '请选择规则类型', trigger: 'change' },
                  { validator: validateDuplicated, required: true, trigger: 'change' }],
                batchRuleEnrollLimit: { type: 'number', min: 1, required: true, message: '报名上限最小为数字，且>=1', trigger: 'change' },
                batchRuleLimit: { type: 'number', min: 1, required: true, message: '辅导上限最小为数字，且>=1', trigger: 'change' }
              },
              trigger: 'change'
            },
            trigger: 'change' },
          { type: 'array', min: 1, required: true, message: '至少选择一项开放申报类型', trigger: 'change' }
        ]
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
          minWidth: 120
        },
        {
          title: '申报年度',
          key: 'batchYear',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '学生开始时间',
          key: 'studentStartDate',
          sortable: true,
          minWidth: 150
        },
        {
          title: '学生截止时间',
          key: 'studentEndDate',
          minWidth: 150
        },
        {
          title: '导师开始时间',
          sortable: true,
          key: 'tutorStartDate',
          ellipsis: true,
          tooltip: true,
          minWidth: 150
        },
        {
          title: '导师截止时间',
          key: 'tutorEndDate',
          ellipsis: true,
          tooltip: true,
          minWidth: 150
        },
        {
          title: '申报开关',
          key: 'batchOpenFlag',
          sortable: true,
          minWidth: 150,
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
          title: '查看导师指导详情',
          key: 'gotoDetail',
          minWidth: 150,
          className: 'font_color',
          render: (h, params) => {
            return h('div',
              {
                on: {
                  click: (val) => {
                    this.$router.push({ name: 'declare-tutor/batch-stat', params: { batchId: params.row.id } })
                  }
                }
              }, '查看导师指导详情')
          }
        },
        // {
        //   title: '批次规则',
        //   key: 'gotoCourse',
        //   minWidth: 80,
        //   className: 'font_color',
        //   render: (h, params) => {
        //     return h('div',
        //       {
        //         on: {
        //           click: (val) => {
        //             this.$router.push({ path: 'course-set' })
        //           }
        //         }
        //       }, '查看详情')
        //   }
        // },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
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
                      this.deleteBatch(params.row, true)
                    }
                  }
                }
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      batchList: []
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
            item.tutorDate = []
            item.tutorDate.push(item.tutorStartDate)
            item.tutorDate.push(item.tutorEndDate)
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
    changeFlag (obj, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          api.updateOpenFlag({
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
    addItem () {
      let item = Object.assign({}, this.batchRuleItem)
      this.dataForm.batchRuleList.push(item)
      console.log('addItem')
    },
    removeItem (index) {
      this.dataForm.batchRuleList.splice(index, 1)
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
          this.dataForm.tutorStartDate = this.dataForm.tutorDate[0]
          this.dataForm.tutorEndDate = this.dataForm.tutorDate[1]
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
    deleteBatch (v, singleFlag) {
      let ids = []
      if (singleFlag) {
        ids.push(v.id)
      } else {
        if (this.selectedList.length === 0) {
          this.$Message.info('请选择一条记录')
          return
        }
        this.selectedList.map(item => {
          ids.push(item.id)
        })
      }
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
    selectionChangeHandle (list) {
      this.selectedList = list
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
  top: 10px;
  right: 15px;
  font-size: 20px;
  margin: -5px 0 0 0;
}
</style>
