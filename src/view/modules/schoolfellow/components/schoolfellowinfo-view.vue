<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Tabs value="caseLibrary-view1" name="caseLibrary-view">
          <TabPane label="基本信息" name="caseLibrary-view1" tab="caseLibrary-view">

        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <i-Col span="8">
              <FormItem label="创建人姓名:">{{dataForm.createUserName}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="学号:">{{dataForm.stuCode}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="学籍状态">{{dataForm.stuStatus ? '已毕业' : '未毕业'}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="年级:">{{dataForm.grade}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="性别">{{dataForm.sex ? '男' : '女'}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="导师:">{{dataForm.teacher}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="入校时间:">{{dataForm.startDate}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="毕业时间:">{{dataForm.endDate}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="工作省份:">{{dataForm.adsWorking}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="单位/部门:">{{dataForm.unit}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="岗位:">{{dataForm.post}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="级别:">{{dataForm.rank}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="工作部门性质:">{{dataForm.nature}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="电话:">{{dataForm.phone}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="邮箱:">{{dataForm.email}}</FormItem>
            </i-Col>
            <i-Col span="8">
              <FormItem label="通讯地址:">{{dataForm.adsContact}}</FormItem>
            </i-Col>
          </Row>
        </Form>
        </TabPane>
          <TabPane label="沟通信息" name="caseLibrary-view2" tab="caseLibrary-view">
            <CaseLibraryComment ref="caseLibraryComment" :caseId="dataForm.id" />
          </TabPane>
          <TabPane label="工作信息" name="caseLibrary-view3" tab="caseLibrary-view">
            <CaseLibraryComment1 ref="caseLibraryComment" :caseId="dataForm.id" />
          </TabPane>
        </Tabs>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowinfo'
import CaseLibraryComment from './schoolfellowcommunication'
import CaseLibraryComment1 from './schoolfellowjobupdate'

export default {
  name: 'SchoolfellowInfo-view',
  components: { CaseLibraryComment, CaseLibraryComment1 },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        createUserName: '',
        updateUserName: '',
        stuCode: '',
        stuName: '',
        stuStatus: '',
        grade: '',
        sex: '',
        teacher: '',
        startDate: '',
        endDate: '',
        adsWorking: '',
        unit: '',
        post: '',
        rank: '',
        nature: '',
        phone: '',
        email: '',
        adsContact: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSchoolfellowInfo(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSchoolfellowInfo (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowInfoInfo(id).then(res => {
        let entity = res.schoolfellowInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    }
  }
}
</script>
