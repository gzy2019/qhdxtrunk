<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <!-- <FormItem label="读者姓名:">{{dataForm.readerName}}</FormItem> -->
          <Row>
            <Col span="12">
            <FormItem label="标题:">{{dataForm.msgTitle}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="内容:">{{dataForm.msgInfo}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="留言类型:">{{dataForm.msgType ? '建议':'咨询'}}</FormItem>
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
import api from '@/api/library/libraryreadermessage'
export default {
  name: 'LibraryReaderMessage-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        // readerName: '',
        msgTitle: '',
        msgInfo: '',
        msgType: '',
        msgTime: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewLibraryReaderMessage(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewLibraryReaderMessage (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getLibraryReaderMessageInfo(id).then(res => {
        let entity = res.libraryReaderMessage
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
