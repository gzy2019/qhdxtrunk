<template>
  <div>
    <Card>
      <Row>
        <Col span="18">&nbsp;</Col>
        <Col span="6">
          <Button size="small" type="primary" @click="bookNow">立即预订</Button>
          <Button size="small" type="primary" @click="showAgreement" style="margin: 0 5px;">会议预定须知</Button>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="margin-top: 5px;">
          <FullCalendar
            ref="fullcalendar"
            @eventClick="eventClickHandle"
            locale="zh-cn"
            :firstDay="1"
            :displayEventTime="true"
            :buttonText="buttonText"
            :events="events"
            minTime="07:00:00"
            maxTime="23:00:00"
            slotDuration="00:15:00"
            :slotWidth="slotWidth"
            timeZone="Asia/Shanghai"
            :header="header"
            :resources="resources"
            resourceAreaWidth="20%"
            resourceLabelText="会议室"
            themeSystem="bootstrap"
            defaultView="resourceTimelineDay"
            :schedulerLicenseKey="schedulerLicenseKey"
            @viewSkeletonRender="viewSkeletonRender"
            :plugins="calendarPlugins"
            :views="views"
          />
        </Col>
      </Row>
    </Card>

    <BookForm ref="bookform" @update="refreshCalendar" />

    <!--教师会议室使用须知 start-->
    <Modal
      title="教师会议室使用须知"
      v-model="modalReserveNotice"
      class-name="vertical-center-modal"
      :width="1000"
      scrollable
    >
      <div class="words">
        <p>1 使用原则</p>
        <p>1.1 教室应主要用于学院教学活动。</p>
        <p>1.2 各类会议室的使用设定优先级，优先顺序为学院重要会议、学院教学活动、院级学术活动、重要培训活动、学校重要活动、学院其他活动、院外重要活动。</p>
        <p>1.3 申请一般采取先到先得的原则。综合办公室有权根据重要性临时调整使用安排。</p>
        <p>1.4 院外使用原则上应实行收费。</p>
        <p>1.5 各类场所不得用于商业活动。</p>
        <p>1.6 出席活动人数应当与场地容量相符合。报告厅的使用人数原则上不少于100人。</p>
        <p>2 使用申请</p>
        <p>2.1 院外各种活动不得以院内机构或教师的名义进行申请。除院培训中心外，院内申请不得用于各种培训活动。</p>
        <p>2.2 在预约使用日期前，院内应提前五个工作日提出书面或网上申请。集中答辩和统一面试的使用需求应至少提前一周提出。</p>
        <p>2.3 申请者应事先明确填写各类设施、设备、用具使用需求建议（含类型、数量、时间等信息），以及场地（会务）布置的具体方案。</p>
        <p>2.4 对不符合报告厅、会议室、教室管理规定的各种申请事项不予许可。综合办公室做出的临时性调整一般应提前2个工作日告知申请者。</p>
        <p>2.5申请者若在办理使用手续后需要变更或取消使用计划的，至少应在预约使用日前一工作日通知综合办公室（或物业工作人员）。对于因课程计划变更而临时取消使用的，助教（跟班管理人员）有责任提前告知物业工作人员。</p>
        <p>3 使用管理</p>
        <p>3.1 物业公司负责场地日常布置工作，按设定标准布置（开启）桌椅、音响、话筒、投影仪、灯光、空调等。其他布置工作及笔记本电脑一般应由使用者负责。</p>
        <p>3.2 使用者应严格按照综合办公室许可的事项进行场地（会务）布置，并接受综合办公室及物业公司工作人员的监督和管理。未经综合办公室同意，不得在室内张贴海报、横幅、标语、广告等。</p>
        <p>3.3 使用者需提前布置会场的应在借用时说明，并不得占用其他正常使用时间。</p>
        <p>3.4 通常情况下，物业工作人员提前30分钟开门，并开启音响、投影仪等设备。特殊情况下，使用者需要提前开启的，应在申请时注明。</p>
        <p>3.5 电子电器设备必须由物业专业工作人员进行操作，其他人员不得擅自操作。未经允许，任何人不得随意进入控制室，不得更改室内操作台软硬件设置。</p>
        <p>3.6 使用者对活动安全和活动内容负责，切实维护好室内正常的活动秩序，并配合物业做好相关检查工作。</p>
        <p>3.7 使用期间，室内人员要爱护室内的一切公共设施，禁止随便动用室内设备。要注意防火安全，严禁使用明火，严禁私自动用消防设施。</p>
        <p>3.8 使用期间，凡出现设备故障问题，使用者应及时告知物业人员进行现场处理。</p>
        <p>3.9 使用结束后，使用者（跟班管理人员或助教）应及时清点物品并关灯，并及时通知物业管理人员。由物业管理人员检查使用情况，双方签字确认后方可离去。如使用者未告知物业人员或未签字而离开，不影响记录的有效性。</p>
        <p>4 责任</p>
        <p>4.1 使用者有义务及时对服务质量进行评价。</p>
        <p>4.2 使用者的违约情形包括但不限于以下事项：取消或变更使用计划而未告知或未及时告知的；使用结束后未及时告知物业人员的；因使用者的原因造成设施、设备、物品的损坏、改变、丢失的。</p>
        <p>4.3 因使用者的原因造成的设施、设备、物品的损坏、改变、丢失的，使用者应承担相应的赔偿责任或恢复原状。</p>
        <p>4.4 申请和使用情况应列入使用者（部门）或助教评价记录。该记录将作为后续申请批准或助教工作评定的依据之一。首次违约的，提出警告；三次违约的，应暂停申请；情形严重的，可取消申请资格。</p>
        <p>4.5 当天预订不用审批。</p>
      </div>
      <div slot="footer">
        <Button @click="modalReserveNotice = false">取消</Button>
        <Button type="primary" @click="agreementConfirm">申请人已阅读并同意上述规定</Button>
      </div>
    </Modal>
    <!--教师会议室使用须知 end-->
  </div>
</template>

<script>
import api from '@/api/meeting/meetingroombook'
import BookForm from './components/book-form'
import { getFormateDateTime } from '@/libs/util'
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
export default {
  name: 'meeting-booking',
  components: { BookForm, FullCalendar },
  data () {
    return {
      modalReserveNotice: false,
      confirmAgreement: false,
      curDate: '',
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      calendarPlugins: [resourceTimelinePlugin],
      header: {
        left: '',
        center: 'prev,title,next',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
      },
      views: {
        resourceTimelineWeek: {
          displayEventTime: false,
          displayEventEnd: false,
          allDay: true,
          slotDuration: '00:30:00'
        }
      },
      slotWidth: 15,
      buttonText: {
        today: '本月',
        month: '月',
        week: '周',
        day: '日'
        // prev: '前一天',
        // next: '下一天'
      },
      resources: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.curDate = getFormateDateTime(new Date(), 'yyyy-MM-dd')
      this.loadMeetingRoomList()
    },
    loadMeetingRoomList () {
      let colors = ['purple', '', 'orange', 'green', 'red']
      api.getMeetingRoomList().then(res => {
        let list = res.list
        this.resources = list.map((item, index) => {
          return {
            id: item.id,
            title: item.name + '-' + item.roomTypeStr,
            eventColor: colors[index % 5]
          }
        })
      })
    },
    events (info, successCallback, failCallback) {
      console.log('events,', info)
      let params = {
        limit: 1000,
        bookDateBegin: getFormateDateTime(info.start, 'yyyy-MM-dd'),
        bookDateEnd: getFormateDateTime(info.end, 'yyyy-MM-dd')
      }
      api.getBookTimeList(params).then(res => {
        let list = res.list
        list = list.map(item => {
          return {
            resourceId: item.meetingRoomId,
            bookId: item.bookId,
            id: item.id + '-' + item.bookId,
            title: item.meetingName,
            start: item.useTime,
            date: item.date,
            end: item.endTime
          }
        })
        list = this.handleTimeList(list)
        successCallback(list)
      })
    },
    handleTimeList (list) {
      let hlist = []
      let preItem = {}
      list.forEach(item => {
        if (
          hlist.length === 0 ||
          item.resourceId !== preItem.resourceId ||
          item.date !== preItem.date ||
          item.bookId !== preItem.bookId
        ) {
          hlist.push(item)
          preItem = item
        } else {
          if (item.start === preItem.end) {
            preItem.end = item.end
          } else {
            hlist.push(item)
            preItem = item
          }
        }
      })

      return hlist
    },
    formatDate (date) {
      let d = new Date(date)
      let str = getFormateDateTime(d, 'MM月dd日')
      return str
    },
    formatDay (date) {
      let d = new Date(date)
      let dayStr = dayMap[d.getDay()]
      return dayStr
    },
    bookNow () {
      this.showAgreement()
      this.confirmAgreement = false
    },
    showAgreement () {
      this.modalReserveNotice = true
    },
    agreementConfirm () {
      this.modalReserveNotice = false
      this.confirmAgreement = true
      this.$refs.bookform.addBook()
    },
    refreshCalendar () {
      let calendarApi = this.$refs.fullcalendar.getApi()
      calendarApi.refetchEvents()
    },
    eventClickHandle (info) {
      let idStr = info.event.id
      let bookId = parseInt(idStr.split('-')[1])
      this.$refs.bookform.viewBook(bookId)
    },
    viewSkeletonRender (info) {
      if (info.view.type === 'resourceTimelineDay') {
        this.slotWidth = 15
      } else if (info.view.type === 'resourceTimelineWeek') {
        this.slotWidth = 30
      } else {
        this.slotWidth = 150
      }
    }
  }
}
</script>
<style>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/timeline/main.css";
@import "~@fullcalendar/resource-timeline/main.css";

div.legend-gray {
  width: 60px;
  height: 22px;
  background-color: #dcdee2;
  display: inline-block;
  margin: 0 5px -8px 5px;
}
div.legend-white {
  width: 60px;
  height: 22px;
  background-color: #fff;
  display: inline-block;
  border: 1px solid #8a8282ad;
  margin: 0 5px -8px 5px;
}
.fc-button-primary {
  background-color: #8c0e9e;
  border-color: #8c0e9e;
}
.fc-button-primary:not(:disabled).fc-button-active {
  background-color: #b318caa8;
  border-color: #b318caa8;
}
.fc-center h2 {
  display: inline-block;
  vertical-align: middle;
  padding: 0 10px;
}
</style>
