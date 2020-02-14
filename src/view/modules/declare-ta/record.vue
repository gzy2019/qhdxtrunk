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
      <Tabs v-model="activeTab" v-if="loaded">
        <TabPane label="助教" name="name1">
          <RecordAssistant v-show="activeTab === 'name1'" :batchId="batchId" :postId="postId" :postName="postName"/>
        </TabPane>
        <TabPane label="助管" name="name2">
          <RecordAdmin v-show="activeTab === 'name2'" :batchId="batchId" :postId="postId2" :postName="postName2"/>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import RecordAdmin from './components/record-admin'
import RecordAssistant from './components/record-assistant'
import apiBatch from '@/api/declare-ta/batch'
export default {
  name: 'post',
  components: {
    RecordAdmin,
    RecordAssistant
  },
  data () {
    return {
      loaded: false,
      batchId: undefined,
      postId: undefined,
      postName: '',
      postId2: undefined,
      postName2: '',
      activeTab: 'name1',
      batchList: []
    }
  },
  methods: {
    init () {
      // this.getRuleList()
      console.log('=======', this.$route.params)
      if (this.$route.params.batchId) {
        this.batchId = this.$route.params.batchId
      }
      if (this.$route.params.postType === '0') {
        this.postId = this.$route.params.postId
        this.postName = this.$route.params.postName
      }
      // 如果是主管则需要切换到第二个Tab
      if (this.$route.params.postType === '1') {
        this.activeTab = 'name2'
        this.postId2 = this.$route.params.postId
        this.postName2 = this.$route.params.postName
      }
      console.log('======', this.postName, this.postName2)
      apiBatch.getBatchListAll().then(res => {
        this.batchList = res.list
        if (this.batchList.length > 0 && !this.batchId) {
          this.batchId = this.batchList[0].id
        }

        this.loaded = true
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
