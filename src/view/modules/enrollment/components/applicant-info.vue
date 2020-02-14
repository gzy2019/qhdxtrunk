<template>
  <!-- 查看详细信息 start-->
  <Modal :title="`报名详情: ${applicantInfo.applicantName || ''}`" v-model="modalViewDetail" :mask-closable='false' :width="1170" class-name="vertical-center-modal popup_detail" :styles="{top: '20px'}">
    <div class="detail_cont ">
      <Spin size="large" fix v-if="loading"></Spin>
      <Row :gutter="16">
        <Col span="3" class="popup_title">
          <ul class="left_ul">
            <li :class="{'active': currentIndex===1}"><span @click="currentIndex=1">基本信息</span></li>
            <li :class="{'active': currentIndex===2}"><span @click="currentIndex=2">联系方式</span></li>
            <li :class="{'active': currentIndex===3}"><span @click="currentIndex=3">当前在职企业</span></li>
            <li :class="{'active': currentIndex===4}"><span @click="currentIndex=4">学历信息</span></li>
            <li :class="{'active': currentIndex===5}"><span @click="currentIndex=5">学习经历</span></li>
            <li :class="{'active': currentIndex===6}"><span @click="currentIndex=6">工作经历</span></li>
            <li :class="{'active': currentIndex===7}"><span @click="currentIndex=7">论文著作</span></li>
            <li :class="{'active': currentIndex===8}"><span @click="currentIndex=8">推荐人</span></li>
            <li :class="{'active': currentIndex===9}"><span @click="currentIndex=9">材料上传</span></li>
          </ul>
        </Col>
        <Col span="21">
        <div class="right_cont applicant_table">

          <!--基本信息 start-->
          <div class="baseinformation" v-show="currentIndex==1">
            <div class="popup_title">
              <p><Icon type="ios-person-outline" />基本信息</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table>
                <tr>
                  <td>姓名</td>
                  <td>{{applicantInfo.applicantName}}</td>
                  <td>姓名拼音</td>
                  <td>{{applicantInfo.applicantNamePinyin}}</td>
                </tr>
                <tr>
                  <td>性别</td>
                  <td>{{applicantInfo.applicantSexStr}}</td>
                  <td>出生日期</td>
                  <td>{{applicantInfo.applicantBirthday}}</td>
                </tr>
                <tr>
                  <td>出生地</td>
                  <td>{{applicantInfo.applicantBirthPlace}}</td>
                  <td>考生来源</td>
                  <td>{{applicantInfo.applicantSourceStr}}</td>
                </tr>
                <tr>
                  <td>证件类型</td>
                  <td>{{applicantInfo.applicantCardTypeStr}}</td>
                  <td>证件号码</td>
                  <td>{{applicantInfo.applicantCardNo}}</td>
                </tr>
                <tr>
                  <td>通行证类型</td>
                  <td>{{applicantInfo.applicantPassTypeStr}}</td>
                  <td>通行证号码</td>
                  <td>{{applicantInfo.applicantPassNo}}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--基本信息 end-->

          <!--联系方式 start-->
          <div class="baseinformation" v-show="currentIndex==2">
            <div class="popup_title">
              <p><Icon type="ios-call-outline" />联系方式</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table style="margin:0 auto 10px">
                <tr>
                  <td>通讯地址</td>
                  <td>{{applicantInfo.applicantAddress}}</td>
                  <td>邮政编码</td>
                  <td>{{applicantInfo.applicantZipcode}}</td>
                </tr>
                <tr>
                  <td>电话区号</td>
                  <td>{{applicantInfo.applicantTelephonePre}}</td>
                  <td>固定电话</td>
                  <td>{{applicantInfo.applicantTelephone}}</td>
                </tr>
                <tr>
                  <td>移动电话</td>
                  <td>{{applicantInfo.applicantMobile}}</td>
                  <td>传真号码</td>
                  <td>{{applicantInfo.applicantFax}}</td>
                </tr>
                <tr>
                  <td>电子邮箱</td>
                  <td colspan="3">{{applicantInfo.applicantEmail}}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--联系方式 end-->

          <!--当前在职企业 start-->
          <div class="baseinformation" v-show="currentIndex==3">
            <div class="popup_title">
              <p><Icon type="ios-create-outline" />当前在职企业</p>
              <Divider />
            </div>
            <div class="popup-content">
                <table style="margin:0 auto 10px">
                <tr>
                  <td>现工作单位</td>
                  <td>{{applicantInfo.applicantCompanyName}}</td>
                  <td>职务</td>
                  <td>{{applicantInfo.applicantPost}}</td>
                </tr>
                <tr>
                  <td>现单位地址</td>
                  <td>{{applicantInfo.applicantCompanyLocation}}</td>
                  <td>入职日期</td>
                  <td>{{applicantInfo.applicantJoinTime}}</td>
                </tr>
                <tr>
                  <td>所属行业</td>
                  <td>{{applicantInfo.applicantTypeIndustry}}</td>
                  <td>所属部门</td>
                  <td>{{applicantInfo.applicantDepartment}}</td>
                </tr>
                <tr>
                  <td>直属上司岗位</td>
                  <td>{{applicantInfo.applicantPostLeader}}</td>
                  <td>现在个人年薪</td>
                  <td>{{applicantInfo.applicantYearSalary}}</td>
                </tr>
                <tr>
                  <td>企业单位年收入</td>
                  <td>{{applicantInfo.applicantYearIncome}}</td>
                  <td>直接管辖下属人数</td>
                  <td>{{applicantInfo.applicantManagersDirect}}</td>
                </tr>
                <tr>
                  <td>间接管辖下属人数</td>
                  <td>{{applicantInfo.applicantManagersIndirect}}</td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>
          <!--当前在职企业 end-->

          <!--学历信息 start-->
          <div class="baseinformation" v-show="currentIndex==4">
            <div class="popup_title">
              <p><Icon type="ios-create-outline" />当前在职企业</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table style="margin:0 auto 10px">
                <tr>
                  <td>已有学历名称</td>
                  <td>{{applicantInfo.applicantEducationNameStr}}</td>
                  <td>毕业学校名称</td>
                  <td>{{applicantInfo.applicantSchoolName}}</td>
                </tr>
                <tr>
                  <td>专业名称</td>
                  <td>{{applicantInfo.applicantMajorName}}</td>
                  <td>毕业学校所在地</td>
                  <td>{{applicantInfo.applicantSchoolLocation}}</td>
                </tr>
                <tr>
                  <td>毕业年月</td>
                  <td>{{applicantInfo.applicantGraduateDate}}</td>
                  <td>学历证书编码</td>
                  <td>{{applicantInfo.applicantEducationCertificateNum}}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--学历信息 end-->

          <!--学习经历 start-->
          <div class="baseinformation" v-show="currentIndex==5">
            <div class="popup_title">
              <p><Icon type="ios-create-outline" />学习经历</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table v-for="(item,index) in applicantInfo.studyExpList" :key="index">
                <tr>
                  <td colspan="4">
                    学习经历{{getCNOrder(index)}}
                  </td>
                </tr>
                <tr>
                  <td>开始日期</td>
                  <td>{{item.applicantStudyStart}}</td>
                  <td>结束日期</td>
                  <td>{{item.applicantStudyEnd}}</td>
                </tr>
                <tr>
                  <td>学校名称</td>
                  <td>{{item.applicantSchoolName}}</td>
                  <td>学位</td>
                  <td>{{item.applicantDegreeStr}}</td>
                </tr>
                <tr>
                  <td>奖惩记录</td>
                  <td colspan="3">{{item.applicantRecord}}</td>
                </tr>
              </table>
            </div>

          </div>
          <!--学习经历 end-->

          <!--工作经历 start-->
          <div class="baseinformation" v-show="currentIndex==6">
            <div class="popup_title">
              <p><Icon type="ios-desktop-outline" />工作经历</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table v-for="(item,index) in applicantInfo.workExpList" :key="index">
                <tr>
                  <td colspan="4">
                    工作经历{{getCNOrder(index)}}
                  </td>
                </tr>
                <tr>
                  <td>开始日期</td>
                  <td>{{item.applicantWorkStart}}</td>
                  <td>结束日期</td>
                  <td>{{item.applicantWorkEnd}}</td>
                </tr>
                <tr>
                  <td>工作单位</td>
                  <td>{{item.applicantCompanyName}}</td>
                  <td>职务</td>
                  <td>{{item.applicantPost}}</td>
                </tr>
              </table>
            </div>

          </div>
          <!--工作经历 end-->

          <!--论文著作 start-->
          <div class="baseinformation" v-show="currentIndex==7">
            <div class="popup_title">
              <p><Icon type="ios-paper-outline" />论文著作</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table v-for="(item,index) in applicantInfo.paperList" :key="index">
                <tr>
                  <td colspan="4">
                    论文著作{{getCNOrder(index)}}
                  </td>
                </tr>
                <tr>
                  <td>论文著作类型</td>
                  <td>{{item.applicantPaperType}}</td>
                  <td>作者</td>
                  <td>{{item.applicantPaperAuthor}}</td>
                </tr>
                <tr>
                  <td>论文标题</td>
                  <td>{{item.applicantPaperTitle}}</td>
                  <td>论文出版方</td>
                  <td>{{item.applicantPaperPublisher}}</td>
                </tr>
                <tr>
                  <td>论文状态</td>
                  <td>{{item.applicantPaperStatus}}</td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>
          <!--论文著作 end-->

          <!--推荐人 start-->
          <div class="baseinformation" v-show="currentIndex==8">
            <div class="popup_title">
              <p><Icon type="ios-contact-outline" />推荐人信息</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table v-for="(item,index) in applicantInfo.recommendList" :key="index">
                <tr>
                  <td colspan="4">
                    推荐人{{getCNOrder(index)}}
                  </td>
                </tr>
                <tr>
                  <td>推荐人姓名</td>
                  <td colspan="2">{{item.applicantRecommendName}}</td>
                  <td>工作单位</td>
                  <td colspan="2">{{item.applicantRecommendCompany}}</td>
                </tr>
                <tr>
                  <td>职务</td>
                  <td>{{item.applicantRecommendPost}}</td>
                  <td>联系电话</td>
                  <td>{{item.applicantRecommendMobile}}</td>
                  <td>电子邮箱</td>
                  <td>{{item.applicantRecommendEmail}}</td>
                </tr>
              </table>
            </div>

          </div>
          <!--推荐人 end-->

          <!--材料 start-->
          <div class="baseinformation" v-show="currentIndex==9">
            <div class="popup_title">
              <p><Icon type="ios-list-box-outline" />材料</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table>
                <tr v-for="(item,index) in applicantInfo.fileList" :key="index">
                  <td>{{item.applicantFileType | fileTypeInfo}}</td>
                  <td>
                    <a v-for="(file,findex) in item.applicantFile" :key="findex + 1000" target="_blank" :href="file.url">{{file.name}}</a>
                  </td>
                </tr>
              </table>
            </div>

          </div>
          <!--材料 end-->
        </div>
        </Col>
      </Row>
    </div>
  </Modal>
  <!-- 查看详细信息 end-->
</template>

<script>
import api from '@/api/mpaa/applicant'
export default {
  name: 'mpaa-applicant-info',
  data () {
    return {
      loading: false,
      currentIndex: 1,
      modalViewDetail: false,
      applicantInfo: {
        project: {},
        studyExpList: [],
        workExpList: [],
        recommendList: [],
        paperList: []
      }
    }
  },
  filters: {
    fileTypeInfo (val) {
      if (val === '1') {
        return '中文个人陈述'
      } else if (val === '2') {
        return '学士学位证明'
      } else if (val === '3') {
        return '成绩单'
      } else if (val === '4') {
        return '在线推荐信'
      } else if (val === '5') {
        return '身份证'
      } else if (val === '6') {
        return '体检报告'
      } else if (val === '7') {
        return '补充材料'
      }
    }
  },
  methods: {
    init (applicantId) {
      this.modalViewDetail = true
      this.loadApplicantInfo(applicantId)
      this.applicantInfo = {
        project: {}
      }
    },
    getCNOrder (index) {
      let strArr = ['一', '二', '三', '四', '五', '六', '七']
      if (strArr.length > index) return strArr[index]
      return index
    },
    loadApplicantInfo (applicantId) {
      if (!applicantId) return
      this.currentIndex = 1
      this.loading = true
      api.getMpaApplicantInfo(applicantId, {}).then(res => {
        this.applicantInfo = res.applicant
        this.handleMaterialList(this.applicantInfo.fileList)
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    handleMaterialList (list) {
      if (list && list.length) {
        list.forEach(item => {
          item.applicantFile = JSON.parse(item.applicantFile)
        })
      }
    },
    prevInfo () {
      let index = this.currentIndex - 1
      index = index < 0 ? 8 : index
      this.currentIndex = index
    },
    nextInfo () {
      let index = this.currentIndex + 1
      index = index > 8 ? 0 : index
      this.currentIndex = index
    }
  }
}
</script>
<style scoped>
.words p {
  font-size: 12px;
}
.words span {
  color: red;
}
.applicant_table table {
  border-collapse: collapse;
  margin: 10px auto;
  width: 90%;
}
.applicant_table td {
  width: 15%;
  height: 48px;
  padding-left: 18px;
  padding-right: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  box-sizing: border-box;
  box-sizing: border-box;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: middle;
  border: 1px solid #e8eaec;
  border-bottom: 1px solid #e8eaec;
  color: #3f3f3f;
  font-weight: 100;
  font-family: 'Hiragino Sans GB';
}
.applicant_table td:nth-child(2n + 1) {
  font-weight: 700;
  color: #000;
}
</style>
