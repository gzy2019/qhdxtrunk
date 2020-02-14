<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="申报批次" prop="batchId" style="margin-bottom:6px">
            <Select v-model="batchId" style="width:200px">
              <Option v-for="item in batchList" :value="item.id" :key="item.id">{{ item.batchName }}</Option>
            </Select>
          </Form-item>
        </Form>
      </Row>
      <Tabs v-model="activeTab">
        <TabPane label="助教" name="name1">
          <DeclareAssistant v-show="activeTab === 'name1'" :batchId="batchId" />
        </TabPane>
        <TabPane label="助管" name="name2">
          <DeclareAdmin v-show="activeTab === 'name2'" :batchId="batchId" />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import DeclareAdmin from '../components/declare-admin'
import DeclareAssistant from '../components/declare-assistant'
import apiBatch from '@/api/declare-ta/batch'
export default {
  name: 'post',
  components: {
    DeclareAdmin,
    DeclareAssistant
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
        if (this.batchList.length > 0) {
          this.batchId = this.batchList[0].id
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
