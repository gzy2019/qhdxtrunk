<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="奖学金名称" prop="fellowshipTitle">
            <Input type="text" v-model="dataForm.fellowshipTitle" :maxlength="100" placeholder="请输入奖学金名称" />
          </FormItem>
          <FormItem label="奖学金明细" prop="fellowshipDesc">
            <Input type="textarea" v-model="dataForm.fellowshipDesc" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入奖学金明细" />
          </FormItem>
          <FormItem label="报名时间" prop="applyDate">
            <IDatePicker type="daterange" v-model="dataForm.applyDate" format="yyyy-MM-dd" placeholder="请输入报名开始时间" />
          </FormItem>
          <!-- <FormItem label="报名结束时间" prop="applyEndDate">
            <IDatePicker type="date" v-model="dataForm.applyEndDate" format="yyyy-MM-dd" placeholder="请输入报名结束时间" />
          </FormItem> -->
          <FormItem label="结果公示时间" prop="resultDate">
            <IDatePicker type="daterange" v-model="dataForm.resultDate" format="yyyy-MM-dd" placeholder="请输入结果公示开始时间" />
          </FormItem>
          <!-- <FormItem label="结果公示结束时间" prop="resultEndDate">
            <IDatePicker type="date" v-model="dataForm.resultEndDate" format="yyyy-MM-dd" placeholder="请输入结果公示结束时间" />
          </FormItem> -->
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerFellowshipInfo">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/fellowship/researchworkerfellowshipinfo'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'ResearchworkerFellowshipInfo-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        fellowshipTitle: '',
        fellowshipDesc: '',
        applyDate: [],
        // applyEndDate: '',
        resultDate: [],
        // resultEndDate: '',
        id: null
      },
      dataFormValidate: {
        fellowshipTitle: [
          { required: true, message: '奖学金名称不能为空', trigger: 'blur' }
        ],
        fellowshipDesc: [
          { required: true, message: '奖学金明细不能为空', trigger: 'blur' }
        ],
        applyDate: [
          { type: 'array', required: true, message: '报名时间不能为空', trigger: 'blur' }
        ],
        resultDate: [
          { type: 'array', required: true, message: '结果公示时间不能为空', trigger: 'blur' }
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
    addResearchworkerFellowshipInfo () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerFellowshipInfo (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerFellowshipInfoInfo(id).then(res => {
        let entity = res.researchworkerFellowshipInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
        this.dataForm.resultDate = []
        this.dataForm.resultDate.push(entity.resultStartDate)
        this.dataForm.resultDate.push(entity.resultEndDate)
        this.dataForm.applyDate = []
        this.dataForm.applyDate.push(entity.applyStartDate)
        this.dataForm.applyDate.push(entity.applyEndDate)
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerFellowshipInfo () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.resultStartDate = this.dataForm.resultDate[0]
          this.dataForm.resultEndDate = this.dataForm.resultDate[1]
          this.dataForm.applyStartDate = this.dataForm.applyDate[0]
          this.dataForm.applyEndDate = this.dataForm.applyDate[1]
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveResearchworkerFellowshipInfo(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerFellowshipInfo(data).then(res => {
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
