<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <!-- <FormItem label="创建人ID" prop="createUserId">
            {{dataForm.createUserId}}
        </FormItem> -->
        <FormItem label="论坛名字" prop="forumName">
          <Input type="text" v-model="dataForm.forumName" :maxlength="200" placeholder="请输入论坛名字" />
        </FormItem>
        <FormItem label="举办日期" prop="startDate">
          <IDatePicker type="date" v-model="dataForm.startDate" format="yyyy-MM-dd" placeholder="请输入举办日期" />
        </FormItem>
        <FormItem label="举办地点" prop="forumAddress">
          <Input type="text" v-model="dataForm.forumAddress" :maxlength="200" placeholder="请输入举办地点" />
        </FormItem>
        <FormItem label="限报人数" prop="applyAmount">
          <Input type="text" v-model="dataForm.applyAmount" :maxlength="200" placeholder="请输入备注" />
        </FormItem>
        <FormItem label="备注" prop="forumDesc">
          <Input type="text" v-model="dataForm.forumDesc" :maxlength="200" placeholder="请输入备注" />
        </FormItem>
        <FormItem label="是否开放报名" prop="batchOpenFlag">
          <i-switch v-model="dataForm.batchOpenFlag">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">取消</Button>
          <Button type="primary" :loading="submitLoading" @click="saveOfficeForumInfo">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->
    </div>
</template>

<script>
import api from '@/api/officeforum/officeforuminfo'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'OfficeForumInfo-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        // createUserId: '',
        forumName: '',
        startDate: '',
        forumAddress: '',
        forumDesc: '',
        batchOpenFlag: false,
        applyAmount: '',
        id: null
      },
      dataFormValidate: {
        forumName: [
          { required: true, message: '论坛名字不能为空', trigger: 'blur' }
        ],
        startDate: [
          { type: 'string', required: true, message: '举办日期不能为空', trigger: 'blur' }
        ],
        forumAddress: [
          { required: true, message: '举办地点不能为空', trigger: 'blur' }
        ],
        forumDesc: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ],
        // batchOpenFlag: [
        //   { type: 'number', required: true, message: '是否开放报名不能为空', trigger: 'blur' }
        // ],
        applyAmount: [
          { type: 'string', required: true, message: '限报人数不能为空', trigger: 'blur' }
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

    },
    cancel () {
      this.formModalVisible = false
    },
    addOfficeForumInfo () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editOfficeForumInfo (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getOfficeForumInfoInfo(id).then(res => {
        let entity = res.officeForumInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveOfficeForumInfo () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveOfficeForumInfo(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateOfficeForumInfo(data).then(res => {
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
