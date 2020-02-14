<template>
  <div>
    <DatePicker :value="inputVal" :disabled="disabled" :readonly="readonly" :type="type"  :splitPanels="splitPanels" :placeholder="placeholder" :format="format" :clearable="clearable" @on-change="onChange" @on-clear="onClear" style="width: 100%"></DatePicker>
  </div>
</template>

<script>
export default {
  name: 'iDatePicker',
  props: {
    placeholder: {
      type: String,
      default () {
        return '请选择日期'
      }
    },
    type: {
      type: String,
      default () {
        return 'date'
      }
    },
    splitPanels: {
      type: Boolean,
      default () {
        return false
      }
    },
    format: {
      type: String,
      default () {
        return 'yyyy-MM-dd'
      }
    },
    value: {
      type: [String, Array],
      default () {
        return ''
      }
    },
    clearable: {
      type: Boolean,
      default () {
        return false
      }
    },
    editable: {
      type: Boolean,
      default () {
        return false
      }
    },
    readonly: {
      type: Boolean,
      default () {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      inputVal: ''
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.inputVal = newVal
    }
  },
  mounted () {
    if (this.value) {
      this.inputVal = this.value
    }
  },
  methods: {
    onChange (value) {
      this.$emit('input', value)
      this.$emit('on-change', value)
    },
    onClear () {
      this.$emit('on-clear')
    }
  }
}
</script>

<style>

</style>
