<style lang="less">
@import './style.less';
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="addRootChannel()" v-if="isAuth('sys:cmschannel:save')" type="primary" icon="md-add">添加一级栏目</Button>
        <Button @click="addSubChannel()" v-if="isAuth('sys:cmschannel:save')" type="primary" icon="md-add">添加下级栏目</Button>
        <Button @click="deleteChannel()" v-if="isAuth('sys:cmschannel:delete')" type="error" icon="md-trash">批量删除栏目</Button>
      </Row>
      <Row type="flex" justify="start" class="code-row-bg" style="margin-top:10px">
        <Col span="10">
          <div class="tree-bar">
            <Tree ref="tree" :data="treeData" show-checkbox :check-strictly="true" :multiple="false" @on-check-change="checkSelectHandle" @on-select-change="selectTreeHandle"></Tree>
          </div>
          <Spin size="large" fix v-if="loading"></Spin>
        </Col>
        <Col span="10" style="margin-left:10px">
        <Form ref="channelForm" :model="channelForm" :label-width="85" :rules="channelFormValidate">
          <Alert show-icon v-show="channelForm.id" >
            当前选择的节点：
            <span class="select-title"><b>{{channelForm.channelName}}</b></span>
            <a class="select-clear" @click="handleFormReset">取消选择</a>
          </Alert>
          <FormItem v-show="channelForm.parentName" label="父节点名称" prop="parentName">
            <Input v-model="channelForm.parentName" readonly />
          </FormItem>
          <FormItem label="栏目名称" prop="channelName">
            <Input v-model="channelForm.channelName" placeholder="栏目名称" :maxlength="100" />
          </FormItem>
          <FormItem label="栏目描述" prop="channelDesc">
            <Input type="textarea" :rows="4" v-model="channelForm.channelDesc" :maxlength="260" placeholder="栏目描述" />
          </FormItem>
          <FormItem label="排序" prop="ordchannelOrderNumerNum">
            <InputNumber :max="1000" :min="1" v-model="channelForm.channelOrderNum"></InputNumber>
            <span style="margin-left:5px">值越小越靠前</span>
          </FormItem>
          <Form-item>
            <Button style="margin-right:5px" v-if="isAuth('sys:cmschannel:save') || isAuth('sys:cmschannel:update')" @click="submitForm" :loading="submitLoading" type="primary" icon="ios-create-outline">保存</Button>
            <Button @click="handleFormReset()">重置</Button>
          </Form-item>
        </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import api from '@/api/channel'
export default {
  name: 'cmsChannel',
  data () {
    return {
      loading: true,
      checkList: [],
      selectedNode: undefined,
      searchKey: '',
      channelForm: {
        channelName: '',
        channelParentId: undefined,
        channelOrderNum: 1,
        channelDesc: ''
      },
      channelFormValidate: {
        channelName: [{ required: true, message: '栏目名称不能为空', trigger: 'blur' }]
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
      api.getCmsChannelTree({}).then(res => {
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
      api.getCmsChannelInfo(curNode.value).then(res => {
        this.channelForm.id = res.cmsChannel.id
        this.channelForm.channelName = res.cmsChannel.channelName
        this.channelForm.channelParentId = res.cmsChannel.channelParentId
        this.channelForm.channelOrderNum = res.cmsChannel.channelOrderNum
        this.channelForm.channelDesc = res.cmsChannel.channelDesc
        this.channelForm.parentName = res.cmsChannel.parentName
      })
    },
    submitForm () {
      this.$refs.channelForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let ctx = this
          let callback = (res) => {
            ctx.submitLoading = false
            if (res.code === 200) {
              ctx.$Message.success('操作成功！')
              ctx.loadTreeData()
            } else {
              ctx.$Message.error('操作失败，请检查原因后重试！')
            }
          }
          if (this.channelForm.id) {
            api.updateCmsChannel(this.channelForm).then(res => {
              callback(res)
            })
          } else {
            api.saveCmsChannel(this.channelForm).then(res => {
              callback(res)
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
      this.$refs.channelForm.resetFields()
      delete this.channelForm.id
      this.channelForm.channelName = ''
      this.channelForm.channelParentId = undefined
      this.channelForm.channelOrderNum = 1
      this.channelForm.channelDesc = ''
      this.channelForm.parentName = ''
    },
    addSubChannel () {
      if (!this.selectedNode) {
        this.$Message.warning({
          content: '请先点击栏目名称，选择一个节点！',
          top: '650'
        })
        return false
      }

      this.channelForm.channelParentId = this.channelForm.id
      this.channelForm.parentName = this.channelForm.channelName
      delete this.channelForm.id
      this.channelForm.channelName = ''
      this.channelForm.channelOrderNum = 1
      this.channelForm.channelDesc = ''
    },
    addRootChannel (name) {
      this.handleFormReset()
    },
    checkSelectHandle (v) {
      this.checkList = v
    },
    deleteChannel () {
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

          api.deleteCmsChannel(ids).then(res => {
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
