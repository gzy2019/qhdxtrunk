<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="教师姓名" prop="teaName">
              <Input type="text" v-model="searchForm.teaName" clearable placeholder="请输入教师姓名" style="width: 180px" />
            </Form-item>
            <Form-item label="岗位属性" prop="dutyType">
              <DicSelect v-model="searchForm.dutyType" dtype="duty-type" :clearable="true" style="width: 180px"></DicSelect>
            </Form-item>
            <Form-item label="证件号" prop="teaCode">
              <Input type="text" v-model="searchForm.teaCode" clearable placeholder="请输入证件号" style="width: 180px" />
            </Form-item>
            <Form-item label="部门" prop="deptId">
              <DepartmentSelect v-model="searchForm.deptId" style="width: 180px"></DepartmentSelect>
            </Form-item>
            <Form-item label="职称" prop="dutyTitle">
              <DicSelect v-model="searchForm.dutyTitle" dtype="position-title" :clearable="true" style="width: 180px"></DicSelect>
            </Form-item>
            <Form-item label="导师类型" prop="supervisorType">
              <DicSelect v-model="searchForm.supervisorType" dtype="supervisor-type" :clearable="true" style="width: 180px"></DicSelect>
            </Form-item>
            <Button @click="handleSearch" type="primary" icon="ios-search" style="margin-left:15px">搜索</Button>
            <Button @click="handleClear">清除</Button>
        </Form>
        <Col span="24" class="operation btn_group">
          <Button @click="addData" v-if="isAuth('sys:allteacher:save')" type="primary" icon="md-add">新增</Button>
          <Button :disabled="selectedList.length === 0" @click="deleteData" v-if="isAuth('sys:allteacher:delete')" icon="ios-trash-outline">批量删除</Button>
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="1170" scrollable class-name="vertical-center-modal popup" :styles="{top: '20px'}">
      <Form ref="dataForm" :model="dataForm" :label-width="108" :rules="dataFormValidate" inline>
        <Row style="position:relative">
          <!--基本信息 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />基本信息</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="证件号" prop="teaCode">
              <Input v-model="dataForm.teaCode" placeholder="请输入证件号" :maxlength="20" class="wth" />
            </FormItem>
            <FormItem label="姓名" prop="teaName">
              <Input v-model="dataForm.teaName" placeholder="请输入姓名" :maxlength="20" class="wth" />
            </FormItem>
            <FormItem label="英文名" prop="teaEnglishName">
              <Input v-model="dataForm.teaEnglishName" placeholder="请输入英文名" :maxlength="30" class="wth" />
            </FormItem>
            <FormItem label="民族" prop="nation">
              <DicSelect v-model="dataForm.nation" dtype="nationality" :clearable="true" class="wth"></DicSelect>
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="性别" prop="sex">
              <DicSelect v-model="dataForm.sex" dtype="sex" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="籍贯" prop="nativePlace">
              <Input v-model="dataForm.nativePlace" placeholder="请输入籍贯" :maxlength="30" class="wth" />
            </FormItem>
            <FormItem label="籍贯市县" prop="nativePlace2">
              <Input v-model="dataForm.nativePlace2" placeholder="请输入籍贯" :maxlength="30" class="wth" />
            </FormItem>
            <FormItem label="出生日期" prop="birthday">
              <DatePicker type="date" :value="dataForm.birthday" @on-change="dateChange1" format="yyyy-MM-dd" placeholder="请输入出生日期" class="wth"></DatePicker>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="国别" prop="country">
              <DicSelect v-model="dataForm.country" dtype="country" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="身份证" prop="idNum">
              <Input v-model="dataForm.idNum" placeholder="请输入身份证" :maxlength="20" class="wth" />
            </FormItem>
            <FormItem label="政治面貌" prop="teaPoliticState">
              <DicSelect v-model="dataForm.teaPoliticState" dtype="polity" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="婚姻状况" prop="teaMaritalState">
              <DicSelect v-model="dataForm.teaMaritalState" dtype="marriage" :clearable="true" class="wth"></DicSelect>
            </FormItem>
          </Col>
          <!--基本信息 end-->

          <!--职位学历 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />职位&学历</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="所在部门" prop="" class="long">
              <Tag v-for="item in dataForm.deptList" :key="item.id" :name="item.deptName" closable @on-close="removeDept(item)">{{ item.deptName }}</Tag>
              <Button icon="ios-add" type="dashed" size="small" @click="addDeptTag">添加部门</Button>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="岗位属性" prop="dutyType">
              <DicSelect v-model="dataForm.dutyType" dtype="duty-type" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="职务" prop="dutyPosition">
              <Input v-model="dataForm.dutyPosition" placeholder="请输入职务" :maxlength="30" class="wth" />
            </FormItem>
            <FormItem label="职称" prop="dutyTitle">
              <DicSelect v-model="dataForm.dutyTitle" dtype="position-title" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="来院时间" prop="joinTime">
              <DatePicker type="date" :value="dataForm.joinTime" @on-change="dateChange2" format="yyyy-MM-dd" placeholder="选择入学年月" class="wth"></DatePicker>
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="最高学历" prop="topDegree">
              <DicSelect v-model="dataForm.topDegree" dtype="student-type" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="毕业院校" prop="graduatedSchool">
              <Input v-model="dataForm.graduatedSchool" placeholder="请输入毕业院校" :maxlength="100" class="wth" />
            </FormItem>
            <Form-item label="导师类型" prop="supervisorType">
              <DicSelect v-model="dataForm.supervisorType" dtype="supervisor-type" :clearable="true" class="wth"></DicSelect>
            </Form-item>
          </Col>
          <!--入学信息 end-->

          <!--联系方式 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />联系方式</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="手机" prop="mobile">
              <Input type='tel' v-model="dataForm.mobile" placeholder="请输入手机号" :maxlength="20" class="wth" clearable/>
            </FormItem>
            <FormItem label="家庭住址" prop="homeAddress" class="large">
              <Input v-model="dataForm.homeAddress" placeholder="请输入家庭住址" :maxlength="100" class="wth" />
            </FormItem>
            <FormItem label="家庭电话" prop="homePhone">
              <Input v-model="dataForm.homePhone" placeholder="请输入家庭电话" :maxlength="20" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="邮箱" prop="email">
              <Input type='email' v-model="dataForm.email" placeholder="请输入邮箱" :maxlength="20" class="wth" clearable />
            </FormItem>
            <FormItem label="宿舍住址" prop="domitoryAddress" class="large">
              <Input v-model="dataForm.domitoryAddress" placeholder="请输入宿舍住址" :maxlength="100" class="wth" />
            </FormItem>
            <FormItem label="宿舍电话" prop="domitoryPhone">
              <Input v-model="dataForm.domitoryPhone" placeholder="请输入宿舍电话" :maxlength="20" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="实验室电话" prop="labPhone">
              <Input v-model="dataForm.labPhone" placeholder="请输入实验室电话" :maxlength="20" class="wth" />
            </FormItem>
            <FormItem label="邮编" prop="zipCode">
              <Input v-model="dataForm.zipCode" placeholder="请输入邮编" :maxlength="20" class="wth" />
            </FormItem>
          </Col>
          <!--联系方式 end-->

          <!--备注 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />个人描述</p>
            <Divider />
          </Col>
          <Col span="24">
            <!-- <FormItem prop="desc" class="large"> -->
            <Input v-model="dataForm.teaDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="2000" placeholder="填写内容" style="width:96%;margin-left:20px"></Input>
            <!-- </FormItem> -->
          </Col>
          <!--备注 end-->
        </Row>
      </Form>
      <div slot="footer" v-show="!modalView">
        <Button @click="cancel">重置</Button>
        <Button type="primary" :loading="submitLoading" @click="submitForm">保存</Button>
      </div>
    </Modal>
    <!-- 新增/编辑 end-->

    <!-- 部门选择 start-->
    <Modal title="关联部门" v-model="deptModalVisible" footer-hide :mask-closable='true' class-name="vertical-center-modal popup">
      <Form>
        <Row style="position:relative;margin: 20px;">
          <Col span="20">
          <DepartmentSelect @on-change="deptChangeHandle"></DepartmentSelect>
          </Col>
        </Row>
      </Form>
      <!-- <div slot="footer">
        <Button @click="deptModalVisible = false">确定</Button>
      </div> -->
    </Modal>
    <!-- 部门选择 end-->

  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/teacher'
import dicUtil from '@/libs/dicUtil'
import DicSelect from '@/view/components/dic-select'
import DepartmentSelect from '@/view/components/department-select'
export default {
  name: 'information',
  components: {
    Tables, DicSelect, DepartmentSelect
  },
  data () {
    const validateCode = (rule, value, callback) => {
      if (!this.dataForm.teaCode) {
        callback(new Error('证件号不能为空'))
      } else {
        api.validateTeaCode(this.dataForm).then(res => {
          if (!res.result) {
            callback(new Error('证件号已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      exportLoading: false,
      loading: true,
      modalView: false,
      formModalVisible: false,
      deptModalVisible: false,
      modalTitle: '',
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        teaName: '',
        teaCode: '',
        dutyType: '',
        deptId: undefined,
        dutyTitle: '',
        supervisorType: ''
      },
      dataForm: {
        teaCode: '',
        teaName: '',
        teaEnglishName: '',
        nation: '',
        sex: '',
        nativePlace: '',
        nativePlace2: '',
        birthday: '',
        country: '',
        dutyType: '',
        dutyPosition: '',
        dutyTitle: '',
        joinTime: '',
        topDegree: '',
        graduatedSchool: '',
        mobile: '',
        homeAddress: '',
        homePhone: '',
        email: '',
        domitoryAddress: '',
        domitoryPhone: '',
        labPhone: '',
        zipCode: '',
        teaDesc: '',
        deptList: []
      },
      dataFormValidate: {
        teaName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机不能为空', trigger: 'blur' },
          { pattern: /^[1][0-9]{10}$/, message: '手机格式不正确', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
        teaCode: [{ validator: validateCode, required: true, trigger: 'blur' }]
      },
      submitLoading: false,
      pageData: {
        totalCount: 0,
        list: []
      },
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '证件号',
          key: 'teaCode',
          ellipsis: true,
          tooltip: true,
          minWidth: 180
        },
        {
          title: '姓名',
          key: 'teaName',
          minWidth: 100,
          className: 'font_color'
        },
        {
          title: '性别',
          key: 'sexStr',
          minWidth: 80
        },
        {
          title: '国别',
          key: 'countryStr',
          minWidth: 120,
          sortable: false
        },
        {
          title: '职务',
          key: 'dutyPosition',
          minWidth: 120,
          sortable: false
        },
        {
          title: '邮箱',
          key: 'email',
          ellipsis: true,
          tooltip: true,
          minWidth: 200
        },
        {
          title: '导师类别',
          key: 'supervisorTypeStr',
          minWidth: 100
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 100,
          fixed: 'right',
          render: (h, params) => {
            let btns = []
            if (this.isAuth('sys:allteacher:info')) {
              btns.push(h(
                'Icon',
                {
                  props: {
                    type: 'ios-eye-outline',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.viewData(params.row)
                    }
                  }
                },
                '查看'
              ))
            }
            if (this.isAuth('sys:allteacher:update')) {
              btns.push(h(
                'Icon',
                {
                  props: {
                    type: 'ios-create-outline',
                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editData(params.row)
                    }
                  }
                },
                '编辑'
              ))
            }
            return h('div', btns)
          }
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getDataList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getDataList()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getDataList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    dateChange1 (value, d) {
      this.dataForm.birthday = value
    },
    dateChange2 (value, d) {
      this.dataForm.joinTime = value
    },
    getDataList () {
      this.loading = true
      api.getTeacherList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          dicUtil.setDicName(res.page.list, [
            { type: 'sex', key: 'sex' },
            { type: 'duty-type', key: 'dutyType' },
            { type: 'country', key: 'country' },
            { type: 'supervisor-type', key: 'supervisorType' },
            { type: 'polity', key: 'polity' },
            { type: 'marriage', key: 'teaMaritalState' },
            { type: 'position-title', key: 'dutyTitle' }
          ])
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    removeDept (dept) {
      this.dataForm.deptList.splice(this.dataForm.deptList.findIndex(item => item.id === dept.id), 1)
    },
    addDeptTag () {
      this.deptModalVisible = true
    },
    deptChangeHandle (value, valueArr, arr) {
      let obj = arr[arr.length - 1]
      let ind = this.dataForm.deptList.findIndex(item => item.id === obj.value)
      if (ind < 0) {
        this.dataForm.deptList.push({
          deptName: obj.label,
          id: obj.value
        })
      }
    },
    addData () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      delete this.dataForm.id
      this.formModalVisible = true
      this.modalView = false
    },
    editData (v) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      delete this.dataForm.createTime
      delete this.dataForm.modifyTime
      this.formModalVisible = true
      this.modalView = false
    },
    viewData (v) {
      this.modalTitle = '查看'
      this.$refs.dataForm.resetFields()
      let entity = JSON.parse(JSON.stringify(v))
      this.dataForm = entity
      delete this.dataForm.createTime
      delete this.dataForm.modifyTime
      this.formModalVisible = true
      this.modalView = true
    },
    submitForm () {
      if (this.submitLoading) return
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveTeacher(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
                this.handleSearch()
              }
            })
          } else {
            api.updateTeacher(
              this.dataForm
            ).then(res => {
              this.submitLoading = false
              if (res.code === 200) {
                this.$Message.success('操作成功！')
                this.formModalVisible = false
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
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getTeacherList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    deleteData () {
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
          api.deleteTeacher(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
