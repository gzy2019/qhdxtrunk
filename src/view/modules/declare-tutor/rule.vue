<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="规则名称" prop="ruleName">
              <Input type="text" v-model="searchForm.ruleName" clearable placeholder="请输入规则名称" style="width: 170px" />
            </Form-item>
            <Button @click="handleSearch" type="primary" icon="ios-search" style="margin-left:15px">搜索</Button>
            <Button @click="handleClear">清除</Button><!-- icon="ios-trash-outline"-->
        </Form>
        <Col span="24" class="operation btn_group">
          <Button @click="addRule" type="primary" icon="md-add">新增</Button>
          <!-- <Button @click="deleteBatch">批量删除</Button> -->
        </Col>
      </Row>
      <Row>
        <Alert type="warning" closable>申报规则管理主要设置导师不同申报类型的年度指导限额和三年累计指导限额，如果不进行设置则以批次中设置的单次规则为准。</Alert>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
        <FormItem label="规则名称" prop="ruleName">
          <Input type="text" v-model="dataForm.ruleName" clearable placeholder="请输入规则名称" />
        </FormItem>
        <FormItem label="导师申报类型" prop="declareTutorType">
          <DicSelect v-model="dataForm.declareTutorType" dtype="declare-tutor-type" placeholder="请选择导师申报类型" :clearable="true" style="width:100%"></DicSelect>
        </FormItem>
        <FormItem label="每年指导人数上限" prop="ruleYearLimit">
          <InputNumber :max="50" :min="1" v-model="dataForm.ruleYearLimit" style="width:100%" placeholder="请输入每年指导人数上限"></InputNumber>
        </FormItem>
        <FormItem label="三年指导人数上限" prop="ruleTotalLimit">
          <InputNumber :max="50" :min="1" v-model="dataForm.ruleTotalLimit" style="width:100%" placeholder="请输入三年指导人数上限"></InputNumber>
        </FormItem>
        <FormItem label="是否开启" prop="ruleOpenFlag">
          <i-switch v-model="dataForm.ruleOpenFlag" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <!-- <FormItem label="关联可选班级" prop="classListArr">
          <ClassSelect v-model="dataForm.classListArr" :clearable="true"  multiple></ClassSelect>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveRule">提交</Button>
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
import api from '@/api/declare-tutor/rule'
import dicUtil from '@/libs/dicUtil'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'rule',
  components: {
    Tables, DicSelect, dicUtil
  },
  data () {
    const validateDeclareTutorType = (rule, value, callback) => {
      if (!this.dataForm.declareTutorType) {
        callback(new Error('导师申报类型不能为空'))
      } else {
        api.validateDuplicated(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('导师申报类型不允许重复添加'))
          } else {
            callback()
          }
        })
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
        ruleName: ''
      },
      dataForm: {
        ruleName: '',
        declareTutorType: '',
        ruleYearLimit: 1,
        ruleTotalLimit: 10,
        ruleOpenFlag: true
      },
      dataFormValidate: {
        ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        declareTutorType: [{ validator: validateDeclareTutorType, required: true, trigger: 'blur' }],
        ruleYearLimit: [{ type: 'number', required: true, message: '每年指导人数上限不能为空', trigger: 'blur' }],
        ruleTotalLimit: [{ type: 'number', required: true, message: '三年指导人数上限不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '规则名称',
          key: 'ruleName',
          ellipsis: true,
          tooltip: true,
          minWidth: 80
        },
        {
          title: '导师申报类型',
          key: 'declareTutorTypeStr',
          minWidth: 100
        },
        {
          title: '每年指导人数上限',
          key: 'ruleYearLimit',
          minWidth: 120
        },
        {
          title: '三年指导人数上限',
          key: 'ruleTotalLimit',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '启用/禁用',
          key: 'ruleOpenFlag',
          minWidth: 80,
          render: (h, params) => {
            return h('i-switch',
              {
                props: {
                  value: params.row.ruleOpenFlag
                },
                on: {
                  'on-change': (val) => {
                    this.testOnChange(params.row, val)
                  },
                  input: (val) => {
                    params.row.ruleOpenFlag = val
                  }
                }
              })
          }
        },
        {
          title: '操作',
          key: 'action',
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
                      this.editRule(params.row)
                    }
                  }
                },
                '编辑'
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
      this.getRuleList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getRuleList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getRuleList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getRuleList () {
      this.loading = true
      api.getRuleList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
        }
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    testOnChange (value, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          value.ruleOpenFlag = value2
        },
        onCancel: () => {
          value.ruleOpenFlag = !value2
        }
      })
    },
    addRule () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    editRule (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      console.log(this.dataForm)
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    saveRule () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveRule(
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
            api.updateRule(
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
    deleteRule () {
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
          api.deleteRule(ids).then(res => {
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
