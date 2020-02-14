<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="选课批次" prop="batchId">
            <Select v-model="searchForm.batchId" style="width:170px">
              <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
          </Select>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left:5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button v-if="isAuth('mpa:mpacbatchcourse:save')" @click="addCourse" type="primary" icon="md-add">新增</Button>
          <Button v-if="isAuth('mpa:mpacbatchcourse:delete')" :disabled="selectedList.length === 0" @click="deleteCourse()">批量删除</Button>
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
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
    <Modal :title="modalTitle" v-model="dataModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="课程名称" prop="courseName">
          <Input type="text" v-model="dataForm.courseName" clearable placeholder="请输入课程名称" />
        </FormItem>
        <FormItem label="课程编号" prop="courseCode">
          <Input type="text" v-model="dataForm.courseCode" clearable placeholder="请输入课程编号" />
        </FormItem>
        <FormItem label="课程序号" prop="courseOrderNum">
          <InputNumber :max="10" :min="0" v-model="dataForm.courseOrderNum" style="width:100%"></InputNumber>
        </FormItem>
        <FormItem label="学分" prop="courseValue">
          <InputNumber :max="10" :min="0.5" v-model="dataForm.courseValue" style="width:100%"></InputNumber>
        </FormItem>
        <FormItem label="是否培训内课程" prop="courseTypeFlag">
          <i-switch v-model="dataForm.courseTypeFlag" />
        </FormItem>
        <FormItem label="教师" prop="teacherId">
          <TeacherSelect v-model="dataForm.teacherId" :clearable="false"></TeacherSelect>
        </FormItem>
        <FormItem label="容量" prop="courseCapacity">
          <InputNumber :min="1" v-model="dataForm.courseCapacity" style="width:100%"></InputNumber>
        </FormItem>
        <FormItem label="上课时间" prop="courseDescTime">
          <Input v-model="dataForm.courseDescTime" type="textarea" :autosize="{minRows: 2,maxRows: 5}" clearable placeholder="上课时间描述"></Input>
        </FormItem>
        <FormItem label="上课地点" prop="courseDescPlace">
          <Input v-model="dataForm.courseDescPlace" type="textarea" :autosize="{minRows: 2,maxRows: 5}" clearable placeholder="上课地点描述" />
        </FormItem>
        <FormItem label="教材信息" prop="courseDescMaterial">
          <Input type="text" v-model="dataForm.courseDescMaterial" clearable placeholder="请输入教材信息" />
        </FormItem>
        <FormItem label="备注" prop="courseDesc">
          <Input v-model="dataForm.courseDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveCourse">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import TeacherSelect from '@/view/components/teacher-select'
import api from '@/api/mpac-batch-course'
import apiBatch from '@/api/mpac-batch'
export default {
  name: 'courseSet',
  components: {
    Tables, DicSelect, TeacherSelect
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
        batchId: ''
      },
      dataForm: {
        courseName: '',
        courseCode: '',
        courseOrderNum: 0,
        courseValue: 0.5,
        courseTypeFlag: true,
        teacherId: undefined,
        courseCapacity: 1,
        courseDescTime: '',
        courseDescPlace: '',
        courseDescMaterial: '',
        courseDesc: ''
      },
      dataFormValidate: {
        courseName: [{ required: true, message: '课程名称不能为空', trigger: 'blur' }],
        courseCode: [{ required: true, message: '课程编号不能为空', trigger: 'blur' }],
        teacherId: [{ type: 'number', required: true, message: '教师不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '课程',
          key: 'courseName',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '课程号',
          key: 'courseCode',
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '课程序号',
          key: 'courseOrderNum',
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '学分',
          key: 'courseValue',
          minWidth: 80
        },
        {
          title: '是否MPA培养方案内课程',
          key: 'courseTypeFlag',
          minWidth: 180,
          render: (h, params) => {
            return h(
              'Tag',
              {
                props: {
                  // type: 'border',
                  color: params.row.courseTypeFlag ? 'primary' : 'error'
                }
              }, params.row.courseTypeFlag ? '是' : '否'
            )
          }

        },
        {
          title: '教师',
          key: 'teacherName',
          minWidth: 80
        },
        {
          title: '容量',
          key: 'courseCapacity',
          minWidth: 80
        },
        {
          title: '上课时间',
          key: 'courseDescTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '上课地点',
          key: 'courseDescPlace',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '教材信息',
          key: 'courseDescMaterial',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '备注',
          key: 'courseDesc',
          ellipsis: true,
          tooltip: true,
          minWidth: 80
        },
        {
          title: '创建时间',
          key: 'createTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 120,
          fixed: 'right',
          render: (h, params) => {
            let btns = []
            if (this.isAuth('mpa:mpacbatchcourse:update')) {
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
                      this.editCourse(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            if (this.isAuth('mpa:mpacbatchcourse:delete')) {
              btns.push(h(
                'Icon',
                {
                  props: {
                    type: 'ios-trash-outline',
                    size: '20'
                  },
                  on: {
                    click: () => {
                      this.deleteCourse(params.row)
                    }
                  }
                },
                '删除'
              ))
            }
            return h('div', btns)
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      selectedList: [],
      batchList: []
    }
  },
  methods: {
    init () {
      apiBatch.getMpacbatchListAll().then(res => {
        this.batchList = res.list
        if (this.$route.params.batchId) {
          this.searchForm.batchId = this.$route.params.batchId
        } else if (this.batchList.length > 0) { this.searchForm.batchId = this.batchList[0].id }
        this.getMpacBatchCourseList()
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpacBatchCourseList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpacBatchCourseList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getMpacBatchCourseList () {
      this.loading = true
      api.getMpacBatchCourseList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
      })
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getMpacBatchCourseList(params).then(res => {
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
    addCourse () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      if (!this.searchForm.batchId) {
        this.$Message.info('新增课程必须选择批次')
      } else {
        this.dataForm.batchId = this.searchForm.batchId
      }
      this.modalView = false
      this.dataModalVisible = true
    },
    editCourse (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    saveCourse () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            this.dataForm.batchId = this.searchForm.batchId
            api.saveMpacBatchCourse(this.dataForm).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.dataModalVisible = false
              this.handleSearch()
            })
          } else {
            api.updateMpacBatchCourse(this.dataForm).then(res => {
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
    deleteCourse (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMpacBatchCourse(ids).then(res => {
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
