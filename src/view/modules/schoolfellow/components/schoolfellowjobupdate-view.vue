<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <i-Col span="12">
              <FormItem label="入职时间:">{{dataForm.startDate}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="离职时间:">{{dataForm.endDate}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="学号:">{{dataForm.stuCode}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="工作省份:">{{dataForm.adsWorking}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="单位/部门:">{{dataForm.unit}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="岗位:">{{dataForm.post}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="级别:">{{dataForm.rank}}</FormItem>
            </i-Col>
            <i-Col span="12">
              <FormItem label="工作部门性质:">{{dataForm.nature}}</FormItem>
            </i-Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowjobupdate'
export default {
  name: 'SchoolfellowJobupdate-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        updateUserName: '',
        startDate: '',
        endDate: '',
        stuCode: '',
        stuName: '',
        adsWorking: '',
        unit: '',
        post: '',
        rank: '',
        nature: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewSchoolfellowJobupdate(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewSchoolfellowJobupdate (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowJobupdateInfo(id).then(res => {
        let entity = res.schoolfellowJobupdate
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
