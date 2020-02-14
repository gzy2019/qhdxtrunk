<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" :label-width="70" inline class="search-form">
        <Form-item label="班级名称" prop="className">
          <Input type="text" v-model="searchForm.className" clearable placeholder="请输入班级名称" style="width: 160px" />
        </Form-item>
        <Form-item label="创立年度" prop="classYear">
          <IDatePicker type="year" v-model="searchForm.classYear" clearable format="yyyy" placeholder="请选择班级创立时间" style="width: 160px" />
        </Form-item>
        <Form-item label="班级类别" prop="classType">
          <DicSelect v-model="searchForm.classType" dtype="student-type" :clearable="true" placeholder="请选择班级类别" style="width: 160px"></DicSelect>
        </Form-item>
        <Form-item label="是否毕业" prop="graduatedFlag">
          <Select v-model="searchForm.graduatedFlagStr" style="width:160px">
            <Option v-for="item in graduatedList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="申报类型" prop="stuTypeTutorDeclare">
          <DicSelect v-model="searchForm.stuTypeTutorDeclare" dtype="declare-tutor-type" placeholder="请选择申报类型" :clearable="true" style="width: 160px"></DicSelect>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addClass" v-if="isAuth('sys:allclass:save')" type="primary" icon="md-add">新增</Button>
          <Button :disabled="selectedList.length === 0" v-if="isAuth('sys:allclass:delete')" icon="ios-trash-outline" @click="deleteClassData()">批量删除</Button>
          <Button :disabled="selectedList.length === 0" @click="Graduating = true">设置毕业状态</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" border stripe editable v-model="classData" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="totalCount" current.sync="currPage" :current="currPage" :page-size="limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="classModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="classForm" :model="classForm" :label-width="85" :rules="classFormValidate">
        <FormItem label="班级名称" prop="className">
          <Input type="text" v-model="classForm.className" clearable placeholder="请输入班级名称" />
        </FormItem>
        <FormItem label="创立年度" prop="classYear">
          <IDatePicker type="year" format="yyyy" clearable v-model="classForm.classYear" placeholder="请选择班级创立年度" style="width: 100%" />
        </FormItem>
        <FormItem label="所属类别" prop="classType">
          <DicSelect v-model="classForm.classType" dtype="student-type" :clearable="true"></DicSelect>
        </FormItem>
        <FormItem label="导师申报类型" prop="stuTypeTutorDeclare">
          <DicSelect v-model="classForm.stuTypeTutorDeclare" dtype="declare-tutor-type" :clearable="true"></DicSelect>
        </FormItem>
        <FormItem label="是否毕业" prop="graduatedFlag">
          <i-switch v-model="classForm.graduatedFlag">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-if="isAuth('sys:allclass:save')" :loading="submitLoading" @click="saveClassData">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
    <!-- 是否毕业 start-->
    <Modal title="设置毕业状态" v-model="Graduating" :mask-closable='false' :width="500" class-name="vertical-center-modal ">
      <Form :label-width="80">
        <FormItem label="是否毕业" prop="status">
          <i-switch v-model="graduatingFlag">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="Graduating = false">取消</Button>
        <Button type="primary" @click="dealBatchGraduating">保存</Button>
      </div>
    </Modal>
    <!-- 是否毕业 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import IDatePicker from '@/view/components/idate-picker'
import api from '@/api/class'
export default {
  name: 'classManagement',
  components: {
    Tables, DicSelect, IDatePicker
  },
  data () {
    return {
      loading: true,
      deletes: false,
      Graduating: false,
      modalType: 0,
      classModalVisible: false,
      modalTitle: '',
      statusList: [{ id: 1, name: '正常' }, { id: 0, name: '删除' }],
      switch1: false,
      searchForm: {
        className: '',
        classYear: '',
        classType: '',
        stuTypeTutorDeclare: '',
        graduatedFlag: null,
        graduatedFlagStr: '0'
      },
      classForm: {
        id: '',
        className: '',
        classYear: '',
        classType: '',
        stuTypeTutorDeclare: '',
        graduatedFlag: false,
        isDel: ''
      },
      classFormValidate: {
        className: [{ required: true, message: '班级名称不能为空', trigger: 'blur' }],
        classYear: [{ required: true, message: '创立年度不能为空', trigger: 'blur' }],
        classType: [{ required: true, message: '班级类型不能为空', trigger: 'blur' }]
      },
      graduatedList: [{ value: '0', label: '全部' }, { value: '1', label: '未毕业' }, { value: '2', label: '毕业' }],
      submitLoading: false,
      graduatingFlag: true,
      selectedList: [],
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '班级',
          key: 'className',
          minWidth: 100,
          sortable: true
        },
        {
          title: '创立年度',
          key: 'classYear',
          minWidth: 120,
          sortable: true
        },
        {
          title: '所属类别',
          key: 'classTypeStr',
          minWidth: 120,
          sortable: true
        },
        {
          title: '导师申报类型',
          key: 'stuTypeTutorDeclareStr',
          minWidth: 120,
          sortable: true
        },
        {
          title: '是否毕业',
          key: 'graduatedFlagStr',
          minWidth: 120
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
                      this.editClass(params.row)
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
                      this.deleteClassData(params.row)
                    }
                  }
                }
              )
            ])
          }
        }
      ],
      classData: [],
      totalCount: 0,
      currPage: 1,
      limit: 10
    }
  },
  methods: {
    init () {
      this.getClassList()
    },
    handleSearch () {
      this.totalCount = 0
      this.currPage = 1
      this.getClassList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.currPage = currentPage
      this.getClassList()
    },
    handlePageSize (limit) {
      this.limit = limit
      this.getClassList()
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    getClassList () {
      this.loading = true
      if (this.searchForm.graduatedFlagStr === '0') {
        this.searchForm.graduatedFlag = null
      } else if (this.searchForm.graduatedFlagStr === '1') {
        this.searchForm.graduatedFlag = false
      } else {
        this.searchForm.graduatedFlag = true
      }
      api.getClassList({
        page: this.currPage,
        limit: this.limit,
        className: this.searchForm.className,
        classYear: this.searchForm.classYear,
        classType: this.searchForm.classType,
        graduatedFlag: this.searchForm.graduatedFlag,
        stuTypeTutorDeclare: this.searchForm.stuTypeTutorDeclare
      }).then(res => {
        this.loading = false
        this.selectedList = []
        this.classData = res.page.list
        this.classData.map(item => {
          if (item.graduatedFlag) {
            item.graduatedFlagStr = '是'
          } else {
            item.graduatedFlagStr = '否'
          }
        })
        this.totalCount = res.page.totalCount
        this.currPage = res.page.currPage
      })
    },
    cancel () {
      this.classModalVisible = false
    },
    addClass () {
      this.modalType = 0
      this.modalTitle = '新增'
      this.$refs.classForm.resetFields()
      delete this.classForm.id
      this.classModalVisible = true
    },
    editClass (v) {
      this.modalType = 1
      this.modalTitle = '编辑'
      this.$refs.classForm.resetFields()
      let str = JSON.stringify(v)
      let classInfo = JSON.parse(str)
      this.classForm = classInfo
      this.classModalVisible = true
    },
    saveClassData () {
      this.$refs.classForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (this.modalType === 0) {
            api.saveClassData(
              this.classForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.classModalVisible = false
                this.getClassList()
              } else {
                this.$Message.error('操作失败，请检查原因后重试！')
              }
            })
          } else if (this.modalType === 1) {
            api.updateClassData(
              this.classForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.classModalVisible = false
                this.getClassList()
              } else {
                this.$Message.error('操作失败，请检查原因后重试！')
              }
            })
          }
        }
      })
    },
    updateClassData (v) {
      this.$Modal.confirm({
        title: '确认' + (v.status === 0 ? '启用' : '删除'),
        content: '您确认要' + (v.status === 0 ? '启用' : '删除' + '班级 ') + v.className + ' ?',
        onOk: () => {
          let classInfo = {
            id: v.id,
            graduatedFlag: v.status === 0 ? 1 : 0
          }
          api.updateClassData(
            classInfo
          ).then(res => {
            if (res.code === 200) {
              this.$Message.success('操作成功！')
              this.getClassList()
            } else {
              this.$Message.error('操作失败，请检查原因后重试！')
            }
          })
        }
      })
    },
    deleteClassData (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteClassData(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    dealBatchGraduating () {
      let ids = this.selectedList.map(item => item.id)
      let param = {
        ids: ids
      }
      param.graduatingFlag = this.graduatingFlag
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认批量修改毕业状态吗?</p>',
        onOk: () => {
          api.updateGraduatingBatch(param).then(res => {
            this.$Message.success('修改毕业状态成功!')
            this.Graduating = false
            this.selectedList = []
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
