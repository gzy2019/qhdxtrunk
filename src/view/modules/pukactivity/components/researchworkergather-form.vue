<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="活动" prop="activityId">
            <Select v-model="activityId" clearable>
              <Option v-for="item in tagList" :value="item.id" :key="item.id">{{ item.activityName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="添加人员" prop="msgGroupMember">
          <Tag v-for="(item, index) in dataForm.msgGroupMember" color="primary" :closable="true" @on-close="deleteMember(index)" :key="index">{{item.stuName}}</Tag>
          <Button icon="ios-add" type="dashed" size="small" @click="addpersonnel=true">添加人员</Button>
        </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveResearchworkerGather">提交</Button>
        </div>
      </Modal>
      <Modal v-model="addpersonnel" title="选择对象" @on-ok="completeSelect" @on-cancel="addpersonnel=false">
        <Tabs v-if="addpersonnel">
          <TabPane label="学生">
            <div>
              <Input prefix="ios-search" placeholder="快速查找" style="width: 50%" />
            </div>
            <StudentTree @on-check-change="onStudentSelectCheck"/>
          </TabPane>
        </Tabs>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/pukactivity/researchworkergather'
import api1 from '@/api/pukactivity/researchworkeractivity'

import StudentTree from '@/view/components/student-tree'

export default {
  name: 'ResearchworkerGather-form',
  components: {
    StudentTree
  },
  data () {
    return {
      addpersonnel: false,
      receiverSelectVisible: false,
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      activityId: '',
      dataForm: {
        // sendType: 'mail',
        msgGroupMember: [],
        // stuName: '',
        id: null
      },
      tagList: [],
      tmpReceiverList: [],
      receiverList: [],
      dataFormValidate: {
        msgGroupMember: [
          { type: 'array', required: true, message: '人员不能为空', trigger: 'blur' }
        ],
        activityId: [
          { type: 'array', required: true, message: '学生学号不能为空', trigger: 'blur' }
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
    onStudentSelectCheck (arr) {
      if (arr && arr.length) {
        let list = []
        arr.forEach(item => {
          if (item.type === 'student') {
            list.push({
              name: item.label,
              // mobile: item.mobile,
              // email: item.email,
              // type: 'student',
              id: item.id
            })
          }
        })
        let teaList = this.tmpReceiverList.filter(item => item.type === 'tea')
        this.tmpReceiverList = [...teaList, ...list]
      }
    },
    completeSelect () {
      let groupMemberArr = []
      this.tmpReceiverList.forEach(item => {
        console.log(item)
        groupMemberArr.push({
          stuId: item.id,
          stuName: item.name,
          activityId: this.activityId
          // mobile: item.mobile,
          // email: item.email,
          // msgGroupMemberType: item.type
        })
      })
      this.dataForm.msgGroupMember = [...groupMemberArr]
    },
    init () {
      api1.getResearchworkerActivityList().then(res => {
        console.log(res, 'wqwww')
        this.tagList = res.page.list
      })
    },
    deleteMember (index) {
      this.dataForm.msgGroupMember.splice(index, 1)
    },
    cancel () {
      this.formModalVisible = false
    },
    addResearchworkerGather () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editResearchworkerGather (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getResearchworkerGatherInfo(id).then(res => {
        let entity = res.researchworkerGather
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveResearchworkerGather () {
      if (this.submitLoading) return
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          console.log(data)
          // data.msgGroupMember = JSON.parse(data.msgGroupMember)
          // 新增保存
          if (!data.id) {
            api.saveResearchworkerGather1(
              data.msgGroupMember
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            })
          } else {
            api.updateResearchworkerGather(
              data
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-update')
            })
          }
        }
      })
    }
  }
}
</script>
