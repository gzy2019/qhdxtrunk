<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="75" class="search-form">
        <Form-item label="申报批次" prop="batchId">
          <Select v-model="searchForm.batchId" style="width:180px">
            <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchName }}</Option>
          </Select>
        </Form-item>
        <Form-item label="导师姓名" prop="teacherId">
          <Select v-model="searchForm.teacherId" style="width:160px" clearable>
            <Option v-for="item in tutorList" :value="item.teacherId" :key="item.teacherId">{{ item.teaName }}</Option>
          </Select>
        </Form-item>
        <FormItem label="导师申报类型" prop="declareTutorType" :label-width="85">
          <DicSelect v-model="searchForm.declareTutorType" dtype="declare-tutor-type" :clearable="true" style="width:160px"></DicSelect>
        </FormItem>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addRecord" type="primary" icon="md-add">录入选导师结果</Button>
          <Button :disabled="selectedList.length === 0" @click="deleteBatch">批量删除</Button>
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
      <Form ref="dataForm" :model="dataForm" :label-width="90" :rules="dataFormValidate">
        <FormItem label="关联可选导师" prop="teacherId">
          <Select v-model="dataForm.teacherId"  clearable>
            <Option v-for="item in tutorList" :value="item.teacherId" :key="item.teacherId">{{ item.teaName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联学生" prop="studentId">
          <Input v-model="dataForm.studentId" placeholder="请输入学号"></Input>
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
import apiBatch from '@/api/declare-tutor/batch'
import api from '@/api/declare-tutor/record'
import apiTutor from '@/api/declare-tutor/tutor'
import ClassSelect from '@/view/components/class-select'
import StudentTree from '@/view/components/student-tree'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'Record',
  components: {
    Tables, ClassSelect, StudentTree, DicSelect
  },
  data () {
    return {
      exportLoading: false,
      loading: true,
      modalType: 0,
      dataModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        batchId: '',
        teacherId: '',
        declareTutorType: undefined
      },
      dataForm: {
        batchTitle: '',
        batchStartTime: '',
        batchEndTime: '',
        batchOpenFlag: true,
        classListArr: [],
        classList: [],
        batchDemo: ''
      },
      dataFormValidate: {
        batchName: [{ required: true, message: '批次标题不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '学生姓名',
          key: 'stuName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '学生证件号',
          key: 'stuCode',
          minWidth: 120
        },
        {
          title: '班级名称',
          key: 'className',
          minWidth: 150
        },
        {
          title: '导师申报类型',
          key: 'declareTutorTypeStr',
          minWidth: 180,
          ellipsis: true,
          tooltip: true,
          sortable: false
        },
        {
          title: '申报时间',
          key: 'createTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 150
        },
        {
          title: '拟申报导师',
          key: 'teaName',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '申报状态',
          key: 'recordStatusDesc',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 140
        },
        {
          title: '手机',
          key: 'mobile',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '邮箱',
          key: 'email',
          ellipsis: true,
          tooltip: true,
          minWidth: 150
        },
        {
          title: '操作',
          fixed: 'right',
          key: 'action',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h('div', [
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
      selectedList: [],
      batchList: [],
      tutorList: []
    }
  },
  methods: {
    init () {
      apiBatch.getBatchListAll().then(res => {
        this.batchList = res.list
        if (this.batchList.length > 0) { this.searchForm.batchId = this.batchList[0].id }
        this.getRecordList()
      })
      apiTutor.getTutorListAll().then(res => {
        this.tutorList = res.list
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getRecordList()
    },
    handleClear () {
      this.searchForm.teacherId = undefined
      this.searchForm.declareTutorType = undefined
      // this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getRecordList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getRecordList () {
      this.loading = true
      api.getRecordList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          this.pageData.list.map(item => {
            item.stuName = item.student.stuName
            item.stuCode = item.student.stuCode
            item.className = item.student.className
            item.mobile = item.student.mobile
            item.email = item.student.email
            item.teaName = item.tutorDesc.teacher.teaName
          })
        }
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getRecordList(params).then(res => {
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
    testOnChange (value, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          value.batchOpenFlag = value2
        },
        onCancel: () => {
          value.batchOpenFlag = !value2
        }
      })
    },
    addRecord () {
      this.modalTitle = '录入选导师结果'
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
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMpacbatch(
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
            api.updateMpacbatch(
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
      if (obj.id) {
        ids.push(obj.id)
      } else {
        ids = this.selectedList.map(item => item.id)
      }
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteRecord(ids).then(res => {
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
