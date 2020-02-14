<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="问卷标题" prop="title">
            <Input type="text" v-model="dataForm.title" :maxlength="200" placeholder="请输入问卷标题" />
          </FormItem>
          <FormItem label="类型" prop="qaType">
            <RadioGroup v-model="dataForm.qaType">
                <Radio :label="1" :disabled="dataForm.id">问卷</Radio>
                <Radio :label="2" :disabled="dataForm.id">投票</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否启用" prop="enable">
            <i-switch v-model="dataForm.enable">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="启用开始时间" prop="beginDate">
            <IDatePicker type="date" v-model="dataForm.beginDate" format="yyyy-MM-dd" placeholder="请输入启用开始时间" />
          </FormItem>
          <FormItem label="启用结束时间" prop="endDate">
            <IDatePicker type="date" v-model="dataForm.endDate" format="yyyy-MM-dd" placeholder="请输入启用结束时间" />
          </FormItem>
          <FormItem label="问卷说明" prop="memo">
            <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入问卷说明" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveQaForm">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/qa/qaform'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'QaForm-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        enable: true,
        beginDate: '',
        endDate: '',
        title: '',
        memo: '',
        qaType: 1,
        labelPosition: 'top',
        labelWidth: 120,
        itemSize: 'default',
        id: null
      },
      dataFormValidate: {
        beginDate: [
          { required: true, message: '启用开始时间不能为空', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '启用结束时间不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '问卷标题不能为空', trigger: 'blur' }
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
    addQaForm () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editQaForm (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getQaFormInfo(id).then(res => {
        let entity = res.qaForm
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveQaForm () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveQaForm(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save', res.data)
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateQaForm(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-update')
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
