<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Modal title="数据导入" v-model="formModalVisible" :footer-hide="true" :mask-closable='false' :width="850" class-name="vertical-center-modal">
      <Card title="导入EXCEL">
        <div slot="extra" v-if="inTemplate.url">
          <a :href="inTemplate.url" target="_blank">{{inTemplate.name}}下载</a>
        </div>
        <Row>
          <Col span="6">
            <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
              <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
            </Upload>
          </Col>
          <Col span="8">
            <Button icon="ios-cloud-upload-outline" :loading="importLoading" @click="importData" type="primary" v-if="tableData.length > 0">开始导入</Button>
          </Col>

        </Row>
        <Row>
          <div class="ivu-upload-list-file" v-if="file !== null">
            <Icon type="ios-stats"></Icon>
              {{ file.name }} 共 {{ dataTotal }} 条记录
            <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
          </div>
          <div v-if="importCount > 0">
            <span>导入进度: {{ importCount }} / {{ dataTotal }}</span>
            <Progress :percent="importProgress" :stroke-width="2" />
          </div>
        </Row>
        <Row v-if="importCount === 0">
          <transition name="fade">
            <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
              <div v-if="progressPercent == 100">
                <Icon type="ios-checkmark-circle"></Icon>
                <span>成功</span>
              </div>
            </Progress>
          </transition>
        </Row>
      </Card>
      <Row class="margin-top-10">
        <Table :max-height="400" :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table>
      </Row>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'
export default {
  name: 'upload-excel',
  props: {
    inTemplate: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formModalVisible: false,
      uploadLoading: false,
      importLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      fileName: '',
      tableData: [],
      tableTitle: [],
      tableLoading: false,
      importCount: 0,
      dataTotal: 0
    }
  },
  computed: {
    importProgress () {
      if (this.dataTotal === 0) {
        return 0
      }
      let tmp = this.importCount / this.dataTotal * 100
      tmp = tmp > 100 ? 100 : tmp
      return Math.round(tmp)
    }
  },
  methods: {
    initUpload () {
      this.file = null
      this.fileName = ''
      this.showProgress = false
      this.uploadLoading = false
      this.importLoading = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
      this.formModalVisible = true
      this.importCount = 0
      this.dataTotal = 0
    },
    handleUploadFile () {
      this.initUpload()
    },
    handleRemove () {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      this.fileName = file.name
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {
        this.$Message.info('文件读取成功')
        const data = e.target.result
        const { header, results } = excel.read(data, 'array')
        const tableTitle = header.map(item => { return { title: item, key: item, minWidth: 130 } })
        this.tableData = results
        this.tableTitle = tableTitle
        this.tableTitle.push({
          title: '错误信息',
          key: 'errorMsg',
          minWidth: 120,
          fixed: 'right',
          className: 'table-error-cell'
        })
        this.uploadLoading = false
        this.tableLoading = false
        this.showRemoveFile = true
        this.dataTotal = results.length

        this.tableData.forEach((item, index) => {
          item.rowIndex = index
        })
        this.$emit('on-load', this.tableData, this.fileName)
      }
    },
    removeRecord (record) {
      this.tableData.splice(this.tableData.findIndex(item => item.rowIndex === record.rowIndex), 1)
      this.importCount++
    },
    updateImportStatus (val) {
      this.importLoading = val
    },
    importData () {
      let records = [...this.tableData]
      this.$emit('on-upload', records, this.fileName)
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style>
.ivu-table td.table-error-cell {
  color: #ea1d1db8;
}
</style>
