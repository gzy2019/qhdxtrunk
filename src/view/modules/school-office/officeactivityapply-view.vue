<template>
    <div>
        <!-- 查看 start-->
        <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="120">
                <Row>
                    <Col span="12">
                        <FormItem label="创建人ID" prop="createUserId">
                            {{dataForm.createUserId}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="人员类型：0-学生，1-教师" prop="userType">
                            {{dataForm.userType}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="证件号" prop="userId">
                            {{dataForm.userId}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="学生ID/教师ID" prop="userCode">
                            {{dataForm.userCode}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="学生姓名/教师姓名" prop="userName">
                            {{dataForm.userName}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="报名留言" prop="applyMsg">
                            {{dataForm.applyMsg}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="报名状态：0-初始化，1-同意,2-不同意" prop="applyAuditStatus">
                            {{dataForm.applyAuditStatus}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="审批人员ID" prop="applyAuditUserId">
                            {{dataForm.applyAuditUserId}}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="是否已经邮件提醒" prop="emailedFlag">
                            {{dataForm.emailedFlag}}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button @click="cancel">关闭</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
    export default {
        name: 'OfficeActivityApply-view',
        data() {
            return {
                formModalVisible: false,
                loading: false,
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
                }
            }
        },
        mounted () {

        },
        methods: {
            init (id) {
               if(id) this.viewOfficeActivityApply(id)
            },
            cancel () {
                this.formModalVisible = false
            },
            viewOfficeActivityApply (id) {
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
            }
        }
    }
</script>
