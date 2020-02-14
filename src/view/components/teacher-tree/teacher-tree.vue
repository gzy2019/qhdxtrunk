<template>
  <div>
    <Tree :data="treeData" show-checkbox @on-check-change="checkChangeHandle"></Tree>
    <Spin size="large" fix v-if="loading"></Spin>
  </div>
</template>

<script>
import api from '@/api/department'
export default {
  name: 'teacher-tree',
  data () {
    return {
      treeSelected: [],
      loading: false,
      treeData: []
    }
  },
  mounted () {
    this.loadTreeData()
  },
  methods: {
    dataTransform (list) {
      if (list && list.length) {
        let travelFunc = function (list) {
          if (list && list.length) {
            list.forEach(item => {
              item.title = item.label
              item.id = item.value
              if (item.children) {
                travelFunc(item.children)
              }
            })
          }
        }
        travelFunc(list)
        this.treeData = list
      }
    },
    loadTreeData () {
      this.loading = true
      api.getAllDepartmentTeacherTree({}).then(res => {
        this.dataTransform(res.list)
      }).finally(() => {
        this.loading = false
      })
    },
    checkChangeHandle (arr, node) {
      this.$emit('on-check-change', arr)
    }
  }
}
</script>

<style>

</style>
