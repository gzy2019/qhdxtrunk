<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="书名" prop="bookName">
            <Input type="text" v-model="dataForm.bookName" :maxlength="200" placeholder="请输入书名" />
          </FormItem>
          <FormItem label="作者" prop="author">
            <Input type="text" v-model="dataForm.author" :maxlength="100" placeholder="请输入作者" />
          </FormItem>
          <FormItem label="出版社" prop="publishers">
            <Input type="text" v-model="dataForm.publishers" :maxlength="200" placeholder="请输入出版社" />
          </FormItem>
          <FormItem label="出版时间" prop="publishTime">
            <IDatePicker type="date" v-model="dataForm.publishTime" format="yyyy-MM-dd" placeholder="请输入出版时间" />
          </FormItem>
          <FormItem label="备注" prop="comment">
            <Input type="text" v-model="dataForm.comment" :maxlength="250" placeholder="请输入备注" />
          </FormItem>
          <!-- <FormItem label="推荐时间" prop="recommendTime">
            <IDatePicker type="date" v-model="dataForm.recommendTime" format="yyyy-MM-dd" placeholder="请输入推荐时间" />
          </FormItem>
          <FormItem label="推荐人" prop="recommendName">
            <Input type="text" v-model="dataForm.recommendName" :maxlength="100" placeholder="请输入推荐人" />
          </FormItem> -->
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveLibraryBookRecommend">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/library/librarybookrecommend'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'LibraryBookRecommend-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        bookName: '',
        author: '',
        publishers: '',
        publishTime: '',
        comment: '',
        // recommendTime: '',
        // recommendName: '',
        id: null
      },
      dataFormValidate: {
        bookName: [
          { required: true, message: '书名不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        // recommendName: [
        //   { required: true, message: '推荐人不能为空', trigger: 'blur' }
        // ],
        formItem_: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' },
          { type: 'string', min: 20, message: '不能超过20个字符', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    },
    cancel () {
      this.formModalVisible = false
    },
    addLibraryBookRecommend () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editLibraryBookRecommend (id) {
      this.modalTitle = '编辑'
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
    },
    saveLibraryBookRecommend () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveLibraryBookRecommend(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateLibraryBookRecommend(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-update')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
