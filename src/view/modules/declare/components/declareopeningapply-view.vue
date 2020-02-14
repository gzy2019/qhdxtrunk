<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="学生姓名:">{{dataForm.stuName}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="学号:">{{dataForm.stuCode}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="导师ID:">{{dataForm.teacherId}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="邮箱:">{{dataForm.email}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="手机号:">{{dataForm.mobile}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="申报名称">{{dataForm.name}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="开题时间:">{{dataForm.openingDate}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="开题地点:">{{dataForm.openingAds}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="报名状态">{{dataForm.applyStatus | recordStatusInfo}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="备注:">{{dataForm.stuDesc}}</FormItem>
            </Col>
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
import api from '@/api/declare/declareopeningapply'
export default {
  name: 'DeclareOpeningApply-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        stuName: '',
        stuCode: '',
        teacherId: '',
        email: '',
        mobile: '',
        name: '',
        openingDate: '',
        openingAds: '',
        applyStatus: '',
        stuDesc: '',
        id: undefined
      }
    }
  },
  filters: {
    recordStatusInfo (val) {
      if (val === 0) {
        return '申请中'
      } else if (val === 1) {
        return '撤回'
      } else if (val === 2) {
        return '同意'
      } else {
        return '驳回'
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewDeclareOpeningApply(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewDeclareOpeningApply (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getDeclareOpeningApplyInfo(id).then(res => {
        let entity = res.declareOpeningApply
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
