<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="130" :rules="dataFormValidate">
                <FormItem label="部门" prop="paypointDepartmentId">
                  <Select v-model="dataForm.paypointDepartmentId" placeholder="请选择">
                    <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="dataForm.name" :maxlength="200" placeholder="请输入名称" />
                </FormItem>
                <FormItem label="编码" prop="code">
                    <Input type="text" v-model="dataForm.code" :maxlength="50" placeholder="请输入编码" />
                </FormItem>
                <FormItem label="参与人事工作量统计" prop="joinStats">
                    <i-switch v-model="dataForm.joinStats">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="类型" prop="category">
                  <Select v-model="dataForm.category" placeholder="请选择">
                    <Option :value="0">课酬</Option>
                    <Option :value="1">公共服务</Option>
                    <Option :value="2">其它</Option>
                  </Select>
                </FormItem>
                <FormItem label="参与统计类型" prop="statsCategory">
                    <Select v-model="dataForm.statsCategory" placeholder="请选择">
                      <Option :value="0">授课统计</Option>
                      <Option :value="1">指导学生统计</Option>
                      <Option :value="2">公共服务统计</Option>
                      <Option :value="3">培训部统计</Option>
                    </Select>
                </FormItem>
                <FormItem label="说明" prop="memo">
                    <Input type="text" v-model="dataForm.memo" :maxlength="300" placeholder="请输入说明" />
                </FormItem>
                <FormItem label="是否已发放" prop="sendFlag">
                    <i-switch v-model="dataForm.sendFlag">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="savePaypointBatch">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/paypoint/paypointbatch'
import departmentapi from '@/api/paypoint/paypointdepartment'
export default {
  name: 'PaypointBatch-form',
  data () {
    const validateCode = (rule, value, callback) => {
      if (!this.dataForm.code) {
        callback(new Error('编码不能为空'))
      } else {
        let data = Object.assign({}, this.dataForm)
        delete data.categoryIdPath
        api.validateCode(data).then(res => {
          if (!res.result) {
            callback(new Error('编码已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      departmentList: [],
      dataForm: {
        paypointDepartmentId: '',
        name: '',
        code: '',
        joinStats: true,
        category: null,
        statsCategory: null,
        memo: '',
        sendFlag: true,
        id: undefined
      },
      dataFormValidate: {
        paypointDepartmentId: [
          { type: 'number', required: true, message: '部门不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, required: true, trigger: 'blur' }
        ],
        category: [
          { type: 'number', required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        statsCategory: [
          { type: 'number', required: true, message: '统计类型不能为空', trigger: 'blur' }
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
      this.loadDepartmentList()
    },
    loadDepartmentList () {
      departmentapi.getPaypointDepartmentDataList().then(res => {
        this.departmentList = res.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addPaypointBatch () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editPaypointBatch (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointBatchInfo(id).then(res => {
        let entity = res.paypointBatch
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    savePaypointBatch () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.savePaypointBatch(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updatePaypointBatch(data).then(res => {
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
