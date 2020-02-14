<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="群组名称" prop="msgGroupName">
              <Input type="text" v-model="searchForm.msgGroupName" clearable placeholder="请输入群组名称" style="width: 170px" />
            </Form-item>
            <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
            <Button @click="handleClear">清除</Button><!-- icon="ios-trash-outline"-->
        </Form>
        <Col span="24" class="operation btn_group">
          <Button @click="addData" type="primary" icon="md-add">新增</Button>
          <Button @click="delData()" :disabled="selectedList.length === 0" type="primary"
            icon="ios-download-outline">批量删除</Button>
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
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="80" :rules="dataFormValidate">
        <FormItem label="群组名称" prop="msgGroupName">
          <Input type="text" v-model="dataForm.msgGroupName" clearable placeholder="请输入群组名称" />
        </FormItem>
        <FormItem label="备注" prop="msgGroupRemark">
          <Input type="text" v-model="dataForm.msgGroupRemark" clearable placeholder="请输入备注" />
        </FormItem>
        <FormItem label="添加人员" prop="msgGroupMember">
          <Tag v-for="(item, index) in dataForm.msgGroupMember" color="primary" :closable="true" @on-close="deleteMember(index)" :key="index">{{item.msgGroupMemberName}}</Tag>
          <Button icon="ios-add" type="dashed" size="small" @click="addpersonnel=true">添加人员</Button>
        </FormItem>
        <FormItem label="是否公开" prop="msgGroupPublic">
          <i-switch v-model="dataForm.msgGroupPublic" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-if="isAuth('msg:group:save')" :loading="submitLoading" @click="submitForm">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <!--添加人员 start-->
    <Modal v-model="addpersonnel" title="选择对象" @on-ok="completeSelect" @on-cancel="addpersonnel=false">
      <Tabs v-if="addpersonnel">
        <TabPane label="学生">
          <div>
            <Input prefix="ios-search" placeholder="快速查找" style="width: 50%" />
          </div>
          <StudentTree @on-check-change="onStudentSelectCheck"/>
        </TabPane>
        <TabPane label="教师">
          <div>
            <Input prefix="ios-search" placeholder="快速查找" style="width: 50%" />
          </div>
           <TeacherTree @on-check-change="onTeacherSelectCheck"/>
        </TabPane>
      </Tabs>
    </Modal>
    <!--添加人员 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import TeacherTree from '@/view/components/teacher-tree'
import StudentTree from '@/view/components/student-tree'
import api from '@/api/msg'
export default {
  name: 'group',
  components: {
    Tables, TeacherTree, StudentTree
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      searchForm: {
        page: 1,
        limit: 10,
        msgGroupName: '',
        msgGroupStatus: ''
      },
      formModalVisible: false,
      modalTitle: '新增',
      addpersonnel: false,
      dataForm: {
        msgGroupName: '',
        msgGroupMember: [],
        msgGroupPublic: false,
        msgGroupRemark: '',
        id: undefined
      },
      selectedList: [],
      dataFormValidate: {
        msgGroupName: [{ required: true, message: '群组名称不能为空', trigger: 'blur' }],
        msgGroupMember: [{ type: 'array', required: true, message: '群组人员不能为空', trigger: 'blur' }]
      },
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '群组名称',
          key: 'msgGroupName',
          minWidth: 80
        },
        {
          title: '创建人',
          key: 'createUserId',
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
          className: 'font_color'
        },
        {
          title: '备注',
          key: 'msgGroupRemark',
          ellipsis: true,
          tooltip: true,
          minWidth: 80
        },
        {
          title: '公开',
          key: 'msgGroupPublic',
          minWidth: 120,
          render: (h, params) => {
            return h('div', params.row.msgGroupPublic ? '是' : '否')
          }
        },
        {
          title: '群组成员',
          key: 'msgGroupMemberStr',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
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
                      this.editData(params.row)
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
                      this.delData(params.row)
                    }
                  }
                },
                params.row.status === 0 ? '启用' : '禁用'
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      tmpReceiverList: []
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
    getDataList () {
      this.loading = true
      api.getMsgGroupList(this.searchForm).then(res => {
        this.pageData = res.page
        this.selectedList = []
        this.pageData.list.forEach(item => {
          let col = JSON.parse(item.msgGroupMember)
          let names = col.map(item => item.msgGroupMemberName)

          item.msgGroupMemberStr = names.join(',')
        })

        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$Message.error(err)
      })
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDataList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    submitForm () {
      if (this.submitLoading) return
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          data.msgGroupMember = JSON.stringify(data.msgGroupMember)
          // 新增保存
          if (!data.id) {
            api.saveMsgGroupData(
              data
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.handleSearch()
              }
            }).catch(err => {
              this.$Message.error('操作失败：', err)
              this.submitLoading = false
            })
          } else {
            api.updateMsgGroupData(
              data
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.handleSearch()
              }
            }).catch(err => {
              this.$Message.error('操作失败：', err)
              this.submitLoading = false
            })
          }
        }
      })
    },
    addData () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.msgGroupMember = []
      this.formModalVisible = true
    },
    editData (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      Object.keys(this.dataForm).forEach(key => {
        if (key === 'msgGroupMember' && entity[key]) {
          entity[key] = JSON.parse(entity[key])
        }
        this.dataForm[key] = entity[key]
      })

      this.formModalVisible = true
    },
    delData (row) {
      let ids = row ? [row.id] : this.selectedList.map(item => { return item.id })
      this.$Modal.confirm({
        title: '确认提示',
        content: `<p>您确定删除${
          ids.length > 1 ? ids.length + '条记录' : '此记录'
        }吗?</p>`,
        onOk: () => {
          api.deleteGroupData(ids).then(res => {
            this.$Message.success('操作成功！')
            this.handleSearch()
          })
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    deleteMember (index) {
      this.dataForm.msgGroupMember.splice(index, 1)
    },
    onStudentSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          if (item.type === 'student') {
            list.push({
              name: item.label,
              mobile: item.mobile,
              email: item.email,
              type: 'student',
              id: item.id
            })
          }
        })
        let teaList = this.tmpReceiverList.filter(item => item.type === 'tea')
        this.tmpReceiverList = [...teaList, ...list]
      }
    },
    onTeacherSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          if (item.type === 'tea') {
            list.push({
              name: item.label,
              mobile: item.mobile,
              email: item.email,
              type: 'tea',
              id: item.id
            })
          }
        })
        let studentList = this.tmpReceiverList.filter(item => item.type === 'student')
        this.tmpReceiverList = [...list, ...studentList]
      }
    },
    completeSelect () {
      let groupMemberArr = []
      this.tmpReceiverList.forEach(item => {
        groupMemberArr.push({
          msgGroupMemberId: item.id,
          msgGroupMemberName: item.name,
          mobile: item.mobile,
          email: item.email,
          msgGroupMemberType: item.type
        })
      })
      this.dataForm.msgGroupMember = [...groupMemberArr]
    }
  },
  mounted () {
    this.init()
  }
}
</script>
