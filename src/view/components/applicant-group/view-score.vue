<template>
  <div>
    <Modal :title="modalTitle" v-model="pModalVisible" :footer-hide="true" :mask-closable='false' :width="700" class-name="vertical-center-modal" @on-visible-change="visibleChange">
        <div>
            <Table :columns="columns" :data="dataList"></Table>
        </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'group-view-score',
  props: {
    teacherList: {
      type: Array,
      default () {
        return []
      }
    },
    studentList: {
      type: Array,
      default () {
        return []
      }
    },
    scoreList: {
      type: Array,
      default () {
        return []
      }
    },
    modalVisible: {
      type: Boolean,
      default () {
        return false
      }
    },
    modalTitle: {
      type: String,
      default () {
        return '选择学生'
      }
    }
  },
  data () {
    return {
      pModalVisible: false
    }
  },
  watch: {
    modalVisible (newVal) {
      this.pModalVisible = newVal
    }
  },
  computed: {
    columns () {
      let columns = [{
        title: ' ',
        key: 'studentName',
        minWidth: 100
      }]
      if (!this.teacherList || !this.teacherList.length) {
        return columns
      }
      this.teacherList.forEach((item, index) => {
        columns.push({
          title: item.teacherName,
          key: 'score-' + index,
          minWidth: 100
        })
      })
      return columns
    },
    dataList () {
      let list = this.studentList.map((item, index) => {
        let obj = {
          studentId: item.studentId,
          studentName: item.studentName
        }
        for (let i = 0; i < this.teacherList.length; i++) {
          obj['score-' + i] = '--'
        }
        return obj
      })
      let teacherIds = this.teacherList.map(item => item.teacherId)
      this.scoreList.forEach(element => {
        let teacherIndex = teacherIds.findIndex(item => item === element.teacherId)
        let studentScore = list.find(item => item.studentId === element.studentId)
        if (studentScore) studentScore['score-' + teacherIndex] = element.score
      })

      return list
    }
  },
  methods: {
    visibleChange (visible) {
      if (!visible) {
        this.$emit('on-close')
      }
    }
  }
}
</script>
