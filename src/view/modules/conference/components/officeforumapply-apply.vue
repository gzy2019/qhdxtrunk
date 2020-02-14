<template>
    <div>
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="300" class-name="vertical-center-modal">
        <Form ref="dataForm" :label-width="100" label="报名">
          <div id="qrCode">
          <div id='code'> 请扫二维码</div>
          <canvas id="canvas" style="width: 200px; height: 200px"></canvas>
          </div>
          <div>
          <!-- <div class='QR' id="qrcode"></div> -->
          <Button style="margin-left:180px" :loading="exportLoading" @click="exportData()">图片下载</Button>
          </div>
        </Form>
      </Modal>
    </div>
</template>
<script>
import QRCode from 'qrcode'
export default {
  components: {
    QRCode
  },
  data () {
    return {
      formModalVisible: false,
      exportLoading: false,
      msg: 'hello vue',
      codes: '',
      id: undefined,
      modalTitle: ''
    }
  },
  methods: {
    useqrcode () {
      var canvas = document.getElementById('canvas')
      let _this = this
      QRCode.toCanvas(canvas, 'https://blog.csdn.net/weixin_42890953/article/details/82776760',
        function (error) {
          if (error) console.error(error)
          // console.log('QRCode success!')
          _this.formModalVisible = true
        })
    },
    exportData (canvas) {
      let data = document.getElementById('canvas')
      let a = document.createElement('a')
      a.href = data.toDataURL('img/png')
      a.download = '论坛报名二维码'
      a.click()
    },
    applyOfficeForumApply () {
      this.modalTitle = '报名'
      this.useqrcode()
    }
  },
  mounted () {
  }
}
</script>
<style>
  #qrCode {
    text-align: center;
    margin:0 auto
  }
  #code {
    color:#000;
    font-size: 20px
  }
</style>
