<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" >
          <FormItem label="id" prop="openingDate" v-show="false">
            <Input type="text" v-model="openScheduleData.id" :maxlength="100" placeholder="" />
          </FormItem>
          <FormItem label="标签" prop="tag">
             <Tag checkable :checked="item.checked" @on-change="tagChange" color="success" v-for="(item,index) in tagList" :key="index" :name="item.id" >{{item.tagName}}</Tag>
          </FormItem>
          <!-- <FormItem label="差评标签" prop="negative">
            <Tag checkable :checked="item.checked" @on-change="tagChange" color="primary" v-for="(item,index) in negativeTags" :key="index" :name="item.id">{{item.tagName}}</Tag>
          </FormItem>
          <FormItem label="意见反馈" prop="memo">
            <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入意见反馈" />
          </FormItem> -->
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveCaseLibraryComment">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowtag'
import apiTag from '@/api/schoolfellow/schoolfellowinfo'

export default {
  name: 'SchoolfellowInfo-tag',
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      tagList: [],
      openScheduleData: '',
      dataForm: {
        tag: '',
        // openingDate: undefined,
        id: null
      },
      submitLoading: false
    }
  },
  computed: {
    // positiveTags () {
    //   return this.tagList.filter(item => item.type === 'tagName')
    // }
    // negativeTags () {
    //   return this.tagList.filter(item => item.type !== 'positive')
    // }
  },
  mounted () {
    this.init()
  },
  methods: {
    openSchedule (row) {
      this.openScheduleData = Object.assign({}, row)
      console.log(JSON.stringify(row), 'qqq')
      console.log('----' + this.openScheduleData.id)
      this.formModalVisible = true
    },
    init () {
      this.loadTagList()
    },
    cancel () {
      this.formModalVisible = false
    },
    loadTagList () {
      api.getSchoolfellowTagList().then(res => {
        this.tagList = res.page.list
        console.log(this.tagList)
        this.tagList.forEach(item => {
          item.checked = false
        })
      })
    },
    initTagList () {
      if (this.tagList) {
        this.tagList.forEach(item => {
          item.checked = false
          console.log(this.tagList, '111')
        })
      }
      this.dataForm.tag = ''
    },
    addCaseLibraryComment () {
      this.modalTitle = '标签'
      this.$refs.dataForm.resetFields()
      this.initTagList()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    tagChange (checked, name) {
      let item = this.tagList.find(item => item.id === name)

      item.checked = checked

      // console.log(arr1, '222333')
      let arr1 = this.tagList.filter(item => item.checked && item.tagName)
      console.log(arr1, '333')
      this.dataForm.tag = arr1.map(item => item.tagName).join(',')
      console.log(this.dataForm.tag, '222')
    },
    saveCaseLibraryComment () {
      // this.$refs.dataForm.validate(valid => {
      //   if (valid) {
      this.submitLoading = true
      // 新增保存
      Object.assign(this.dataForm, { id: this.openScheduleData.id })

      console.log(this.dataForm.tag, '22333')
      let data = Object.assign({}, this.dataForm)
      apiTag.updatetagSchoolfellowInfo(data).then(res => {
        this.$Message.success('操作成功！')
        this.formModalVisible = false
        this.$emit('update')
      }).finally(() => {
        this.submitLoading = false
      })
    }
    // })
  }
  // }
}
</script>
