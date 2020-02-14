<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="报名时间" prop="applyDate">
            <IDatePicker type="daterange" v-model="dataForm.applyDate" format="yyyy-MM-dd" placeholder="请输入报名时间" />
          </FormItem>
          <FormItem label="活动时间" prop="activityDate">
            <IDatePicker type="daterange" v-model="dataForm.activityDate" format="yyyy-MM-dd" placeholder="请输入活动时间" />
          </FormItem>
          <FormItem label="活动名" prop="activityName">
            <Input type="text" v-model="dataForm.activityName" :maxlength="50" placeholder="请输入活动名" />
          </FormItem>
          <FormItem label="活动地址" prop="activityAds">
            <Input type="text" v-model="dataForm.activityAds" :maxlength="100" placeholder="请输入活动地址" />
          </FormItem>
          <FormItem label="活动类型" prop="activityType">
            <Input type="text" v-model="dataForm.activityType" :maxlength="100" placeholder="请输入活动类型" />
          </FormItem>
          <FormItem label="活动组别" prop="activityGroupIds">
            <Tag  v-model="dataForm.activityGroups" v-for="item in count" :key="item"
             :name="item" closable @on-close="handleClose2">
              <Input v-model="dataForm.activityGroups[item]" type="text" style="width:60px"/>
            </Tag>
            <Button icon="ios-add" type="dashed" size="small" @click="handleAdd">添加</Button>
            <!-- <Input type="text" v-model="dataForm.activityGroup" :maxlength="100" placeholder="请输入活动组别" /> -->
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerSocialactivityInfo">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/socialActivity/researchworkersocialactivityinfo'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'ResearchworkerSocialactivityInfo-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      count: [],
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        applyDate: [],
        activityDate: [],
        activityName: '',
        activityAds: '',
        activityType: '',
        activityGroups: [],
        id: null
      },
      dataFormValidate: {
        applyDate: [
          { type: 'array', required: true, message: '报名时间不能为空', trigger: 'blur' }
        ],
        activityDate: [
          { type: 'array', required: true, message: '活动时间不能为空', trigger: 'blur' }
        ],
        activityName: [
          { required: true, message: '活动名不能为空', trigger: 'blur' }
        ],
        activityAds: [
          { required: true, message: '活动地址不能为空', trigger: 'blur' }
        ],
        activityType: [
          { required: true, message: '活动类型不能为空', trigger: 'blur' }
        ],
        // activityGroup: [
        //   { type: 'array', required: true, message: '活动组别不能为空', trigger: 'blur' }
        // ],
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
    handleAdd () {
      if (this.count.length) {
        this.count.push(this.count[this.count.length - 1] + 1)
      } else {
        this.count.push(0)
      }
    },
    handleClose2 (event, name) {
      const index = this.count.indexOf(name)
      console.log(index)
      this.count.splice(index, 1)
    },
    init () {

    },
    cancel () {
      this.formModalVisible = false
    },
    addResearchworkerSocialactivityInfo () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerSocialactivityInfo (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerSocialactivityInfoInfo(id).then(res => {
        let entity = res.researchworkerSocialactivityInfo
        console.log(entity, 'we')
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
          console.log(this.dataForm[key], 'ddf')
        })
        this.dataForm.activityDate = []
        this.dataForm.activityDate.push(entity.activityStartDate)
        this.dataForm.activityDate.push(entity.activityEndDate)
        this.dataForm.applyDate = []
        this.dataForm.applyDate.push(entity.applyStartDate)
        this.dataForm.applyDate.push(entity.applyEndDate)
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerSocialactivityInfo () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.activityStartDate = this.dataForm.activityDate[0]
          this.dataForm.activityEndDate = this.dataForm.activityDate[1]
          this.dataForm.applyStartDate = this.dataForm.applyDate[0]
          this.dataForm.applyEndDate = this.dataForm.applyDate[1]
          // this.dataForm.activityGroups = Set(this.dataForm.activityGroups)
          this.dataForm.activityGroupIds = this.count
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          console.log(data, '1223')
          if (!data.id) {
            api.saveResearchworkerSocialactivityInfo(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerSocialactivityInfo(data).then(res => {
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
