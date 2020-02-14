<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <Row>
            <Col span="12">
            <FormItem label="书名:">{{dataForm.bookName}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="作者:">{{dataForm.author}}</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="出版社:">{{dataForm.publishers}}</FormItem>
            </Col>
            <Col span="12">
            <FormItem label="出版时间:">{{dataForm.publishTime}}</FormItem>
            </Col>
          </Row>
          <FormItem label="备注:">{{dataForm.comment}}</FormItem>
          <!-- <FormItem label="推荐时间:">{{dataForm.recommendTime}}</FormItem>
          <FormItem label="推荐人:">{{dataForm.recommendName}}</FormItem> -->
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/library/librarybookrecommend'
export default {
  name: 'LibraryBookRecommend-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        bookName: '',
        author: '',
        publishers: '',
        publishTime: '',
        comment: '',
        recommendTime: '',
        recommendName: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewLibraryBookRecommend(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewLibraryBookRecommend (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getLibraryBookRecommendInfo(id).then(res => {
        let entity = res.libraryBookRecommend
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
