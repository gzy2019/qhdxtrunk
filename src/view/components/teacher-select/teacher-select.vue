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
      <Option v-for="(item, index) in dataList" :value="item.id" :key="index">{{ item.teaName }}</Option>
    </Select>
  </div>
</template>

<script>
import api from '@/api/teacher'

export default {
  name: 'TeacherSelect',
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
      let key = 'teacher-select'
      let list = sessionStorage.getItem(key)
      if (list && list !== 'undefined' && list.length > 0 && this.cachable) {
        this.dataList = JSON.parse(list)
      } else {
        let ctx = this
        this.dataList = []
        this.loadList(() => {
          sessionStorage.setItem(key, JSON.stringify(ctx.dataList))
        })
      }
    },
    getTeacherName (id) {
      let item = this.dataList.find(item => item.id === id)
      return item.teaName || ''
    },
    // 多选时返回逗号分割的教师姓名
    getTeacherNames (ids) {
      let items = this.dataList.filter(item =>
        ids.findIndex((value, index, arr) => {
          return item.id === value
        }) >= 0
      )
      let teaNames = items.map(item => {
        return item.teaName
      })
      return teaNames
    },
    getRecord (id) {
      return this.dataList.find(item => item.id === id)
    },
    loadList (callback) {
      api.getAllTeacher({}).then(res => {
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
