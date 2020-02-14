<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <!-- <FormItem label="读者姓名" prop="readerName">
            <Input type="text" v-model="dataForm.readerName" clearable :maxlength="200" placeholder="请输入读者姓名" />
          </FormItem> -->
          <FormItem label="标题" prop="msgTitle">
            <Input type="text" v-model="dataForm.msgTitle" clearable :maxlength="200" placeholder="请输入标题" />
          </FormItem>
          <FormItem label="内容" prop="msgInfo">
            <Input type="textarea" v-model="dataForm.msgInfo" clearable :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入内容" />
          </FormItem>
          <FormItem label="留言类型" prop="msgType">
            <Select v-model="dataForm.msgType">
              <Option v-for="item in msgTypeList" clearable :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveLibraryReaderMessage">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/library/libraryreadermessage'
// import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'LibraryReaderMessage-form',
  components: {
    // IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      msgTypeList: [
        {value: '0', label: '咨询'},
        {value: '1', label: '建议'}
      ],
      dataForm: {
        // readerName: '',
        msgTitle: '',
        msgInfo: '',
        msgType: '',
        msgTime: undefined,
        id: null
      },
      dataFormValidate: {
        // readerName: [
        //   { required: true, message: '读者姓名不能为空', trigger: 'blur' }
        // ],
        msgTitle: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        msgInfo: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        msgType: [
          { required: true, message: '留言类型不能为空', trigger: 'blur' }
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
    addLibraryReaderMessage () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editLibraryReaderMessage (id) {
      this.modalTitle = '编辑'
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
    },
    saveLibraryReaderMessage () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (!data.id) {
            // let msgTime = new Date().toLocaleDateString().replace(/\//g, '-')
            api.saveLibraryReaderMessage(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateLibraryReaderMessage(data).then(res => {
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
