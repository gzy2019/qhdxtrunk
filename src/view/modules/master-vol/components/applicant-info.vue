<template>
  <!-- 查看详细信息 start-->
  <Modal :title="`报名详情: ${applicantInfo.applicantName || ''}`" v-model="modalViewDetail" :mask-closable='false' :width="1170" class-name="vertical-center-modal popup_detail" :styles="{top: '20px'}">
    <div class="detail_cont ">
      <Spin size="large" fix v-if="loading"></Spin>
      <Row :gutter="16">
        <Col span="3" class="popup_title">
          <ul class="left_ul">
            <li :class="{'active': currentIndex===1}"><span @click="currentIndex=1">基本信息</span></li>
            <li :class="{'active': currentIndex===2}"><span @click="currentIndex=2">教育经历</span></li>
            <li :class="{'active': currentIndex===3}"><span @click="currentIndex=3">工作经历</span></li>
            <li :class="{'active': currentIndex===4}"><span @click="currentIndex=4">外语水平</span></li>
            <li :class="{'active': currentIndex===5}"><span @click="currentIndex=5">推荐人信息</span></li>
            <li :class="{'active': currentIndex===6}"><span @click="currentIndex=6">所获荣誉</span></li>
            <li :class="{'active': currentIndex===7}"><span @click="currentIndex=7">个人自述</span></li>
            <li :class="{'active': currentIndex===8}"><span @click="currentIndex=8">材料上传</span></li>
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
                  <td>面试申请号</td>
                  <td>{{applicantInfo.applicantNo}}</td>
                  <td>姓名</td>
                  <td>{{applicantInfo.applicantName}}</td>
                  <td>性别</td>
                  <td>{{applicantInfo.applicantSexStr}}</td>
                </tr>
                <tr>
                  <td>出生日期</td>
                  <td>{{applicantInfo.applicantBirthday}}</td>
                  <td>批次</td>
                  <td>{{applicantInfo.project.projectName}}</td>
                  <td>政治面貌</td>
                  <td>{{applicantInfo.applicantPoliticStateStr}}</td>
                </tr>
                <tr>
                  <td>民族</td>
                  <td>{{applicantInfo.applicantNationStr}}</td>
                  <td>户籍地</td>
                  <td>{{applicantInfo.applicantBirthPlace}}</td>
                  <td>手机号码</td>
                  <td>{{applicantInfo.applicantMobile}}</td>
                </tr>
                <tr>
                  <td>电话区号</td>
                  <td>{{applicantInfo.applicantTelephonePre}}</td>
                  <td>座机号码</td>
                  <td>{{applicantInfo.applicantTelephone}}</td>
                  <td>证件类型</td>
                  <td>{{applicantInfo.applicantCardTypeStr}}</td>
                </tr>
                <tr>
                  <td>证件号</td>
                  <td>{{applicantInfo.applicantCardNo}}</td>
                  <td>考生来源</td>
                  <td>{{applicantInfo.applicantSourceStr}}</td>
                  <td>考试方式</td>
                  <td>{{applicantInfo.applicantExamWayStr}}</td>
                </tr>
                <tr>
                  <td>电子邮箱</td>
                  <td>{{applicantInfo.applicantEmail}}</td>
                  <td>家庭住址</td>
                  <td>{{applicantInfo.applicantAddressHome}}</td>
                  <td>通讯地址</td>
                  <td>{{applicantInfo.applicantAddress}}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--基本信息 end-->

          <!--教育经历 start-->
          <div class="baseinformation" v-show="currentIndex==2">
            <div class="popup_title">
              <p><Icon type="ios-school-outline" />教育经历</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table style="margin:0 auto 10px">
                <tr>
                  <td>最高学历</td>
                  <td>{{applicantInfo.applicantEducationNameStr}}</td>
                  <td>毕业时间</td>
                  <td>{{applicantInfo.applicantGraduateDate}}</td>
                  <td>最高毕业学位</td>
                  <td>{{applicantInfo.applicantDegreeNameStr}}</td>
                </tr>
                <tr>
                  <td>最高学历院校</td>
                  <td>{{applicantInfo.applicantSchoolName}}</td>
                  <td>国家</td>
                  <td>{{applicantInfo.applicantSchoolLocationStr}}</td>
                  <td>毕业专业</td>
                  <td>{{applicantInfo.applicantMajorName}}</td>
                </tr>
              </table>

              <table v-for="(item,index) in applicantInfo.studyExpList" :key="index" style="margin:0 auto 10px">
                <tr>
                  <td>院校</td>
                  <td>{{item.applicantSchoolName}}</td>
                  <td>国家</td>
                  <td>{{item.applicantSchoolCountryStr}}</td>
                  <td>学习方式</td>
                  <td>{{item.applicantTypeStudyStr}}</td>
                </tr>
                <tr>
                  <td>开始时间</td>
                  <td colspan="2">{{item.applicantStudyStart}}</td>
                  <td>结束时间</td>
                  <td colspan="2">{{item.applicantStudyEnd}}</td>
                </tr>
                <tr>
                  <td>学历</td>
                  <td>{{item.applicantEducationStr}}</td>
                  <td>专业</td>
                  <td>{{item.applicantMajorName}}</td>
                  <td>学位</td>
                  <td>{{item.applicantDegreeStr}}</td>
                </tr>
                <tr>
                  <td>学历证书编号</td>
                  <td colspan="2">{{item.applicantEducationCertificateNum}}</td>
                  <td>学位证书编号</td>
                  <td colspan="2">{{item.applicantDegreeCertificateNum}}</td>
                </tr>
                <tr>
                  <td>班级排名</td>
                  <td>{{item.applicantClassRank}}</td>
                  <td>备注</td>
                  <td colspan="3">{{item.applicantStudyDesc}}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--教育经历 end-->

          <!--工作经历 start-->
          <div class="baseinformation" v-show="currentIndex==3">
            <div class="popup_title">
              <p><Icon type="ios-document-outline" />工作经历</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table v-for="(item,index) in applicantInfo.workExpList" :key="index">
                <tr>
                  <td>全职工作经验</td>
                  <td>{{item.applicantWorkYears}}</td>
                  <td>管理工作经验</td>
                  <td>{{item.applicantManageYears}}</td>
                  <td>现任岗位职务/职级</td>
                  <td>{{item.applicantPost}}</td>
                </tr>
                <tr>
                  <td>其他职务/职级</td>
                  <td>{{item.applicantPostOther}}</td>
                  <td>职务/职级开始时间</td>
                  <td>{{item.applicantPostStart}}</td>
                  <td>现工作单位名称</td>
                  <td>{{item.applicantCompanyName}}</td>
                </tr>
                <tr>
                  <td>单位所在省市</td>
                  <td>{{item.applicantCompanyLocation}}</td>
                  <td>行业类别</td>
                  <td>{{item.applicantTypeIndustryStr}}</td>
                  <td>单位类别</td>
                  <td>{{item.applicantTypeCompanyStr}}</td>
                </tr>
                <tr>
                  <td>岗位职能</td>
                  <td colspan="3">{{item.applicantTypePostStr}}</td>
                  <td>专业技术职称</td>
                  <td>{{item.applicantTypeTitle}}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--工作经历 end-->

          <!--外语水平 start-->
          <div class="baseinformation" v-show="currentIndex==4">
            <div class="popup_title">
              <p><Icon type="ios-megaphone-outline" />外语水平</p>
              <Divider />
            </div>
            <div class="popup-content">
              <p>英语水平</p>
              <table v-for="(item,index) in getEnglishForeign()" :key="index">
                <tr>
                  <td>英语考试{{getCNOrder(index)}}</td>
                  <td>{{item.applicantExamTypeStr}}</td>
                  <td>分数</td>
                  <td>{{item.applicantExamScore}}</td>
                  <td>考试日期</td>
                  <td>{{item.applicantExamDate}}</td>
                </tr>
              </table>
              <p>其它外语</p>
              <table style="margin:0 auto 10px" v-for="(item,index) in getOtherForeign()" :key="index + 500">
                <tr >
                  <td>考试名称</td>
                  <td>{{item.applicantExamName}}</td>
                  <td>分数</td>
                  <td>{{item.applicantExamScore}}</td>
                </tr>
                <tr >
                  <td>获取证书时间</td>
                  <td>{{item.applicantCertificateDate}}</td>
                  <td>证书编号</td>
                  <td>{{item.applicantCertificateNum}}</td>
                </tr>
              </table>
            </div>

          </div>
          <!--外语水平 end-->

          <!--推荐人 start-->
          <div class="baseinformation" v-show="currentIndex==5">
            <div class="popup_title">
              <p><Icon type="ios-contact-outline" />推荐人信息</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table v-for="(item,index) in applicantInfo.recommendList" :key="index">
                <tr>
                  <td colspan="6">
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
                  <td>职称</td>
                  <td>{{item.applicantRecommendPost}}</td>
                  <td>电话号码</td>
                  <td>{{item.applicantRecommendMobile}}</td>
                  <td>邮箱</td>
                  <td>{{item.applicantRecommendEmail}}</td>
                </tr>
              </table>
            </div>

          </div>
          <!--推荐人 end-->

          <!--所获荣誉 start-->
          <div class="baseinformation" v-show="currentIndex==6">
            <div class="popup_title">
              <p><Icon type="ios-medal-outline" />所获荣誉</p>
              <Divider />
            </div>
            <div class="popup-content">
              <table>
                <tr v-for="(item,index) in applicantInfo.honorList" :key="index">
                  <td>奖项名称</td>
                  <td>{{item.applicantHonorName}}</td>
                  <td>获奖时间</td>
                  <td>{{item.applicantHonorDate}}</td>
                  <td>颁奖机构</td>
                  <td>{{item.applicantGrantOrganization}}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--所获荣誉 end-->

          <!--个人自述 start-->
          <div class="baseinformation" v-show="currentIndex==7">
            <div class="popup_title">
              <p><Icon type="ios-person-outline" />个人自述</p>
              <Divider />
            </div>
            <div class="words">
              <!-- <Input type="textarea" :rows="10" readonly v-model="applicantInfo.applicantDesc" :maxlength="2000" placeholder="栏目描述" /> -->
              <pre>{{applicantInfo.applicantDesc}}</pre>
            </div>
          </div>
          <!--个人自述 end-->

          <!--材料 start-->
          <div class="baseinformation" v-show="currentIndex==8">
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
import api from '@/api/master/applicant'
export default {
  name: 'master-applicant-info',
  data () {
    return {
      loading: false,
      currentIndex: 1,
      modalViewDetail: false,
      applicantInfo: {
        project: {}
      }
    }
  },
  filters: {
    fileTypeInfo (val) {
      if (val === '1') {
        return '研究生登记表'
      } else if (val === '2') {
        return '成绩单'
      } else if (val === '3') {
        return '证书'
      } else if (val === '4') {
        return '在线推荐信'
      } else if (val === '5') {
        return '论文'
      } else if (val === '6') {
        return '中文个人陈述'
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
    getEnglishForeign () {
      if (!this.applicantInfo.foreignList) return []
      return this.applicantInfo.foreignList.filter(item => item.applicantLanguageType === 1)
    },
    getOtherForeign (list) {
      if (!this.applicantInfo.foreignList) return []
      return this.applicantInfo.foreignList.filter(item => item.applicantLanguageType !== 1)
    },
    loadApplicantInfo (applicantId) {
      if (!applicantId) return
      this.currentIndex = 1
      this.loading = true
      api.getMasterApplicantInfo(applicantId, {}).then(res => {
        this.applicantInfo = res.applyApplicant
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
pre{
  border: 1px solid #dcdee2;
  padding:5px 5px;
  min-height:100px;
  font-size: 14px;
  line-height:1.5;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  color:#515a6e;
}
.applicant_table td:nth-child(2n + 1) {
  font-weight: 700;
  color: #000;
}
</style>
