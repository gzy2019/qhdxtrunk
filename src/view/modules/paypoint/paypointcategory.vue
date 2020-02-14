
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="addRootCategory()" v-if="isAuth('paypoint:paypointcategory:save')" type="primary" icon="md-add" style="margin-right:5px;">添加一级分类</Button>
        <Button @click="addSubCategory()" v-if="isAuth('paypoint:paypointcategory:save')" type="primary" icon="md-add" style="margin-right:5px;">添加下级分类</Button>
        <Button @click="deleteCategory()" v-if="isAuth('paypoint:paypointcategory:delete')" type="error" icon="md-trash">批量删除分类</Button>
      </Row>
      <Row type="flex" justify="start" class="code-row-bg" style="margin-top:10px">
        <Col span="10">
          <div class="tree-bar">
            <Tree ref="tree" :data="treeData" show-checkbox :check-strictly="true" :multiple="false" @on-check-change="checkSelectHandle" @on-select-change="selectTreeHandle"></Tree>
          </div>
          <Spin size="large" fix v-if="loading"></Spin>
        </Col>
        <Col span="10" style="margin-left:10px">
        <Form ref="dataForm" :model="dataForm" :label-width="85" :rules="dataFormValidate">
          <Alert show-icon v-show="dataForm.id" >
            当前选择的节点：
            <span class="select-title"><b>{{dataForm.name}}</b></span>
            <a class="select-clear" @click="handleFormReset">取消选择</a>
          </Alert>
          <FormItem v-show="dataForm.parentName" label="父节点名称" prop="parentName">
            <Input v-model="dataForm.parentName" readonly />
          </FormItem>
          <FormItem label="分类名称" prop="name">
            <Input v-model="dataForm.name" placeholder="分类名称" :maxlength="100" />
          </FormItem>
          <FormItem label="分类描述" prop="memo">
            <Input type="textarea" :rows="4" v-model="dataForm.memo" :maxlength="300" placeholder="分类描述" />
          </FormItem>
          <FormItem label="排序" prop="ordchannelOrderNumerNum">
            <InputNumber :max="1000" :min="1" v-model="dataForm.orderNum"></InputNumber>
            <span style="margin-left:5px">值越小越靠前</span>
          </FormItem>
          <Form-item>
            <Button style="margin-right:5px" v-if="isAuth('paypoint:paypointcategory:save') || isAuth('paypoint:paypointcategory:update')" @click="submitForm" :loading="submitLoading" type="primary" icon="ios-create-outline">保存</Button>
            <Button @click="handleFormReset()">重置</Button>
          </Form-item>
        </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import api from '@/api/paypoint/paypointcategory'
export default {
  name: 'paypointCategory',
  data () {
    return {
      loading: true,
      checkList: [],
      selectedNode: undefined,
      searchKey: '',
      dataForm: {
        name: '',
        parentId: undefined,
        orderNum: 1,
        memo: ''
      },
      dataFormValidate: {
        name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      treeData: []
    }
  },
  mounted () {
    this.loadTreeData()
  },
  methods: {
    loadTreeData () {
      this.loading = true
      api.getPaypointCategoryTree({}).then(res => {
        this.handleList2Tree(res.list)
        this.loading = false
      })
    },
    handleList2Tree (list) {
      this.treeData = []
      if (list) {
        let travelFunc = function (item) {
          item.title = item.label
          item.expand = true
          delete item.label
          if (item.children) {
            item.children.map(child => {
              travelFunc(child)
            })
          }
        }

        list.map(item => {
          travelFunc(item)
        })
        this.treeData = list
      }
    },
    selectTreeHandle (nodes, curNode) {
      this.selectedNode = curNode
      api.getPaypointCategoryInfo(curNode.value).then(res => {
        this.dataForm.id = res.paypointCategory.id
        this.dataForm.name = res.paypointCategory.name
        this.dataForm.parentId = res.paypointCategory.parentId
        this.dataForm.orderNum = res.paypointCategory.orderNum
        this.dataForm.memo = res.paypointCategory.memo
        this.dataForm.parentName = res.paypointCategory.parentName
      })
    },
    submitForm () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.dataForm.id) {
            api.updatePaypointCategory(this.dataForm).then(res => {
              this.$Message.success('操作成功！')
              this.loadTreeData()
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.savePaypointCategory(this.dataForm).then(res => {
              this.$Message.success('操作成功！')
              this.loadTreeData()
            }).finally(() => {
              this.submitLoading = false
            })
          }
        }
      })
    },
    handleFormReset () {
      let node = this.$refs.tree.getSelectedNodes()[0]
      if (node) {
        this.$set(node, 'selected', !node.selected)
      }
      this.selectedNode = undefined
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      this.dataForm.name = ''
      this.dataForm.parentId = undefined
      this.dataForm.orderNum = 1
      this.dataForm.memo = ''
      this.dataForm.parentName = ''
    },
    addSubCategory () {
      if (!this.selectedNode) {
        this.$Message.warning({
          content: '请先点击分类名称，选择一个节点！',
          top: '650'
        })
        return false
      }

      this.dataForm.parentId = this.dataForm.id
      this.dataForm.parentName = this.dataForm.name
      delete this.dataForm.id
      this.dataForm.name = ''
      this.dataForm.orderNum = 1
      this.dataForm.memo = ''
    },
    addRootCategory (name) {
      this.handleFormReset()
    },
    checkSelectHandle (v) {
      this.checkList = v
    },
    deleteCategory () {
      if (this.checkList.length <= 0) {
        this.$Message.warning('请勾选要删除的节点！')
        return false
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '确认要删除所选的 ' + this.checkList.length + ' 条数据?',
        onOk: () => {
          let ids = []
          this.checkList.forEach(function (e) {
            ids.push(e.value)
          })

          api.deletePaypointCategory(ids).then(res => {
            if (res.code === 200) {
              this.$Message.success('操作成功！')
              this.loadTreeData()
            } else {
              this.$Message.error('操作失败，请检查原因后重试！')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search {
    .operation {
        margin-bottom: 2vh;
    }
    .select-count {
        font-size: 13px;
        font-weight: 600;
        color: #40a9ff;
    }
    .select-title {
        font-size: 12px;
        font-weight: 600;
        color: #40a9ff;
    }
    .select-clear {
        margin-left: 10px;
    }
    .page{
        margin-top: 2vh;
    }
    .drop-down{
        font-size: 13px;
        margin-left: 5px;
    }
}

.ivu-poptip {
    display: inline-block;
    width: 100%;
}

.ivu-poptip-rel {
    display: inline-block;
    position: relative;
    width: 100%;
}

.tree-bar {
    min-height: 450px;
    overflow: auto;
    margin-top: 5px;
}

.tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
}
</style>
