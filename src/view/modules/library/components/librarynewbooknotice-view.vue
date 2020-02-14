<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="分类:">{{dataForm.bookType}}</FormItem>
          <FormItem label="副本数:">{{dataForm.numberOfCopies}}</FormItem>
          <FormItem label="书名:">{{dataForm.bookName}}</FormItem>
          <FormItem label="作者:">{{dataForm.author}}</FormItem>
          <FormItem label="出版社:">{{dataForm.publishers}}</FormItem>
          <FormItem label="出版时间:">{{dataForm.publishTime}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/library/librarynewbooknotice'
export default {
  name: 'LibraryNewbookNotice-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        bookType: '',
        numberOfCopies: '',
        bookName: '',
        author: '',
        publishers: '',
        publishTime: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewLibraryNewbookNotice(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewLibraryNewbookNotice (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getLibraryNewbookNoticeInfo(id).then(res => {
        let entity = res.libraryNewbookNotice
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
