<template>
  <div>
    <Card style="width:600px">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            欢迎登录
        </p>
        <p>欢迎登录清华大学公共管理学院新综合办公系统！系统当前处于试运行阶段，欢迎反馈使用中遇到的问题！</p>
    </Card>
    <!-- <Row :gutter="20">
      <i-col span="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row> -->

    <!-- <Row :gutter="20" style="margin-top: 20px;">
      <i-col span="10">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="签到状态"></chart-pie>
        </Card>
      </i-col>
      <i-col span="14">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量" />
        </Card>
      </i-col>
    </Row>
    <Row style="margin-top: 20px;">
      <Card shadow>
        <example style="height: 310px;" />
      </Card>
    </Row> -->
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '学生用户', icon: 'md-person-add', count: 11790, color: '#2d8cf0' },
        { title: '教师用户', icon: 'md-locate', count: 79, color: '#19be6b' },
        { title: '累计签到', icon: 'md-checkmark', count: 94445, color: '#ff9900' },
        { title: '累计请假', icon: 'ios-medkit-outline', count: 15, color: '#ed3f14' }
      ],
      pieData: [
        { value: 335, name: '正常签到' },
        { value: 310, name: '迟到签到' },
        { value: 234, name: '补签' },
        { value: 135, name: '请假' },
        { value: 1548, name: '旷签' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
