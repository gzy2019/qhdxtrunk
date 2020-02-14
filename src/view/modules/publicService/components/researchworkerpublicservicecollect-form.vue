<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" clearable :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem>
          <FormItem label="学生学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" clearable :maxlength="50" placeholder="请输入学生学号" />
          </FormItem>
          <FormItem label="服务批次" prop="serviceId">
            <Select v-model="dataForm.serviceId" clearable>
              <Option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.serviceName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="信息备注" prop="infoDesc">
            <Input type="textarea" v-model="dataForm.infoDesc" clearable :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入信息备注" />
          </FormItem>
          <FormItem label="服务总时长" prop="countTime">
            <Input type="text" v-model="dataForm.countTime" clearable :maxlength="50" placeholder="请输入服务总时长" />
          </FormItem>
          <FormItem label="结果" prop="result">
            <Select v-model="dataForm.result" clearable>
              <Option v-for="item in resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerPublicserviceCollect">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import apiProject from '@/api/publicService/researchworkerpublicservice'
import api from '@/api/publicService/researchworkerpublicservicecollect'
export default {
  name: 'ResearchworkerPublicserviceCollect-form',
  data () {
    return {
      resultList: [{value: 1, label: '通过'}, {value: 2, label: '未通过'}],
      projectList: [],
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        stuName: '',
        stuCode: '',
        serviceId: '',
        infoDesc: '',
        countTime: '',
        result: '',
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
          { type: 'number', required: true, message: '服务批次Id不能为空', trigger: 'blur' }
        ],
        countTime: [
          { required: true, message: '服务总时长不能为空', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '结果0-通过1-不通过不能为空', trigger: 'blur' }
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
    addResearchworkerPublicserviceCollect () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerPublicserviceCollect (id) {
      this.modalTitle = '录入结果'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerPublicserviceCollectInfo(id).then(res => {
        let entity = res.researchworkerPublicserviceCollect
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerPublicserviceCollect () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveResearchworkerPublicserviceCollect(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateResearchworkerPublicserviceCollect(data).then(res => {
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
