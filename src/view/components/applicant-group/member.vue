<template>
  <div>
    <Modal :title="modalTitle" v-model="pModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal" @on-visible-change="visibleChange">
      <Transfer :data="data" :target-keys="targetKeys" :list-style="listStyle" :operations="['','']" filterable @on-change="handleChange">
      </Transfer>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

export default {
  name: 'group-member-select',
  props: {
    orgData: {
      type: Array,
      default () {
        return []
      }
    },
    selectedData: {
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
    },
    listStyle: {
      type: Object,
      default () {
        return {
          width: '300px',
          height: '350px'
        }
      }
    }
  },
  data () {
    return {
      data: [],
      targetKeys: [],
      pModalVisible: false,
      targetList: []
    }
  },
  watch: {
    orgData (newVal) {
      this.data = newVal
    },
    selectedData (newVal) {
      this.targetKeys = newVal
    },
    modalVisible (newVal) {
      this.pModalVisible = newVal
    }
  },
  methods: {
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
      this.targetList = this.data.filter(item => targetKeys.includes(item.key))
    },
    cancel () {
      this.$emit('on-close')
    },
    visibleChange (visible) {
      if (!visible) {
        this.$emit('on-close')
      }
    },
    submit () {
      this.$emit('on-change', this.targetList)
    }
  }
}
</script>
