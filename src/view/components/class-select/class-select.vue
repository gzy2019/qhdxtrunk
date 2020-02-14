<template>
  <div>
    <Select v-model="selectedVal" :multiple="multiple" :filterable="filterable" :cachable="cachable" :clearable="clearable" :placeholder="placeholder" @on-change="onChange" @on-clear="onClear">
      <Option v-for="(item, index) in dataList" :value="item.id" :key="index">{{ item.className }}</Option>
    </Select>
  </div>
</template>

<script>
import api from '@/api/class'

export default {
  name: 'ClassSelect',
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
      let key = 'class-select'
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
    getClassNames (ids) {
      let items = this.dataList.filter(item =>
        ids.findIndex((value, index, arr) => {
          return item.id === value
        }) >= 0
      )
      let classNames = items.map(item => {
        return item.className
      })
      return classNames
    },
    loadList (callback) {
      api.getAllClass({}).then(res => {
        console.log(res.data)
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
