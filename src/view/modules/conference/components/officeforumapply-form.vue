<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <!-- <FormItem label="创建人ID" prop="createUserId">
          </FormItem> -->
          <FormItem label="姓名" prop="applicantName">
            <Input type="text" v-model="dataForm.applicantName" :maxlength="200" placeholder="请输入姓名" />
          </FormItem>
          <FormItem label="性别" prop="applicantSex">
            <Select v-model="dataForm.applicantSex" :maxlength="200" >
              <Option :value="0">男</Option>
              <Option :value="1">女</Option>
            </Select>
          </FormItem>
          <FormItem label="论坛活动" prop="forumId">
            <Select v-model="dataForm.forumId" clearable>
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.forumName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="手机号" prop="applicantPhone">
            <Input type="text" v-model="dataForm.applicantPhone"  :maxlength="200" placeholder="请输入手机号" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">取消</Button>
          <Button type="primary" :loading="submitLoading" @click="saveOfficeForumApply">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->
    </div>
</template>

<script>
import apply from '@/api/officeforum/officeforuminfo'
import api from '@/api/officeforum/officeforumapply'
export default {
  name: 'OfficeForumApply-form',
  components: { apply },
  data () {
    return {
      projectList: [],
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        // createUserId: '',
        applicantName: '',
        applicantSex: '',
        forumId: '',
        applicantPhone: '',
        id: null
      },
      dataFormValidate: {
        applicantName: [
          { type: 'string', required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        applicantSex: [
          { type: 'number', required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        // forumId: [
        //   { type: 'number', required: true, message: '论坛活动ID不能为空', trigger: 'blur' }
        // ],
        applicantPhone: [
          { type: 'string', required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        formItem_: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' },
          { type: 'string', min: 20, message: '不能超过20个字符', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      apply.getOfficeForumInfoList({limit: 100}).then(res => {
        this.projectList = res.page.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addOfficeForumApply () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editOfficeForumApply (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeForumApplyInfo(id).then(res => {
        let entity = res.officeForumApply
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveOfficeForumApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveOfficeForumApply(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateOfficeForumApply(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}

</script>
