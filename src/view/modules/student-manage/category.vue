<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="类别名称" prop="dicName">
              <Input type="text" v-model="searchForm.dicName" clearable placeholder="请输入类别名称" style="width: 170px" />
            </Form-item>
            <FormItem label="是否启用" prop="enable">
              <Select v-model="searchForm.enableStr" style="width:170px">
                <Option v-for="item in enableList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClear">清除</Button><!-- icon="ios-trash-outline"-->
        </Form>
        <Col span="24" class="operation btn_group">
          <Button v-if="isAuth('sys:alldic:save')" @click="addData" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('sys:alldic:delete')" @click="deleteData" icon="ios-trash-outline">批量删除</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" border stripe editable v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
        <FormItem label="类别名称" prop="dicName">
          <Input type="text" v-model="dataForm.dicName" clearable :maxlength="20" placeholder="请输入类别名称" />
        </FormItem>
        <FormItem label="类别编码" prop="dicValue">
          <Input type="text" v-model="dataForm.dicValue" clearable :maxlength="20" placeholder="请输入类别编码" />
        </FormItem>
        <FormItem label="是否启用" prop="enable">
          <i-switch v-model="dataForm.enable" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-if="isAuth('sys:alldic:save')" :loading="submitLoading" @click="submitForm">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import api from '@/api/dic'
export default {
  name: 'category',
  components: {
    Tables, DicSelect
  },
  data () {
    const validateDicType = (rule, value, callback) => {
      if (!this.dataForm.dicValue) {
        callback(new Error('类别编码不能为空'))
      } else {
        api.validateDicValue(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('类别编码已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      loading: true,
      formModalVisible: false,
      modalTitle: '',
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        dicName: '',
        dicType: 'student-type',
        enable: true,
        enableStr: '0'
      },
      dataForm: {
        dicType: 'student-type',
        dicName: '',
        dicValue: '',
        enable: true
      },
      enableList: [{ value: '0', label: '全部' }, { value: '1', label: '启用' }, { value: '2', label: '关闭' }],
      dataFormValidate: {
        dicName: [
          { required: true, message: '类别名称不能为空', trigger: 'blur' }
        ],
        dicValue: [
          { validator: validateDicType, trigger: 'blur' }
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
          title: '类别名称',
          key: 'dicName',
          minWidth: 100,
          sortable: true
        },
        {
          title: '类别编码',
          key: 'dicValue',
          minWidth: 100,
          sortable: true
        },
        {
          title: '是否启用',
          minWidth: 80,
          key: 'enableStr'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('sys:alldic:update')) {
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
                      this.edit(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            return h('div', btns)
          }
        }
      ]
    }
  },
  methods: {
    init () {
      this.getDataList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDataList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDataList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getDataList () {
      this.loading = true
      if (this.searchForm.enableStr === '0') {
        this.searchForm.enable = null
      } else if (this.searchForm.enableStr === '1') {
        this.searchForm.enable = true
      } else {
        this.searchForm.enable = false
      }
      api.getDicList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          this.pageData.list.map(item => {
            if (item.enable) {
              item.enableStr = '启用'
            } else {
              item.enableStr = '关闭'
            }
          })
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addData () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      this.formModalVisible = true
    },
    edit (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      delete this.dataForm.createTime
      delete this.dataForm.modifyTime
      this.formModalVisible = true
    },
    submitForm () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveDicData(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.handleSearch()
              }
            })
          } else {
            api.updateDicData(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
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
    deleteData () {
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
          api.delDic(ids).then(res => {
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
