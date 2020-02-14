<template>
  <div>
      <!-- 查看 start-->
      <Modal title="查看" v-model="formModalVisible" :mask-closable='false' :width="650" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="120">
          <FormItem label="期刊名称:">{{dataForm.cssciName}}</FormItem>
          <FormItem label="期刊号:">{{dataForm.cssciNum}}</FormItem>
          <FormItem label="期刊年:">{{dataForm.cssciTime}}</FormItem>
          <FormItem label="摘要:">{{dataForm.abstract}}</FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">关闭</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

  </div>
</template>

<script>
import api from '@/api/library/librarycsscidetail'
export default {
  name: 'LibraryCssciDetail-view',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      dataForm: {
        cssciName: '',
        cssciNum: '',
        cssciTime: '',
        abstract: '',
        id: undefined
      }
    }
  },
  mounted () {

  },
  methods: {
    init (id) {
      if (id) this.viewLibraryCssciDetail(id)
    },
    cancel () {
      this.formModalVisible = false
    },
    viewLibraryCssciDetail (id) {
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getLibraryCssciDetailInfo(id).then(res => {
        let entity = res.libraryCssciDetail
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
