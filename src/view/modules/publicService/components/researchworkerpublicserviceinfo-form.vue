<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem>
          <FormItem label="学生学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="50" placeholder="请输入学生学号" />
          </FormItem>
          <FormItem label="服务批次" prop="serviceId">
            <Select v-model="dataForm.serviceId" clearable>
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.serviceName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务内容" prop="serviceDesc">
            <Input type="textarea" v-model="dataForm.serviceDesc" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入服务内容" />
          </FormItem>
          <FormItem label="服务时长" prop="serviceTime">
            <Input type="text" v-model="dataForm.serviceTime" :maxlength="50" placeholder="请输入服务时长" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerPublicserviceInfo">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import apiProject from '@/api/publicService/researchworkerpublicservice'
import api from '@/api/publicService/researchworkerpublicserviceinfo'
export default {
  name: 'ResearchworkerPublicserviceInfo-form',
  data () {
    return {
      projectList: [],
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        stuName: '',
        stuCode: '',
        serviceId: '',
        serviceDesc: '',
        serviceTime: '',
        id: null
      },
      dataFormValidate: {
        stuName: [
          { required: true, message: '学生姓名不能为空', trigger: 'blur' }
        ],
        stuCode: [
          { required: true, message: '学生学号不能为空', trigger: 'blur' }
        ],
        serviceId: [
          { type: 'number', required: true, message: '服务批次不能为空', trigger: 'blur' }
        ],
        serviceDesc: [
          { required: true, message: '服务内容不能为空', trigger: 'blur' }
        ],
        serviceTime: [
          { type: 'number', required: true, message: '服务时长不能为空', trigger: 'blur' }
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
      apiProject.getResearchworkerPublicserviceList({ limit: 100 }).then(res => {
        console.log(res, '222')
        this.projectList = res.page.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addResearchworkerPublicserviceInfo () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerPublicserviceInfo (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerPublicserviceInfoInfo(id).then(res => {
        let entity = res.researchworkerPublicserviceInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerPublicserviceInfo () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveResearchworkerPublicserviceInfo(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerPublicserviceInfo(data).then(res => {
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
