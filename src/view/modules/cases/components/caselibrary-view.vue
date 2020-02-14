<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="750" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Tabs value="caseLibrary-view1" name="caseLibrary-view">
          <TabPane label="基本信息" name="caseLibrary-view1" tab="caseLibrary-view">
            <Form ref="dataForm" :model="dataForm" :label-width="120">
              <Row>
                <Col span="24">
                  <FormItem label="案例题目:">{{dataForm.title}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例编号:">{{dataForm.code}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="页数:">{{dataForm.pages}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="语种">{{dataForm.lang}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例来源:">{{dataForm.sourceStr}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例作者:">{{dataForm.author}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="指导老师:">{{dataForm.mentor}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例主题:">{{dataForm.topic}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="关键字:">{{dataForm.keywords}}</FormItem>
                </Col>
                <Col span="24" v-if="dataForm.courseList">
                  <FormItem label="适用课程:">{{dataForm.courseList.map(item => item.courseName).join(' ')}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="案例摘要:">{{dataForm.summary}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="案例上传:">
                    <a @click="downloadCase(item)" v-for="(item,index) in dataForm.files" :key="index" href="javascript:void(0)">
                      {{item.name}}
                    </a>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="多媒体:">{{dataForm.haveMedia ? '有' : '无'}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="点赞数:">{{dataForm.ups}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="备注:">{{dataForm.memo}}</FormItem>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="评论列表" name="caseLibrary-view2" tab="caseLibrary-view">
            <CaseLibraryComment ref="caseLibraryComment" :caseId="dataForm.id" />
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
import api from '@/api/cases/caselibrary'
import downloadApi from '@/api/cases/caselibrarydownload'
import CaseLibraryComment from '../caselibrarycomment'
export default {
  name: 'CaseLibrary-view',
  components: { CaseLibraryComment },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        title: '',
        code: '',
        pages: null,
        lang: '',
        source: '',
        author: '',
        mentor: '',
        topic: '',
        keywords: '',
        summary: '',
        courseList: [],
        files: [],
        haveMedia: null,
        memo: '',
        ups: null,
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewCaseLibrary(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewCaseLibrary (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getCaseLibraryInfo(id).then(res => {
        let entity = res.caseLibrary
        Object.keys(this.dataForm).forEach(key => {
          if (key === 'files' && entity[key]) {
            entity[key] = JSON.parse(entity[key])
          }
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
      this.dataForm.id = id
      this.$refs.caseLibraryComment.init()
    },
    downloadCase (file) {
      if (file.url) {
        downloadApi.saveCaseLibraryDownload({ caseId: this.dataForm.id }).then(res => {})
        window.open(file.url)
      }
    }
  }
}
</script>
