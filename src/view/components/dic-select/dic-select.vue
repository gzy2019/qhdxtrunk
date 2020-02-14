<template>
  <div>
    <Select v-model="selectedVal" :multiple="multiple" :disabled="disabled" :filterable="filterable" :cachable="cachable" :clearable="clearable" :placeholder="placeholder" @on-change="onChange" @on-clear="onClear">
      <Option v-for="(item, index) in dataList" :value="item.dicValue" :key="index">{{ item.dicName }}</Option>
    </Select>
  </div>
</template>

<script>
import api from '@/api/dic'

export default {
  name: 'Dics',
  props: {
    dtype: {
      type: String,
      default () {
        return ''
      }
    },
    placeholder: {
      type: String,
      default () {
        return '请选择'
      }
    },
    value: {
      type: [String, Array],
      default () {
        return ''
      }
    },
    multiple: {
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
    dtype (newVal, oldVal) {
      this.fetchListByType()
      this.selectedVal = ''
    },
    value (newVal, oldVal) {
      this.selectedVal = newVal
    },
    cachable (newVal, oldVal) {
      this.fetchListByType()
    }
  },
  mounted () {
    console.log('dtype2:' + this.dtype)
    if (this.dtype) {
      this.fetchListByType()
    }
    if (this.value) {
      this.selectedVal = this.value
    }
  },
  methods: {
    fetchListByType () {
      let key = 'dics-' + this.dtype
      let list = sessionStorage.getItem(key)
      if (list && list !== 'undefined' && list.length > 0 && this.cachable) {
        this.dataList = JSON.parse(list)
      } else {
        let ctx = this
        this.dataList = []
        this.loadListByType(() => {
          sessionStorage.setItem(key, JSON.stringify(ctx.dataList))
        })
      }
    },
    loadListByType (callback) {
      if (this.dtype) {
        api.getDicByType(this.dtype).then(res => {
          console.log('========loadListByType=======')
          console.log(res.data)
          this.dataList = res.data
          callback && callback()
        })
      }
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
