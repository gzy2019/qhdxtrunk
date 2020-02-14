<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="110" :rules="dataFormValidate">
          <FormItem label="Case Title" prop="title">
            <Input type="text" v-model="dataForm.title" :maxlength="250" placeholder="please input case title" />
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="Case Reference No" prop="code">
                <Input type="text" v-model="dataForm.code" :maxlength="50" placeholder="please input Case Reference No" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="Pages" prop="pages">
                <InputNumber v-model="dataForm.pages" :max="99999" :min="0" style="width: 180px;" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="Language" prop="lang">
                <Select v-model="dataForm.lang" placeholder="please choose language">
                  <Option value="中文">chinese</Option>
                  <Option value="英文">english</Option>
                  <Option value="其它">other</Option>
                  <Option value="无">none</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="Case Bank" prop="source">
                <DicSelect v-model="dataForm.source" dtype="case-source" :clearable="true" placeholder="please choose case bank" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="Authors" prop="author">
                <Input type="text" v-model="dataForm.author" :maxlength="200" placeholder="please input authors" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="Sponsors" prop="mentor">
                <Input type="text" v-model="dataForm.mentor" :maxlength="200" placeholder="please input sponsors" />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="Main Topics" prop="topic">
            <Input type="text" v-model="dataForm.topic" :maxlength="200" placeholder="please input main topics" />
          </FormItem>
          <FormItem label="Key Words" prop="keywords">
            <Input type="text" v-model="dataForm.keywords" :maxlength="250" placeholder="please input key words" />
          </FormItem>
          <Form-item label="Curriculum Division" prop="courseIdList">
            <Select v-model="dataForm.courseIdList" multiple placeholder="please choose">
              <Option v-for="(item,index) in courseList" :key="index" :value="item.id">{{item.courseName}}</Option>
            </Select>
          </Form-item>
          <FormItem label="Abstract" prop="summary">
            <Input type="textarea" v-model="dataForm.summary" :autosize="{minRows: 3,maxRows: 5}" :maxlength="500" placeholder="please input abstract" />
          </FormItem>
          <FormItem label="Case Upload" prop="files">
            <IUpload v-model="dataForm.files" :defaultList="dataForm.defaultFileList" :onlyone="true" :multiple="false" :maxSize="20480" />
          </FormItem>
          <FormItem label="Is There Vedio File" prop="haveMedia">
            <i-switch v-model="dataForm.haveMedia">
              <span slot="open">yes</span>
              <span slot="close">no</span>
            </i-switch>
          </FormItem>
          <FormItem label="notes" prop="memo">
            <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 3,maxRows: 5}" :maxlength="500" placeholder="please input notes" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">cancel</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseLibrary">submit</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import IUpload from '@/view/components/iupload'
import api from '@/api/cases/caselibrary'
import courseApi from '@/api/cases/casecourse'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'CaseLibrary-form-en',
  components: { DicSelect, IUpload },
  data () {
    const validateCode = (rule, value, callback) => {
      if (!this.dataForm.code) {
        callback(new Error('case reference No is required}'))
      } else {
        let data = {
          id: this.dataForm.id,
          code: this.dataForm.code
        }
        api.validateCaseLibraryCode(data).then(res => {
          if (!res.result) {
            callback(new Error('case reference No exist'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      courseList: [],
      dataForm: {
        type: 'en',
        title: '',
        code: '',
        pages: 10,
        lang: '',
        source: '',
        author: '',
        mentor: '',
        topic: '',
        keywords: '',
        courseIdList: [],
        summary: '',
        files: null,
        defaultFileList: null,
        haveMedia: false,
        memo: '',
        id: null
      },
      dataFormValidate: {
        title: [
          { required: true, message: 'case title is required', trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, required: true, trigger: 'blur' }
        ],
        pages: [
          { type: 'number', required: true, message: 'pages is required', trigger: 'blur' }
        ],
        lang: [
          { required: true, message: 'language is required', trigger: 'blur' }
        ],
        source: [
          { required: true, message: 'case bank is required', trigger: 'change' }
        ],
        author: [
          { required: true, message: 'authors is required', trigger: 'blur' }
        ],
        mentor: [
          { required: true, message: 'sponsors is required', trigger: 'blur' }
        ],
        topic: [
          { required: true, message: 'main topics is required', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: 'key words is required', trigger: 'blur' }
        ],
        courseIdList: [
          { type: 'array', required: true, message: 'curriculum division is required', trigger: 'change' }
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
      this.loadCourseList()
    },
    cancel () {
      this.formModalVisible = false
    },
    loadCourseList () {
      courseApi.getCaseCourseDataList().then(res => {
        this.courseList = res.list
      })
    },
    addCaseLibrary () {
      this.modalTitle = 'Add new case'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editCaseLibrary (id) {
      this.modalTitle = 'Edit case'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getCaseLibraryInfo(id).then(res => {
        let entity = res.caseLibrary
        Object.keys(this.dataForm).forEach(key => {
          if (key === 'files' && entity[key]) {
            entity[key] = JSON.parse(entity[key])
          }
          if (entity.files) {
            this.dataForm.defaultFileList = [...entity.files]
          }
          if (entity.courseList && entity.courseList.length) {
            this.dataForm.courseIdList = entity.courseList.map(item => item.id)
          }
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveCaseLibrary () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (data.files) {
            data.files = JSON.stringify(data.files)
          }
          if (data.courseIdList) {
            let arr = data.courseIdList.map(item => {
              return {
                id: item
              }
            })
            data.courseList = arr
          }
          if (!data.id) {
            api.saveCaseLibrary(data).then(res => {
              this.$Message.success('save success！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseLibrary(data).then(res => {
              this.$Message.success('update success！')
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
