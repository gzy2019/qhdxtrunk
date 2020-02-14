<template>
  <div class="search">
    <Card>
      <div class="words">开放时间:{{batch.tutorStartDate}}至{{batch.tutorEndDate}}</div>
      <div class="words">操作说明：①请您选择同意指导的学生、选择结果提交后系统将直接通知学生（若可能修改，请暂存）。②若无意指导某学生，请点击拒绝按钮。以便学生另做选择。每个学生只能申报1名导师</div>
        <Alert type="warning" class="tips">
          您每年级可以指导{{declareTutorTypeStr}}人数：<span>{{count && count.ruleYearLimit}}</span>；
          您本批次可以指导{{declareTutorTypeStr}}人数：<span>{{count && count.batchRuleLimit}}</span>；
          您{{batch.batchYear}}年级已经选定<span>{{count && count.tutoredCurrentCount}}</span>名；
          您本批次已经选定<span>{{count && count.tutoredBatchCount}}</span>名；
          当前累计剩余名额：<Badge show-zero :count="count && count.remanent"></Badge> 名；
          以下是申报您为导师的{{declareTutorTypeStr}}名单。</Alert>
        <Row style="margin-bottom:10px">
          <Button @click="tempSave">暂存</Button>
        </Row>
      <tables ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
    </Card>

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
import api from '@/api/declare-tutor/record'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'RecordTutor',
  components: {
    Tables, DicSelect
  },
  props: {
    batchId: {
      type: Number,
      default: undefined
    },
    declareTutorType: {
      type: String,
      default: undefined
    },
    declareTutorTypeStr: {
      type: String,
      default: undefined
    },
    time4Confirm: {
      type: Boolean,
      default: undefined
    },
    batch: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      modalExport: false,
      modalDelete: false,
      modalType: 0,
      dataModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        batchId: undefined,
        declareTutorType: undefined
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
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '学生证件号',
          sortable: true,
          key: 'stuCode',
          minWidth: 120
        },
        {
          title: '班级名称',
          key: 'className',
          minWidth: 100
        },
        {
          title: '申报时间',
          key: 'createTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 160
        },
        {
          title: '拟申报导师',
          key: 'teaName',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '论文意向',
          key: 'paperIntend',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '申报状态',
          key: 'recordStatusDesc',
          className: 'font_color',
          sortable: true,
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '暂存状态',
          key: 'recordTempStatusDesc',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
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
          minWidth: 180
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            let btns = []
            if (params.row.recordStatus === 0 || params.row.recordStatus === 4) {
              btns.push(h(
                'Button', {
                  props: {
                    type: 'primary',
                    disabled: !(this.time4Confirm && this.count.remanent > 0),
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      if (this.time4Confirm && this.count.remanent > 0) this.dealRecord(params.row, 'confirm')
                    }
                  }
                },
                '选定'
              ))
              btns.push(h(
                'Button', {
                  props: {
                    type: 'error',
                    disabled: !(this.time4Confirm && this.count.remanent > 0),
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      if (this.time4Confirm && this.count.remanent > 0) this.dealRecord(params.row, 'reject')
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
      count: {
      }
    }
  },
  watch: {
    batchId (newVal, oldVal) {
      this.getRecordList()
    }
  },
  methods: {
    init () {
      this.getRecordList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getRecordList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
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
      if (!this.batchId) return
      this.loading = true
      this.searchForm.batchId = this.batchId
      this.searchForm.declareTutorType = this.declareTutorType
      api.getRecordListByTeacher(this.searchForm).then(res => {
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
            if (item.recordTempStatus === 1) item._disabled = true
          })
          this.count = res.count
        }
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    dealRecord (obj, action) {
      let param = {}
      param.id = obj.id
      if (action === 'confirm') {
        if (this.count && this.count.remanent === 0) {
          this.$Message.warning('辅导名额不足！')
          return
        }
        param.recordStatus = 1
      } else if (action === 'reject') {
        param.recordStatus = 2
      } else {
        this.$Message.warning('操作错误！')
        return
      }
      this.submitLoading = true
      // 新增保存
      api.updateRecord(param).then(res => {
        this.submitLoading = false
        if (res.code === 200) {
          this.$Message.success('操作成功！')
          this.dataModalVisible = false
          this.handleSearch()
        }
      })
    },
    tempSave (obj) {
      if (this.selectedList.length === 0) {
        this.$Message.warning('至少选择一条记录')
        return
      }
      let params = []
      this.selectedList.map(item => {
        let param = {}
        param.id = item.id
        param.recordTempStatus = 1
        params.push(param)
      })
      this.submitLoading = true
      // 新增保存
      api.updateBatch(params).then(res => {
        this.submitLoading = false
        if (res.code === 200) {
          this.$Message.success('操作成功！')
          this.dataModalVisible = false
          this.handleSearch()
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
