<template>
  <div>
    <Row>
      <Spin size="large" fix v-if="loading"></Spin>
      <Col span="4">
        <Card class="df-card" v-if="curFormId">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon> 问题列表
          </p>
          <draggable
            class="dragArea list-group"
            :list="validWidgetList"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="cloneWidget"
          >
            <Button long v-for="(item,index) in validWidgetList" :icon="item.icon" @click="cloneWidget(item)" :key="index" class="df-widget-button">{{item.title}}</Button>
          </draggable>
        </Card>
      </Col>
      <Col span="13">
        <Card class="df-card">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon> {{formData.attribute.title}}
          </p>
          <div slot="extra">
            <Button v-if="curFormId" shape="circle" :loading="submitLoading" size="small" type="primary" @click="saveFormData">保存</Button>
            <Select v-model="curFormId" size="small" style="width:100px">
              <Option v-for="item in formList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
            <Tooltip transfer placement="top" content="预览" v-if="curFormId">
              <a href="javascript:void(0)" @click="previewForm" class="df-card-extra"><Icon type="ios-eye" /></a>
            </Tooltip>
            <Tooltip transfer placement="top" content="生成JSON" v-if="curFormId">
              <a href="javascript:void(0)" @click="drawerCode = true" class="df-card-extra"><Icon type="ios-code-working" /></a>
            </Tooltip>
          </div>
          <Form ref="iform" :label-position="formData.attribute.labelPosition" :label-width="comFormLabelWidth" v-if="curFormId">
            <draggable
                class="dragArea list-group"
                :list="formData.itemList"
                group="people"
              >
              <div v-for="(item,index) in formData.itemList" :key="item.id" :class="getlockCss(item)"  @click="itemBlockClik(item)">
                <div class="item-oper">
                  <a href="javascript:void(0)" @click="itemBlockCopy(index)"><Icon type="ios-copy-outline"></Icon></a>
                  <a href="javascript:void(0)" @click="itemBlockRemove(index)"><Icon type="ios-trash-outline"></Icon></a>
                </div>
                <div class="item-content">
                  <DElement :attribute="item" :size="formData.attribute.itemSize" />
                </div>
              </div>
              <div v-if="!formData.itemList.length" class="empty-tip-text">从左侧拖拽或点击来添加字段</div>
            </draggable>
          </Form>
          <div v-if="!curFormId" style="top:30%;left:40%;">
            <Button type="dashed" @click="addQaForm">点击创建问卷</Button>
          </div>
        </Card>
      </Col>
      <Col span="6">
        <Card class="df-card" v-if="curFormId">
          <Tabs value="name1">
            <TabPane label="问题属性" name="name1">
              <DElementAttribute v-model="curItem" v-if="curItem.id" />
              <div v-else class="empty-tip-text">请添加字段</div>
            </TabPane>
            <TabPane label="问卷属性" name="name2">
              <DFormAttribute v-model="formData.attribute" />
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
    <Drawer title="表单JSON" width="400" :closable="false" v-model="drawerCode" v-if="curFormId">
      <rawDisplayer class="col-3" :value="curItem" title="curItem" />
      <rawDisplayer class="col-3" :value="formData" title="formData" />
    </Drawer>
    <Drawer title="表单预览" width="800" :closable="false" v-model="drawerPreview" v-if="curFormId">
      <DFormPreview ref="dFormPreview" />
    </Drawer>

    <QaFormForm ref="qaFormForm" @on-save="saveCallback" />
  </div>
</template>

<script>
import QaFormForm from './components/qaform-form'
import api from '@/api/qa/qaform'
import DElement from './design-components/delement'
import DElementAttribute from './design-components/delement-attribute'
import DFormAttribute from './design-components/dform-attribute'
import DFormPreview from './design-components/dform-preview'
import draggable from 'vuedraggable'
var counter = 11
export default {
  name: 'designIndex',
  components: { draggable, DElement, DElementAttribute, DFormAttribute, DFormPreview, QaFormForm },
  data () {
    return {
      loading: false,
      submitLoading: false,
      drawerCode: false,
      drawerPreview: false,
      widgetList: [
        { id: 1, title: '单行填空题', enable: true, type: 'text', icon: 'ios-create', attrCodes: ['a-placeholder', 'a-maxlength'] },
        { id: 2, title: '多行填空题', enable: true, type: 'textarea', icon: 'md-list', attrCodes: ['a-placeholder', 'a-maxlength'] },
        { id: 3, title: '计数器', enable: true, type: 'number', icon: 'ios-calculator', attrCodes: ['a-number'] },
        { id: 4, title: '单选题', enable: true, type: 'radio', icon: 'ios-radio-button-on', attrCodes: ['a-option', 'a-layout'] },
        { id: 5, title: '多选题', enable: true, type: 'checkbox', icon: 'ios-checkbox', attrCodes: ['a-option'] },
        { id: 6, title: '日期选择框', enable: true, type: 'date', icon: 'ios-calendar', attrCodes: ['a-dformat'] },
        { id: 7, title: '时间选择框', enable: true, type: 'time', icon: 'ios-time', attrCodes: ['a-tformat'] },
        { id: 8, title: '下拉选择题', enable: true, type: 'select', icon: 'ios-arrow-down', attrCodes: ['a-option', 'a-multiple'] },
        { id: 9, title: '图片上传', enable: true, type: 'image', icon: 'ios-camera', attrCodes: ['a-multiple'] },
        { id: 10, title: '文件上传', enable: true, type: 'file', icon: 'ios-cloud-upload', attrCodes: ['a-multiple'] },
        { id: 11, title: '评价打分题', enable: true, type: 'rate', icon: 'ios-star', attrCodes: [] }
      ],
      curItem: {},
      curItemAttribute: {},
      formList: [],
      curFormId: null,
      formData: {
        attribute: {
          title: '表单标题',
          memo: '',
          labelPosition: 'top',
          labelWidth: 100,
          itemSize: 'default'
        },
        itemList: []
      }
    }
  },
  computed: {
    comFormLabelWidth () {
      if (!this.formData.attribute) {
        return 120
      }
      if (this.formData.attribute.labelPosition === 'top') {
        return null
      }
      return this.formData.attribute.labelWidth
    },
    validWidgetList () {
      if (!this.formData.attribute.qaType) {
        return []
      }
      let type1 = ['text', 'textarea', 'radio', 'checkbox', 'select', 'rate']
      let type2 = ['radio', 'checkbox', 'select']
      if (this.formData.attribute.qaType === 1) {
        return this.widgetList.filter(item => item.enable && type1.includes(item.type))
      }
      if (this.formData.attribute.qaType === 2) {
        return this.widgetList.filter(item => item.enable && type2.includes(item.type))
      }

      return []
    }
  },
  watch: {
    curItem: {
      deep: true,
      handler () {
        let item = this.formData.itemList.find(item => item.id === this.curItem.id)
        if (item) Object.assign(item, this.curItem)
      }
    },
    curFormId: {
      handler () {
        this.loadFormData()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.curFormId = this.$route.query.fid
      this.loadFormList()
    },
    loadFormList () {
      api.getQaFormDataList({enable: 1}).then(res => {
        this.formList = res.list
      })
    },
    loadFormData () {
      if (!this.curFormId) {
        return false
      }
      this.loading = true
      api.getQaFormDesignInfo(this.curFormId).then(res => {
        this.loading = false
        let item = res.qaForm
        let form = {
          attribute: {},
          itemList: []
        }
        Object.assign(form.attribute, item)
        delete form.attribute.itemList
        form.itemList = item.itemList || []
        form.itemList.forEach(item => {
          item.attrCodes = JSON.parse(item.attrCodes)
        })
        Object.assign(this.formData, form)
      }).finally(() => {
        this.loading = false
      })
    },
    addQaForm () {
      this.$refs.qaFormForm.addQaForm()
    },
    saveCallback (id) {
      this.curFormId = id
      this.loadFormList()
    },
    saveFormData () {
      let data = {}
      Object.assign(data, this.formData.attribute)
      data.itemList = this.formData.itemList
      data.itemList.forEach(item => {
        item.attrCodes = JSON.stringify(item.attrCodes)
      })
      this.submitLoading = true
      api.updateQaDesignForm(data).then(res => {
        this.$Message.success('保存成功!')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    initFormItem (item) {
      if (item.type === 'radio') {
        item.optionList = [
          { fid: -1, label: '单选1' },
          { fid: -2, label: '单项2' },
          { fid: -3, label: '单项3' }
        ]
        item.multiple = false
      }
      if (item.type === 'checkbox') {
        item.optionList = [
          { fid: -1, label: '多项1' },
          { fid: -2, label: '多项2' },
          { fid: -3, label: '多项3' }
        ]
        item.multiple = true
      }
      if (item.type === 'select') {
        item.optionList = [
          { fid: -1, label: '下拉选项1' },
          { fid: -2, label: '下拉选项2' },
          { fid: -3, label: '下拉选项3' }
        ]
      }
      if (item.type === 'textarea') {
        item.maxlength = 500
      }
    },
    cloneWidget (widget) {
      let dateFormat = widget.type === 'date' ? 'yyyy-MM-dd' : ''
      let timeFormat = widget.type === 'time' ? 'HH:mm:ss' : ''
      let item = {
        id: counter++ * -1,
        type: widget.type,
        title: widget.title,
        attrCodes: widget.attrCodes,
        placeholder: '',
        width: 100,
        maxlength: 100,
        layout: 'block',
        style: '',
        required: true,
        optionRand: false,
        stats: false,
        optionList: [],
        className: '',
        multiple: false,
        minVal: 0,
        maxVal: 9999,
        dateFormat: dateFormat,
        timeFormat: timeFormat
      }
      this.initFormItem(item)
      this.formData.itemList.push(item)
    },
    getlockCss (item) {
      if (this.curItem && item.id === this.curItem.id) {
        return 'dform-item-block dform-item-block-active'
      }
      return 'dform-item-block'
    },
    itemBlockClik (item) {
      this.curItem = item
    },
    itemBlockRemove (index) {
      let item = this.formData.itemList[index]
      if (item.id === this.curItem.id) {
        this.curItem.id = null
      }
      this.formData.itemList.splice(index, 1)
    },
    itemBlockCopy (index) {
      let item = this.formData.itemList[index]
      let itemCopy = Object.assign({}, item)
      itemCopy.id = counter++
      this.formData.itemList.splice(index, 0, itemCopy)
    },
    previewForm () {
      this.drawerPreview = true
      this.$refs.dFormPreview.init(JSON.stringify(this.formData))
    }
  }
}
</script>
<style scoped>
.df-widget-button {
  margin: 5px 0 0 0;
  text-align:left;
  width: 90%;
}
.df-card {
  min-height: 600px;
  margin: 5px;
}
.df-card-extra {
  font-size: 18px;
  color: rgb(178, 178, 178);
  margin: 0 5px;
}
</style>
<style lang="less" >
.dform-item-block {
  margin: 5px 0;
  border-radius: 5px;
  padding: 10px;
  border: 1px solid #80808057;
  .item-oper {
    float: right;
  }
  .item-content {
    clear: both;
    display: block;
  }
}
.dform-item-block-active {
  border: 2px solid #0f26d670;
  box-shadow: 5px 10px 15px 2px rgba(0,0,0,0.1);
}
.empty-tip-text {
  position: absolute;
  text-align: center;
  width: 100px;
  height: 20px;
  font-size: 18px;
  top: 50%;
  width: 90%;
  margin-top: -10px;
  color: #ccc;
}
</style>
