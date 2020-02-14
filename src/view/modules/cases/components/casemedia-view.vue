<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="750" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Tabs value="caseMedia-view1" name="caseMedia-view">
          <TabPane label="基本信息" name="caseMedia-view1" tab="caseMedia-view">
            <Form ref="dataForm" :model="dataForm" :label-width="120">
              <Row>
                <Col span="24">
                  <FormItem label="案例题目:">{{dataForm.title}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例编号:">{{dataForm.code}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例长度:">{{dataForm.mediaLength}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="声音语言:">{{dataForm.voiceLang}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="字幕语言:">{{dataForm.subtitleLang}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例来源:">{{dataForm.sourceStr}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="案例主题:">{{dataForm.topic}}</FormItem>
                </Col>
                <Col span="24" v-if="dataForm.courseList">
                  <FormItem label="适用课程:">{{dataForm.courseList.map(item => item.courseName).join(' ')}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="案例图片:">
                    <a @click="downloadCase(item)" v-for="(item,index) in dataForm.imageFile" :key="index" href="javascript:void(0)">
                      {{item.name}}
                    </a>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="案例音频视频:">
                    <a @click="downloadCase(item)" v-for="(item,index) in dataForm.mediaFile" :key="index" href="javascript:void(0)">
                      {{item.name}}
                    </a>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="内容简介:">{{dataForm.summary}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="备注:">{{dataForm.memo}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="审核状态:">{{dataForm.approveStatusInfo}}</FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="审核时间:">{{dataForm.approveDate}}</FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="审核备注:">{{dataForm.approveMemo}}</FormItem>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="评论列表" name="caseMedia-view2" tab="caseMedia-view">
            <CaseMediaComment ref="caseMediaComment" :mediaId="dataForm.id" />
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
import api from '@/api/cases/casemedia'
import CaseMediaComment from '../casemediacomment'
export default {
  name: 'CaseMedia-view',
  components: { CaseMediaComment },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        title: '',
        code: '',
        mediaLength: '',
        voiceLang: '',
        subtitleLang: '',
        source: '',
        topic: '',
        courseList: [],
        imageFile: [],
        mediaFile: [],
        summary: '',
        memo: '',
        ups: null,
        status: null,
        approveStatus: null,
        approveDate: '',
        approveMemo: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewCaseMedia(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewCaseMedia (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getCaseMediaInfo(id).then(res => {
        let entity = res.caseMedia
        Object.keys(this.dataForm).forEach(key => {
          if (['imageFile', 'mediaFile'].includes(key) && entity[key]) {
            entity[key] = JSON.parse(entity[key])
          }
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.dataForm.id = id
      this.$refs.caseMediaComment.init()
      this.formModalVisible = true
    },
    downloadCase (file) {
      if (file.url) {
        window.open(file.url)
      }
    }
  }
}
</script>
