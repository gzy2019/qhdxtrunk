<template>
  <div>
      <!-- 查看 start-->
      <Modal title="View case" v-model="formModalVisible" :mask-closable='false' :width="750" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Tabs value="caseLibrary-viewen1" name="caseLibrary-viewen">
          <TabPane label="Base information" name="caseLibrary-viewen1" tab="caseLibrary-viewen">
            <Form ref="dataForm" :model="dataForm" :label-width="120">
              <Row>
                <Col span="24">
                  <FormItem label="Case Title:">{{dataForm.title}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Case Reference No:">{{dataForm.code}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Pages:">{{dataForm.pages}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Language:">{{dataForm.lang}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Case Bank:">{{dataForm.sourceStr}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Authors:">{{dataForm.author}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Sponsors:">{{dataForm.mentor}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Main Topics:">{{dataForm.topic}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Key Words:">{{dataForm.keywords}}</FormItem>
                </Col>
                <Col span="24" v-if="dataForm.courseList">
                  <FormItem label="Curriculum Division:">{{dataForm.courseList.map(item => item.courseName).join(' ')}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="Abstract:">{{dataForm.summary}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="Case Upload:">
                    <a @click="downloadCase(item)" v-for="(item,index) in dataForm.files" :key="index" href="javascript:void(0)">
                      {{item.name}}
                    </a>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Is There Vedio File:">{{dataForm.haveMedia ? 'yes' : 'no'}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="Thumbs:">{{dataForm.ups}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="notes:">{{dataForm.memo}}</FormItem>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="Comment list" name="caseLibrary-viewen2" tab="caseLibrary-viewen">
            <CaseLibraryComment ref="caseLibraryComment" :caseId="dataForm.id" />
          </TabPane>
        </Tabs>
        <div slot="footer">
          <Button @click="cancel">Close</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/cases/caselibrary'
import downloadApi from '@/api/cases/caselibrarydownload'
import CaseLibraryComment from '../caselibrarycomment-en'
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
        files: [],
        courseList: [],
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
