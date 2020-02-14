<template>
  <div>
    <Select
      v-model="selectedVal"
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      :cachable="cachable"
      :clearable="clearable"
      :placeholder="placeholder"
      @on-change="onChange"
      @on-clear="onClear"
    >
      <Option v-for="(item, index) in dataList" :value="item.id" :key="index">{{ item.stuName }}</Option>
    </Select>
  </div>
</template>

<script>
import api from '@/api/student'

export default {
  name: 'StudentSelect',
  props: {
    placeholder: {
      type: String,
      default () {
        return '请选择'
      }
    },
    value: {
      type: [Number, Array, String],
      default () {
        return undefined
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    },
    filterable: {
      type: Boolean,
      default () {
        return true
      }
    },
    cachable: {
      type: Boolean,
      default: false
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
    }
  },
  data () {
    return {
      dataList: [],
      selectedVal: ''
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.selectedVal = newVal
    },
    cachable (newVal, oldVal) {
      this.fetchList()
    }
  },
  mounted () {
    this.fetchList()
    if (this.value) {
      this.selectedVal = this.value
    }
  },
  methods: {
    fetchList () {
      let key = 'student-select'
      let list = sessionStorage.getItem(key)
      if (list && list !== 'undefined' && list.length > 0 && this.cachable) {
        this.dataList = JSON.parse(list)
      } else {
        let ctx = this
        this.dataList = []
        this.loadList(() => {
          if (this.cachable) sessionStorage.setItem(key, JSON.stringify(ctx.dataList))
        })
      }
    },
    getStudentName (id) {
      let item = this.dataList.find(item => item.id === id)
      return item.stuName || ''
    },
    getRecord (id) {
      return this.dataList.find(item => item.id === id)
    },
    loadList (callback) {
      api.getAllStudentList({}).then(res => {
        this.dataList = res.data
        callback && callback()
      })
    },
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
