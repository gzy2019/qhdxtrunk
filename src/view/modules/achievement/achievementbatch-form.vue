<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="550" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="loading"></Spin>
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="批次标题" prop="batchTitle">
          <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.batchTitle" :maxlength="100" placeholder="请输入批次标题" />
        </FormItem>
        <FormItem label="填报开始时间" prop="batchStartTime">
          <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.batchStartTime" format="yyyy-MM-dd" placeholder="请输入填报开始时间" />
        </FormItem>
        <FormItem label="填报结束时间" prop="batchEndTime">
          <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.batchEndTime" format="yyyy-MM-dd" placeholder="请输入填报结束时间" />
        </FormItem>
        <FormItem label="年度" prop="batchYear">
          <Select :disabled="modalView" v-model="dataForm.batchYear">
            <Option :value="2019">2019</Option>
            <Option :value="2020">2020</Option>
            <Option :value="2021">2021</Option>
            <Option :value="2022">2022</Option>
            <Option :value="2023">2023</Option>
            <Option :value="2024">2024</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="batchDesc">
          <Input  type="textarea" :autosize="{minRows: 3,maxRows: 5}" :readonly="modalView" :clearable="!modalView" v-model="dataForm.batchDesc" :maxlength="200" placeholder="请输入选课备注" />
        </FormItem>
        <FormItem label="是否开放" prop="batchOpenFlag">
          <i-switch :disabled="modalView" v-model="dataForm.batchOpenFlag">
            <span slot="open">开放</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveAchievementBatch">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/achievement/achievementbatch'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'AchievementBatch-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      modalView: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        createUserId: '',
        batchTitle: '',
        batchStartTime: '',
        batchEndTime: '',
        batchYear: 2019,
        batchDesc: '',
        batchOpenFlag: '',
        id: undefined
      },
      dataFormValidate: {
        batchTitle: [
          { required: true, message: '批次标题不能为空', trigger: 'blur' }
        ],
        batchStartTime: [
          { required: true, message: '填报开始时间不能为空', trigger: 'blur' }
        ],
        batchEndTime: [
          { required: true, message: '填报结束时间不能为空', trigger: 'blur' }
        ],
        batchYear: [
          { type: 'number', required: true, message: '年度不能为空', trigger: 'blur' }
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
    addAchievementBatch () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.batchYear = new Date().getFullYear()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
    },
    viewAchievementBatch (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getAchievementBatchInfo(id).then(res => {
        let entity = res.achievementBatch
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editAchievementBatch (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getAchievementBatchInfo(id).then(res => {
        let entity = res.achievementBatch
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
      this.formModalVisible = true
      this.modalView = false
    },
    saveAchievementBatch () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveAchievementBatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).catch(e => {
              this.submitLoading = false
              this.$emit('update')
            })
          } else {
            api.updateAchievementBatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).catch(e => {
              this.$emit('update')
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
