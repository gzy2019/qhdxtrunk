<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Col span="19" class="meeting_top">
          TODAY 2019.07.05
          <i>
            <Badge class-name="badge"></Badge>已预约
          </i>
          <i class="no_bg">
            <Badge class-name="badge"></Badge>空闲
          </i>
          </Col>
          <Col span="5" class="operation btn_group" style="text-align:right">
          <Button @click="modalReserveNotice = true" type="primary">立即预定</Button>
          <Button @click="modalReserveNotice = true">特殊会议说明</Button>
          </Col>
        </Form>

      </Row>
      <Row>
        <Col span="24" class="meeting_list">
        <ul class="date_list">
          <li>07月01日<div>星期一</div>
          </li>
          <li class="active">07月01日<div>星期二</div>
          </li>
          <li>07月01日<div>星期三</div>
          </li>
          <li>07月01日<div>星期四</div>
          </li>
          <li>07月01日<div>星期五</div>
          </li>
          <li>07月01日<div>星期六</div>
          </li>
          <li>07月01日<div>星期日</div>
          </li>
          <li class="date_box">
            <Icon type="ios-arrow-back" class="icon left_arrow" />07月01日
            <Icon type="ios-arrow-forward" class="icon right_arrow" />
          </li>

        </ul>
        </Col>
        <Table border :columns="columns" :data="data1" :show-header="false" class="table1">

        </Table>
        <!--预定详情 start-->
        <div class="reserve_detail" style="display:none">
          <h3>预定详情</h3>
          <ul>
            <li><span>会议名称：</span>教学办</li>
            <li><span>预订人：</span>刘青</li>
            <li><span>联系方式：</span>1847867943</li>
            <li><span>使用部门：</span>联合办公室</li>
          </ul>
        </div>
        <!--预定详情 end-->
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 预定 start-->
    <Modal title="预定" v-model="modalReserve" :width="540" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
        <FormItem label="会议名称" prop="meetingName">
          <Input type="text" v-model="dataForm.meetingName" clearable placeholder="请输入会议名称" />
        </FormItem>
        <FormItem label="会议室" prop="meeting">
          <Input type="text" v-model="dataForm.meeting" clearable placeholder="请选择会议室" />
        </FormItem>
        <FormItem label="会议类型" prop="meetingType">
          <ClassSelect v-model="searchForm.classId" :clearable="true"></ClassSelect>
        </FormItem>
        <FormItem label="使用部门" prop="department">
          <Input type="text" v-model="dataForm.department" clearable placeholder="请输入使用部门" />
        </FormItem>
        <FormItem label="预订人" prop="booker">
          <Input type="text" v-model="dataForm.booker" clearable value="刘青" />
        </FormItem>
        <FormItem label="联系方式" prop="contact">
          <Input type="text" v-model="dataForm.contact" clearable placeholder="19787444557" />
        </FormItem>
        <FormItem label="是否连续预定" prop="continuousBooking">
          <div @click="modalContinuityReserve = true">
            <i-switch v-model="dataForm.enable" size="large">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
        <FormItem label="使用日期" prop="date">
          <DatePicker type="date" placeholder="年/月/日" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="开始时间" prop="date">
          <DatePicker type="date" placeholder="请选择开始时间" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="date">
          <DatePicker type="date" placeholder="请选择结束时间" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="添加刷卡人员" prop="credit">
          <Button type="dashed" icon="md-add" small>添加刷卡人员</Button>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="dataForm.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="【注】">
          <p>1、如果使用部门为其他，请在备注中说明</p>
          <p>2、如果是为他人代订，请在备注中说明</p>
          <p>3、请在备注中说明是否需要投影</p>
          <p>4、特殊会议是指有院外媒体、院外老师参与的</p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="modalReserve = false">取消</Button>
        <Button type="primary" @click="modalReserve = false">保存</Button>
      </div>
    </Modal>
    <!-- 预定 end-->

    <!-- 连续预定 start-->
    <Modal title="预定" v-model="modalContinuityReserve" :width="540" class-name="vertical-center-modal">
      <Form ref="dataForm" :model="dataForm" :label-width="120" :rules="dataFormValidate">
        <FormItem label="会议名称" prop="meetingName">
          <Input type="text" v-model="dataForm.meetingName" clearable placeholder="请输入会议名称" />
        </FormItem>
        <FormItem label="会议室" prop="meeting">
          <Input type="text" v-model="dataForm.meeting" clearable placeholder="请选择会议室" />
        </FormItem>
        <FormItem label="会议类型" prop="meetingType">
          <ClassSelect v-model="searchForm.classId" :clearable="true"></ClassSelect>
        </FormItem>
        <FormItem label="使用部门" prop="department">
          <Input type="text" v-model="dataForm.department" clearable placeholder="请输入使用部门" />
        </FormItem>
        <FormItem label="预订人" prop="booker">
          <Input type="text" v-model="dataForm.booker" clearable value="刘青" />
        </FormItem>
        <FormItem label="联系方式" prop="contact">
          <Input type="text" v-model="dataForm.meetingName" clearable placeholder="19787444557" />
        </FormItem>
        <FormItem label="是否连续预定">
          <i-switch v-model="dataForm.enable" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="使用日期" prop="date">
          <DatePicker type="date" placeholder="年/月/日" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="结束日期" prop="date">
          <DatePicker type="date" placeholder="年/月/日" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="星期">
          <CheckboxGroup v-model="dataForm.checkbox">
            <Checkbox label="星期一"></Checkbox>
            <Checkbox label="星期二"></Checkbox>
            <Checkbox label="星期三"></Checkbox>
            <Checkbox label="星期四"></Checkbox>
            <Checkbox label="星期五"></Checkbox>
            <Checkbox label="星期六"></Checkbox>
            <Checkbox label="星期日"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="开始时间" prop="date">
          <DatePicker type="date" placeholder="请选择开始时间" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="date">
          <DatePicker type="date" placeholder="请选择结束时间" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="添加刷卡人员" prop="credit">
          <Button type="dashed" icon="md-add" small>添加刷卡人员</Button>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="dataForm.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="【注】">
          <p>1、如果使用部门为其他，请在备注中说明</p>
          <p>2、如果是为他人代订，请在备注中说明</p>
          <p>3、请在备注中说明是否需要投影</p>
          <p>4、特殊会议是指有院外媒体、院外老师参与的</p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="modalContinuityReserve = false">取消</Button>
        <Button type="primary" @click="modalContinuityReserve = false">保存</Button>
      </div>
    </Modal>
    <!-- 连续预定 end-->

    <!--预定成功提示 start-->
    <Modal title="" v-model="modalReservetip" class-name="vertical-center-modal popup">
      <p slot="header" style="color:#f60!important">
        <Icon type="ios-information-circle"></Icon>
        <span>预定提示</span>
      </p>
      <p style="padding:20px;font-size:14px">您提交的会议室预定申请，已提交成功</p>
      <div slot="footer">
        <Button @click="modalReservetip = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="modalReservetip = false">确定</Button>
      </div>
    </Modal>
    <!--预定成功提示 end-->

    <!--教师会议室使用须知 start-->
    <Modal title="教师会议室使用须知" v-model="modalReserveNotice" class-name="vertical-center-modal" :width="1000" scrollable>
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
        <p>3.6 使用者对活动安全和活动内容负责，切实维护好室内正常的活动秩序，并配合物业做好相关检查工作。 </p>
        <p>3.7 使用期间，室内人员要爱护室内的一切公共设施，禁止随便动用室内设备。要注意防火安全，严禁使用明火，严禁私自动用消防设施。</p>
        <p>3.8 使用期间，凡出现设备故障问题，使用者应及时告知物业人员进行现场处理。</p>
        <p>3.9 使用结束后，使用者（跟班管理人员或助教）应及时清点物品并关灯，并及时通知物业管理人员。由物业管理人员检查使用情况，双方签字确认后方可离去。如使用者未告知物业人员或未签字而离开，不影响记录的有效性。</p>
        <p>4 责任</p>
        <p>4.1 使用者有义务及时对服务质量进行评价。</p>
        <p>4.2 使用者的违约情形包括但不限于以下事项：取消或变更使用计划而未告知或未及时告知的；使用结束后未及时告知物业人员的；因使用者的原因造成设施、设备、物品的损坏、改变、丢失的。</p>
        <p>4.3 因使用者的原因造成的设施、设备、物品的损坏、改变、丢失的，使用者应承担相应的赔偿责任或恢复原状。</p>
        <p>4.4 申请和使用情况应列入使用者（部门）或助教评价记录。该记录将作为后续申请批准或助教工作评定的依据之一。首次违约的，提出警告；三次违约的，应暂停申请；情形严重的，可取消申请资格。</p>
        <!-- <p style="text-align:center"> <Button type="primary">申请人已阅读并同意上述规定</Button></p> -->
      </div>
      <div slot="footer">
        <Button @click="modalReserveNotice = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="modalReserveNotice = false">申请人已阅读并同意上述规定</Button>
      </div>
    </Modal>
    <!--教师会议室使用须知 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/declare-tutor/record'
import apiBatch from '@/api/declare-tutor/batch'
import ClassSelect from '@/view/components/class-select'
export default {
  name: 'Record',
  components: {
    Tables, ClassSelect
  },
  data () {
    return {
      loading: true,
      modalReservetip: false,
      modalReserveNotice: false,
      modalContinuityReserve: false,
      modalType: 0,
      modalReserve: false,
      tabs: 2,
      modalTitle: '',
      searchForm: {
        page: 1,
        limit: 10,
        username: '',
        status
      },
      dataForm: {
        batchTitle: '',
        batchStartTime: '',
        batchEndTime: '',
        batchOpenFlag: true,
        classListArr: [],
        classList: [],
        batchDemo: '',
        enable: true,
        enableStr: '0',
        textarea: '',
        checkbox: []
      },
      dataFormValidate: {
        meetingName: [{ required: true, message: '会议名称不能为空', trigger: 'blur' }],
        meeting: [{ required: true, message: '会议室不能为空', trigger: 'blur' }],
        meetingType: [{ required: true, message: '会议类型不能为空', trigger: 'blur' }],
        department: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        booker: [{ required: true, message: '预订人不能为空', trigger: 'blur' }],
        contact: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        date: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
        credit: [{ required: true, message: '刷卡人员不能为空', trigger: 'blur' }]
      },
      submitLoading: false,
      columns: [
        {
          key: 'roomNumber',
          className: 'violet_bg'
        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date',
          className: 'lightviolet_bg'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        },
        {
          key: 'date'

        }
      ],
      data1: [
        {
          roomNumber: '220',
          date: '8:00'
          // // eslint-disable-next-line no-dupe-keys
          // date: '9:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00'
        },
        {
          roomNumber: '220',
          date: '8:00'
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00'
        },
        {
          roomNumber: '220',
          date: '8:00'
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00',
          // date: '8:00'
        }
      ],
      pageData: {
        totalCount: 0,
        list: []
      },
      batchList: []
    }
  },
  methods: {
    handleTabsAdd () {
      this.tabs++
    },
    init () {
      apiBatch.getBatchListAll().then(res => {
        this.batchList = res.list
        if (this.batchList.length > 0) { this.searchForm.batchId = this.batchList[0].id }
        this.getRecordList()
      })
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getRecordList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getRecordList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getRecordList () {
      this.loading = true
      api.getRecordList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
        }
      })
    },
    cancel () {
      this.dataModalVisible = false
    },
    testOnChange (value, value2) {
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认修改此记录吗?</p>',
        onOk: () => {
          value.batchOpenFlag = value2
        },
        onCancel: () => {
          value.batchOpenFlag = !value2
        }
      })
    },
    addRecord () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    editBatch (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      this.dataForm.classListArr = []
      this.dataForm.classList && this.dataForm.classList.map(item => {
        this.dataForm.classListArr.push(item.id)
      })
      delete this.dataForm.createDate
      delete this.dataForm.modifyDate
      this.modalView = false
      this.dataModalVisible = true
    },
    saveBatch () {
      this.dataForm.classList = []
      this.dataForm.classListArr.map(item => {
        this.dataForm.classList.push({
          id: item
        })
      })
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveMpacbatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.dataModalVisible = false
                this.handleSearch()
              }
            })
          } else {
            api.updateMpacbatch(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.dataModalVisible = false
                this.handleSearch()
              }
            })
          }
        }
      })
    },
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    deleteBatch () {
      if (this.selectedList.length === 0) {
        this.$Message.info('请选择一条记录')
        return
      }
      let ids = []
      this.selectedList.map(item => {
        ids.push(item.id)
      })
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteMpacbatch(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped>
.meeting_top i {
  margin: 0 5px 0 5px;
  font-style: normal;
  vertical-align: middle;
}
.meeting_top .ivu-badge {
  width: 30px;
  height: 20px;
  margin: -3px 3px 0 0;
  background: #f5a623 !important;
  border-radius: 3px;
  vertical-align: middle;
}
.meeting_top .no_bg .ivu-badge {
  border: 1px solid #dcdee2;
  background: none !important;
}
.meeting_list .date_list li {
  position: relative;
  float: left;
  width: 12.5%;
  height: 50px;
  padding: 6px 0px;
  text-align: center;
  list-style: none;
  border: 1px solid #dcdee2;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
.meeting_list .date_list li:hover {
  cursor: pointer;
}
.meeting_list .date_list li.active {
  color: #fff;
  background: #8c0e9e;
}
.meeting_list .date_list .date_box {
  line-height: 50px;
  padding: 0;
}
.meeting_list .date_list li .icon {
  position: absolute;
  top: 12px;

  font-size: 25px !important;
}
.meeting_list .date_list li .left_arrow {
  left: 5px;
}
.meeting_list .date_list li .right_arrow {
  right: 5px;
}
.words {
  padding: 15px;
}
.words p {
  font-size: 14px;
  margin: 7px 0;
}
</style>
<style>
.ivu-table td.violet_bg {
  position: relative;
  text-align: center;
  background: #8c0e9e !important;
  color: #fff !important;
}

.ivu-table td.lightviolet_bg {
  background: #f5a623 !important;
  color: #fff !important;
}
.reserve_detail {
  position: absolute;
  top: 60px;
  left: 100px;
  width: 200px;
  height: 180px;
  padding: 10px;
  z-index: 8;
  background: #fff;
  border: 1px solid #dcdee2;
  border-radius: 4px;
}
.reserve_detail h3 {
  margin: 0 0 10px;
  text-align: center;
}
.reserve_detail span {
  display: inline-block;
  width: 80px;
  text-align: right;
}
.reserve_detail ul {
  list-style: none;
}
.reserve_detail li {
  padding: 5px 0;
  font-size: 12px;
}
.table1 .ivu-table td.violet_bg {
  position: relative;
}
</style>
