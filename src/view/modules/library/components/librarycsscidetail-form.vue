<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="期刊名称" prop="cssciName">
            <Input type="text" v-model="dataForm.cssciName" clearable :maxlength="200" placeholder="请输入期刊名称" />
          </FormItem>
          <FormItem label="期刊号" prop="cssciNum">
            <Input type="text" v-model="dataForm.cssciNum" clearable :maxlength="200" placeholder="请输入期刊号" />
          </FormItem>
          <FormItem label="期刊年" prop="cssciTime">
            <IDatePicker type="date" v-model="dataForm.cssciTime" clearable format="yyyy-MM-dd" placeholder="请输入期刊年" />
          </FormItem>
          <FormItem label="摘要" prop="abstract1">
            <Input type="textarea" v-model="dataForm.abstract1" clearable :autosize="{minRows: 4,maxRows: 6}" :maxlength="1000" placeholder="请输入摘要" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveLibraryCssciDetail">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/library/librarycsscidetail'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'LibraryCssciDetail-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      dataForm: {
        cssciName: '',
        cssciNum: '',
        cssciTime: '',
        abstract1: '',
        cssciTitleId: '',
        id: null
      },
      dataFormValidate: {
        cssciName: [
          { required: true, message: '期刊名称不能为空', trigger: 'blur' }
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
    addLibraryCssciDetail () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editLibraryCssciDetail (id) {
      this.modalTitle = '编辑'
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
    },
    saveLibraryCssciDetail () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let cssciTitleId = this.$route.params.cssciTitleId
          this.dataForm.cssciTitleId = cssciTitleId
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            console.log(this.dataForm.cssciTitleId, '11')
            api.saveLibraryCssciDetail(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateLibraryCssciDetail(data).then(res => {
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
