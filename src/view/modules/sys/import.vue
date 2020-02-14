<template>
  <div class="search">
    <Card>
      <Row>
        <Upload ref="upload" multiple :action="actionUrl" :on-success="handleUploadSuccess" :on-exceeded-size="onExceededSize" :before-upload="handleBeforeUpload" :show-upload-list="true" :with-credentials="true" :max-size="4096000" :data="params">
          <Button icon="ios-cloud-upload-outline">上传附件</Button>
        </Upload>
        <!-- <Input type="text" v-model="params.param1" clearable placeholder="请输入导师姓名" style="width: 200px" /> -->
        <p style="margin-top:15px">
          {{uploadResult}}
        </p>
      </Row>
    </Card>
  </div>
</template>

<script>
import url from '_conf/url'
import { getToken } from '@/libs/util'
export default {
  name: 'excelimport',
  components: {
  },
  data () {
    return {
      actionUrl: url + 'sys/importfile/excel',
      uploadResult: '',
      params: {
        BusinessType: 'IMPORTSTUTYPE',
        param2: 'param22',
        token: getToken()
      }
    }
  },
  methods: {
    init () {

    },
    handleBeforeUpload () {
      console.log('handleBeforeUpload')
    },
    handleUploadSuccess (response, file, fileList) {
      this.uploadResult = response.data
      console.log('handleUploadSuccess=', JSON.stringify(response))
    },
    deleteFile (uid) {
    },
    onExceededSize () {
    }
  },
  mounted () {
    this.init()
  }
}
</script>
