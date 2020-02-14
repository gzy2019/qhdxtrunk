<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="申报批次" prop="batchId" style="margin-bottom:6px">
            <Select v-model="batchId" style="width:170px">
              <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchName }}</Option>
            </Select>
          </Form-item>
        </Form>
      </Row>
      <Tabs v-model="activeTab">
        <TabPane label="助教" name="name1">
          <Assistant v-show="activeTab === 'name1'" :batchId="batchId" />
        </TabPane>
        <TabPane label="助管" name="name2">
          <Admin v-show="activeTab === 'name2'" :batchId="batchId" />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import Admin from './components/admin'
import Assistant from './components/assistant'
import apiBatch from '@/api/declare-ta/batch'
export default {
  name: 'post',
  components: {
    Admin,
    Assistant
  },
  data () {
    return {
      batchId: undefined,
      activeTab: 'name1',
      batchList: []
    }
  },
  methods: {
    init () {
      // this.getRuleList()
      apiBatch.getBatchListAll().then(res => {
        this.batchList = res.list
        console.log(this.$route.params, '1111')
        if (this.$route.params.batchId) {
          this.batchId = this.$route.params.batchId
          console.log(this.batchId, '222')
        } else if (this.batchList.length > 0) {
          this.batchId = this.batchList[0].id
          console.log(this.batchId, '222999')
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
