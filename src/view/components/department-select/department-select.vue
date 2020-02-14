<template>
  <div>
    <Cascader :data="dataList" v-model="selectedVal" :change-on-select="changeOnSelect" :clearable="clearable" :filterable="filterable" @on-change="handleChange"></Cascader>
  </div>
</template>

<script>
import api from '@/api/department'

export default {
  name: 'DepartmentSelect',
  props: {
    size: {
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
      type: [Number, Array],
      default () {
        return 0
      }
    },
    changeOnSelect: {
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
    editModel: {
      type: Boolean,
      default () {
        return false
      }
    },
    cachable: {
      type: Boolean,
      default () {
        return true
      }
    },
    clearable: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      dataList: [],
      selectedVal: [],
      nodeDic: {}
    }
  },
  watch: {
    value (newVal, oldVal) {
      console.log(this.value)
      this.selectedVal = this.value || []
      let node = this.nodeDic[this.value]
      console.log(node)
      if (node) {
        this.selectedVal = node.treePath
      }
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      let key = 'cache-dept-tree'
      let list = sessionStorage.getItem(key)
      if (list && list !== 'undefined' && this.cachable) {
        this.dataList = JSON.parse(list)
        this.handleAllNode()
      } else {
        let ctx = this
        this.loadList(() => {
          sessionStorage.setItem(key, JSON.stringify(ctx.dataList))
          ctx.handleAllNode()
        })
      }
    },
    loadList (callback) {
      api.getAllDepartmentTree({}).then(res => {
        console.log('========loadList=======')
        this.dataList = res.list
        callback && callback()
      })
    },
    handleAllNode () {
      let ctx = this
      let travelFunc = function (node) {
        ctx.nodeDic[node.value] = node
        if (node.parentId && ctx.nodeDic[node.parentId]) {
          node.treePath = ctx.nodeDic[node.parentId].treePath.concat([node.value])
        }
        if (node.children) {
          node.children.map(child => {
            travelFunc(child)
          })
        }
      }
      this.dataList.map(item => {
        item.treePath = [item.value]
        travelFunc(item)
      })

      this.removeSelf()
    },
    getDepartmentName (id) {
      let name = ''
      let travelFunc = (nodeList) => {
        if (nodeList && nodeList.length) {
          nodeList.forEach(node => {
            if (node.value === id) {
              name = node.label
            } else if (node.children) {
              travelFunc(node.children)
            }
          })
        }
      }
      travelFunc(this.dataList)
      return name
    },
    getTreePath (id) {
      return this.nodeDic[id].treePath
    },
    removeSelf () {
      if (!this.value || !this.editModel) {
        return
      }
      let selectNode = this.nodeDic[this.value]
      if (selectNode) {
        delete selectNode.children
      }
    },
    refresh () {
      this.fetchList()
    },
    handleChange (value, selectedData) {
      console.log('value=' + value)
      if (value.length) {
        this.$emit('input', value[value.length - 1])
        this.$emit('on-change', value[value.length - 1], value, selectedData)
      } else {
        this.$emit('input', undefined)
      }
    }
  }
}
</script>

<style>

</style>
