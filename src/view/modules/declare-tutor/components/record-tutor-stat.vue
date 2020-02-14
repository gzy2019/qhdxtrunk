<template>
  <div class="search">
    <Card>
      <div style="margin-bottom:10px;">批次学生开放时间:{{batch.studentStartDate}}至{{batch.studentEndDate}}，教师开放时间:{{batch.tutorStartDate}}至{{batch.tutorEndDate}}</div>
      <tables ref="table" size="small" v-model="pageData.list" :columns="columns" />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/declare-tutor/tutor'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'RecordTutorStat',
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
        limit: 1000,
        batchId: undefined,
        declareTutorType: undefined
      },
      submitLoading: false,
      columns: [
        {
          title: '导师姓名',
          key: 'teacherName',
          ellipsis: true,
          sortable: true,
          tooltip: true,
          minWidth: 80
        },
        {
          title: '导师简介',
          key: 'teacherDesc',
          ellipsis: true,
          minWidth: 200,
          className: 'font_color',
          render: (h, params) => {
            let create = this.$createElement
            return create('span',
              {
                'class': {
                  'ivu-table-cell-tooltip-content': true
                },
                on: {
                  click: (val) => {
                    if (params.row.teacherDesc.indexOf('http://') === 0 || params.row.teacherDesc.indexOf('https://') === 0) window.open(params.row.teacherDesc)
                  }
                }
              }, params.row.teacherDesc)
          }
        },
        {
          title: '连续三年累计已选学生',
          key: 'tutoredTotalCount',
          sortable: true,
          minWidth: 40,
          className: 'font_color'
        },
        {
          title: '本年度累计已选学生',
          key: 'tutoredCurrentCount',
          minWidth: 40,
          sortable: true,
          ellipsis: true,
          tooltip: true,
          className: 'font_color'
        },
        {
          title: '本批次已选学生',
          key: 'tutoredBatchCount',
          sortable: true,
          minWidth: 40,
          ellipsis: true,
          tooltip: true,
          className: 'font_color'
        },
        {
          title: '本批次已选+报名学生',
          key: 'tutoredBatchEnrollCount',
          minWidth: 40,
          ellipsis: true,
          tooltip: true,
          className: 'font_color'
        },
        {
          title: '本批次剩余可选名额',
          key: 'tutoredRemanent',
          minWidth: 40,
          sortable: true,
          ellipsis: true,
          tooltip: true,
          className: 'font_color'
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
      this.searchForm.statFlag = true

      api.getTutorList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          this.pageData.list.map(item => {
            item.teacherName = item.teacher && item.teacher.teaName
          })
        }
      })
    },
    cancel () {
      this.dataModalVisible = false
    }
  },
  mounted () {
    this.init()
  }
}
</script>
