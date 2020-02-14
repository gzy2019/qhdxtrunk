<template>
    <div class="search">
        <Card>
            <Form ref="searchForm" :model="searchForm" @keydown.enter.native="handleSearch" inline :label-width="70" class="search-form">
                <FormItem label="年份" prop="year">
                  <Select v-model="searchForm.year" placeholder="请选择" style="width: 170px;">
                    <Option v-for="(item,index) in yearList" :key="index" :value="item">{{item}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="教师" prop="teacherId" v-if="selectTeacher">
                  <Select v-model="searchForm.teacherId" filterable placeholder="请选择" style="width: 170px;">
                    <Option v-for="(item,index) in teacherList" :key="index" :value="item.id">{{item.teaName}}</Option>
                  </Select>
                </FormItem>
                <Form-item style="margin-left: -70px;">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="exportData" :loading="exportLoading" type="primary" style="margin-left: 10px;" icon="ios-download-outline">导出</Button>
                </Form-item>
            </Form>
            <Row>
              <Col span="24">
                <Spin size="large" fix v-if="loading"></Spin>
                <div class="ivu-table-wrapper ivu-table-wrapper-with-border">
                  <div class="ivu-table ivu-table-default ivu-table-border">
                    <div class="stats-block" v-if="statsData.list1">
                      <p class="stats-title">授课统计</p>
                      <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <th width="10%">序号</th>
                          <th width="15%">日期</th>
                          <th width="25%">摘要</th>
                          <th width="20%">服务内容</th>
                          <th width="15%">课时/人数</th>
                          <th width="10%">绩点数</th>
                        </tr>
                        <tr v-for="(item,index) in statsData.list1" :key="index">
                          <td>{{index + 1}}</td>
                          <td>{{item.createTime}}</td>
                          <td>{{item.summary}}</td>
                          <td>{{item.content}}</td>
                          <td>{{item.count1 || item.count2}}</td>
                          <td>{{item.count3}}</td>
                        </tr>
                        <tr>
                          <td>合计</td>
                          <td colspan="3"></td>
                          <td>{{statsData.total1.count1 || statsData.total1.count2}}</td>
                          <td>{{statsData.total1.count3}}</td>
                        </tr>
                      </table>
                    </div>

                    <div class="stats-block" v-if="statsData.list2">
                      <p class="stats-title">指导学生统计</p>
                      <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <th width="10%">序号</th>
                          <th width="15%">日期</th>
                          <th width="25%">摘要</th>
                          <th width="20%">服务内容</th>
                          <th width="15%">课时/人数</th>
                          <th width="10%">绩点数</th>
                        </tr>
                        <tr v-for="(item,index) in statsData.list2" :key="index">
                          <td>{{index + 1}}</td>
                          <td>{{item.createTime}}</td>
                          <td>{{item.summary}}</td>
                          <td>{{item.content}}</td>
                          <td>{{item.count1 || item.count2}}</td>
                          <td>{{item.count3}}</td>
                        </tr>
                        <tr>
                          <td>合计</td>
                          <td colspan="3"></td>
                          <td>{{statsData.total2.count1 || statsData.total2.count2}}</td>
                          <td>{{statsData.total2.count3}}</td>
                        </tr>
                      </table>
                    </div>

                    <div class="stats-block" v-if="statsData.list3">
                      <p class="stats-title">公共服务统计</p>
                      <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <th width="10%">序号</th>
                          <th width="15%">日期</th>
                          <th width="25%">摘要</th>
                          <th width="20%">服务内容</th>
                          <th width="15%">课时/人数</th>
                          <th width="10%">绩点数</th>
                        </tr>
                        <tr v-for="(item,index) in statsData.list3" :key="index">
                          <td>{{index + 1}}</td>
                          <td>{{item.createTime}}</td>
                          <td>{{item.summary}}</td>
                          <td>{{item.content}}</td>
                          <td>{{item.count1 || item.count2}}</td>
                          <td>{{item.count3}}</td>
                        </tr>
                        <tr>
                          <td>合计</td>
                          <td colspan="3"></td>
                          <td>{{statsData.total3.count1 || statsData.total3.count2}}</td>
                          <td>{{statsData.total3.count3}}</td>
                        </tr>
                      </table>
                    </div>

                    <div class="stats-block" v-if="statsData.list4">
                      <p class="stats-title">培训部统计</p>
                      <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <th width="10%">序号</th>
                          <th width="15%">日期</th>
                          <th width="25%">摘要</th>
                          <th width="20%">服务内容</th>
                          <th width="15%">课时/人数</th>
                          <th width="10%">绩点数</th>
                        </tr>
                        <tr v-for="(item,index) in statsData.list4" :key="index">
                          <td>{{index + 1}}</td>
                          <td>{{item.createTime}}</td>
                          <td>{{item.summary}}</td>
                          <td>{{item.content}}</td>
                          <td>{{item.count1 || item.count2}}</td>
                          <td>{{item.count3}}</td>
                        </tr>
                        <tr>
                          <td>合计</td>
                          <td colspan="3"></td>
                          <td>{{statsData.total4.count1 || statsData.total3.count2}}</td>
                          <td>{{statsData.total4.count3}}</td>
                        </tr>
                      </table>
                    </div>

                  </div>
                </div>
              </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import api from '@/api/paypoint/paypointstats'
import teacherApi from '@/api/teacher'
export default {
  name: 'PaypointStatsStaff-manage',
  props: {
    selectTeacher: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      loading: false,
      exportLoading: false,
      yearList: [],
      teacherList: [],
      statsData: {

      },
      searchForm: {
        page: 1,
        limit: 10,
        year: null,
        teacherId: null
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initYear()
      this.loadTeacherList()
    },
    initYear () {
      let arr = []
      let curYear = new Date().getFullYear()
      this.searchForm.year = curYear
      arr.push(curYear)
      arr.push(curYear - 1)
      arr.push(curYear - 2)
      arr.push(curYear - 3)
      arr.push(curYear - 4)
      arr.push(curYear - 5)
      this.yearList = arr

      if (!this.selectTeacher) {
        this.handleSearch()
      }
    },
    loadTeacherList () {
      teacherApi.getAllTeacher().then(res => {
        this.teacherList = res.data
      })
    },
    handleSearch () {
      if (!this.searchForm.year) {
        this.$Message.error('请选择年份')
        return false
      }
      if (!this.searchForm.teacherId && this.selectTeacher) {
        this.$Message.error('请选择教师')
        return false
      }
      this.loading = true
      let data = Object.assign({}, this.searchForm)
      if (!this.selectTeacher) {
        delete data.teacherId
      }
      api.getPaypointStatsInfo(data).then(res => {
        this.statsData = res.data || {}
      }).finally(() => {
        this.loading = false
      })
    },
    exportData () {
      if (!this.searchForm.year) {
        this.$Message.error('请选择年份')
        return false
      }
      if (!this.searchForm.teacherId && this.selectTeacher) {
        this.$Message.error('请选择教师')
        return false
      }
      let data = Object.assign({}, this.searchForm)
      if (!this.selectTeacher) {
        delete data.teacherId
      }

      this.exportLoading = true
      data.exportExcel = true
      api.getPaypointStatsInfo(data).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    }
  }
}
</script>
<style scoped>
.stats-title {
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  margin: 5px 0;
}
.stats-block {
  margin: 10px;
}
.stats-block table {
  width: 100%;
}
</style>
<style lang="less">
.ivu-table {
  th {
    text-align: center;
  }
  td {
    text-align: center;
    height: 30px;
  }
}
</style>
