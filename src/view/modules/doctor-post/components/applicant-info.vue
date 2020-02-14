<template>
  <!-- 查看详细信息 start-->
  <Modal
    :title="`报名详情: ${applicantInfo.applicantName || ''}`"
    v-model="modalViewDetail"
    :mask-closable="false"
    :width="1170"
    class-name="vertical-center-modal popup_detail"
    :styles="{top: '20px'}"
  >
    <div class="detail_cont">
      <Spin size="large" fix v-if="loading"></Spin>
      <Row :gutter="16">
        <Col span="3" class="popup_title">
          <ul class="left_ul">
            <li :class="{'active': currentIndex===0}">
              <span @click="currentIndex=0">研究方向</span>
            </li>
            <li :class="{'active': currentIndex===1}">
              <span @click="currentIndex=1">基本信息</span>
            </li>
            <li :class="{'active': currentIndex===2}">
              <span @click="currentIndex=2">学历信息</span>
            </li>
            <li :class="{'active': currentIndex===3}">
              <span @click="currentIndex=3">工作经历</span>
            </li>
            <li :class="{'active': currentIndex===4}">
              <span @click="currentIndex=4">配偶信息</span>
            </li>
            <li :class="{'active': currentIndex===5}">
              <span @click="currentIndex=5">论文发表</span>
            </li>
            <li :class="{'active': currentIndex===6}">
              <span @click="currentIndex=6">科研情况</span>
            </li>
            <li :class="{'active': currentIndex===7}">
              <span @click="currentIndex=7">奖罚情况</span>
            </li>
            <li :class="{'active': currentIndex===8}">
              <span @click="currentIndex=8">自我评价</span>
            </li>
          </ul>
        </Col>
        <Col span="21">
          <div class="right_cont applicant_table">
            <!--研究方向 start-->
            <div class="baseinformation" v-show="currentIndex==0">
              <div class="popup_title">
                <p>
                  <Icon type="ios-create-outline" />研究方向
                </p>
                <Divider />
              </div>
              <div class="popup-content">
                <table>
                  <tr>
                    <td>申请导师</td>
                    <td>
                      <template
                        v-if="applicantInfo.teacher && applicantInfo.teacher.postTeacher"
                      >{{applicantInfo.teacher.postTeacher.teacherName}}</template>
                    </td>
                  </tr>
                  <tr>
                    <td>研究方向</td>
                    <td>
                      <template
                        v-if="applicantInfo.teacher && applicantInfo.teacher.postTeacher"
                      >{{applicantInfo.teacher.postTeacher.applyDirectionStr}}</template>
                    </td>
                  </tr>
                  <tr>
                    <td>联合导师</td>
                    <td>
                      <template
                        v-if="applicantInfo.teacher && applicantInfo.teacher.postTeacher"
                      >{{applicantInfo.teacher.postTeacher.teacher2Name}}</template>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <!--研究 end-->
            <!--基本信息 start-->
            <div class="baseinformation" v-show="currentIndex==1">
              <div class="popup_title">
                <p>
                  <Icon type="ios-person-outline" />基本信息
                </p>
                <Divider />
              </div>
              <div class="popup-content">
                <table>
                  <tr>
                    <td>面试申请号</td>
                    <td>{{applicantInfo.applicantNo}}</td>
                    <td>批次</td>
                    <td>{{applicantInfo.project.projectName}}</td>
                    <td>姓名</td>
                    <td>{{applicantInfo.applicantName}}</td>
                  </tr>
                  <tr>
                    <td>性别</td>
                    <td>{{applicantInfo.applicantSexStr}}</td>
                    <td>出生日期</td>
                    <td>{{applicantInfo.applicantBirthday}}</td>
                    <td>籍贯</td>
                    <td>{{applicantInfo.applicantNativePlace}}</td>
                  </tr>
                  <tr>
                    <td>民族</td>
                    <td>{{applicantInfo.applicantNationStr}}</td>
                    <td>政治面貌</td>
                    <td>{{applicantInfo.applicantPoliticStateStr}}</td>
                    <td>手机号码</td>
                    <td>{{applicantInfo.applicantMobile}}</td>
                  </tr>
                  <tr>
                    <td>电子邮箱</td>
                    <td>{{applicantInfo.applicantEmail}}</td>
                    <td>邮政编码</td>
                    <td>{{applicantInfo.applicantZipcode}}</td>
                    <td>户口所在地</td>
                    <td>{{applicantInfo.applicantHukou}}</td>
                  </tr>
                  <tr>
                    <td>联系地址</td>
                    <td colspan="5">{{applicantInfo.applicantAddress}}</td>
                  </tr>
                  <tr>
                    <td>获博士学位单位</td>
                    <td>{{applicantInfo.applicantDoctorOrg}}</td>
                    <td>专业特长</td>
                    <td>{{applicantInfo.applicantMajor}}</td>
                    <td>人事隶属单位</td>
                    <td>{{applicantInfo.applicantRenshiOrg}}</td>
                  </tr>
                  <tr>
                    <td>主要研究方向</td>
                    <td>{{applicantInfo.applicantResearchDirection}}</td>
                    <td>申请状态</td>
                    <td>{{applicantInfo.applicantApplyStatus}}</td>
                    <td>博士预计答辩时间</td>
                    <td>{{applicantInfo.applicantDoctorPaperTime}}</td>
                  </tr>
                  <tr>
                    <td>职务</td>
                    <td>{{applicantInfo.applicantTechPost}}</td>
                    <td>职称</td>
                    <td colspan="3">{{applicantInfo.applicantTechPostTime}}</td>
                  </tr>
                </table>
              </div>
            </div>
            <!--基本信息 end-->

            <!--学历信息 start-->
            <div class="baseinformation" v-show="currentIndex==2">
              <div class="popup_title">
                <p>
                  <Icon type="ios-school-outline" />学历信息
                </p>
                <Divider />
              </div>
              <div class="popup-content">
                <p>本科经历</p>
                <table style="margin:0 auto 10px">
                  <tr>
                    <td>学校</td>
                    <td>{{undergraduate.applicantSchoolName}}</td>
                    <td>专业</td>
                    <td>{{undergraduate.applicantMajor}}</td>
                    <td>指导老师</td>
                    <td>{{undergraduate.applicantMentor}}</td>
                  </tr>
                  <tr>
                    <td>获学位时间</td>
                    <td>{{undergraduate.applicantDegreeeTime}}</td>
                    <td>论文题目</td>
                    <td colspan="3">{{undergraduate.applicantPaperTitle}}</td>
                  </tr>
                </table>
                <p>硕士经历</p>
                <table style="margin:0 auto 10px">
                  <tr>
                    <td>学校</td>
                    <td>{{postgraduate.applicantSchoolName}}</td>
                    <td>专业</td>
                    <td>{{postgraduate.applicantMajor}}</td>
                    <td>指导老师</td>
                    <td>{{postgraduate.applicantMentor}}</td>
                  </tr>
                  <tr>
                    <td>获学位时间</td>
                    <td>{{postgraduate.applicantDegreeeTime}}</td>
                    <td>论文题目</td>
                    <td colspan="3">{{postgraduate.applicantPaperTitle}}</td>
                  </tr>
                </table>
                <p>博士经历</p>
                <table style="margin:0 auto 10px">
                  <tr>
                    <td>学校</td>
                    <td>{{doctor.applicantSchoolName}}</td>
                    <td>专业</td>
                    <td>{{doctor.applicantMajor}}</td>
                    <td>指导老师</td>
                    <td>{{doctor.applicantMentor}}</td>
                  </tr>
                  <tr>
                    <td>获学位时间</td>
                    <td>{{doctor.applicantDegreeeTime}}</td>
                    <td>论文题目</td>
                    <td colspan="3">{{doctor.applicantPaperTitle}}</td>
                  </tr>
                </table>
                <p>其它经历</p>
                <table style="margin:0 auto 10px">
                  <tr>
                    <td>学校</td>
                    <td>{{other.applicantSchoolName}}</td>
                    <td>专业</td>
                    <td>{{other.applicantMajor}}</td>
                    <td>指导老师</td>
                    <td>{{other.applicantMentor}}</td>
                  </tr>
                  <tr>
                    <td>获学位时间</td>
                    <td>{{other.applicantDegreeeTime}}</td>
                    <td>论文题目</td>
                    <td colspan="3">{{other.applicantPaperTitle}}</td>
                  </tr>
                </table>
              </div>
            </div>
            <!--学历信息 end-->

            <!--工作经历 start-->
            <div class="baseinformation" v-show="currentIndex==3">
              <div class="popup_title">
                <p>
                  <Icon type="ios-document-outline" />工作经历
                </p>
                <Divider />
              </div>
              <div class="popup-content">
                <table v-for="(item,index) in applicantInfo.workExpList" :key="index">
                  <tr>
                    <td>开始时间</td>
                    <td>{{item.applicantPostStart}}</td>
                    <td>结束时间</td>
                    <td>{{item.applicantPostEnd}}</td>
                  </tr>
                  <tr>
                    <td>工作单位</td>
                    <td>{{item.applicantCompanyName}}</td>
                    <td>职务</td>
                    <td>{{item.applicantPost}}</td>
                  </tr>
                  <tr>
                    <td>具体工作内容</td>
                    <td colspan="3">{{item.applicantMemo}}</td>
                  </tr>
                </table>
              </div>
            </div>
            <!--工作经历 end-->

            <!--配偶信息 start-->
            <div class="baseinformation" v-show="currentIndex==4">
              <div class="popup_title">
                <p>
                  <Icon type="ios-megaphone-outline" />配偶信息
                </p>
                <Divider />
              </div>
              <div class="popup-content">
                <p>配偶信息</p>
                <table>
                  <tr>
                    <td>姓名</td>
                    <td>{{spouse.applicantName}}</td>
                    <td>出生日期</td>
                    <td>{{spouse.applicantBirthday}}</td>
                    <td>籍贯</td>
                    <td>{{spouse.applicantNativePlace}}</td>
                  </tr>
                  <tr>
                    <td>民族</td>
                    <td>{{spouse.applicantNationStr}}</td>
                    <td>政治面貌</td>
                    <td>{{spouse.applicantPoliticStateStr}}</td>
                    <td>毕业学校</td>
                    <td>{{spouse.applicantSchoolName}}</td>
                  </tr>
                  <tr>
                    <td>专业</td>
                    <td>{{spouse.applicantMajor}}</td>
                    <td>学历</td>
                    <td>{{spouse.applicantEducation}}</td>
                    <td>工作单位</td>
                    <td>{{spouse.applicantCompnay}}</td>
                  </tr>
                  <tr>
                    <td>职务</td>
                    <td>{{spouse.applicantPost}}</td>
                    <td>职称</td>
                    <td>{{spouse.applicantPostTitle}}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
                <p>子女信息</p>
                <table
                  style="margin:0 auto 10px"
                  v-for="(item,index) in applicantInfo.childrenList"
                  :key="index + 500"
                >
                  <tr>
                    <td>姓名</td>
                    <td>{{item.applicantName}}</td>
                    <td>出生日期</td>
                    <td>{{item.applicantBirthday}}</td>
                  </tr>
                  <tr>
                    <td>性别</td>
                    <td>{{item.applicantSexStr}}</td>
                    <td>上学情况</td>
                    <td>{{item.applicantStudyStatus}}</td>
                  </tr>
                </table>
              </div>
            </div>
            <!--配偶信息 end-->

            <!--论文发表 start-->
            <div class="baseinformation" v-show="currentIndex==5">
              <div class="popup_title">
                <p>
                  <Icon type="ios-person-outline" />论文发表情况
                </p>
                <Divider />
              </div>
              <div class="words">
                <pre>{{applicantInfo.applicantPaperMemo}}</pre>
              </div>
              <div class="popup_title">
                <p>
                  <Icon type="ios-person-outline" />论文摘要
                </p>
                <Divider />
              </div>
              <div class="words">
                <pre>{{applicantInfo.applicantPaperSummary}}</pre>
              </div>
            </div>
            <!--论文发表 end-->

            <!--科研情况 start-->
            <div class="baseinformation" v-show="currentIndex==6">
              <div class="popup_title">
                <p>
                  <Icon type="ios-person-outline" />科研情况
                </p>
                <Divider />
              </div>
              <div class="words">
                <pre>{{applicantInfo.applicantResearchMemo}}</pre>
              </div>
            </div>
            <!--科研情况 end-->

            <!--奖罚情况 start-->
            <div class="baseinformation" v-show="currentIndex==7">
              <div class="popup_title">
                <p>
                  <Icon type="ios-person-outline" />奖罚情况
                </p>
                <Divider />
              </div>
              <div class="words">
                <pre>{{applicantInfo.applicantRewardMemo}}</pre>
              </div>
            </div>
            <!--奖罚情况 end-->

            <!--自我评价 start-->
            <div class="baseinformation" v-show="currentIndex==8">
              <div class="popup_title">
                <p>
                  <Icon type="ios-person-outline" />自我评价
                </p>
                <Divider />
              </div>
              <div class="words">
                <pre>{{applicantInfo.applicantDesc}}</pre>
              </div>
            </div>
            <!--自我评价 end-->
          </div>
        </Col>
      </Row>
    </div>
  </Modal>
  <!-- 查看详细信息 end-->
</template>

<script>
import api from '@/api/doctorpost/doctorpostapplicant'
export default {
  name: 'doctorpost-applicant-info',
  data () {
    return {
      loading: false,
      currentIndex: 0,
      modalViewDetail: false,
      applicantInfo: {
        project: {}
      }
    }
  },
  computed: {
    undergraduate () {
      if (this.applicantInfo.studyExpList) {
        return this.applicantInfo.studyExpList.find(
          item => item.studyType === 'undergraduate'
        ) || {}
      }
      return {}
    },
    postgraduate () {
      if (this.applicantInfo.studyExpList) {
        return (
          this.applicantInfo.studyExpList.find(
            item => item.studyType === 'postgraduate'
          ) || {}
        )
      }
      return {}
    },
    doctor () {
      if (this.applicantInfo.studyExpList) {
        return (
          this.applicantInfo.studyExpList.find(
            item => item.studyType === 'doctor'
          ) || {}
        )
      }
      return {}
    },
    other () {
      if (this.applicantInfo.studyExpList) {
        return (
          this.applicantInfo.studyExpList.find(
            item => item.studyType === 'other'
          ) || {}
        )
      }
      return {}
    },
    spouse () {
      return this.applicantInfo.spouse || {}
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
      this.currentIndex = 0
      this.loading = true
      api
        .getDoctorPostApplicantInfo(applicantId, {})
        .then(res => {
          this.applicantInfo = res.doctorPostApplicant
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
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
  font-family: "Hiragino Sans GB";
}
.applicant_table td:nth-child(2n + 1) {
  font-weight: 700;
  color: #000;
}
pre {
  border: 1px solid #dcdee2;
  padding: 5px 5px;
  min-height: 100px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  color: #515a6e;
}
</style>
