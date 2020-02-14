<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="900" :styles="{top: '20px'}" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" label-position="top" :rules="dataFormValidate">
        <Divider>选择提交批次</Divider>
        <Row :gutter="16">
          <i-Col span="8">
          <Form-item label="批次名称" prop="batchId" class="margin10">
            <Select v-model="dataForm.batchId" clearable>
              <Option v-for="item in batchList" :disabled="!item.timeWindowOpen" :value="item.id" :key="item.id">{{ item.batchTitle }}</Option>
            </Select>
          </Form-item>
          </i-Col>
          <i-Col span="4">
          <Form-item label="年度" class="margin10">
            {{curBatch.batchYear}}
          </Form-item>
          </i-Col>
          <i-Col span="6">
          <Form-item label="填报开始时间" class="margin10">
            {{curBatch.batchStartTime}}
          </Form-item>
          </i-Col>
          <i-Col span="6">
          <Form-item label="填报结束时间" class="margin10">
            {{curBatch.batchEndTime}}
          </Form-item>
          </i-Col>
        </Row>
        <Divider>科研成果</Divider>
        <FormItem label="成果名称" prop="name">
          <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.name" :maxlength="300" placeholder="请输入成果名称" />
        </FormItem>
        <Row :gutter="16">
          <i-Col span="8">
          <FormItem label="第一作者" prop="firstAuthor">
            <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.firstAuthor" :maxlength="100" placeholder="请输入第一作者" />
          </FormItem>
          </i-Col>
          <i-Col span="16">
          <FormItem label="作者列表" prop="authors">
            <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.authors" :maxlength="300" placeholder="请输入作者列表" />
          </FormItem>
          </i-Col>
        </Row>
        <Row :gutter="16">
          <i-Col span="8">
          <FormItem label="成果来源" prop="source">
            <DicSelect v-model="dataForm.source" dtype="achievement-source" :clearable="true" placeholder="请选择成果来源" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="成果形式" prop="form">
            <DicSelect v-model="dataForm.form" dtype="achievement-form" :clearable="true" placeholder="请选择成果形式" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="发表范围" prop="scope">
            <DicSelect v-model="dataForm.scope" dtype="achievement-scope" :clearable="true" placeholder="请选择发表范围" />
          </FormItem>
          </i-Col>
        </Row>
        <Row :gutter="16">
          <i-Col span="8">
          <FormItem label="是否译成外文" prop="translateOtherLang">
            <i-switch :disabled="modalView" v-model="dataForm.translateOtherLang">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="是否采购(针对研究与咨询报告)" prop="accpeted">
            <i-switch :disabled="modalView" v-model="dataForm.accpeted">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="是否提交给有关部门(针对研究与咨询报告)" prop="submitInstitute">
            <i-switch :disabled="modalView" v-model="dataForm.submitInstitute">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          </i-Col>
        </Row>
        <Row :gutter="16">
          <i-Col span="8">
          <FormItem label="研究类别" prop="category">
            <DicSelect v-model="dataForm.category" dtype="achievement-category" :clearable="true" placeholder="请选择研究类别" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="学科门类" prop="subject">
            <DicSelect v-model="dataForm.subject" dtype="achievement-subject" :clearable="true" placeholder="请选择学科门类" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="出版发表使用单位" prop="publishOrg">
            <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.publishOrg" :maxlength="100" placeholder="请输入出版发表使用单位" />
          </FormItem>
          </i-Col>
        </Row>
        <Row :gutter="16">
          <i-Col span="8">
          <FormItem label="出版发表使用时间" prop="publishTime">
            <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.publishTime" format="yyyy-MM-dd" placeholder="请输入出版发表使用时间" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="发行代码(ISBN与ISSN号)" prop="publishCode">
            <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.publishCode" :maxlength="100" placeholder="请输入发行代码(ISBN与ISSN号)" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="关键字" prop="keyword">
            <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.keyword" :maxlength="200" placeholder="请输入关键字" />
          </FormItem>
          </i-Col>
        </Row>
        <Row :gutter="16">
          <i-Col span="8">
          <FormItem label="成果字数(千字)" prop="wordCount">
            <InputNumber :min="1" :max="99999" :readonly="modalView" :clearable="!modalView" v-model="dataForm.wordCount" placeholder="请输入成果字数" style="width: 240px;" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem label="成果产生时间" prop="produceTime">
            <IDatePicker type="date" :readonly="modalView" :clearable="!modalView" v-model="dataForm.produceTime" format="yyyy-MM-dd" placeholder="请输入成果产生时间" />
          </FormItem>
          </i-Col>
          <i-Col span="8">
          <FormItem prop="journalLevel">
            <Tooltip content="CSSCI/SSCI/SCI论文标注；中英文论文等级标注；教材标注" slot="label">期刊级别</Tooltip>
            <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.journalLevel" :maxlength="100" placeholder="请输入期刊级别(CSSCI/SSCI/SCI论文标注；中英文论文等级标注；教材标注)" />
          </FormItem>
          </i-Col>
        </Row>
        <FormItem label="成果摘要" prop="summary">
          <Input type="textarea" :autosize="{minRows: 5,maxRows: 8}" :readonly="modalView" :clearable="!modalView" v-model="dataForm.summary" :maxlength="5000" placeholder="请输入成果摘要" />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveAchievementInfo">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/achievement/achievementinfo'
import IDatePicker from '@/view/components/idate-picker'
import DicSelect from '@/view/components/dic-select'
export default {
  name: 'AchievementInfo-form',
  components: {
    IDatePicker,
    DicSelect
  },
  data () {
    return {
      formModalVisible: false,
      modalView: false,
      modalTitle: '',
      batchList: [],
      curBatch: {},
      paperSource: {},
      projectSource: {},
      dataForm: {
        batchId: undefined,
        name: '',
        firstAuthor: '',
        authors: '',
        source: '',
        form: '',
        scope: '',
        translateOtherLang: true,
        category: '',
        submitInstitute: true,
        accpeted: true,
        subject: '',
        publishOrg: '',
        publishTime: '',
        publishCode: '',
        keyword: '',
        wordCount: 1,
        produceTime: '',
        journalLevel: '',
        summary: '',
        year: '',
        id: undefined
      },
      dataFormValidate: {
        batchId: [
          {
            type: 'number',
            required: true,
            message: '批次不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '成果名称不能为空', trigger: 'blur' }
        ],
        firstAuthor: [
          { required: true, message: '第一作者不能为空', trigger: 'blur' }
        ],
        authors: [
          { required: true, message: '作者列表不能为空', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '成果来源不能为空', trigger: 'change' }
        ],
        form: [
          { required: true, message: '成果形式不能为空', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '发表范围不能为空', trigger: 'change' }
        ],
        category: [
          { required: true, message: '研究类别不能为空', trigger: 'change' }
        ],
        subject: [
          { required: true, message: '学科门类不能为空', trigger: 'change' }
        ],
        publishOrg: [
          { required: true, message: '出版发表使用单位不能为空', trigger: 'blur' }
        ],
        publishTime: [
          { required: true, message: '发表使用时间不能为空', trigger: 'blur' }
        ],
        publishCode: [
          { required: true, message: '发行代码不能为空', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ],
        wordCount: [
          { type: 'number', required: true, message: '成果字数(千字)不能为空', trigger: 'blur' }
        ],
        produceTime: [
          { required: true, message: '成果产生时间不能为空', trigger: 'blur' }
        ],
        journalLevel: [
          { required: true, message: '期刊级别不能为空', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '成果摘要不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    'dataForm.batchId': {
      handler () {
        this.curBatch =
          this.batchList.find(item => item.id === this.dataForm.batchId) || {}
        this.dataForm.year = this.curBatch.batchYear
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadBatchList()
    },
    cancel () {
      this.formModalVisible = false
    },
    loadBatchList () {
      api.getAchievementBatchList().then(res => {
        this.batchList = res.list
      })
    },
    loadPaperSource (id) {
      api.getPaperSourceInfo(id).then(res => {
        this.paperSource = res.data
        if (this.paperSource) {
          this.dataForm.sourcePaperId = this.paperSource.id
          this.dataForm.name = this.paperSource.title
          let authors = this.paperSource.authors
          authors = authors.replace(/；/g, ';')
          this.dataForm.authors = authors
          this.dataForm.firstAuthor = authors.split(';')[0]
          this.dataForm.publishTime = this.paperSource.published + '-01-01'
          let isbn = ''
          if (this.paperSource.issn) isbn += this.paperSource.issn
          if (this.paperSource.isbn) isbn += this.paperSource.isbn
          this.dataForm.publishCode = isbn
        }
      })
    },
    loadProjectSource (id) {

    },
    addAchievementInfo (paperSourceId, projectSourceId) {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.modalView = false
      this.formModalVisible = true
      if (paperSourceId) {
        this.loadPaperSource(paperSourceId)
      } else if (projectSourceId) {
        this.loadProjectSource(projectSourceId)
      }
    },
    viewAchievementInfo (id) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      api.getAchievementInfoInfo(id).then(res => {
        let entity = res.achievementInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.formModalVisible = true
      this.modalView = true
    },
    editAchievementInfo (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      api.getAchievementInfoInfo(id).then(res => {
        let entity = res.achievementInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      })
      this.formModalVisible = true
      this.modalView = false
    },
    saveAchievementInfo () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveAchievementInfo(this.dataForm).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).catch(e => {
              this.submitLoading = false
              this.$emit('update')
            })
          } else {
            api.updateAchievementInfo(this.dataForm).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).catch(e => {
              this.$emit('update')
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
.margin10 {
  margin-bottom: 10px;
}
</style>
