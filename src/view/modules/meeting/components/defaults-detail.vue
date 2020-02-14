<template>
    <div >
        <Modal title="违约详情" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="defaultsInfo" :label-width="150">
                <Row>
                    <Col span="12">
                        <FormItem label="姓名">{{defaultsInfo.userName}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="违约次数总计">{{defaultsInfo.restrictCount}}</FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="限制使用开始时间">{{defaultsInfo.restrictBegin}}</FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="限制使用结束时间">{{defaultsInfo.restrictEnd}}</FormItem>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table :columns="columns" :data="defaultsInfo.detailList"></Table>
            </Form>
        </Modal>
    </div>
</template>

<script>
import api from '@/api/meeting/meetingroomdefaults'

export default {
  name: 'MeetingRoomDefaultsDetail-info',
  data () {
    return {
      loading: true,
      formModalVisible: false,
      defaultsInfo: {
        detailList: []
      },
      id: '',
      columns: [
        {
          title: '违约次数总计',
          key: 'restrictCount',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '限制开始使用时间',
          key: 'restrictBegin',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '限制结束使用时间',
          key: 'restrictEnd',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '限制原因',
          key: 'restrictMemo',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 150
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      this.formModalVisible = true
      this.getMeetingRoomDefaultsInfo()
    },
    getMeetingRoomDefaultsInfo (id) {
      this.loading = true
      api.getMeetingRoomDefaultsInfo(this.searchForm).then(res => {
        this.loading = false
        this.defaultsInfo = res.meetingRoomDefaults || {}
      })
    }
  }
}
</script>
