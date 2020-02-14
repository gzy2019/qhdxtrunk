<template>
  <div>
    <Form ref="dataForm" v-if="refresh" :model="dataForm" :label-position="formData.attribute.labelPosition" :label-width="comFormLabelWidth" :rules="dataFormValidate">
      <div class="dform-title">
        {{formData.attribute.title}}
      </div>
      <div class="dform-memo" v-if="formData.attribute.memo">
        <Alert type="success">{{formData.attribute.memo}}</Alert>
      </div>
      <div class="dform-body">
        <DElement v-for="(item,index) in formData.itemList" :index="index + 1" v-model="dataForm[item.fieldName]" :prop="item.fieldName" :key="item.id" :attribute="item" :size="formData.attribute.itemSize" />
        <FormItem v-if="showOper">
          <Button type="primary" :loading="submitLoading" @click="submitForm">提交</Button>
          <Button style="margin-left: 8px">取消</Button>
        </FormItem>
      </div>
    </Form>
    <Alert type="success" show-icon v-if="success">
        提交成功
        <span slot="desc">感谢您的参与!</span>
    </Alert>
  </div>
</template>
<script>
import api from '@/api/qa/qaforminst'
import DElement from './delement'
export default {
  name: 'design-form-preview',
  components: { DElement },
  props: {
    showButton: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      formData: {
        attribute: {
          title: '表单标题',
          memo: '',
          labelPosition: 'top',
          labelWidth: 100,
          itemSize: 'default'
        },
        itemList: []
      },
      instData: {},
      success: false,
      formJson: null,
      refresh: false,
      submitLoading: false,
      dataForm: {},
      dataFormValidate: {}
    }
  },
  computed: {
    comFormLabelWidth () {
      if (this.formData.attribute.labelPosition === 'top') {
        return null
      }
      return this.formData.attribute.labelWidth
    },
    userId () {
      return 'admin-' + this.$store.state.user.userId
    },
    showOper () {
      if (!this.showButton) return false
      if (!this.formData.itemList || !this.formData.itemList.length) return false
      if ((!this.instData.id) && !this.success) {
        return true
      }
      return false
    }
  },
  methods: {
    init (json, ignoreValidate) {
      this.formJson = json
      this.formData = JSON.parse(json)
      this.success = false
      this.refresh = false
      let dataForm = { }
      let dataFormValidate = { }
      console.log('itemList', this.formData.itemList)
      if (this.formData.itemList) {
        this.formData.itemList.forEach(item => {
          let fieldName = this.getFieldName(item)
          item.fieldName = fieldName
          let fieldValid = { required: item.required, message: '此项不能为空', trigger: 'blur' }
          dataForm[fieldName] = ''
          if (item.type === 'number') {
            fieldValid.type = 'number'
            dataForm[fieldName] = parseInt(item.min)
          } else if (item.type === 'radio') {
            fieldValid.type = 'number'
          } else if (item.type === 'checkbox') {
            fieldValid.type = item.multiple ? 'array' : 'string'
            if (item.multiple) dataForm[fieldName] = []
          } else if (item.type === 'select') {
            fieldValid.type = item.multiple ? 'array' : 'number'
            if (item.multiple) dataForm[fieldName] = []
            fieldValid.trigger = 'change'
          } else if (item.type === 'file') {
            fieldValid.type = 'array'
            fieldValid.trigger = 'change'
            dataForm[fieldName] = []
          } else if (item.type === 'image') {
            fieldValid.type = 'array'
            dataForm[fieldName] = []
            fieldValid.trigger = 'change'
          } else if (item.type === 'time') {
            fieldValid.type = 'string'
            dataForm[fieldName] = null
            fieldValid.trigger = 'blur'
          } else if (item.type === 'date') {
            fieldValid.type = 'string'
            dataForm[fieldName] = null
            fieldValid.trigger = 'blur'
          }
          dataFormValidate[fieldName] = [fieldValid]
        })
      }
      this.dataForm = dataForm
      if (!ignoreValidate) this.dataFormValidate = dataFormValidate
      this.loadInstData()
      this.$nextTick(() => {
        this.refresh = true
      })
    },
    initFormVal (answerObj = {}) {
      if (this.formData.itemList) {
        this.formData.itemList.forEach(item => {
          let fieldName = this.getFieldName(item)
          item.fieldName = fieldName
          let fieldVal = answerObj[item.id] || ''
          console.log('fieldName', fieldName, 'fieldVal', fieldVal)
          if (item.type === 'number') {
            if (fieldVal) this.dataForm[fieldName] = parseInt(fieldVal)
          } else if (item.type === 'radio') {
            if (fieldVal) this.dataForm[fieldName] = parseInt(fieldVal)
          } else if (item.type === 'checkbox') {
            if (fieldVal && !item.multiple) this.dataForm[fieldName] = parseInt(fieldVal)
            if (fieldVal && item.multiple) {
              let ids = fieldVal.split(',')
              ids = ids.map(id => parseInt(id))
              this.dataForm[fieldName] = ids
            }
          } else if (item.type === 'select') {
            if (fieldVal && !item.multiple) this.dataForm[fieldName] = parseInt(fieldVal)
            if (fieldVal && item.multiple) {
              let ids = fieldVal.split(',')
              ids = ids.map(id => parseInt(id))
              this.dataForm[fieldName] = ids
            }
          } else if (item.type === 'file') {
            if (fieldVal) this.dataForm[fieldName] = JSON.parse(fieldVal)
          } else if (item.type === 'image') {
            if (fieldVal) this.dataForm[fieldName] = JSON.parse(fieldVal)
          } else {
            this.dataForm[fieldName] = fieldVal
          }
        })
      }
    },
    loadInstData () {
      let param = {
        userId: this.userId,
        formId: this.formData.attribute.id
      }
      api.getQaFormInstByUser(param).then(res => {
        this.instData = res.data || {}
      })
    },
    getFieldName (item) {
      return 'dfield' + Math.abs(item.id)
    },
    getItemId (fieldName) {
      return parseInt(fieldName.replace('dfield', ''))
    },
    getItemById (itemId) {
      return this.formData.itemList.find(item => item.id === itemId)
    },
    getOptionLabel (item, optionIds) {
      if (item && item.optionList) {
        let arr = []
        item.optionList.forEach((option, index) => {
          if (optionIds.includes(option.id)) {
            arr.push(this.getOptionLabelWithAlphabet(index, option))
          }
        })
        return arr.join(',')
      }

      return ''
    },
    getOptionLabelWithAlphabet (index, option) {
      let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
      if (alphabet.length > index) {
        return alphabet[index] + '. ' + option.label
      }
    },
    submitForm2 () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$Message.success('表单校验成功...')
        }
      })
    },
    submitForm () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          let itemInstList = []
          Object.keys(this.dataForm).forEach(fieldName => {
            let itemInst = {
              itemId: this.getItemId(fieldName)
            }
            let item = this.getItemById(itemInst.itemId)
            itemInst.itemType = item.type
            let answer = this.dataForm[fieldName]
            itemInst.answer = answer

            if (item.type === 'checkbox') {
              itemInst.answer = answer.join(',')
              itemInst.optionLabel = this.getOptionLabel(item, answer)
            } else if (item.type === 'file') {
              itemInst.answer = JSON.stringify(answer)
            } else if (item.type === 'image') {
              itemInst.answer = JSON.stringify(answer)
            } else if (item.type === 'select') {
              if (item.multiple) {
                itemInst.answer = answer.join(',')
                itemInst.optionLabel = this.getOptionLabel(item, answer)
              } else {
                itemInst.optionLabel = this.getOptionLabel(item, [answer])
              }
            } else if (item.type === 'radio') {
              itemInst.optionLabel = this.getOptionLabel(item, [answer])
            }

            itemInstList.push(itemInst)
          })

          let data = {
            userId: this.userId,
            formId: this.formData.attribute.id,
            formDef: this.formJson,
            itemInstList: itemInstList,
            title: this.formData.attribute.title
          }
          this.submitLoading = true
          api.saveQaFormInst(data).then(res => {
            this.$Message.success('提交成功!')
            this.success = true
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.dform-title {
  font-size: 20px;
  font-weight: bold;
  color: #151313ab;
  text-align: center;
}
.dform-memo {
  font-size: 1.1em;
  padding: 5px 0;
  margin: 5px 0;
  text-align: left;
}
.dform-body {
  margin: 5px 10%;
}
</style>
