<template>
  <div class="search">
    <Card>
      <Tabs value="caselist-1" name="caselist">
        <TabPane label="中国公共管理案例库" name="caselist-1" tab="caselist">
          <CaseLibrary />
        </TabPane>
        <TabPane label="China Base Bank" name="caselist-2" tab="caselist">
          <CaseLibraryEn />
        </TabPane>
        <TabPane label="多媒体案例库" name="caselist-3" tab="caselist">
          <CaseMedia />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import CaseLibrary from './caselibrary'
import CaseLibraryEn from './caselibrary-en'
import CaseMedia from './casemedia'
export default {
  name: 'CaseList-manage',
  components: { CaseLibrary, CaseLibraryEn, CaseMedia },
  data () {
    return {
      loading: true,
      exportLoading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {

    }
  }
}
</script>
