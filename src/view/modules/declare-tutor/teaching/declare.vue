<template>
  <div class="search">
    <Card>
      <Row>
        <Form inline :label-width="90" class="search-form">
          <Col span="8">
            <Form-item label="申报批次" prop="batchId">
              <Select v-model="batchId" style="width:200px">
                <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchName }}</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="4" class="btn_group">
            <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
          </Col>
        </Form>
        <Col span="9" class="operation btn_group">
          <Button @click="modalProfile=true">个人简介维护</Button>
          <Button @click="openModalView">查看我的学生</Button>
        </Col>
      </Row>
      <Row>
        <Tabs value="name1" v-model="nameIndex">
          <TabPane :label="item.declareTutorTypeStr+'选导师'" :name="'name'+index" class="tab_cont" v-for="(item, index) in batchRuleList" :key="index">
            <RecordTutor :batchId="newBatchId" :declareTutorType="item.declareTutorType" :declareTutorTypeStr="item.declareTutorTypeStr" :time4Confirm = "currentBatch.time4Confirm" :batch="currentBatch" />
          </TabPane>
        </Tabs>
      </Row>
    </Card>
    <!--查看我的学生 start-->
    <Modal title="查看我的学生" v-model="modalView" class-name="vertical-center-modal popup" :width="1000" scrollable>
      <tables ref="table" size="small" v-model="pageData.list" :columns="columns" />
      <div slot="footer">
        <Button @click="modalView = false">取消</Button>
      </div>
      <!-- <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row> -->
    </Modal>
    <!--查看我的学生 end-->

    <!--个人简介维护 start-->
    <Modal title="个人简介维护" v-model="modalProfile" class-name="vertical-center-modal ">
      <Alert type="warning" class="tips">导师您好,请您及时维护下方的个人简介和个人链接，您所填写的内容，均可被学生查看，作为选择导师的参考项，请您及时更新个人简介和个人链接。</Alert>
      <Form ref="turorForm" :model="turorForm" label-position="top">
        <Form-item label="研究方向" prop="teacherResearchContent">
          <Input v-model="turorForm.teacherResearchContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入您的研究方向" style="width:100%"></Input>
        </Form-item>
        <Form-item label="个人链接" prop="teacherDesc">
          <Input type="text" v-model="turorForm.teacherDesc" clearable placeholder="请输入您的个人链接" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="modalProfile = false">取消</Button>
        <Button type="primary" @click="updateTutorInfo">保存</Button>
      </div>
    </Modal>
    <!--个人简介维护 end-->
    <!--暂存 start-->
    <Modal title="" v-model="modalDeposit" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">确认暂时保存数据？</p>
      <div slot="footer">
        <Button @click="modalDeposit = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="modalDeposit = false">确定</Button>
      </div>
    </Modal>
    <!--暂存 end-->

    <!--拒绝 start-->
    <Modal title="" v-model="modalRefuse" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <p style="padding:20px;font-size:14px">暂时不保存数据？</p>
      <div slot="footer">
        <Button @click="modalRefuse = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="modalRefuse = false">确定</Button>
      </div>
    </Modal>
    <!--拒绝 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import DicSelect from '@/view/components/dic-select'
import RecordTutor from '../components/record-tutor'
import api from '@/api/declare-tutor/batch'
import apiTutor from '@/api/declare-tutor/tutor'
import apiRecord from '@/api/declare-tutor/record'
export default {
  name: 'declareTutor',
  components: {
    Tables, DicSelect, RecordTutor
  },
  data () {
    return {
      nameIndex: 0,
      modalView: false,
      modalDeposit: false,
      modalProfile: false,
      modalRefuse: false,
      batchId: undefined,
      newBatchId: undefined,
      teacherId: this.$store.state.user.teacherId,
      searchForm: {
        page: 1,
        limit: 100
      },
      turorForm: {
        teacherResearchContent: '',
        teacherDesc: ''
      },
      submitLoading: false,
      columns: [
        {
          title: '学生姓名',
          key: 'stuName',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '学生证件号',
          key: 'stuCode',
          minWidth: 100
        },
        {
          title: '班级名称',
          key: 'className',
          minWidth: 100
        },
        {
          title: '申报类型',
          key: 'declareTutorTypeStr',
          minWidth: 100
        },
        {
          title: '申报时间',
          key: 'createTime',
          ellipsis: true,
          tooltip: true,
          minWidth: 180
        },
        {
          title: '拟申报导师',
          key: 'teaName',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '论文意向',
          key: 'paperIntend',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '申报状态',
          key: 'recordStatusDesc',
          className: 'font_color',
          ellipsis: true,
          tooltip: true,
          minWidth: 140
        },
        {
          title: '手机',
          key: 'mobile',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '邮箱',
          key: 'email',
          ellipsis: true,
          tooltip: true,
          minWidth: 150
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      currentIndex: 0,
      batchList: [],
      batchRuleList: [],
      currentBatch: { time4Confirm: true }
    }
  },
  methods: {
    init () {
      api.getBatchListAll().then(res => {
        this.batchList = res.list
        if (this.batchList.length > 0) { this.batchId = this.batchList[0].id }
        this.getBatchRuleList()
      })
      this.getTutorInfo()
    },
    getBatchRuleList () {
      let params = {}
      params.batchId = this.batchId
      params.limit = 100
      api.getBatchRuleList(params).then(res => {
        this.batchRuleList = res.page.list
        this.newBatchId = this.batchId
        this.currentBatch = this.batchList.find((value, index, arr) => {
          return value.id === this.batchId
        })
      })
    },
    handleSearch () {
      this.getBatchRuleList()
    },
    getTutorInfo () {
      apiTutor.getTutorInfoByTeacher(this.teacherId).then(res => {
        if (res.code === 200) {
          if (res.declareTutorDesc) {
            this.turorForm.teacherResearchContent = res.declareTutorDesc.teacherResearchContent
            this.turorForm.teacherDesc = res.declareTutorDesc.teacherDesc
            this.turorForm.id = res.declareTutorDesc.id
          }
        }
      })
    },
    updateTutorInfo () {
      if (this.turorForm.id) {
        apiTutor.updateTutor(this.turorForm).then(res => {
          this.$Message.success('修改个人简介成功！')
          this.modalProfile = false
        })
      }
    },
    openModalView () {
      this.getRecordList()
      this.modalView = true
    },
    getRecordList () {
      if (!this.batchId) return
      this.loading = true
      this.searchForm.batchId = this.batchId
      this.searchForm.recordStatusArr = [1, 3]
      this.searchForm.page = '1'
      this.searchForm.limit = '100'
      // 使用post传递数据，强制设置page,limit两个参数为字符串～～后台使用@requestBody
      // this.searchForm.recordStatus = 1
      apiRecord.getRecordResultListByTeacher(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          this.pageData.list.map(item => {
            item.stuName = item.student.stuName
            item.stuCode = item.student.stuCode
            item.className = item.student.className
            item.mobile = item.student.mobile
            item.email = item.student.email
            item.teaName = item.tutorDesc.teacher.teaName
          })
          this.count = res.count
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped>
.words {
  margin: 0 0 10px;
  font-size: 12px;
  text-indent: 2em;
}
.tab_cont .tips span {
  text-decoration: underline;
}
</style>
