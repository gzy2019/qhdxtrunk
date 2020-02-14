<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="分类" prop="bookType">
            <Input type="text" v-model="dataForm.bookType" clearable :maxlength="200" placeholder="请输入分类" />
          </FormItem>
          <FormItem label="书名" prop="bookName">
            <Input type="text" v-model="dataForm.bookName" clearable :maxlength="200" placeholder="请输入书名" />
          </FormItem>
          <FormItem label="作者" prop="author">
            <Input type="text" v-model="dataForm.author" clearable :maxlength="100" placeholder="请输入作者" />
          </FormItem>
          <FormItem label="副本数" prop="numberOfCopies">
            <Input type="text" v-model="dataForm.numberOfCopies" clearable :maxlength="200" placeholder="请输入副本数" />
          </FormItem>
          <FormItem label="出版社" prop="publishers">
            <Input type="text" v-model="dataForm.publishers" clearable :maxlength="200" placeholder="请输入出版社" />
          </FormItem>
          <FormItem label="出版时间" prop="publishTime">
            <IDatePicker type="date" v-model="dataForm.publishTime" clearable format="yyyy-MM-dd" placeholder="请输入出版时间" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveLibraryNewbookNotice">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/library/librarynewbooknotice'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'LibraryNewbookNotice-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        bookType: '',
        numberOfCopies: '',
        bookName: '',
        author: '',
        publishers: '',
        publishTime: '',
        id: null
      },
      dataFormValidate: {
        bookType: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ],
        bookName: [
          { required: true, message: '书名不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
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
    addLibraryNewbookNotice () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editLibraryNewbookNotice (id) {
      this.modalTitle = '编辑'
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
    },
    saveLibraryNewbookNotice () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            api.saveLibraryNewbookNotice(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateLibraryNewbookNotice(data).then(res => {
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
