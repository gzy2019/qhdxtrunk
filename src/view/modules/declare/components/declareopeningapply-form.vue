<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="20" placeholder="请输入学号" @blur.native.capture="stCode()" clearable/>
          </FormItem>
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" clearable/>
          </FormItem>
          <FormItem label="导师" prop="teacherId">
            <TeacherSelect v-model="dataForm.teacherId" dtype="position-title" :clearable="true" ></TeacherSelect>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input type="text" v-model="dataForm.email" :maxlength="50" placeholder="请输入邮箱" clearable/>
          </FormItem>
          <FormItem label="手机号" prop="mobile">
            <Input type="text" v-model="dataForm.mobile" :maxlength="30" placeholder="请输入手机号" clearable/>
          </FormItem>
          <FormItem label="申报名称" prop="applyId">
            <Select v-model="dataForm.applyId" clearable placeholder="请输入申报名称">
              <Option v-for="item in applyIdList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="论文名称" prop="paperTitle">
            <Input type="text" v-model="dataForm.paperTitle" :maxlength="30" placeholder="请输入论文名称" clearable/>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveDeclareOpeningApply">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->
    </div>
</template>

<script>
import apply from '@/api/declare/declareopeninginfo'
import api from '@/api/declare/declareopeningapply'
import TeacherSelect from '@/view/components/teacher-select'

export default {
  name: 'DeclareOpeningApply-form',
  components: {
    TeacherSelect, apply
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      applyIdList: [],
      dataForm: {
        stuName: '',
        stuCode: '',
        teacherId: '',
        email: '',
        mobile: '',
        applyId: '',
        paperTitle: '',
        id: null
      },
      dataFormValidate: {
        stuName: [
          { type: 'string', required: true, message: '学生姓名不能为空', trigger: 'blur' }
        ],
        stuCode: [
          { type: 'string', required: true, message: '学号不能为空', trigger: 'blur' }
        ],
        teacherId: [
          { type: 'number', required: true, message: '导师不能为空', trigger: 'blur' }
        ],
        email: [
          { type: 'string', required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        mobile: [
          { type: 'string', required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        applyId: [
          { type: 'number', required: true, message: '申报不能为空', trigger: 'blur' }
        ],
        applyStatus: [
          { type: 'number', required: true, message: '报名状态不能为空', trigger: 'blur' }
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
      apply.getDeclareOpeningInfoList({limit: 1000}).then(res => {
        this.applyIdList = res.page.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    stCode () {
      if (this.dataForm.stuCode) {
        api.getDeclareOpeningApplyInfo1({'stuCode': this.dataForm.stuCode}).then(res => {
          let entity = res.allStudentEntity
          Object.keys(this.dataForm).forEach(key => {
            // console.log(this.searchForm, 222)
            this.dataForm[key] = entity[key]
          })
        }).finally(() => {
          this.loading = false
        })
        this.formModalVisible = true
      }
    },
    addDeclareOpeningApply () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    // editDeclareOpeningApply (id) {
    //   this.modalTitle = '编辑'
    //   this.$refs.dataForm.resetFields()
    //   this.loading = true
    //   api.getDeclareOpeningApplyInfo(id).then(res => {
    //     let entity = res.declareOpeningApply
    //     Object.keys(this.dataForm).forEach(key => {
    //       this.dataForm[key] = entity[key]
    //     })
    //   }).finally(() => {
    //     this.loading = false
    //   })
    //   this.formModalVisible = true
    // },
    saveDeclareOpeningApply () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          // console.log(typeof (data))
          if (!data.id) {
            api.updateDeclareOpeningApply(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.saveDeclareOpeningApply(data).then(res => {
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
