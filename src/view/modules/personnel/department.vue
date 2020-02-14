<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="部门名称" prop="deptName">
              <!-- @on-change="handleSearch" -->
              <Input type="text" v-model="searchForm.deptName" clearable placeholder="请输入部门名称" style="width: 170px" />
            </Form-item>
            <Button @click="handleSearch" type="primary" icon="ios-search" style="margin-left:15px">搜索</Button>
            <Button @click="handleClear">清除</Button><!-- icon="ios-trash-outline"-->
        </Form>
        <Col span="24" class="operation btn_group">
          <Button @click="addDepartment" v-if="isAuth('sys:alldepartment:save')" type="primary" icon="md-add">新增</Button>
          <Button @click="deleteDepartment" v-if="isAuth('sys:alldepartment:delete')" icon="ios-trash-outline">批量删除</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlelimit' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="deptModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="deptForm" :model="deptForm" :label-width="80" :rules="deptFormValidate">
        <FormItem label="部门名称" prop="deptName">
          <Input type="text" v-model="deptForm.deptName" clearable placeholder="请输入部门名称" />
        </FormItem>
        <FormItem label="上级部门" prop="deptParentId">
          <DepartmentSelect ref="deptSelect" :editModel="departmentSelectEdit" :changeOnSelect="true" :cachable="false" v-model="deptForm.deptParentId"></DepartmentSelect>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-if="isAuth('sys:alldepartment:save')" @click="submitForm" :loading="submitLoading">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/department'
import DepartmentSelect from '@/view/components/department-select'
export default {
  name: 'department',
  components: {
    Tables, DepartmentSelect
  },
  data () {
    return {
      loading: true,
      deptModalVisible: false,
      modalTitle: '',
      statusList: [{ id: 1, name: '正常' }, { id: 0, name: '禁用' }],
      searchForm: {
        page: 1,
        limit: 10,
        deptName: ''
      },
      departmentSelectEdit: false,
      selectedList: [],
      pageData: {
        totalCount: 0,
        list: []
      },
      deptForm: {
        deptName: '',
        deptParentId: undefined
      },
      deptFormValidate: {
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '部门名称',
          key: 'deptName',
          minWidth: 80
        },
        {
          title: '上级部门',
          key: 'parentName',
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '创建日期',
          key: 'createTime',
          minWidth: 80
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 120,
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
                      this.editDepartment(params.row)
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
      this.handleSearch()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.loadDataList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.loadDataList()
    },
    handlelimit (limit) {
      this.searchForm.limit = limit
      this.loadDataList()
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    loadDataList () {
      this.loading = true
      api.getAllDepartmentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
        }
      })
    },
    cancel () {
      this.deptModalVisible = false
    },
    addDepartment () {
      this.modalTitle = '新增'
      this.$refs.deptForm.resetFields()
      delete this.deptForm.id
      this.deptModalVisible = true
      this.departmentSelectEdit = false
      this.$refs.deptSelect.refresh()
    },
    editDepartment (row) {
      this.modalTitle = '编辑'
      this.$refs.deptForm.resetFields()
      this.deptForm.id = row.id
      this.deptForm.deptName = row.deptName
      this.deptForm.deptParentId = row.deptParentId
      this.departmentSelectEdit = true
      this.deptModalVisible = true
      this.$refs.deptSelect.refresh()
    },
    submitForm () {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.deptForm.id) {
            api.saveAllDepartment(
              this.deptForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.deptModalVisible = false
                this.handleSearch()
              }
            })
          } else {
            api.updateAllDepartment(
              this.deptForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.deptModalVisible = false
                this.handleSearch()
              }
            })
          }
        }
      })
    },
    deleteDepartment () {
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
          api.deleteAllDepartment(ids).then(res => {
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
