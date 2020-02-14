<style lang="less">
@import './role.less';
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button v-if="isAuth('sys:role:save')" @click="addRole" type="primary" icon="md-add">添加角色</Button>
        <!-- <Button @click="delAll" icon="md-trash">批量删除</Button> -->
        <Button @click="init" icon="md-refresh" style="margin-left: 10px;">批量刷新</Button>
      </Row>
      <!-- <Row>
        <Alert show-icon>
          已选择 <span class="select-count">{{selectCount}}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </Row> -->
      <Row>
        <tables :loading="loading" ref="table" size="small" border stripe editable v-model="roleData" :columns="columns" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="totalCount" current.sync="currPage" :current="currPage" :page-size="limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 -->
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
      <Form ref="roleForm" :model="roleForm" :label-width="100" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="roleForm.roleName" :maxlength="100" placeholder="请填写角色名称" />
        </FormItem>
        <FormItem label="角色编码" prop="roleCode">
          <Input v-model="roleForm.roleCode" :maxlength="50" placeholder="请填写角色编码" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="roleForm.remark" :maxlength="200" />
        </FormItem>

        <div class="tree-bar" style="margin-left:10px">
          <Col span="4">
            <FormItem label="功能权限" prop="menuIdList"></FormItem>
          </Col>
          <Col span="8">
            <Tree ref="tree" :data="menuTreeData" show-checkbox @on-select-change="selectTree"></Tree>
            <Spin size="small" fix v-if="loading"></Spin>
          </Col>
        </div>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" v-if="isAuth('sys:role:save')" :loading="submitLoading" @click="saveRoleData">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/sys'
import { translateMenusToTree, translateMenusIdToArray, initMenuTreeChecked } from '@/libs/util'
export default {
  name: 'rolemanage',
  components: {
    Tables
  },
  data () {
    const validateCode = (rule, value, callback) => {
      if (!this.roleForm.roleCode) {
        callback(new Error('角色编码不能为空'))
      } else {
        api.validateRoleCode(this.roleForm).then(res => {
          if (!res.result) {
            callback(new Error('角色编码已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      loading: true,
      modalType: 0,
      roleModalVisible: false,
      modalTitle: '',
      roleForm: {
        roleId: '',
        roleName: '',
        roleCode: '',
        description: '',
        menuIdList: []
      },
      roleFormValidate: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleCode: [{ validator: validateCode, required: true, trigger: 'blur' }]
      },
      menuTreeDataOrg: [],
      menuTreeData: [],
      submitLoading: false,
      selectList: [],
      selectCount: 0,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'roleName',
          minWidth: 120
        },
        {
          title: '角色编码',
          key: 'roleCode',
          minWidth: 120
        },
        {
          title: '备注',
          key: 'remark',
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
                    type: 'ios-trash-outline',
                    size: '20'
                  },
                  on: {
                    click: () => {
                      this.del(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      roleData: [],
      totalCount: 0,
      currPage: 1,
      limit: 10
    }
  },
  methods: {
    init () {
      this.getAllMenuList()
    },
    changePage (currentPage) {
      this.currPage = currentPage
      this.getRoleList()
    },
    handlePageSize (limit) {
      this.limit = limit
      this.getRoleList()
    },
    getRoleList () {
      this.loading = true
      api.getRoleList({
        page: this.currPage,
        limit: this.limit
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.roleData = res.page.list
          this.totalCount = res.page.totalCount
          this.currPage = res.page.currPage
        }
      })
    },
    cancelRole () {
      this.roleModalVisible = false
    },
    saveRoleData () {
      let selectedMenus = this.$refs.tree.getCheckedAndIndeterminateNodes()
      this.roleForm.menuIdList = translateMenusIdToArray(selectedMenus)
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          if (!this.roleForm.menuIdList || !this.roleForm.menuIdList.length) {
            this.$Message.error('请选择角色权限')
            return false
          }
          this.submitLoading = true
          // 新增保存
          if (this.modalType === 0) {
            api.saveRoleData(
              this.roleForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.roleModalVisible = false
                this.getRoleList()
              } else {
                this.$Message.error('操作失败，请检查原因后重试！')
              }
            })
          } else if (this.modalType === 1) {
            api.updateRoleData(
              this.roleForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.roleModalVisible = false
                this.getRoleList()
              } else {
                this.$Message.error('操作失败，请检查原因后重试！')
              }
            })
          }
        }
      })
    },
    addRole () {
      this.modalType = 0
      this.modalTitle = '添加角色'
      this.$refs.roleForm.resetFields()
      delete this.roleForm.id
      this.menuTreeData = [...this.menuTreeDataOrg]
      this.menuTreeData = initMenuTreeChecked(this.menuTreeData, [])
      this.roleModalVisible = true
    },
    edit (v) {
      this.modalType = 1
      this.modalTitle = '编辑角色'
      this.$refs.roleForm.resetFields()
      let str = JSON.stringify(v)
      let roleInfo = JSON.parse(str)
      this.roleForm = roleInfo
      this.menuTreeData = [...this.menuTreeDataOrg]
      this.menuTreeData = initMenuTreeChecked(this.menuTreeData, this.roleForm.menuIdList)
      this.roleModalVisible = true
    },
    del (v) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除角色 ' + v.roleName + ' ?',
        onOk: () => {
          api.delRole({
            roleId: v.roleId
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success('操作成功！')
              this.getRoleList()
            } else {
              this.$Message.error('操作失败，请检查原因后重试！')
            }
          })
        }
      })
    },
    clearSelectAll () {
      this.$refs.table.selectAll(false)
    },
    changeSelect (e) {
      this.roleForm.menuIdList = translateMenusIdToArray(e)
    },
    getAllMenuList () {
      this.loading = true
      api.getMenuTree({}).then(res => {
        this.menuTreeDataOrg = translateMenusToTree(res.data, 2, 0)
        this.loading = false
        this.getRoleList()
      })
    },
    selectTree (selectedArr, selectedItem) {
      // console.log(JSON.stringify(selectedItem))
      // 当前选中的树节点
      // var ele = node[node.length - 1]
      // 设置为展开
      // selectedItem.expand = !selectedItem.expand || true
    }
  },
  mounted () {
    this.init()
  }
}
</script>
