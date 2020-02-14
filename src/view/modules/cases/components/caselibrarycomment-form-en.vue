<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="Positive tag" prop="positive">
             <Tag checkable :checked="item.checked" @on-change="tagChange" color="success" v-for="(item,index) in positiveTags" :key="index" :name="item.id" >{{item.tagName}}</Tag>
          </FormItem>
          <FormItem label="Native tag" prop="negative">
            <Tag checkable :checked="item.checked" @on-change="tagChange" color="primary" v-for="(item,index) in negativeTags" :key="index" :name="item.id">{{item.tagName}}</Tag>
          </FormItem>
          <FormItem label="Suggestion" prop="memo">
            <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="please input suggestion" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">cancel</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseLibraryComment">submit</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/cases/caselibrarycomment'
import tagApi from '@/api/cases/casetag'
export default {
  name: 'CaseLibraryComment-form',
  props: {
    caseId: {
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
        callback(new Error('positive tag or negative tag is required}'))
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
        caseId: null,
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
    addCaseLibraryComment () {
      this.modalTitle = 'Suggestion Or Feedback'
      this.$refs.dataForm.resetFields()
      this.initTagList()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editCaseLibraryComment (id) {
      this.modalTitle = 'Edit'
      this.$refs.dataForm.resetFields()
      this.initTagList()
      this.loading = true
      api.getCaseLibraryCommentInfo(id).then(res => {
        let entity = res.caseLibraryComment
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
    saveCaseLibraryComment () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          data.caseId = this.caseId
          if (!data.id) {
            api.saveCaseLibraryComment(data).then(res => {
              this.$Message.success('save success！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateCaseLibraryComment(data).then(res => {
              this.$Message.success('update success！')
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
