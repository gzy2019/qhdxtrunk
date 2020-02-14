<template>
  <div>
    <TimePicker :value="inputVal" :type="type" :readonly="readonly" :editable="editable" :placeholder="placeholder" :format="format" :clearable="clearable" :disabled="disabled" @on-change="onChange" @on-clear="onClear" style="width: 100%"></TimePicker>
  </div>
</template>

<script>
export default {
  name: 'iTimePicker',
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
        return 'time'
      }
    },
    format: {
      type: String,
      default () {
        return 'HH:mm:ss'
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
    disabled: {
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
    editable: {
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
