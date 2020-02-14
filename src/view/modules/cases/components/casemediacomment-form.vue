<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="好评标签" prop="positive">
             <Tag checkable :checked="item.checked" @on-change="tagChange" color="success" v-for="(item,index) in positiveTags" :key="index" :name="item.id" >{{item.tagName}}</Tag>
          </FormItem>
          <FormItem label="差评标签" prop="negative">
            <Tag checkable :checked="item.checked" @on-change="tagChange" color="primary" v-for="(item,index) in negativeTags" :key="index" :name="item.id">{{item.tagName}}</Tag>
          </FormItem>
          <FormItem label="意见反馈" prop="memo">
            <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入意见反馈" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseMediaComment">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/cases/casemediacomment'
import tagApi from '@/api/cases/casetag'
export default {
  name: 'CaseMediaComment-form',
  props: {
    mediaId: {
      type: Number,
      required: true,
      default () {
        return 0
      }
    }
  },
  data () {
    const validateTag = (rule, value, callback) => {
      if (!this.dataForm.positive && !this.dataForm.negative) {
        callback(new Error('好评标签和差评标签不能同时为空}'))
      } else {
        callback()
      }
    }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      tagList: [],
      dataForm: {
        mediaId: '',
        positive: '',
        negative: '',
        memo: '',
        id: null
      },
      dataFormValidate: {
        positive: [
          { validator: validateTag, trigger: 'blur' }
        ],
        negative: [
          { validator: validateTag, trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  computed: {
    positiveTags () {
      return this.tagList.filter(item => item.type === 'positive')
    },
    negativeTags () {
      return this.tagList.filter(item => item.type !== 'positive')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadTagList()
    },
    cancel () {
      this.formModalVisible = false
    },
    loadTagList () {
      tagApi.getCaseTagDataList().then(res => {
        this.tagList = res.list
        this.tagList.forEach(item => {
          item.checked = false
        })
      })
    },
    initTagList () {
      if (this.tagList) {
        this.tagList.forEach(item => {
          item.checked = false
        })
      }
      this.dataForm.positive = ''
      this.dataForm.negative = ''
    },
    addCaseMediaComment () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.initTagList()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editCaseMediaComment (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.initTagList()
      this.loading = true
      api.getCaseMediaCommentInfo(id).then(res => {
        let entity = res.caseMediaComment
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    tagChange (checked, name) {
      let item = this.tagList.find(item => item.id === name)
      item.checked = checked
      let arr1 = this.tagList.filter(item => item.checked && item.type === 'positive')
      let arr2 = this.tagList.filter(item => item.checked && item.type !== 'positive')

      this.dataForm.positive = arr1.map(item => item.tagName).join(',')
      this.dataForm.negative = arr2.map(item => item.tagName).join(',')
    },
    saveCaseMediaComment () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          data.mediaId = this.mediaId
          if (!data.id) {
            api.saveCaseMediaComment(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseMediaComment(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
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
