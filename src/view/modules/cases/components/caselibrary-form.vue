<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="案例题目" prop="title">
            <Input type="text" v-model="dataForm.title" :maxlength="250" placeholder="请输入案例题目" />
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="案例编号" prop="code">
                <Input type="text" v-model="dataForm.code" :maxlength="50" placeholder="请输入案例编号" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="页数" prop="pages">
                <InputNumber v-model="dataForm.pages" :max="99999" :min="0" style="width: 180px;" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="语种" prop="lang">
                <Select v-model="dataForm.lang" placeholder="请选择语种">
                  <Option value="中文">中文</Option>
                  <Option value="英文">英文</Option>
                  <Option value="其它">其它</Option>
                  <Option value="无">无</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="案例来源" prop="source">
                <DicSelect v-model="dataForm.source" dtype="case-source" :clearable="true" placeholder="请选择案例来源" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="案例作者" prop="author">
                <Input type="text" v-model="dataForm.author" :maxlength="200" placeholder="请输入案例作者" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="指导老师" prop="mentor">
                <Input type="text" v-model="dataForm.mentor" :maxlength="200" placeholder="请输入指导老师" />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="案例主题" prop="topic">
            <Input type="text" v-model="dataForm.topic" :maxlength="200" placeholder="请输入案例主题" />
          </FormItem>
          <FormItem label="关键字" prop="keywords">
            <Input type="text" v-model="dataForm.keywords" :maxlength="250" placeholder="请输入关键字" />
          </FormItem>
          <Form-item label="适用课程" prop="courseIdList">
            <Select v-model="dataForm.courseIdList" multiple placeholder="请选择">
              <Option v-for="(item,index) in courseList" :key="index" :value="item.id">{{item.courseName}}</Option>
            </Select>
          </Form-item>
          <FormItem label="案例摘要" prop="summary">
            <Input type="textarea" v-model="dataForm.summary" :autosize="{minRows: 3,maxRows: 5}" :maxlength="500" placeholder="请输入案例摘要" />
          </FormItem>
          <FormItem label="案例上传" prop="files">
            <IUpload v-model="dataForm.files" :defaultList="dataForm.defaultFileList" :onlyone="true" :multiple="false" :maxSize="20480" />
          </FormItem>
          <FormItem label="是否有多媒体" prop="haveMedia">
            <i-switch v-model="dataForm.haveMedia">
              <span slot="open">有</span>
              <span slot="close">无</span>
            </i-switch>
          </FormItem>
          <FormItem label="备注" prop="memo">
            <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 3,maxRows: 5}" :maxlength="500" placeholder="请输入备注" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseLibrary">提交</Button>
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
  name: 'CaseLibrary-form',
  components: { DicSelect, IUpload },
  data () {
    const validateCode = (rule, value, callback) => {
      if (!this.dataForm.code) {
        callback(new Error('案例编号不能为空}'))
      } else {
        let data = {
          id: this.dataForm.id,
          code: this.dataForm.code
        }
        api.validateCaseLibraryCode(data).then(res => {
          if (!res.result) {
            callback(new Error('案例编号已经存在'))
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
        type: 'cn',
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
          { required: true, message: '案例题目不能为空', trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, required: true, trigger: 'blur' }
        ],
        pages: [
          { type: 'number', required: true, message: '页数不能为空', trigger: 'blur' }
        ],
        lang: [
          { required: true, message: '语种不能为空', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '案例来源不能为空', trigger: 'change' }
        ],
        author: [
          { required: true, message: '案例作者不能为空', trigger: 'blur' }
        ],
        mentor: [
          { required: true, message: '指导老师不能为空', trigger: 'blur' }
        ],
        topic: [
          { required: true, message: '案例主题不能为空', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ],
        courseIdList: [
          { type: 'array', required: true, message: '适用课程不能为空', trigger: 'change' }
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
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editCaseLibrary (id) {
      this.modalTitle = '编辑'
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
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseLibrary(data).then(res => {
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
