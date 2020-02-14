<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="750" class-name="vertical-center-modal">
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
              <FormItem label="案例长度" prop="mediaLength">
                <Input type="text" v-model="dataForm.mediaLength" :maxlength="100" placeholder="请输入案例长度" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="声音语言" prop="voiceLang">
                <Select v-model="dataForm.voiceLang" placeholder="请选择">
                  <Option value="中文">中文</Option>
                  <Option value="英文">英文</Option>
                  <Option value="其它">其它</Option>
                  <Option value="无">无</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="字幕语言" prop="subtitleLang">
                <Select v-model="dataForm.subtitleLang" placeholder="请选择">
                  <Option value="中文">中文</Option>
                  <Option value="英文">英文</Option>
                  <Option value="其它">其它</Option>
                  <Option value="无">无</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="案例来源" prop="source">
                <DicSelect v-model="dataForm.source" dtype="case-source" :clearable="true" placeholder="请选择案例来源" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="案例主题" prop="topic">
                <Input type="text" v-model="dataForm.topic" :maxlength="200" placeholder="请输入案例主题" />
              </FormItem>
            </Col>
          </Row>
          <Form-item label="适用课程" prop="courseIdList">
            <Select v-model="dataForm.courseIdList" multiple placeholder="请选择">
              <Option v-for="(item,index) in courseList" :key="index" :value="item.id">{{item.courseName}}</Option>
            </Select>
          </Form-item>
          <FormItem label="案例图片" prop="imageFile">
            <IUpload v-model="dataForm.imageFile" accept="image/*" :defaultList="dataForm.defaultFileList1" :onlyone="true" :multiple="true" :maxSize="20480" />
          </FormItem>
          <FormItem label="案例音频视频" prop="mediaFile">
            <IUpload v-model="dataForm.mediaFile" :defaultList="dataForm.defaultFileList2" :onlyone="true" :multiple="true" :maxSize="20480" />
          </FormItem>
          <FormItem label="内容简介" prop="summary">
            <Input type="textarea" v-model="dataForm.summary" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入内容简介" />
          </FormItem>
          <FormItem label="备注" prop="memo">
            <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入备注" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseMedia">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/cases/casemedia'
import IUpload from '@/view/components/iupload'
import courseApi from '@/api/cases/casecourse'
import IDatePicker from '@/view/components/idate-picker'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'CaseMedia-form',
  components: { IDatePicker, DicSelect, IUpload },
  data () {
    const validateCode = (rule, value, callback) => {
      if (this.dataForm.code) {
        let data = {
          id: this.dataForm.id,
          code: this.dataForm.code
        }
        api.validateCaseLibraryCode(data).then(res => {
          if (!res.result) {
            callback(new Error('案例编号无效'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      courseList: [],
      dataForm: {
        title: '',
        code: '',
        mediaLength: '',
        voiceLang: '',
        subtitleLang: '',
        source: '',
        topic: '',
        courseIdList: [],
        imageFile: null,
        mediaFile: null,
        defaultFileList1: null,
        defaultFileList2: null,
        summary: '',
        memo: '',
        id: null
      },
      dataFormValidate: {
        title: [
          { required: true, message: '案例题目不能为空', trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ],
        mediaLength: [
          { required: true, message: '案例长度不能为空', trigger: 'blur' }
        ],
        voiceLang: [
          { required: true, message: '声音语言不能为空', trigger: 'blur' }
        ],
        subtitleLang: [
          { required: true, message: '字幕语言不能为空', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '案例来源不能为空', trigger: 'blur' }
        ],
        topic: [
          { required: true, message: '案例主题不能为空', trigger: 'blur' }
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
    addCaseMedia () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editCaseMedia (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getCaseMediaInfo(id).then(res => {
        let entity = res.caseMedia
        Object.keys(this.dataForm).forEach(key => {
          if (['imageFile', 'mediaFile'].includes(key) && entity[key]) {
            entity[key] = JSON.parse(entity[key])
          }
          if (entity.imageFile) {
            this.dataForm.defaultFileList1 = [...entity.imageFile]
          }
          if (entity.mediaFile) {
            this.dataForm.defaultFileList2 = [...entity.mediaFile]
          }

          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    saveCaseMedia () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (data.imageFile) {
            data.imageFile = JSON.stringify(data.imageFile)
          }
          if (data.mediaFile) {
            data.mediaFile = JSON.stringify(data.mediaFile)
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
            api.saveCaseMedia(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseMedia(data).then(res => {
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
