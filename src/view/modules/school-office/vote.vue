<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="创建人ID" prop="createUserId">
                </FormItem>
                <FormItem label="人员类型：0-学生，1-教师" prop="userType">
                    <i-switch v-model="dataForm.userType">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="证件号" prop="userId">
                </FormItem>
                <FormItem label="学生ID/教师ID" prop="userCode">
                    <Input type="text" v-model="dataForm.userCode" :maxlength="20" placeholder="请输入学生ID/教师ID" />
                </FormItem>
                <FormItem label="学生姓名/教师姓名" prop="userName">
                    <Input type="text" v-model="dataForm.userName" :maxlength="50" placeholder="请输入学生姓名/教师姓名" />
                </FormItem>
                <FormItem label="报名留言" prop="applyMsg">
                    <Input type="textarea" v-model="dataForm.applyMsg" :autosize="{minRows: 4,maxRows: 6}" :maxlength="2000" placeholder="请输入报名留言" />
                </FormItem>
                <FormItem label="报名状态：0-初始化，1-同意" prop="applyAuditStatus">
                    <i-switch v-model="dataForm.applyAuditStatus">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="审批人员ID" prop="applyAuditUserId">
                </FormItem>
                <FormItem label="是否已经邮件提醒" prop="emailedFlag">
                    <i-switch v-model="dataForm.emailedFlag">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="saveOfficeActivityApply">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
    export default {
        name: 'OfficeActivityApply-form',
        data () {
            // const validateDicType = (rule, value, callback) => {
            //   if (!this.dataForm.dicValue) {
            //     callback(new Error('编码不能为空'))
            //   } else {
            //     api.validateDicValue(this.dataForm).then(res => {
            //       if (!res.result) {
            //         callback(new Error('编码已经存在'))
            //       } else {
            //         callback()
            //       }
            //     })
            //   }
            // }
            return {
                formModalVisible: false,
                loading: false,
                modalTitle: '',
                dataForm: {
                createUserId: '',
                userType: '',
                userId: '',
                userCode: '',
                userName: '',
                applyMsg: '',
                applyAuditStatus: '',
                applyAuditUserId: '',
                emailedFlag: '',
              id: undefined
                },
                dataFormValidate: {
                        userType: [
                        { required: true, message: '人员类型：0-学生，1-教师不能为空', trigger: 'blur' }
                    ],
                            userId: [
                        { required: true, message: '证件号不能为空', trigger: 'blur' }
                    ],
                            userCode: [
                        { required: true, message: '学生ID/教师ID不能为空', trigger: 'blur' }
                    ],
                            userName: [
                        { required: true, message: '学生姓名/教师姓名不能为空', trigger: 'blur' }
                    ],
                                applyAuditStatus: [
                        { required: true, message: '报名状态：0-初始化，1-同意,2-不同意不能为空', trigger: 'blur' }
                    ],
                                emailedFlag: [
                        { required: true, message: '是否已经邮件提醒不能为空', trigger: 'blur' }
                    ],
                            formItem_: [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                        { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' },
                        { type: 'string', min: 20, message: '不能超过20个字符', trigger: 'blur' },
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
            addOfficeActivityApply () {
                this.modalTitle = '新增'
      this.$refs.dataForm.resetFields() 
                this.dataForm.id = undefined
                this.formModalVisible = true
            },
            editOfficeActivityApply (id) {
        this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields() 
             this.loading = true
        api.getOfficeActivityApplyInfo(id).then(res => {
            let entity = res.officeActivityApply
        Object.keys(this.dataForm).forEach(key => {
            this.dataForm[key] = entity[key]
    })
    }).finally(() => {
            this.loading = false
    })
        this.formModalVisible = true
    },
    saveOfficeActivityApply () {
    this.$refs.dataForm.validate(valid => {
             if (valid) {
                 this.submitLoading = true
                 // 新增保存
                 let data = Object.assign({}, this.dataForm)
                 if (!data.id) {
                     api.saveOfficeActivityApply (data).then(res => {
               this.$Message.success('操作成功！') 
                  this.formModalVisible = false
                     this.$emit('update')
                 }).finally(() => {
                         this.submitLoading = false
                 })
                 } else {
                     api.updateOfficeActivityApply (data).then(res => {
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
