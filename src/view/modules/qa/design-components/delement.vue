<template>
  <div>
    <FormItem v-if="refresh" :label="comTitle" :prop="prop">
      <Input v-if="attribute.type === 'text'" v-model="eleVal" :type="attribute.type" :maxlength="maxlength" :placeholder="attribute.placeholder" :style="style" :size="size"/>
      <Input v-if="attribute.type === 'textarea'" v-model="eleVal" :type="attribute.type" :maxlength="maxlength" :placeholder="attribute.placeholder" :style="style" :size="size"/>
      <InputNumber v-if="attribute.type === 'number'" v-model="eleVal" :min="attribute.minVal" :max="attribute.maxVal" :style="style" :size="size"/>
      <Select v-if="attribute.type === 'select'" v-model="eleVal" transfer :multiple="attribute.multiple" :placeholder="attribute.placeholder" :maxlength="maxlength" :style="style" :size="size">
        <Option :value="item.id" v-for="(item,index) in optionList" :key="index">{{item.label}}</Option>
      </Select>
      <IDatePicker v-if="attribute.type === 'date'" v-model="eleVal" :format="attribute.dateFormat" :placeholder="attribute.placeholder" :style="style" :size="size"/>
      <ITimePicker v-if="attribute.type === 'time'" v-model="eleVal" :format="attribute.timeFormat" :placeholder="attribute.placeholder" :style="style" :size="size"/>
      <IUpload v-if="attribute.type === 'file'" v-model="eleVal" type="drag" :multiple="attribute.multiple" :style="style" />
      <ImageUpload v-if="attribute.type === 'image'" v-model="eleVal" :multiple="attribute.multiple" :showUploadlist="false" :style="style" />
      <RadioGroup v-if="attribute.type === 'radio'" v-model="eleVal" :size="size" :vertical="attribute.layout === 'block'">
        <Radio :label="item.id" v-for="(item,index) in optionList" :key="index"><span> {{getOptionLabel(index,item)}}</span></Radio>
      </RadioGroup>
      <CheckboxGroup v-if="attribute.type === 'checkbox'" v-model="eleVal" :size="size" :vertical="attribute.layout === 'block'">
        <Checkbox :label="item.id" v-for="(item,index) in optionList" :key="index" style="margin:0 10px;"> {{getOptionLabel(index,item)}}</Checkbox>
      </CheckboxGroup>
      <Rate v-if="attribute.type === 'rate'" v-model="eleVal" show-text allow-half :size="size"/>
    </FormItem>
  </div>
</template>
<script>
import IDatePicker from '@/view/components/idate-picker'
import ITimePicker from '@/view/components/itime-picker'
import IUpload from '@/view/components/iupload'
import ImageUpload from '@/view/components/image-upload'
export default {
  name: 'design-delement',
  components: { IDatePicker, ITimePicker, IUpload, ImageUpload },
  props: {
    attribute: {
      type: Object,
      default () {
        return {
          id: null,
          attrCodes: [],
          name: '',
          type: 'text',
          title: '标题内容',
          placeholder: '',
          layout: '',
          width: null,
          maxlength: null,
          required: false,
          stats: false,
          className: '',
          style: '',
          optionRand: false,
          optionList: [],
          multiple: false,
          minVal: 0,
          maxVal: 9999,
          dateFormat: dateFormat,
          timeFormat: timeFormat
        }
      }
    },
    size: {
      type: String,
      default () {
        return 'default'
      }
    },
    prop: {
      type: String,
      default () {
        return ''
      }
    },
    index: {
      type: Number,
      default () {
        return 0
      }
    },
    value: {
      type: [String, Number, Array],
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      refresh: false,
      eleVal: null
    }
  },
  watch: {
    attribute: {
      immediate: true,
      deep: true,
      handler () {
        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
        })
      }
    },
    value: {
      immediate: true,
      handler () {
        this.eleVal = this.value || ''
      }

    },
    eleVal () {
      if (this.eleVal !== this.value) this.$emit('input', this.eleVal)
    }
  },
  computed: {
    optionList () {
      if (this.attribute.optionList) {
        return this.attribute.optionList
      }
      return []
    },
    maxlength () {
      if (this.attribute.maxlength) {
        return parseInt(this.attribute.maxlength)
      }
      return 100
    },
    style () {
      let width = 100
      if (this.attribute.width) {
        width = parseInt(this.attribute.width)
      }
      let style = this.attribute.style
      if (!style) {
        style = `width: ${width}%`
      } else if (style.indexOf('width') < 0) {
        style += `width: ${width}%`
      }

      return style
    },
    comTitle () {
      if (this.index) {
        return this.index + '. ' + this.attribute.title
      }

      return this.attribute.title
    }
  },
  mounted () {
    this.initEleVal()
  },
  methods: {
    initEleVal () {
      if (this.eleVal) {
        return false
      }
      this.eleVal = ''
      if (this.attribute.type === 'checkbox') {
        this.eleVal = []
      }
      if (this.attribute.type === 'file') {
        this.eleVal = []
      }
      if (this.attribute.type === 'image') {
        this.eleVal = []
      }
      if (this.attribute.type === 'select' && this.attribute.multiple) {
        this.eleVal = []
      }
      if (this.attribute.type === 'number') {
        this.eleVal = 0
      }
      if (this.attribute.type === 'rate') {
        this.eleVal = 0
      }
    },
    getOptionLabel (index, item) {
      let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
      if (alphabet.length > index) {
        return alphabet[index] + '. ' + item.label
      }
    }
  }
}
</script>
