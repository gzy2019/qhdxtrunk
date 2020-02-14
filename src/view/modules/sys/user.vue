<style lang="less">
@import './role.less';
</style>
<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="用户名" prop="username">
          <Input type="text" v-model="searchForm.username" clearable placeholder="请输入用户名" style="width: 150px" />
        </Form-item>
        <Form-item label="用户状态" prop="status">
          <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px" @on-change="handleSearch">
            <Option value=1>正常</Option>
            <Option value=0>禁用</Option>
          </Select>
        </Form-item>
        <Form-item label="老师姓名" prop="teacherName">
          <Input type="text" v-model="searchForm.teacherName" clearable placeholder="请输入用户名" style="width: 150px" />
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row class="operation">
        <Col span="24" class="operation btn_group">
          <Button @click="addUser" v-if="isAuth('sys:user:save')" type="primary" icon="md-add">添加用户</Button>
          <Button @click="init" icon="md-refresh">刷新</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" border stripe editable v-model="userData" :columns="columns" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="totalCount" current.sync="currPage" :current="currPage" :page-size="limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 -->
    <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="userForm" :model="userForm" :label-width="80" :rules="userFormValidate">
        <FormItem label="用户名" prop="username">
          <Input v-model="userForm.username" placeholder="请填用户名称" />
        </FormItem>
        <FormItem label="密码" prop="userPsd" :required="modalType === 0">
          <Input v-model="userForm.userPsd" type="userPsd" placeholder="修改时可为空，保留原密码不变"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="userForm.email" />
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="userForm.mobile" />
        </FormItem>
        <FormItem label="角色" prop="roleIdList">
          <Select v-model="userForm.roleIdList" multiple>
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="userForm.status">
            <Radio v-for="(item, index) in statusList" :label="item.id" :key="index">{{ item.name }}</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" v-if="isAuth('sys:user:save')" :loading="submitLoading" @click="saveUserData">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/sys'
export default {
  name: 'usermanage',
  components: {
    Tables
  },
  data () {
    return {
      loading: true,
      modalType: 0,
      userModalVisible: false,
      modalTitle: '',
      statusList: [{ id: 1, name: '正常' }, { id: 0, name: '禁用' }],
      roleList: [],
      searchForm: {
        teacherName: '',
        username: '',
        status
      },
      userForm: {
        userId: '',
        username: '',
        userPsd: '',
        email: '',
        mobile: '',
        avator: '',
        status: 1,
        roleIdList: ''
      },
      userFormValidate: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        roleIdList: [{ required: true, type: 'array', min: 1, message: '角色不能为空', trigger: 'change' }]
      },
      submitLoading: false,
      selectList: [],
      selectCount: 0,
      columns: [
        // {
        //   type: 'selection',
        //   width: 45,
        //   align: 'center'
        // },
        {
          title: '用户ID',
          key: 'userId',
          width: 120
        },
        {
          title: '用户名',
          key: 'username',
          minWidth: 120,
          sortable: true
        },
        {
          title: '教师姓名',
          key: 'teacherName',
          minWidth: 120,
          sortable: true
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 120
        },
        {
          title: '手机',
          key: 'mobile',
          minWidth: 120
        },
        {
          title: '状态',
          key: 'status',
          minWidth: 100,
          render: (h, params) => {
            // type=0目录1菜单2按钮
            let status = params.row.status
            let statusColor = 'default'
            let tagName = ''
            if (status === 0) {
              statusColor = 'default'
              tagName = '禁用'
            } else if (status === 1) {
              statusColor = 'success'
              tagName = '正常'
            }
            return h('Tag', {
              props: {
                color: statusColor
              } }, tagName)
          }
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
                      this.edit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Icon',
                {
                  props: {
                    type: 'ios-remove-circle-outline',
                    size: '20'
                  },
                  on: {
                    click: () => {
                      this.updateUserStatus(params.row)
                    }
                  }
                },
                params.row.status === 0 ? '启用' : '禁用'
              )
            ])
          }
        }
      ],
      userData: [],
      totalCount: 0,
      currPage: 1,
      limit: 10
    }
  },
  methods: {
    init () {
      this.getUserList()
      this.getAllRoleList()
    },
    handleSearch () {
      this.totalCount = 0
      this.currPage = 1
      this.getUserList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.currPage = currentPage
      this.getUserList()
    },
    handlePageSize (limit) {
      this.limit = limit
      this.getUserList()
    },
    getAllRoleList () {
      api.getAllRoleList({}).then(res => {
        this.roleList = res.list
      })
    },
    getUserList () {
      this.loading = true
      api.getUserList({
        page: this.currPage,
        limit: this.limit,
        teacherName: this.searchForm.teacherName,
        username: this.searchForm.username,
        status: this.searchForm.status
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.userData = res.page.list
          this.totalCount = res.page.totalCount
          this.currPage = res.page.currPage
        }
      })
    },
    cancel () {
      this.userModalVisible = false
    },
    saveUserData () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (this.modalType === 0) {
            api.saveUserData(
              this.userForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.userModalVisible = false
                this.getUserList()
              } else {
                this.$Message.error('操作失败，请检查原因后重试！')
              }
            })
          } else if (this.modalType === 1) {
            api.updateUserData(
              this.userForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.userModalVisible = false
                this.getUserList()
              } else {
                this.$Message.error('操作失败，请检查原因后重试！')
              }
            })
          }
        }
      })
    },
    addUser () {
      this.modalType = 0
      this.modalTitle = '添加用户'
      this.$refs.userForm.resetFields()
      delete this.userForm.userId
      this.userModalVisible = true
      this.userFormValidate.userPsd = [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    },
    edit (v) {
      this.modalType = 1
      this.modalTitle = '编辑用户'
      this.$refs.userForm.resetFields()
      let str = JSON.stringify(v)
      let userInfo = JSON.parse(str)
      this.userForm = userInfo
      this.userModalVisible = true
      delete this.userFormValidate.userPsd
    },
    updateUserStatus (v) {
      this.$Modal.confirm({
        title: '确认' + (v.status === 0 ? '启用' : '禁用'),
        content: '您确认要' + (v.status === 0 ? '启用' : '禁用' + '用户 ') + v.username + ' ?',
        onOk: () => {
          let userStatusInfo = {
            userId: v.userId,
            status: v.status === 0 ? 1 : 0
          }
          api.updateUserStatus(
            userStatusInfo
          ).then(res => {
            if (res.code === 200) {
              this.$Message.success('操作成功！')
              this.getUserList()
            } else {
              this.$Message.error('操作失败，请检查原因后重试！')
            }
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
