<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="入职时间" prop="startDate">
            <IDatePicker type="date" v-model="dataForm.startDate" format="yyyy-MM-dd" placeholder="请输入入职时间" />
          </FormItem>
          <FormItem label="离职时间" prop="endDate">
            <IDatePicker type="date" v-model="dataForm.endDate" format="yyyy-MM-dd" placeholder="请输入离职时间" />
          </FormItem>
          <!-- <FormItem label="学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="50" placeholder="请输入学号" />
          </FormItem>
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem> -->
          <FormItem label="工作省份" prop="adsWorking">
            <Input type="text" v-model="dataForm.adsWorking" :maxlength="50" placeholder="请输入工作省份" />
          </FormItem>
          <FormItem label="单位/部门" prop="unit">
            <Input type="text" v-model="dataForm.unit" :maxlength="50" placeholder="请输入单位/部门" />
          </FormItem>
          <FormItem label="岗位" prop="post">
            <Input type="text" v-model="dataForm.post" :maxlength="50" placeholder="请输入岗位" />
          </FormItem>
          <FormItem label="级别" prop="rank">
            <Input type="text" v-model="dataForm.rank" :maxlength="50" placeholder="请输入级别" />
          </FormItem>
          <FormItem label="工作部门性质" prop="nature">
            <Input type="text" v-model="dataForm.nature" :maxlength="50" placeholder="请输入工作部门性质" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSchoolfellowJobupdate">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->
    </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowjobupdate'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'SchoolfellowJobupdate-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        updateUserName: '',
        startDate: '',
        endDate: '',
        // stuCode: '',
        // stuName: '',
        adsWorking: '',
        unit: '',
        post: '',
        rank: '',
        nature: '',
        id: null
      },
      dataFormValidate: {
        unit: [
          { required: true, message: '单位/部门不能为空', trigger: 'blur' }
        ],
        // stuCode: [
        //   { required: true, message: '学号不能为空', trigger: 'blur' }
        // ],
        // stuName: [
        //   { required: true, message: '学生姓名不能为空', trigger: 'blur' }
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
    init () {

    },
    cancel () {
      this.formModalVisible = false
    },
    addSchoolfellowJobupdate () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editSchoolfellowJobupdate (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowJobupdateInfo(id).then(res => {
        let entity = res.schoolfellowJobupdate
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveSchoolfellowJobupdate () {
      // let stuCode = this.$route.params.stuCode
      // this.dataForm.stuCode = stuCode
      // let stuName = this.$route.params.stuName
      // this.dataForm.stuName = stuName
      let schoolfellowInfoId = this.$route.params.schoolfellowInfoId
      this.dataForm.schoolfellowInfoId = schoolfellowInfoId
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveSchoolfellowJobupdate(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateSchoolfellowJobupdate(data).then(res => {
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
