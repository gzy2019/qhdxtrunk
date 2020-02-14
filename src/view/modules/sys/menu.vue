<template>
  <div>
    <div class="demo-split">
        <Split v-model="panelRate">
            <div slot="left" class="demo-split-pane">
              <Row class="operation">
                <Button @click="addRootMenu()" v-if="isAuth('sys:menu:save')"  type="primary" icon="md-add" style="margin-right: 5px;">添加根节点</Button>
                <Button @click="addSubMenu()" v-if="isAuth('sys:menu:save')"  type="primary" icon="md-add" style="margin-right: 5px;">添加子节点</Button>
                <Button @click="delAll()" v-if="isAuth('sys:menu:delete')" type="error" icon="md-trash" style="margin-right: 5px;">删除</Button>
              </Row>
              <div class="tree-bar" style="max-height: 460px;">
                <Tree ref="tree" :data="data" show-checkbox :multiple="false" @on-check-change="changeSelect" @on-select-change="selectTree" @on-toggle-expand="expandTree"></Tree>
              </div>
              <Spin size="large" fix v-if="loading"></Spin>
            </div>
            <div slot="right" class="demo-split-pane">
              <Form ref="menuForm" style="width: 500px;" :model="menuForm" :label-width="85" :rules="menuFormValidate">
                <Alert show-icon>
                当前选择的节点： <span class="select-title"><b>{{menuForm.name}}</b></span>
                <a class="select-clear" v-show="menuForm.menuId" @click="handleReset">取消选择</a>
                </Alert>
                <FormItem label="类型" prop="type">
                  <RadioGroup v-model="menuForm.type">
                    <Radio v-for="(item, index) in menuTypeList" :disabled="item.disabled" :label="item.id" :key="index">{{ item.name }}</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="父节点名称" prop="parentName">
                  <Input v-model="menuForm.parentName" readonly></Input>
                </FormItem>
                <FormItem :label="menuTypeList[menuForm.type].name + '名称'" prop="name">
                  <Input v-model="menuForm.name" :placeholder="menuTypeList[menuForm.type].name + '名称'"></Input>
                </FormItem>
                <FormItem v-if="menuForm.type !== 2" label="菜单路由" prop="url">
                  <Input v-model="menuForm.url" placeholder="菜单路由"></Input>
                </FormItem>
                <FormItem v-if="menuForm.type !== 0" label="授权标识" prop="perms">
                  <Input v-model="menuForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></Input>
                </FormItem>
                <FormItem v-if="menuForm.type !== 2" label="菜单图标" prop="icon">
                  <Input :icon="menuForm.icon" v-model="menuForm.icon" placeholder="菜单图标名称"></Input>
                </FormItem>
                <FormItem v-if="menuForm.type !== 2" label="显示状态" prop="isHide">
                  <RadioGroup v-model="menuForm.isHide">
                    <Radio v-for="(item, index) in menuIsHideList" :label="item.id" :key="index">{{ item.name }}</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem v-if="menuForm.type !== 2" label="排序号" prop="orderNum">
                  <InputNumber :max="1000" :min="0" v-model="menuForm.orderNum"></InputNumber>
                  <span style="margin-left:5px">值越小越靠前</span>
                </FormItem>
                <Form-item>
                  <Button style="margin-right:5px" v-if="isAuth('sys:menu:save') || isAuth('sys:menu:update')" @click="saveMenu" :loading="submitLoading" type="primary" icon="ios-create-outline">保存</Button>
                  <Button @click="handleReset()" >重置</Button>
                </Form-item>
              </Form>
            </div>
        </Split>
      </div>
    </div>
</template>

<script>
import api from '@/api/sys'
import { translateMenusToTree } from '@/libs/util'
export default {
  name: 'menu-manage',
  data () {
    return {
      panelRate: 0.35,
      loading: true,
      selectList: [],
      selectCount: 0,
      menuTypeList: [{ id: 0, name: '目录', disabled: true }, { id: 1, name: '菜单', disabled: true }, { id: 2, name: '按钮', disabled: true }],
      menuIsHideList: [{ id: 0, name: '显示' }, { id: 1, name: '隐藏' }],
      menuForm: {
        menuId: 0,
        parentId: 0,
        parentName: '',
        name: '',
        url: '',
        perms: '',
        type: 0,
        icon: '',
        orderNum: 0,
        isHide: 0
      },
      menuFormValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '路由不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      data: [],
      selectedId: '',
      expandIds: []
    }
  },
  methods: {
    getAllMenuList () {
      this.loading = true
      api.getMenuTree({}).then(res => {
        this.data = translateMenusToTree(res.data, 1, 0)
        this.loading = false
        this.handleExpandStatus()
        this.handleSelectStatus()
      })
    },
    search () {

    },
    handleSelectStatus () {
      if (this.data && this.data.length) {
        let ctx = this
        let func = function (list) {
          list.forEach(item => {
            item.selected = (item.menuId === ctx.selectedId)
            if (item.selected) ctx.selectTree([item])
            if (item.children) {
              func(item.children)
            }
          })
        }
        func(this.data)
      }
    },
    handleExpandStatus () {
      if (this.data && this.data.length) {
        let ctx = this
        let func = function (list) {
          list.forEach(item => {
            let index = ctx.expandIds.findIndex(v => v === item.menuId)
            item.expand = (index >= 0)
            if (item.children) func(item.children)
          })
        }
        func(this.data)
      }
    },
    expandTree (node) {
      let index = this.expandIds.findIndex(v => v === node.menuId)
      if (index >= 0) this.expandIds.splice(index, 1)
      if (node.expand) {
        this.expandIds.push(node.menuId)
      }
    },
    selectTree (node) {
      let menu = node || []
      if (menu.length > 0) {
        this.selectedId = menu[0].menuId
        for (let key in this.menuForm) {
          this.menuForm[key] = menu[0][key]
        }
      } else {
        this.handleReset()
      }
      this.menuTypeList.map(item => {
        item.disabled = true
      })
    },
    saveMenu () {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.menuForm.menuId) {
            api.updateMenu(
              this.menuForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.getAllMenuList()
            })
          } else {
            api.saveMenu(
              this.menuForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.getAllMenuList()
            })
          }
        }
      })
    },
    handleReset () {
      let node = this.$refs.tree.getSelectedNodes()[0]
      if (node) {
        this.$set(node, 'selected', !node.selected)
      }
      this.$refs.menuForm.resetFields()
      this.menuForm.menuId = 0
      this.menuForm.parentId = 0
      this.menuForm.perms = ''
      this.menuForm.url = ''
      this.menuForm.isHide = 0
    },
    checkMenuType (parentType) {
      console.log(parentType)
      this.menuTypeList.map(item => {
        // 父节点是目录，子节点不能为按钮
        if (parentType === 0 && item.id === 2) {
          item.disabled = true
        } else if (parentType === 1) {
          item.disabled = true
          this.menuForm.type = 2
        } else if (parentType === 2) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    addSubMenu () {
      if (this.menuForm.menuId === '' || this.menuForm.menuId === null || this.menuForm.menuId === 0) {
        this.$Message.warning({
          content: '请先点击菜单名称，选择一个节点！',
          top: '650'
        })
        return false
      }
      let parentId = this.menuForm.menuId
      let parentName = this.menuForm.name
      let parentType = this.menuForm.type
      if (parentType === 2) {
        this.$Message.warning({
          content: '按钮下不能再添加子节点！',
          top: '650'
        })
        return false
      }
      this.handleReset()
      this.checkMenuType(parentType)

      if (parentType === 0) {
        this.menuForm.type = 1
      }
      this.menuForm.parentId = parentId
      this.menuForm.parentName = parentName
    },
    addRootMenu (name) {
      // 清空Form
      let parentType = this.menuForm.type
      this.handleReset()
      this.checkMenuType(parentType)
    },
    changeSelect (v) {
      this.selectCount = v.length
      this.selectList = v
    },
    delAll () {
      if (this.selectCount <= 0) {
        this.$Message.warning('请勾选要删除的节点！')
        return false
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '确认要删除所选的 ' + this.selectCount + ' 条数据?',
        onOk: () => {
          let ids = []
          this.selectList.forEach(function (e) {
            ids.push(e.menuId)
          })
          api.deleteMenu(ids).then(res => {
            this.$Message.success('操作成功！')
            this.getAllMenuList()
          })
        }
      })
    }
  },
  mounted () {
    this.getAllMenuList()
  }
}
</script>
<style>
  .demo-split{
    height: 550px;
    border: 1px solid #dcdee2;
  }
  .demo-split-pane{
    padding: 10px;
  }
</style>
