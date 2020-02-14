<template>
  <div>
    <Form :model="attributeForm" label-position="top">
      <template v-if="hasCode('a-id')">
        <FormItem label="字段标识">
          <Input v-model="attributeForm.itemId" :maxlength="50" />
        </FormItem>
      </template>

      <template>
        <FormItem label="标题">
          <Input v-model="attributeForm.title" :maxlength="200" />
        </FormItem>
      </template>

      <template v-if="hasCode('a-placeholder')">
        <FormItem label="占位内容">
          <Input v-model="attributeForm.placeholder" :maxlength="100" />
        </FormItem>
        <Divider />
      </template>

      <template>
        <Row>
          <Col span="12">
            <FormItem label="宽度百分比">
              <InputNumber v-model="attributeForm.width" :min="10" :max="100" />
            </FormItem>
          </Col>
          <Col span="12" v-if="hasCode('a-maxlength')">
            <FormItem label="内容长度">
              <InputNumber v-model="attributeForm.maxlength" :min="0" :max="1000" />
            </FormItem>
          </Col>
        </Row>
      </template>

      <template v-if="hasCode('a-number')">
        <Row>
          <Col span="12">
            <FormItem label="最小值">
              <InputNumber v-model="attributeForm.minVal" :min="0" :max="9999999" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="最大值">
              <InputNumber v-model="attributeForm.maxVal" :min="0" :max="9999999" />
            </FormItem>
          </Col>
        </Row>
        <Divider />
      </template>

      <template v-if="hasCode('a-option')">
        <Row>
          <Col span="8">
            <FormItem label="选项随机">
              <Checkbox v-model="attributeForm.optionRand"> 随机</Checkbox>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="允许多选">
              <Checkbox v-model="attributeForm.multiple"> 允许</Checkbox>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="是否统计">
              <Checkbox v-model="attributeForm.stats"> 是</Checkbox>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="选项">
          <draggable :list="attributeForm.optionList" handle=".handle">
            <Row v-for="(item,oindex) in attributeForm.optionList" :key="item.id">
              <Col span="2">
                <Radio v-model="item.checked" @on-change="checkChangeHandle(item)" />
              </Col>
              <Col span="14">
                <Input size="small" v-model="item.label" :maxlength="100"/>
              </Col>
              <Col span="2" style="margin-left: 5px;">
                <Icon type="ios-menu-outline" class="handle" />
              </Col>
              <Col span="2">
                <Button size="small" shape="circle" icon="ios-trash" @click="removeOption(oindex)" />
              </Col>
            </Row>
          </draggable>
          <Row>
            <Col span="24">
              <Button size="small" @click="addOption" type="primary">添加选项</Button>
            </Col>
          </Row>
        </FormItem>
        <Divider />
      </template>

      <template v-if="hasCode('a-layout')">
        <FormItem label="布局方式">
          <RadioGroup v-model="attributeForm.layout" type="button">
            <Radio label="block">块级</Radio>
            <Radio label="inline">行内</Radio>
          </RadioGroup>
        </FormItem>
      </template>

      <template>
        <FormItem label="校验">
          <Checkbox v-model="attributeForm.required"> 必填</Checkbox>
        </FormItem>
      </template>

      <template v-if="hasCode('a-dformat')">
        <FormItem label="选择日期格式">
          <Select transfer v-model="attributeForm.dateFormat">
            <Option value="yyyy-MM-dd">yyyy-MM-dd</Option>
            <Option value="yyyyMMdd">yyyyMMdd</Option>
            <Option value="yyyy/MM/dd">yyyy/MM/dd</Option>
          </Select>
        </FormItem>
      </template>

      <template v-if="hasCode('a-tformat')">
        <FormItem label="选择时间格式">
          <Select transfer v-model="attributeForm.timeFormat">
            <Option value="HH:mm:ss">HH:mm:ss</Option>
            <Option value="HH:mm">HH:mm</Option>
          </Select>
        </FormItem>
      </template>

      <template v-if="hasCode('a-class')">
        <FormItem label="自定义Class">
          <Input v-model="attributeForm.className" :maxlength="100" />
        </FormItem>
      </template>
    </Form>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
var counter = 1
export default {
  name: 'design-delement-attribute',
  components: { draggable },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      optionItem: {
        id: null,
        sort: 0,
        value: '',
        label: ''
      },
      attributeForm: {
        title: '',
        placeholder: '',
        attrCodes: [],
        width: null,
        maxlength: null,
        layout: null,
        required: null,
        stats: false,
        optionRand: false,
        optionList: [],
        className: '',
        style: '',
        multiple: false,
        minVal: 0,
        maxVal: 9999,
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm:ss'
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        Object.assign(this.attributeForm, this.value)
      }
    },
    attributeForm: {
      deep: true,
      handler () {
        if (this.attributeForm.optionList) {
          this.attributeForm.optionList.forEach((item, index) => {
            item.sort = index
          })
        }
        this.$emit('input', this.attributeForm)
      }
    }
  },
  methods: {
    hasCode (code) {
      return this.attributeForm.attrCodes && this.attributeForm.attrCodes.includes(code)
    },
    addOption () {
      let item = Object.assign({}, this.optionItem)
      item.id = counter++ * -1
      this.attributeForm.optionList.push(item)
    },
    removeOption (index) {
      this.attributeForm.optionList.splice(index, 1)
    },
    checkChangeHandle (item) {
      let otherList = this.attributeForm.optionList.filter(it => it.id !== item.id)
      otherList.forEach(it => {
        it.checked = false
      })
    }
  },
  mounted () {

  }
}
</script>
