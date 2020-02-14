<template>
  <div>
      <!-- 查看 start-->
      <Modal title="统计结果" v-model="formModalVisible" :footer-hide="true" :mask-closable='false' :width="850" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Card>
          <div class="stats-item-block" v-for="(item,index) in comItemList" :key="index">
            <p>{{index + 1}}. {{item.title}}</p>
            <div class="stats-option-block" v-for="(opt,oindex) in getOptionStatsList(item.id)" :key="oindex">
              <div class="stats-option-label">
                {{opt.label}} ({{opt.counter}})
              </div>
              <div class="stats-option-percent">
                <Progress :percent="getPercent(opt.counter)" />
              </div>
            </div>
          </div>
        </Card>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/qa/qaform'
export default {
  name: 'QaForm-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        enable: '',
        beginDate: '',
        endDate: '',
        title: '',
        memo: '',
        qaType: '',
        itemList: [],
        itemStatsList: [],
        instCount: 0,
        id: undefined
      }
    }
  },
  computed: {
    comItemList () {
      if (!this.dataForm.itemList) return []
      let types = ['radio', 'checkbox', 'select']
      return this.dataForm.itemList.filter(item => types.includes(item.type))
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewQaForm(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    getPercent (count) {
      let total = this.dataForm.instCount || 0
      if (!total) return 0
      let result = (count * 1.0 / total).toFixed(2)
      return Math.round(result * 100)
    },
    getOptionStatsList (itemId) {
      if (!this.dataForm.itemStatsList) {
        return []
      }
      let opts = this.dataForm.itemStatsList.filter(item => item.itemId === itemId) || []
      opts.sort((a, b) => a.optionId - b.optionId)
      return opts
    },
    viewQaForm (id) {
      this.loading = true
      api.getQaFormInfo(id).then(res => {
        let entity = res.qaForm
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.stats-item-block {
  margin: 10px 0;
  padding: 5px;
  .stats-option-block {
    padding: 5px;
    height: 30px;
    .stats-option-label {
      float:left;
      width: 50%;
    }
    .stats-option-percent {
      float:left;
      width: 50%;
    }
  }

}
</style>
