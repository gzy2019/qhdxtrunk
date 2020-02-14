<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
        <Form-item label="名称" prop="name">
          <Input type="text" v-model="searchForm.name" clearable placeholder="请输入名称" style="width: 180px" />
        </Form-item>
        <Form-item style="margin-left: -70px;">
          <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleClear" style="margin-left: 5px">清除</Button>
        </Form-item>
      </Form>
      <Row class="operation btn_group">
          <Col span="24">
            <Button v-if="isAuth('meeting:meetingroomdef:save')" @click="addMeetingRoomDef" type="primary" icon="md-add">新增</Button>
            <Button v-if="isAuth('meeting:meetingroomdef:delete')" :disabled="selectedList.length === 0" @click="deleteMeetingRoomDef()" type="primary" icon="ios-trash-outline">删除</Button>
            <Button v-if="false" @click="exportMeetingRoomDef" type="primary" icon="ios-download-outline">导出</Button>
          </Col>
      </Row>
      <Row>
        <Table :loading="loading" ref="table" size="small" border stripe :data="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle">
          <template slot-scope="{ row }" slot="enable">
              <Tag v-if="row.enable" color="success">启用</Tag>
              <Tag v-if="!row.enable" color="warning">停用</Tag>
          </template>
        </Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="会议室名称" prop="name">
          <Input type="text" v-model="dataForm.name" clearable :maxlength="200" placeholder="请输入会议室名称" />
        </FormItem>
        <FormItem label="座位数" prop="seatCount">
          <InputNumber type="text" :min="1" :max="9999" v-model="dataForm.seatCount" clearable placeholder="请输入座位数量" style="width: 100px;" />
        </FormItem>
        <FormItem label="是否启用" prop="enable">
          <i-switch v-model="dataForm.enable">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="会议室类型" prop="roomType">
          <DicSelect v-model="dataForm.roomType" dtype="meeting-room-type" :clearable="true" />
        </FormItem>
        <FormItem label="审批人员" prop="adminList">
          <TeacherSelect ref="teacherSelect" v-model="dataForm.adminList" :multiple="true" />
        </FormItem>
        <FormItem label="备注" prop="memo">
          <Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" v-model="dataForm.memo" clearable :maxlength="500" placeholder="请输入备注" />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMeetingRoomDef">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/meeting/meetingroomdef'
import DicSelect from '@/view/components/dic-select'
import TeacherSelect from '@/view/components/teacher-select'
export default {
  name: 'MeetingRoomDef-manage',
  components: { DicSelect, TeacherSelect },
  data () {
    return {
      loading: true,
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        name: ''
      },
      dataForm: {
        name: '',
        seatCount: 20,
        enable: true,
        roomType: '',
        memo: '',
        adminList: [],
        id: undefined
      },
      dataFormValidate: {
        name: [
          { required: true, message: '会议室名称不能为空', trigger: 'blur' }
        ],
        seatCount: [
          { type: 'number', required: true, message: '座位数不能为空', trigger: 'blur' }
        ],
        enable: [
          { type: 'boolean', required: true, message: '是否启用不能为空', trigger: 'blur' }
        ],
        adminList: [
          { type: 'array', required: true, message: '审核人员不能为空', trigger: 'blur' }
        ],
        roomType: [
          { required: true, message: '会议室类型不能为空', trigger: 'blur' }
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
          title: '会议室名称',
          key: 'name',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '使用状态',
          slot: 'enable',
          minWidth: 100
        },
        {
          title: '座位数量',
          key: 'seatCount',
          minWidth: 100
        },
        {
          title: '会议室类型',
          key: 'roomTypeStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '审核人员',
          key: 'adminListStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '备注',
          key: 'memo',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 150,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('meeting:meetingroomdef:info')) {
              btns.push(h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.viewMeetingRoomDef(params.row)
                    }
                  }
                },
                '查看'
              ))
            }
            if (this.isAuth('meeting:meetingroomdef:update')) {
              btns.push(h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editMeetingRoomDef(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            if (this.isAuth('meeting:meetingroomdef:delete')) {
              btns.push(h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteMeetingRoomDef(params.row)
                    }
                  }
                },
                '删除'
              ))
            }
            return h('div', btns)
          }
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getMeetingRoomDefList()
      this.adjustTableHeight()
    },
    adjustTableHeight () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMeetingRoomDefList()
      this.selectedList = []
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMeetingRoomDefList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    getMeetingRoomDefList () {
      this.loading = true
      api.getMeetingRoomDefList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        this.pageData = res.page
        this.pageData.list.map(item => {
          if (item.adminList) {
            item.adminListStr = item.adminList.map(ai => ai.teacherName).join(' ')
          }
        })
        this.adjustTableHeight()
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    exportMeetingRoomDef () {
      this.$refs.table.exportCsv({
        filename: '会议室列表'
      })
    },
    addMeetingRoomDef () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewMeetingRoomDef (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      let entity = Object.assign({}, v)
      Object.keys(this.dataForm).forEach(key => {
        if (key === 'adminList' && entity[key]) {
          entity[key] = entity[key].map(ii => {
            return ii.teacherId
          })
        }
        this.dataForm[key] = entity[key]
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editMeetingRoomDef (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = Object.assign({}, v)
      Object.keys(this.dataForm).forEach(key => {
        if (key === 'adminList' && entity[key]) {
          entity[key] = entity[key].map(ii => {
            return ii.teacherId
          })
        }
        this.dataForm[key] = entity[key]
      })
      this.modalView = false
      this.formModalVisible = true
    },
    saveMeetingRoomDef () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          console.log('adminList', data)
          if (data.adminList) {
            data.adminList = data.adminList.map(item => {
              let obj = { teacherId: item }
              obj.teacherName = this.$refs.teacherSelect.getTeacherName(item)
              return obj
            })
          }
          // 新增保存
          if (!data.id) {
            api.saveMeetingRoomDef(
              data
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMeetingRoomDef(
              data
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteMeetingRoomDef (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => {
        return item.id
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${ids.length > 1 ? ids.length + '条记录' : '此记录'}吗?</p>`,
        onOk: () => {
          api.deleteMeetingRoomDef(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
