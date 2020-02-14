<template>
  <div>
    <Form :model="attributeForm" label-position="top">
      <FormItem label="表单标题">
        <Input v-model="attributeForm.title" :maxlength="200" />
      </FormItem>
      <FormItem label="表单说明">
        <Input type='textarea' :rows="4" v-model="attributeForm.memo" :maxlength="500" />
      </FormItem>
      <FormItem label="标签对齐方式">
        <RadioGroup v-model="attributeForm.labelPosition" type="button">
          <Radio label="top">顶部对齐</Radio>
          <Radio label="left">左对齐</Radio>
          <Radio label="right">右对齐</Radio>
        </RadioGroup>
      </FormItem>
      <Divider />
      <FormItem label="表单标签宽度">
        <InputNumber v-model="attributeForm.labelWidth" :step="10" :min="0" :max="500" style="width: 60%;"/>
      </FormItem>
      <Divider />
      <FormItem label="组件尺寸">
        <RadioGroup v-model="attributeForm.itemSize" type="button">
          <Radio label="default">正常</Radio>
          <Radio label="large">偏大</Radio>
          <Radio label="small">偏小</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'design-form-attribute',
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
      attributeForm: {
        title: '',
        memo: '',
        labelPosition: 'top',
        labelWidth: 100,
        itemSize: 'default'
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
        this.$emit('input', this.attributeForm)
      }
    }
  },
  methods: {

  }
}
</script>
