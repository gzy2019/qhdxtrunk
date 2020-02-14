<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <FormItem label="姓名" prop="userName">
          <Input type="text" v-model="searchForm.userName" clearable placeholder="请输入姓名" style="width:100%" />
        </FormItem>
        <FormItem label="手机号" prop="userMobile">
          <Input type="text" v-model="searchForm.userMobile" clearable placeholder="请输入手机号" style="width:100%" />
        </FormItem>
        <FormItem label="性别" prop="userSex">
          <DicSelect v-model="searchForm.userSex" dtype="sex" :clearable="true" style="width:100%"></DicSelect>
        </FormItem>
        <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addData" type="primary" icon="md-add">新增</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="90" :rules="dataFormValidate">
        <FormItem label="真实姓名" prop="userName">
          <Input type="text" v-model="dataForm.userName" clearable placeholder="请输入真实姓名" />
        </FormItem>
        <FormItem label="手机号码" prop="userMobile">
          <Input type="text" v-model="dataForm.userMobile" clearable placeholder="请输入手机号" />
        </FormItem>
        <FormItem label="邮箱地址" prop="userEmail">
          <Input type="text" v-model="dataForm.userEmail" clearable placeholder="请输入邮箱地址" />
        </FormItem>
        <FormItem label="性别" prop="userSex">
          <DicSelect v-model="dataForm.userSex" dtype="sex" :clearable="true"></DicSelect>
        </FormItem>
        <FormItem label="密码" prop="userPsd">
          <Input type="password" v-model="dataForm.userPsd" clearable placeholder="请输入密码" />
        </FormItem>
        <FormItem label="确认密码" prop="userPsd2">
          <Input type="password" v-model="dataForm.userPsd2" clearable placeholder="请输入密码" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="saveUser" :loading="submitLoading">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <!-- 查看 start-->
    <Modal title="查看" v-model="modalView" footer-hide :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form :label-width="90">
        <FormItem label="手机号码">
          {{dataForm.userMobile}}
        </FormItem>
        <FormItem label="真实姓名">
          {{dataForm.userName}}
        </FormItem>
        <FormItem label="邮箱地址">
          {{dataForm.userEmail}}
        </FormItem>
        <FormItem label="性别">
          <DicSelect v-model="dataForm.userSex" dtype="sex" disabled style="width: 150px"></DicSelect>
        </FormItem>
      </Form>
    </Modal>
    <!-- 查看 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import dicUtil from '@/libs/dicUtil'
import DicSelect from '@/view/components/dic-select'
import api from '@/api/mpah/user'
export default {
  name: 'mpahUserInformation',
  components: {
    Tables, dicUtil, DicSelect
  },
  data () {
    return {
      loading: false,
      deletes: false,
      modalView: false,
      formModalVisible: false,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        userName: '',
        userMobile: '',
        userSex: ''
      },
      dataForm: {
        userName: '',
        userMobile: '',
        userEmail: '',
        userSex: '',
        userPsd: '',
        userPsd2: '',
        id: undefined
      },
      dataFormValidate: {
        userName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
        userEmail: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        userMobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      selectList: [],
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '用户编号',
          key: 'id',
          minWidth: 100
        },
        {
          title: '姓名',
          key: 'userName',
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '手机号',
          key: 'userMobile',
          minWidth: 120
        },
        {
          title: '性别',
          key: 'userSexStr',
          minWidth: 120
        },
        {
          title: '邮箱',
          key: 'userEmail',
          minWidth: 180
        },
        {
          title: '创建日期',
          key: 'createTime',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '是否启用',
          key: 'enable',
          minWidth: 100,
          render: (h, params) => {
            return h('i-switch',
              {
                props: {
                  value: params.row.enabled
                },
                on: {
                  'on-change': (val) => {
                    this.changeStatus(params.row, val)
                  },
                  input: (val) => {
                    params.row.enabled = val
                  }
                }
              })
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Icon',
                {
                  props: {
                    type: 'ios-eye-outline',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.viewData(params.row)
                    }
                  }
                },
                '查看'
              ),
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
              )
            ])
          }
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      }
    }
  },
  methods: {
    init () {
      this.getMpaUserList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getMpaUserList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getMpaUserList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getMpaUserList () {
      this.loading = true
      api.getMpaUserList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          dicUtil.setDicName(res.page.list, [
            { type: 'sex', key: 'userSex' }
          ])
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addData () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.dataFormValidate.userPsd = [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      this.dataFormValidate.userPsd2 = [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      this.formModalVisible = true
      this.modalView = false
    },
    editData (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      Object.keys(this.dataForm).forEach(key => {
        this.dataForm[key] = entity[key]
      })
      this.dataForm.userPsd = ''
      this.dataForm.userPsd2 = ''
      delete this.dataFormValidate.userPsd
      delete this.dataFormValidate.userPsd2
      this.formModalVisible = true
      this.modalView = false
    },
    viewData (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      Object.keys(this.dataForm).forEach(key => {
        this.dataForm[key] = entity[key]
      })
      this.modalView = true
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteData () {
      if (this.selectedList.length === 0) {
        this.$Message.info('请选择一条记录')
        return
      }
      let ids = []
      this.selectedList.map(item => {
        ids.push(item.id)
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteMpaUser(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    changeStatus (obj, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          api.updateMpaUser({
            id: obj.id,
            enabled: value2
          }).then(res => {
            this.$Message.success('修改成功!')
            value.enabled = value2
          })
        },
        onCancel: () => {
          value.enabled = !value2
        }
      })
    },
    saveUser () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMpaUser(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.handleSearch()
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMpaUser(
              this.dataForm
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
    }
  },
  mounted () {
    this.init()
  }
}
</script>
