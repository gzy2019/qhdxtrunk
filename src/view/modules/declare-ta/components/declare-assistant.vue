<template>
  <div class="search">
    <Card>

      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="课程名" prop="postName">
          <Input v-model="searchForm.postName" :clearable="true" style="width: 200px"></Input>
        </Form-item>
        <Form-item label="课程号" prop="postCourseNum">
          <Input v-model="searchForm.postCourseNum" :clearable="true" style="width: 200px"></Input>
        </Form-item>
          <Form-item label="学生类别" prop="studentType">
          <DicSelect v-model="searchForm.studentType" dtype="student-type" placeholder="请选择学生类别" :clearable="true"></DicSelect>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!--申报详情 start-->
    <Modal title="申报详情" v-model="modalDeclare" class-name="vertical-center-modal popup" :width="1000" scrollable>
      <Row>
        <Form ref="searchFormRecord" :model="searchFormRecord" inline :label-width="100" class="search-form">
          <Col span="16">
            <Form-item label="学生姓名" prop="stuName">
              <Input v-model="searchFormRecord.stuName" :clearable="true" style="width: 200px"></Input>
            </Form-item>
            <Form-item label="申报状态" prop="recordStatus">
              <Select v-model="searchFormRecord.recordStatus" :clearable="true" style="width: 200px">
                <Option v-for="item in statusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="8" class="btn_group">
            <Button @click="handleSearchRecord" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleClearRecord">清除</Button>
          </Col>
        </Form>
        <Col span="24" class="operation btn_group" style="margin-bottom:10px;">
          <Button @click="modalSelected = true" type="primary">选定</Button>
          <Button @click="modalRefuse = true">拒绝</Button>
          <Button @click="modalExport = true">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables ref="table" size="small" v-model="pageDataRecord.list" :columns="columns2" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page" style="margin-top:10px">
        <Page :total="pageDataRecord.totalCount" current.sync="searchFormRecord.page" :current="searchFormRecord.page" :page-size="searchFormRecord.limit" @on-change="changePageRecord" @on-page-size-change='handlePageSizeRecord' show-total show-sizer></Page>
      </Row>
      <div slot="footer">
        <Button @click="modalDeclare = false">取消</Button>
        <Button type="primary" @click="modalDeclare = false">确定</Button>
      </div>
    </Modal>
    <!--申报详情 end-->
    <!--选定 start-->
    <Modal title="" v-model="modalSelected" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认选定选中的数据？</p>
      <div slot="footer">
        <Button @click="modalSelected = false">取消</Button>
        <Button type="primary" @click="batchDealRecord('confirm')">确定</Button>
      </div>
    </Modal>
    <!--选定 end-->
    <!--拒绝 start-->
    <Modal title="" v-model="modalRefuse" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认拒绝选中的数据？</p>
      <div slot="footer">
        <Button @click="modalRefuse = false">取消</Button>
        <Button type="primary" @click="batchDealRecord('reject')">确定</Button>
      </div>
    </Modal>
    <!--拒绝 end-->
    <!--导出 start-->
    <Modal title="" v-model="modalExport" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认导出选中的数据？</p>
      <div slot="footer">
        <Button @click="modalExport = false">取消</Button>
        <Button type="primary" @click="batchDealRecord('reject')">确定</Button>
      </div>
    </Modal>
    <!--导出 end-->

    <!--申报详情 start-->
    <Modal title="申报详情" v-model="modalDetail" footer-hide class-name="vertical-center-modal popup" :width="600" scrollable>
      <div class="baseinformation">
        <div class="popup_title">
          <p><Icon type="ios-list" />课程信息</p>
          <Divider />
        </div>
        <div class="popup-content" style="margin-bottom:10px">
          <table class="table1">
            <tr>
              <td>课程名：{{dataForm.postName}}</td>
              <td>课程号：{{dataForm.postCourseNum}}</td>
              <td>岗位数量：{{dataForm.postCount}}</td>
            </tr>
            <tr>
              <td colspan="3">备注：{{dataForm.postAssistant && dataForm.postAssistant.postDesc}}</td>
            </tr>
          </table>
        </div>
        <div class="popup_title">
          <p><Icon type="ios-list" />学生信息</p>
          <Divider />
        </div>
        <div class="popup-content" style="margin-bottom:10px">
          <table class="table1">
            <tr>
              <td>学生姓名：{{dataForm.studentName}}</td>
              <td>学号：{{dataForm.studentCode}}</td>
            </tr>
            <tr>
              <td>手机：{{dataForm.student && dataForm.student.mobile}}</td>
              <td>邮箱：{{dataForm.student && dataForm.student.email}}</td>
            </tr>
          </table>
        </div>

        <div class="popup_title">
          <p><Icon type="ios-list" />申报情况</p>
          <Divider />
        </div>
        <div class="popup-content">
          <table class="table1">
            <tr>
              <td>申报状态：{{dataForm.recordStatusDesc}}</td>
              <td>申报时间：{{dataForm.createTime}}</td>
              <td>批复时间: {{dataForm.modifyTime}}</td>
            </tr>
          </table>
        </div>
      </div>
    </Modal>
    <!--申报详情 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/declare-ta/post-assistant'
import apiRecord from '@/api/declare-ta/record'
import TeacherSelect from '@/view/components/teacher-select'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'declareAssistant',
  components: {
    Tables, TeacherSelect, DicSelect
  },
  props: {
    batchId: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      loading: false,
      modalDeclare: false,
      modalDetail: false,
      modalSelected: false,
      modalExport: false,
      modalRefuse: false,
      modalType: 0,
      dataModalVisible: false,
      searchForm: {
        page: 1,
        limit: 10,
        postName: '',
        postCourseNum: '',
        studentType: '',
        statFlag: true
      },
      submitLoading: false,
      columns: [
        {
          title: '课程名',
          key: 'postName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '课程号',
          key: 'postCourseNum',
          minWidth: 100
        },
        {
          title: '任课教师',
          key: 'teacherName',
          minWidth: 100
        },
        {
          title: '学生类别',
          key: 'typeListStr',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '上课时间',
          key: 'courseSchedule',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '上课周数',
          key: 'courseWeek',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '备注',
          key: 'postDesc',
          ellipsis: true,
          tooltip: true,
          minWidth: 140
        },
        {
          title: '岗位数量',
          key: 'postCount',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '申报数量',
          key: 'enrolledCount',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '选定数量',
          key: 'confirmedCount',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Icon', {
                  props: {
                    type: 'ios-eye-outline',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showRecord(params.row)
                    }
                  }
                },
                '查看'
              )
            ])
          }
        }
      ],
      searchFormRecord: {
        page: 1,
        limit: 10,
        postType: 0,
        stuName: '',
        recordStatus: ''
      },
      statusArr: [
        { value: '0', label: '申请中' },
        { value: '1', label: '已确认' },
        { value: '2', label: '已拒绝' },
        { value: '3', label: '管理员指定' },
        { value: '4', label: '暂存' }
      ],
      columns2: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '课程名',
          key: 'postName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '课程号',
          key: 'postCourseNum',
          minWidth: 100
        },
        {
          title: '岗位数量',
          key: 'postCount',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '学生姓名',
          key: 'studentName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '学号',
          key: 'studentCode',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '申报时间',
          key: 'createTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '申报状态',
          key: 'recordStatusDesc',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 120,
          render: (h, params) => {
            let btns = []
            btns.push(h(
              'Icon', {
                props: {
                  type: 'ios-eye-outline',
                  size: '20'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.viewRecordDetail(params.row)
                  }
                }
              },
              '查看'
            ))
            if (params.row.recordStatus === 0 || params.row.recordStatus === 4) {
              btns.push(h(
                'Icon', {
                  props: {
                    type: 'ios-checkmark',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.dealRecord(params.row, 'confirm')
                    }
                  }
                },
                '选定'
              ))
              btns.push(h(
                'Icon', {
                  props: {
                    type: 'ios-close',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.dealRecord(params.row, 'reject')
                    }
                  }
                },
                '取消'
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
      pageDataRecord: {
        totalCount: 0,
        list: []
      },
      count: {
        countConfirmed: 0,
        countEnrolled: 0
      },
      dataForm: {
        postName: '',
        postCourseNum: '',
        teacherId: '',
        typeList: [],
        typeListStr: '',
        postCount: 1,
        courseSchedule: '',
        courseWeek: '',
        postDesc: ''
      },
      currentPost: {}
    }
  },
  watch: {
    batchId (newVal, oldVal) {
      this.getPostAssistantList()
    }
  },
  methods: {
    init () {
      this.getPostAssistantList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getPostAssistantList()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getPostAssistantList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getPostAssistantList () {
      if (!this.batchId) return
      this.loading = true
      this.searchForm.batchId = this.batchId
      api.getOwnerPostAssistantList(this.searchForm).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.pageData = res.page
        }
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    handleClearRecord () {
      this.$refs.searchFormRecord.resetFields()
      this.handleSearchRecord()
    },
    handleSearchRecord () {
      this.searchFormRecord.page = 1
      this.getRecordList()
    },
    changePageRecord (currentPage) {
      this.searchFormRecord.page = currentPage
      this.getRecordList()
    },
    handlePageSizeRecord (limit) {
      this.searchFormRecord.limit = limit
      this.getRecordList()
    },
    showRecord (obj) {
      this.currentPost = obj// 标记当前操作的岗位信息
      this.modalDeclare = true
      this.searchFormRecord.postId = obj.id
      this.getRecordList()
    },
    getRecordList () {
      apiRecord.getRecordList(this.searchFormRecord).then(res => {
        this.selectedList = []
        if (res.code === 200) {
          this.pageDataRecord = res.page
          // 获取最新的岗位统计信息，在同意和拒绝后更新岗位统计数据
          this.count = res.count
          this.currentPost.confirmedCount = this.count.countConfirmed
          this.currentPost.enrolledCount = this.count.countEnrolled
          this.pageDataRecord.list.map(item => {
            item.postName = item.postAssistant && item.postAssistant.postName
            item.postCourseNum = item.postAssistant && item.postAssistant.postCourseNum
            item.postCount = item.postAssistant && item.postAssistant.postCount
            item.studentName = item.student && item.student.stuName
            item.studentCode = item.student && item.student.stuCode
            if (item.recordStatus !== 0 && item.recordStatus !== 4) {
              item._disabled = true
            }
          })
        }
      })
    },
    viewRecordDetail (v) {
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      this.modalDetail = true
    },
    dealRecord (obj, action) {
      let param = {}
      param.id = obj.id
      if (action === 'confirm') {
        param.recordStatus = 1
        if (this.count.countConfirmed + 1 > this.currentPost.postCount) {
          this.$Message.warning('确认岗位数量不能超过岗位数量！')
          return
        }
      } else if (action === 'reject') {
        param.recordStatus = 2
      } else {
        this.$Message.warning('操作错误！')
        return
      }
      this.submitLoading = true
      // 新增保存
      apiRecord.updateRecord(param).then(res => {
        this.submitLoading = false
        if (res.code === 200) {
          this.$Message.success('操作成功！')
          this.dataModalVisible = false
          this.handleSearchRecord()
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    batchDealRecord (action) {
      if (this.selectedList.length === 0) {
        this.$Message.info('请选择一条记录')
        return
      }
      let param = {}
      if (action === 'confirm') {
        param.recordStatus = 1
        if (this.count.countConfirmed + this.selectedList.length > this.currentPost.postCount) {
          this.$Message.warning('确认岗位数量不能超过岗位数量！')
          return
        }
      } else if (action === 'reject') {
        param.recordStatus = 2
      }
      let items = []
      this.selectedList.map(item => {
        let entity = {}
        entity.id = item.id
        entity.recordStatus = param.recordStatus
        items.push(entity)
      })

      apiRecord.updateBatchRecord(items).then(res => {
        this.$Message.success('批量操作成功!')
        this.handleSearch()
        this.modalRefuse = false
        this.modalSelected = false
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
