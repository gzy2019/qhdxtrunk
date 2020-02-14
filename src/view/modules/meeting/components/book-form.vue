<template>
  <div>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="700" class-name="vertical-center-modal">
      <Spin size="large" fix v-if="loading"></Spin>
      <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
        <FormItem label="会议名称" prop="name">
          <Input type="text" :readonly="modalView" :clearable="!modalView" v-model="dataForm.name" :maxlength="200" placeholder="请输入会议名称" />
        </FormItem>
        <FormItem label="会议类型" prop="meetingType">
          <DicSelect :disabled="modalView" :clearable="!modalView" v-model="dataForm.meetingType" dtype="meeting-type" placeholder="请选择会议类型"/>
        </FormItem>
        <FormItem label="使用部门" prop="departmentId">
          <DepartmentSelect ref="departmentSelect" v-model="dataForm.departmentId" />
        </FormItem>
        <FormItem label="预订人" prop="bookBy">
          <Input :readonly="true" type="text" v-model="dataForm.bookBy" :maxlength="200" placeholder="请输入预订人" />
        </FormItem>
        <FormItem label="联系方式" prop="contact">
          <Input :readonly="modalView" :clearable="!modalView" type="text" v-model="dataForm.contact" :maxlength="200" placeholder="请输入联系方式" />
        </FormItem>
        <FormItem label="会议室" prop="meetingRoomId">
          <Select :disabled="modalView" :clearable="!modalView" v-model="dataForm.meetingRoomId" placeholder="请选择会议室">
            <Option v-for="(item,index) in meetingRoomList" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否连续预订" prop="serialDate">
          <i-switch :disabled="modalView" v-model="dataForm.serialDate">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="使用日期" prop="beginDate" v-show="!dataForm.serialDate">
          <IDatePicker :readonly="modalView" :clearable="!modalView" type="date" v-model="dataForm.beginDate" format="yyyy-MM-dd" placeholder="请选择使用日期" />
        </FormItem>
        <FormItem label="使用日期" prop="useDate" v-show="dataForm.serialDate">
          <IDatePicker :readonly="modalView" :clearable="!modalView" type="daterange" v-model="dataForm.useDate" format="yyyy-MM-dd" placeholder="请选择使用日期" />
        </FormItem>
        <FormItem label="星期" prop="weekDays" v-show="dataForm.serialDate">
          <CheckboxGroup v-model="dataForm.weekDays" size="large">
              <Checkbox :disabled="modalView" v-for="item in weekDays" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="使用时间" prop="timeList">
          <Alert v-if="bookTimeList && bookTimeList.length > 0 && !modalView">
            <template slot="desc">当前日期对应的会议室被预订时间：
              <Tag color="primary" v-for="(item,index) in bookedTimeDescList" :key="index">{{item}}</Tag>
            </template>
          </Alert>
          <Alert v-if="dataForm.serialDate && getCurBookDateList().length === 0" type="warning">
            根据开始日期，结束日期和星期匹配的日期为空
          </Alert>
          <Tag color="primary" :closable="!modalView" v-for="(item,index) in dataForm.timeList" :key="index" @on-close="removeTimeItem(index)">{{item.timeDesc}}</Tag>
          <Button icon="ios-add" size="small" type="primary" v-if="canSelectTime" :disabled="addTimeVisible" @click="addTimeHandle">增加时间</Button>
          <Alert v-if="!canSelectTime && !modalView" type="info">请先选择会议室和日期</Alert>
        </FormItem>

        <Row v-if="addTimeVisible">
          <Col span="9">
            <FormItem label="开始时间">
              <Select v-model="tmpStart" size="small" placeholder="请选择开始时间" @on-change="tmpStartChangeHandle">
                <Option v-for="(item,index) in startTimeList" :disabled="item.disabled" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="结束时间">
              <Select v-model="tmpEnd" size="small" placeholder="请选择结束时间">
                <Option v-for="(item,index) in endTimeList" :disabled="item.disabled" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" style="margin-top: 5px;">
            <Button type="primary" size="small" style="margin:0 5px;" @click="addTimeItem">确定</Button>
            <Button type="primary" size="small" @click="addTimeCancel">取消</Button>
          </Col>
        </Row>

        <FormItem label="刷卡人员" prop="teacherList">
          <Select :disabled="modalView" :clearable="!modalView" v-model="dataForm.teacherList" multiple filterable placeholder="请选择刷卡人员">
            <Option v-for="(item,index) in teacherList" :key="index" :value="item.id">{{item.teaName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="附件" prop="files">
          <IUpload
            v-if="!modalView"
            v-model="dataForm.files"
            :defaultList="dataForm.defaultFileList"
            :onlyone="false"
            :multiple="true"
            :maxSize="20480"
          />
          <a v-if="modalView" target="_blank" v-for="(item,index) in dataForm.defaultFileList" :key="index" :href="item.url">{{item.name}}</a>
        </FormItem>
        <FormItem label="备注" prop="memo">
          <Input :readonly="modalView" :clearable="!modalView"  type="textarea" :rows="4" v-model="dataForm.memo" :maxlength="500" placeholder="如果需要使用设备或其他需求，请备注" />
        </FormItem>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="saveMeetingBook">提交</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->
  </div>
</template>

<script>
import IUpload from '@/view/components/iupload'
import DepartmentSelect from '@/view/components/department-select'
import api from '@/api/meeting/meetingroombook'
import IDatePicker from '@/view/components/idate-picker'
import DicSelect from '@/view/components/dic-select'
import { getFormateDateTime, dateAdds } from '@/libs/util'
const dayMap = {
  2: '星期一',
  3: '星期二',
  4: '星期三',
  5: '星期四',
  6: '星期五',
  7: '星期六',
  1: '星期日'
}
var constTimeList = []
let I_T = 15 // 时间间隔
for (let i = 7; i < 23; i++) {
  let count = 60 / I_T
  for (let j = 1; j <= count; j++) {
    let h = (i > 9 ? i : '0' + i) + ''
    let m = j * I_T
    let m2 = ((j - 1) * I_T)
    let t1 = h + ':' + (m2 > 9 ? m2 : '0' + m2)
    // eslint-disable-next-line no-unused-vars
    let t2 = h + ':' + (m > 9 ? m : '0' + m)
    if (m === 60) {
      let h2 = (i + 1) > 9 ? (i + 1) : '0' + (i + 1) + ''
      t2 = h2 + ':00'
    }
    let obj = {
      key: t1,
      name: t1
    }
    constTimeList.push(obj)
  }
}

export default {
  name: 'meeting-book-form',
  components: { IDatePicker, DicSelect, DepartmentSelect, IUpload },
  data () {
    return {
      loading: false,
      formModalVisible: false,
      modalView: false,
      modalTitle: '立即预订',
      meetingRoomList: [],
      teacherList: [],
      bookTimeList: [],
      tmpStart: '',
      tmpEnd: '',
      addTimeVisible: false,
      dataForm: {
        name: '',
        meetingRoomId: '',
        meetingType: '',
        department: '',
        bookBy: '',
        contact: '',
        serialDate: false,
        beginDate: '',
        endDate: '',
        useDate: [],
        timeList: [],
        useTime: '',
        weekDays: [],
        teacherList: [],
        files: [],
        defaultFileList: [],
        departmentId: null,
        departmentIdPath: null,
        memo: '',
        id: undefined
      },
      dataFormValidate: {
        name: [
          { required: true, message: '会议名称不能为空', trigger: 'blur' }
        ],
        meetingRoomId: [
          { type: 'number', required: true, message: '会议室ID不能为空', trigger: 'change' }
        ],
        meetingType: [
          { required: true, message: '会议类型不能为空', trigger: 'change' }
        ],
        departmentId: [
          { type: 'number', required: true, message: '使用部门不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' }
        ],
        timeList: [
          { type: 'array', required: true, message: '使用时间不能为空', trigger: 'blur' }
        ],
        teacherList: [
          { type: 'array', required: true, message: '刷卡人员不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  computed: {
    weekDays () {
      let arr = []
      Object.keys(dayMap).forEach(key => {
        arr.push({
          id: key,
          name: dayMap[key]
        })
      })
      let sunday = arr[0]
      arr.splice(0, 1)
      arr.push(sunday)

      return arr
    },
    startTimeList () {
      let arr = []
      let bookTimeArr = this.bookTimeList.filter(item => item.bookId !== this.dataForm.id)
      constTimeList.forEach(item => {
        let disabled = false
        let t1 = parseInt(item.key.replace(':', ''))
        let bookedTime = bookTimeArr.find(timeItem => {
          let t2 = parseInt(timeItem.hourMinute.replace(':', ''))
          let t3 = parseInt(timeItem.endHourMinute.replace(':', ''))

          return t1 >= t2 && t1 < t3
        })
        disabled = !!bookedTime

        if (!disabled) {
          bookedTime = this.dataForm.timeList.find(timeItem => {
            let t2 = parseInt(timeItem.hourMinute.replace(':', ''))
            let t3 = parseInt(timeItem.endHourMinute.replace(':', ''))

            return t1 >= t2 && t1 < t3
          })
          disabled = !!bookedTime
        }

        console.log('disabled:', disabled)

        arr.push({
          id: item.key,
          name: item.name,
          disabled: disabled
        })
      })

      return arr
    },
    endTimeList () {
      let arr = []
      let bookTimeArr = this.bookTimeList.filter(item => item.bookId !== this.dataForm.id)
      let closestTimeArr = bookTimeArr.filter(item => {
        if (this.tmpStart) {
          let tmp2 = parseInt(item.hourMinute.replace(':', ''))
          let tmp1 = parseInt(this.tmpStart.replace(':', ''))
          return tmp2 > tmp1
        }

        return true
      })
      let closestTime = null
      if (closestTimeArr.length) {
        closestTimeArr.sort((a, b) => parseInt(a.hourMinute.replace(':', '')) - parseInt(b.hourMinute.replace(':', '')))
        closestTime = closestTimeArr[0]
      }

      let closestTimeArr2 = this.dataForm.timeList.filter(item => {
        if (this.tmpStart) {
          let tmp2 = parseInt(item.hourMinute.replace(':', ''))
          let tmp1 = parseInt(this.tmpStart.replace(':', ''))
          return tmp2 > tmp1
        }

        return true
      })
      let closestTime2 = null
      if (closestTimeArr2.length) {
        closestTimeArr2.sort((a, b) => parseInt(a.hourMinute.replace(':', '')) - parseInt(b.hourMinute.replace(':', '')))
        closestTime2 = closestTimeArr2[0]
      }

      let timeList = constTimeList.filter(item => {
        let cond1 = true
        let cond2 = true
        let cond3 = true
        let tmp2 = parseInt(item.key.replace(':', ''))
        if (this.tmpStart) {
          let tmp1 = parseInt(this.tmpStart.replace(':', ''))
          cond1 = tmp2 > tmp1
        }
        if (closestTime) {
          let tmp3 = parseInt(closestTime.hourMinute.replace(':', ''))
          cond2 = tmp2 <= tmp3
        }

        if (closestTime2) {
          let tmp4 = parseInt(closestTime2.hourMinute.replace(':', ''))
          cond3 = tmp2 <= tmp4
        }

        return cond1 && cond2 && cond3
      })

      timeList.forEach(item => {
        arr.push({
          id: item.key,
          name: item.name
        })
      })

      return arr
    },
    bookedTimeDescList () {
      let arr = []
      this.bookTimeList.forEach(item => {
        if (!arr.includes(item.timeDesc)) {
          arr.push(item.timeDesc)
        }
      })

      return arr
    },
    canSelectTime () {
      if (this.modalView) {
        return false
      }
      if (this.dataForm.serialDate) {
        if (this.dataForm.useDate.length !== 2) {
          return false
        }
        if (!this.dataForm.weekDays.length) {
          return false
        }
      } else {
        if (!this.dataForm.beginDate) {
          return false
        }
      }
      if (this.getCurBookDateList().length === 0) {
        return false
      }

      return true
    }
  },
  watch: {
    'dataForm.meetingRoomId': {
      handler () {
        this.loadBookTimeList()
      }
    },
    'dataForm.useDate': {
      deep: true,
      handler () {
        this.loadBookTimeList()
      }
    },
    'dataForm.beginDate': {
      handler () {
        this.loadBookTimeList()
      }
    },
    'dataForm.weekDays': {
      deep: true,
      handler () {
        this.loadBookTimeList()
      }
    },
    'dataForm.serialDate': {
      immediate: true,
      handler () {
        this.handleValidate()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadMeetingRoomList()
      this.loadTeacherList()
    },
    loadMeetingRoomList () {
      api.getMeetingRoomList().then(res => {
        this.meetingRoomList = res.list
      })
    },
    loadTeacherList () {
      api.getAllTeacherList().then(res => {
        this.teacherList = res.data
      })
    },
    loadBookTimeList () {
      // 必须选择会议室和日期
      if (!this.dataForm) {
        return false
      }
      if (!this.dataForm.meetingRoomId) {
        return false
      }
      let bookDateList = this.getCurBookDateList()
      if (!bookDateList.length) {
        return false
      }
      let params = {
        meetingRoomId: this.dataForm.meetingRoomId,
        bookDateList: bookDateList
      }
      api.getBookTimeList(params).then(res => {
        this.bookTimeList = []
        if (res.list) {
          this.bookTimeList = res.list
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addBook () {
      this.formModalVisible = true
      this.modalView = false
      this.modalTitle = '立即预订'
      this.$refs.dataForm.resetFields()
      this.dataForm.defaultFileList = []
      this.bookTimeList = []
      this.dataForm.bookBy = this.$store.state.user.userName
    },
    editBook (bookId) {
      this.formModalVisible = true
      this.modalView = false
      this.modalTitle = '修改预订'
      this.$refs.dataForm.resetFields()
      this.dataForm.defaultFileList = []
      this.bookTimeList = []
      this.loadBookDetail({ id: bookId })
    },
    viewBook (bookId) {
      this.formModalVisible = true
      this.modalView = true
      this.modalTitle = '查看预订'
      this.$refs.dataForm.resetFields()
      this.dataForm.defaultFileList = []
      this.bookTimeList = []
      this.loadBookDetail({ id: bookId })
    },
    tmpStartChangeHandle () {
      this.tmpEnd = ''
    },
    removeTimeItem (index) {
      this.dataForm.timeList.splice(index, 1)
    },
    getCurBookDateList () {
      let bookDateList = []
      if (this.dataForm.serialDate && this.dataForm.useDate && this.dataForm.weekDays) {
        if (this.dataForm.useDate.length === 0) {
          return bookDateList
        }
        if (this.dataForm.weekDays.length === 0) {
          return bookDateList
        }
        let d1 = new Date(this.dataForm.useDate[0])
        let d2 = new Date(this.dataForm.useDate[1])
        while (d1.getTime() <= d2.getTime()) {
          this.dataForm.weekDays.forEach(day => {
            // JS中的星期比java后台的星期值小1
            if (parseInt(day) === (d1.getDay() + 1)) {
              bookDateList.push(getFormateDateTime(d1, 'yyyy-MM-dd'))
            }
          })
          d1 = dateAdds('d ', 1, d1)
        }
      } else {
        if (!this.dataForm.beginDate) {
          return bookDateList
        }
        bookDateList.push(this.dataForm.beginDate)
      }

      return bookDateList
    },
    addTimeItem () {
      if (!this.tmpStart || !this.tmpEnd) {
        this.$Message.error('开始时间和结束时间不能为空')
        return false
      }
      this.dataForm.timeList.push({
        hourMinute: this.tmpStart,
        endHourMinute: this.tmpEnd,
        timeDesc: this.tmpStart + '-' + this.tmpEnd
      })
      this.addTimeVisible = false
    },
    addTimeHandle () {
      this.addTimeVisible = true
      this.tmpStart = ''
      this.tmpEnd = ''
    },
    addTimeCancel () {
      this.addTimeVisible = false
      this.tmpStart = ''
      this.tmpEnd = ''
    },
    loadBookDetail (v) {
      this.loading = true
      api.getMeetingRoomBookInfo(v.id).then(res => {
        let entity = res.meetingRoomBook
        Object.keys(this.dataForm).forEach(key => {
          if (key === 'weekDays' && entity[key]) {
            entity[key] = entity[key].split(',')
          }
          if (key === 'teacherList' && entity[key]) {
            entity[key] = entity[key].map(item => item.teacherId)
          }
          if (key === 'files' && entity[key]) {
            entity[key] = JSON.parse(entity[key])
          }
          this.dataForm[key] = entity[key]
          if (this.dataForm.files) this.dataForm.defaultFileList = this.dataForm.files
        })
        if (this.dataForm.beginDate && this.dataForm.endDate) {
          this.dataForm.useDate = [this.dataForm.beginDate, this.dataForm.endDate]
        }
        if (this.dataForm.useTime) {
          let segs = this.dataForm.useTime.split(',')
          let timeArr = []
          segs.map(seg => {
            let subSegs = seg.split('-')
            timeArr.push({
              hourMinute: subSegs[0],
              endHourMinute: subSegs[1],
              timeDesc: seg
            })
          })

          this.dataForm.timeList = timeArr
        }
        this.dataForm.weekDays = this.dataForm.weekDays || []
        this.dataForm.teacherList = this.dataForm.teacherList || []

        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    handleValidate () {
      if (this.dataForm.serialDate) {
        delete this.dataFormValidate.beginDate
        this.dataFormValidate.useDate = [
          { type: 'array', required: true, message: '使用日期不能为空', trigger: 'change' }
        ]
        this.dataFormValidate.weekDays = [
          { type: 'array', required: true, message: '星期不能为空', trigger: 'change' }
        ]
      } else {
        delete this.dataFormValidate.useDate
        delete this.dataFormValidate.weekDays
        this.dataFormValidate.beginDate = [
          { required: true, message: '使用日期不能为空', trigger: 'change' }
        ]
      }
    },
    dataFormHandle () {
      let data = Object.assign({}, this.dataForm)
      if (data.serialDate) {
        data.beginDate = data.useDate[0]
        data.endDate = data.useDate[1]
        data.weekDays = data.weekDays.join(',')
      } else {
        data.endDate = data.beginDate
        delete data.weekDays
      }
      data.useTime = this.dataForm.timeList.map(item => item.timeDesc).join(',')
      data.useTimeDesc = data.useTime
      data.teacherList = data.teacherList.map(item => {
        return {
          teacherId: item
        }
      })
      data.formTimeList = [...data.timeList]
      delete data.timeList
      delete data.useDate

      return data
    },
    validateDate () {
      let bookDateList = this.getCurBookDateList()
      if (!bookDateList.length) {
        this.$Message.error('连续日期和星期关联后无日期')
        return false
      }
      return true
    },
    saveMeetingBook () {
      this.$refs.dataForm.validate(valid => {
        if (valid && this.validateDate()) {
          this.submitLoading = true
          let data = this.dataFormHandle()
          if (data.files) {
            data.files = JSON.stringify(data.files)
          }
          if (data.departmentId) {
            data.department = this.$refs.departmentSelect.getDepartmentName(data.departmentId)
            console.log('data.department', data.department)
            data.departmentIdPath = this.$refs.departmentSelect.getTreePath(data.departmentId)
            data.departmentIdPath = data.departmentIdPath.map(item => item + '')
            data.departmentIdPath = JSON.stringify(data.departmentIdPath)
          }
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMeetingRoomBook(
              data
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            api.updateMeetingRoomBook(
              data
            ).then(res => {
              this.submitLoading = false
              this.$Message.success('操作成功！')
              this.$emit('update')
              this.formModalVisible = false
            }).catch(e => {
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
