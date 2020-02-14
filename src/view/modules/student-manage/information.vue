<template>
  <div class="search">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
        <Form-item label="学生姓名" prop="stuName">
          <Input type="text" v-model="searchForm.stuName" clearable placeholder="请输入学生姓名" style="width: 155px" />
        </Form-item>
        <Form-item label="学号" prop="stuCode" :label-width=80>
          <Input type="text" v-model="searchForm.stuCode" clearable placeholder="请输入学号" style="width: 155px" />
        </Form-item>
        <Form-item label="导师姓名" prop="teacherName" :label-width=80>
          <Input type="text" v-model="searchForm.teacherName" clearable placeholder="请输入导师姓名" style="width: 155px" />
        </Form-item>
        <Form-item label="国籍" prop="country" :label-width=50>
          <DicSelect v-model="searchForm.country" dtype="country" :clearable="true" style="width: 155px"></DicSelect>
        </Form-item>
        <Form-item label="学生类别" prop="stuType">
          <DicSelect v-model="searchForm.stuType" dtype="student-type" :clearable="true" style="width: 155px"></DicSelect>
        </Form-item>
        <Form-item label="学生班级" prop="classId">
          <ClassSelect v-model="searchForm.classId" :clearable="true" style="width: 155px"></ClassSelect>
        </Form-item>
        <Form-item label="申报类型" prop="stuTypeTutorDeclare" :label-width=80>
          <DicSelect v-model="searchForm.stuTypeTutorDeclare" dtype="declare-tutor-type" placeholder="请选择导师申报类型" :clearable="true" style="width: 155px"></DicSelect>
        </Form-item>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button @click="handleClear" style="margin-left: 5px;">清除</Button>
      </Form>
      <Row>
        <Col span="24" class="operation btn_group">
          <Button @click="addData" v-if="isAuth('sys:allstudent:save')" type="primary" icon="md-add">新增</Button>
          <Button @click="exportData" :loading="exportLoading" type="primary" icon="ios-download-outline">导出所有</Button>
          <Button @click="onModalImport" icon="ios-cloud-upload-outline">导入学生类别</Button>
          <Button @click="onMaintenance" icon="ios-cloud-upload-outline">导入学生班级</Button>
          <Button :disabled="selectedList.length === 0" @click="deleteData" v-if="isAuth('sys:allstudent:delete')" icon="ios-trash-outline">批量删除</Button>
        </Col>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="pageData.list" :columns="columns" @on-selection-change="selectionChangeHandle"/>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="pageData.totalCount" current.sync="searchForm.page" :current="searchForm.page" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>
    <!-- 新增/编辑 start-->
    <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="1170" scrollable class-name="vertical-center-modal popup" :styles="{top: '20px'}">
      <Form ref="dataForm" :model="dataForm" :label-width="108" :rules="dataFormValidate" inline>
        <Row>
          <!--基本信息 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />基本信息</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="证件号" prop="stuCode">
              <Input v-model="dataForm.stuCode" placeholder="请输入证件号" class="wth" />
            </FormItem>
            <FormItem label="姓名" prop="stuName">
              <Input v-model="dataForm.stuName" placeholder="请输入姓名" class="wth" />
            </FormItem>
            <FormItem label="英文名" prop="englishName">
              <Input v-model="dataForm.englishName" placeholder="请输入英文名" class="wth" />
            </FormItem>
            <FormItem label="身份证" prop="idNum">
              <Input v-model="dataForm.idNum" placeholder="请输入身份证" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="性别" prop="sex">
              <DicSelect v-model="dataForm.sex" dtype="sex" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="出生日期" prop="birthday">
              <IDatePicker v-model="dataForm.birthday" format="yyyy-MM-dd" type="date" placeholder="请输入出生日期" class="wth" />
            </FormItem>
            <FormItem label="籍贯" prop="nativePlace">
              <Input v-model="dataForm.nativePlace" placeholder="请输入籍贯" class="wth" />
            </FormItem>
            <FormItem label="籍贯市县" prop="nativePlace2">
              <Input v-model="dataForm.nativePlace2" placeholder="请输入籍贯市县" class="wth" />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="国别" prop="country">
              <DicSelect v-model="dataForm.country" dtype="country" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="民族" prop="nation">
              <DicSelect v-model="dataForm.nation" dtype="nationality" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="政治面貌" prop="politicState">
              <DicSelect v-model="dataForm.politicState" dtype="polity" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="婚姻状况" prop="maritalState">
              <DicSelect v-model="dataForm.maritalState" dtype="marriage" :clearable="true" class="wth"></DicSelect>
            </FormItem>
          </Col>
          <!--基本信息 end-->

          <!--入学信息 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />入学信息</p>
            <Divider />
          </Col>

          <Col span="24">
            <FormItem label="学生类别" prop="stuType">
              <DicSelect v-model="dataForm.stuType" dtype="student-type" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="班级" prop="classId">
              <ClassSelect v-model="dataForm.classId" :clearable="false" class="wth"></ClassSelect>
            </FormItem>
            <FormItem label="入学年月" prop="stuDateAdmission">
              <IDatePicker type="date" v-model="dataForm.stuDateAdmission" format="yyyy-MM" placeholder="选择入学年月" class="wth" />
            </FormItem>
            <FormItem label="入学方式" prop="stuTypeAdmission">
              <DicSelect v-model="dataForm.stuTypeAdmission" dtype="student-admission" :clearable="true" class="wth"></DicSelect>
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="考生来源" prop="stuTypeOriginal">
              <Input v-model="dataForm.stuTypeOriginal" placeholder="请输入考生来源" class="wth" />
            </FormItem>
            <FormItem label="是否户口迁入" prop="stuFlagResidence">
              <i-switch v-model="dataForm.stuFlagResidence" />
            </FormItem>
            <FormItem label="原单位" prop="stuCompanyEx">
              <Input v-model="dataForm.stuCompanyEx" placeholder="请输入原单位" class="wth" />
            </FormItem>
            <FormItem label="委定单位" prop="stuCompanyAuthorized">
              <Input v-model="dataForm.companyAuthorized" placeholder="请输入委定单位" class="wth" />
            </FormItem>
            <FormItem label="委定方式" prop="stuTypeAuthorized">
              <Input v-model="dataForm.stuTypeAuthorized" placeholder="请输入委定方式" class="wth" />
            </FormItem>
            <FormItem label="原学历" prop="stuDiploma">
              <Input v-model="dataForm.stuDiploma" placeholder="请输入原学历" class="wth" />
            </FormItem>
            <FormItem label="本科毕业院校" prop="stuSchoolUndergraduate">
              <Input v-model="dataForm.stuSchoolUndergraduate" placeholder="请输入毕业院校" class="wth" />
            </FormItem>
            <FormItem label="本科专业" prop="stuSubjectUndergraduate">
              <Input v-model="dataForm.stuSubjectUndergraduate" placeholder="请输入本科专业" class="wth" />
            </FormItem>
            <FormItem label="本科毕业时间" prop="stuDateUndergraduate">
              <IDatePicker type="date" v-model="dataForm.stuDateUndergraduate" format="yyyy-MM-dd" placeholder="选择毕业时间" class="wth" />
            </FormItem>
            <FormItem label="获硕日期" prop="stuDateGetmaster">
              <IDatePicker v-model="dataForm.stuDateGetmaster" type="date" format="yyyy-MM-dd" placeholder="选择日期" class="wth" />
            </FormItem>
            <FormItem label="研究生毕业院校" prop="stuSchoolPostgraduate">
              <Input v-model="dataForm.stuSchoolPostgraduate" placeholder="请输入毕业院校" class="wth" />
            </FormItem>
            <FormItem label="研究生专业" prop="stuSubjectPostgraduate">
              <Input v-model="dataForm.stuSubjectPostgraduate" placeholder="请输入研究生专业" class="wth" />
            </FormItem>
            <FormItem label="研究生毕业时间" prop="stuDatePostgraduate">
              <IDatePicker v-model="dataForm.stuDatePostgraduate" type="date" format="yyyy-MM-dd" placeholder="选择毕业时间" class="wth" />
            </FormItem>
            <FormItem label="导师申报分类" prop="stuTypeTutorDeclare">
              <DicSelect v-model="dataForm.stuTypeTutorDeclare" dtype="declare-tutor-type" :clearable="true" class="wth"></DicSelect>
            </FormItem>
          </Col>
          <!--入学信息 end-->

          <!--联系方式 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />联系方式</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="手机" prop="mobile">
              <Input v-model="dataForm.mobile" placeholder="请输入手机号" class="wth" />
            </FormItem>
            <FormItem label="家庭住址" prop="addressHome" class="large">
              <Input v-model="dataForm.addressHome" placeholder="请输入家庭住址" class="wth" />
            </FormItem>
            <FormItem label="家庭电话" prop="phoneHome">
              <Input v-model="dataForm.phoneHome" placeholder="请输入家庭电话" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="邮箱" prop="email">
              <Input v-model="dataForm.email" placeholder="请输入邮箱" class="wth" />
            </FormItem>
            <FormItem label="宿舍住址" prop="addressDormitory" class="large">
              <Input v-model="dataForm.addressDormitory" placeholder="请输入宿舍住址" class="wth" />
            </FormItem>
            <FormItem label="宿舍电话" prop="phoneDormitory">
              <Input v-model="dataForm.phoneDormitory" placeholder="请输入宿舍电话" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="实验室电话" prop="phoneLab">
              <Input v-model="dataForm.phoneLab" placeholder="请输入实验室电话" class="wth" />
            </FormItem>
            <FormItem label="邮编" prop="zipCode">
              <Input v-model="dataForm.zipCode" placeholder="请输入邮编" class="wth" />
            </FormItem>
          </Col>
          <!--联系方式 end-->

          <!--研究方向 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />研究方向</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="导师姓名" prop="teacherId">
              <TeacherSelect v-model="dataForm.teacherId" :clearable="true" class="wth"></TeacherSelect>
            </FormItem>
            <FormItem label="导师证件号" prop="teacherCode">
              <Input v-model="dataForm.teacherCode" placeholder="请输入证件号" class="wth" />
            </FormItem>
            <FormItem label="学科门类" prop="subjectType">
              <Input v-model="dataForm.subjectType" placeholder="请输入学科门类" class="wth" />
            </FormItem>
            <FormItem label="所属研究所" prop="orgCode">
              <Input v-model="dataForm.orgCode" placeholder="请输入研究机构代码" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="研究方向" prop="subject">
              <Input v-model="dataForm.subject" placeholder="请输入研究方向" class="wth" />
            </FormItem>
            <FormItem label="专业" prop="stuField">
              <Input v-model="dataForm.stuField" placeholder="请输入专业" class="wth" />
            </FormItem>
            <FormItem label="一级学科" prop="subjectTypeMajor">
              <Input v-model="dataForm.subjectTypeMajor" placeholder="请输入一级学科" class="wth" />
            </FormItem>
            <FormItem label="二级学科" prop="subjectTypeMinor">
              <Input v-model="dataForm.subjectTypeMinor" placeholder="请输入二级学科" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="方案年月" prop="majorTime">
              <IDatePicker type="date" v-model="dataForm.majorTime" format="yyyy-MM" placeholder="选择日期" class="wth" />
            </FormItem>
          </Col>
          <!--研究方向 end-->

          <!--学籍信息 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />学籍信息</p>
            <Divider />
          </Col>
          <Col span="24">
            <FormItem label="在校状态" prop="stuStatus">
              <DicSelect v-model="dataForm.stuStatus" dtype="student-status" :clearable="true" class="wth"></DicSelect>
            </FormItem>
            <FormItem label="是否有学籍" prop="flagSchoolRoll">
              <i-switch v-model="dataForm.flagSchoolRoll" />
            </FormItem>
            <FormItem label="学籍变动" prop="schoolRollChangeDesc">
              <Input v-model="dataForm.schoolRollChangeDesc" placeholder="请输入学籍" class="wth" />
            </FormItem>
            <FormItem label="学籍变动日期" prop="schoolRollChangeDate">
              <IDatePicker v-model="dataForm.schoolRollChangeDate" type="date" format="yyyy-MM-dd" placeholder="选择日期" class="wth" />
            </FormItem>
            <FormItem label="答辩日期" prop="stuDateDefense">
              <IDatePicker v-model="dataForm.stuDateDefense" type="date" format="yyyy-MM-dd" placeholder="选择日期" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="授予方式" prop="stuTypeGrant">
              <Input v-model="dataForm.stuTypeGrant" placeholder="请输入授予方式" class="wth" />
            </FormItem>
            <FormItem label="授予日期" prop="stuDateGrant">
              <IDatePicker v-model="dataForm.stuDateGrant" type="date" format="yyyy-MM-dd" placeholder="选择日期" class="wth" />
            </FormItem>
            <FormItem label="毕业方式" prop="stuTypeGraduate">
              <Input v-model="dataForm.stuTypeGraduate" placeholder="请输入毕业方式" class="wth" />
            </FormItem>
            <FormItem label="毕业日期" prop="stuDateGraduate">
              <IDatePicker v-model="dataForm.stuDateGraduate" type="date" format="yyyy-MM-dd" placeholder="选择日期" class="wth" />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="特殊类别" prop="specialType">
              <Input v-model="dataForm.specialType" placeholder="请输入特殊类型" class="wth" />
            </FormItem>
            <FormItem label="毕业证号" prop="stuGraduateNum">
              <Input v-model="dataForm.stuGraduateNum" placeholder="请输入毕业证号" class="wth" />
            </FormItem>
            <FormItem label="结业方式" prop="stuTypeComplete">
              <Input v-model="dataForm.stuTypeComplete" placeholder="请输入结业方式" class="wth" />
            </FormItem>
            <FormItem label="结业日期" prop="stuDateComplete">
              <IDatePicker v-model="dataForm.stuDateComplete" type="date" format="yyyy-MM-dd" placeholder="选择日期" class="wth" />
            </FormItem>
          </Col>
          <!--学籍信息 end-->

          <!--备注 start-->
          <Col span="24" class="popup_title">
            <p><Icon type="ios-list" />备注</p>
            <Divider />
          </Col>
          <Col span="24">
            <Input v-model="dataForm.stuDesc" type="textarea" :maxlength="1000" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写备注" style="width:96%;margin-left:20px"></Input>
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

    <!--导入文件 start-->
    <Modal title="导入学生类别信息" v-model="modalImport" class-name="vertical-center-modal popup">
      <div>
        <Row>
          <Col span="12">
            <Upload ref="uploadStuType" :action="actionUrl" :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess" :show-upload-list="true" :with-credentials="true" :data="paramsImportStuType">
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
          </Col>
          <Col span="12">
            <Button class="template_btn" @click="downloadTeplate('stuType')">下载模板</Button>
          </Col>
        </Row>
        <p>{{ImportStuResultMsg}}</p>
        <tables v-if="ImportStuResult.length>0" size="small" v-model="ImportStuResult" :columns="columnsImportStuResult"></tables>
      </div>
      <div slot="footer">
        <Button @click="modalImport = false">关闭</Button>
        <!-- <Button type="primary" :loading="submitLoading" @click="modalImport = false">保存</Button> -->
      </div>
    </Modal>
    <!--导入文件 end-->

    <!--维护信息 start-->
    <Modal title="导入学生班级信息" v-model="Maintenance" class-name="vertical-center-modal popup">
      <div>
        <Row>
          <Col span="12">
            <Upload ref="uploadStuClass" :action="actionUrl" :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess" :show-upload-list="true" :with-credentials="true" :data="paramsImportStuClass">
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
          </Col>
          <Col span="12">
            <Button class="template_btn" @click="downloadTeplate('stuClass')">下载模板</Button>
          </Col>
        </Row>
        <p>{{ImportStuResultMsg}}</p>
        <tables v-if="ImportStuResult.length>0" size="small" v-model="ImportStuResult" :columns="columnsImportStuResult"></tables>
      </div>
      <div slot="footer">
        <Button @click="Maintenance = false">关闭</Button>
        <!-- <Button type="primary" :loading="submitLoading" @click="Maintenance = false">保存</Button> -->
      </div>
    </Modal>
    <!--维护信息 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import dicUtil from '@/libs/dicUtil'
import DicSelect from '@/view/components/dic-select'
import ClassSelect from '@/view/components/class-select'
import TeacherSelect from '@/view/components/teacher-select'
import IDatePicker from '@/view/components/idate-picker'
import url from '_conf/url'
import api from '@/api/student'
import { getToken } from '@/libs/util'
export default {
  name: 'studentFormation',
  components: {
    Tables, DicSelect, ClassSelect, TeacherSelect, IDatePicker
  },
  data () {
    const validateCode = (rule, value, callback) => {
      if (!this.dataForm.stuCode) {
        callback(new Error('证件号不能为空'))
      } else {
        api.validateStuCode(this.dataForm).then(res => {
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
      modalImport: false,
      Maintenance: false,
      modalView: false,
      formModalVisible: false,
      modalTitle: '',
      selectedList: [],
      searchForm: {
        page: 1,
        limit: 10,
        stuName: '',
        stuCode: '',
        teacherName: '',
        country: '',
        stuType: '',
        stuTypeTutorDeclare: '',
        classId: ''
      },
      dataForm: {
        stuCode: '',
        stuName: '',
        englishName: '',
        idNum: '',
        sex: '',
        birthday: '',
        nativePlace: '',
        nativePlace2: '',
        country: '',
        nation: '',
        politicState: '',
        maritalState: '',
        stuType: '',
        classId: undefined,
        stuDateAdmission: '',
        stuTypeAdmission: '',
        stuTypeOriginal: '', // 考生来源
        stuFlagResidence: false, // 是否户口迁入
        stuCompanyAuthorized: '', // 委定单位
        stuTypeAuthorized: '', // 委定方式
        stuCompanyEx: '',
        stuDiploma: '',
        stuSchoolUndergraduate: '',
        stuSubjectUndergraduate: '',
        stuDateUndergraduate: '',
        stuSchoolPostgraduate: '',
        stuSubjectPostgraduate: '',
        stuDatePostgraduate: '',
        stuDateGetmaster: '', // 获硕日期
        mobile: '',
        addressHome: '',
        phoneHome: '',
        email: '',
        addressDormitory: '',
        phoneDormitory: '',
        phoneLab: '',
        zipCode: '',
        teacherId: undefined,
        teacherCode: '', // 用于数据显示，不存储
        subjectType: '',
        orgCode: '', // ---------数据库缺失
        subject: '', // 研究方向
        stuField: '', // 专业
        subjectTypeMajor: '',
        subjectTypeMinor: '',
        majorTime: '', // ---------数据库缺失
        stuStatus: '', // 在校状态
        flagSchoolRoll: false, // 是否有学籍
        schoolRollChangeDesc: '', // 学籍变动
        schoolRollChangeDate: '', // 学籍变动日期
        stuDateDefense: '', // 答辩日期
        stuTypeGrant: '',
        stuDateGrant: '',
        stuTypeGraduate: '',
        stuDateGraduate: '',
        specialType: '', // ---------数据库缺失
        stuGraduateNum: '', // 毕业证号
        stuTypeComplete: '',
        stuDateComplete: '',
        stuDesc: '',
        stuTypeTutorDeclare: ''
      },
      dataFormValidate: {
        stuCode: [{ validator: validateCode, required: true, trigger: 'blur' }],
        stuName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        stuType: [{ required: true, message: '学生类别不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机不能为空', trigger: 'blur' },
          { pattern: /^[1][0-9]{10}$/, message: '手机格式不正确', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
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
          title: '学号',
          key: 'stuCode',
          minWidth: 120
        },
        {
          title: '姓名',
          key: 'stuName',
          minWidth: 100,
          classId: 'font_color'
        },
        {
          title: '性别',
          key: 'sexStr',
          minWidth: 80
        },
        {
          title: '学生类别',
          key: 'stuTypeStr',
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          sortable: false
        },
        {
          title: '所在班级',
          key: 'className',
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          sortable: false
        },
        {
          title: '邮箱',
          key: 'email',
          ellipsis: true,
          tooltip: true,
          minWidth: 180
        },
        {
          title: '导师申报类型',
          key: 'stuTypeTutorDeclareStr',
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
          sortable: false
        },
        {
          title: '导师姓名',
          key: 'teacherName',
          minWidth: 100
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 100,
          render: (h, params) => {
            let btns = []
            if (this.isAuth('sys:allstudent:info')) {
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
            if (this.isAuth('sys:allstudent:update')) {
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
      ],
      actionUrl: url + 'sys/importfile/excel',
      paramsImportStuType: {
        BusinessType: 'IMPORTSTUTYPE',
        token: getToken()
      },
      paramsImportStuClass: {
        BusinessType: 'IMPORTSTUCLASS',
        token: getToken()
      },
      ImportStuResult: [],
      ImportStuResultMsg: '',
      columnsImportStuResult: [
        {
          title: '行号',
          key: 'rowNum',
          minWidth: 30
        },
        {
          title: '学号',
          key: 'stuCode',
          minWidth: 60
        },
        {
          title: '姓名',
          key: 'stuName',
          minWidth: 100,
          classId: 'font_color'
        },
        {
          title: '校验信息',
          key: 'msg',
          minWidth: 160
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getStudentList()
    },
    handleSearch () {
      this.searchForm.page = 1
      this.getStudentList()
    },
    handleClear () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    changePage (currentPage) {
      this.searchForm.page = currentPage
      this.getStudentList()
    },
    handlePageSize (limit) {
      this.searchForm.limit = limit
      this.handleSearch()
    },
    getStudentList () {
      this.loading = true
      api.getStudentList(this.searchForm).then(res => {
        this.loading = false
        this.selectedList = []
        if (res.code === 200) {
          this.pageData = res.page
          dicUtil.setDicName(res.page.list, [
            { type: 'sex', key: 'sex' },
            { type: 'country', key: 'country' },
            { type: 'nationality', key: 'nation' },
            { type: 'student-type', key: 'stuType' },
            { type: 'declare-tutor-type', key: 'stuTypeTutorDeclare' },
            { type: 'student-admission', key: 'stuTypeAdmission' },
            { type: 'student-status', key: 'stuStatus' },
            { type: 'polity', key: 'politicState' },
            { type: 'marriage', key: 'maritalState' }
          ])
        }
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    submitForm () {
      if (this.submitLoading) return
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          if (!this.dataForm.id) {
            api.saveStudent(
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
            api.updateStudent(
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
    selectionChangeHandle (list) {
      this.selectedList = list
    },
    exportData () {
      this.exportLoading = true
      let params = Object.assign({}, this.searchForm)
      params.exportExcel = true
      api.getStudentList(params).then(res => {
        this.exportLoading = false
        let data = res.data
        this.turn2NewPage(this.$config.downloadExcelUrl, data)
      }).catch(e => {
        this.exportLoading = false
      })
    },
    deleteData () {
      let ids = this.selectedList.map(item => item.id)
      this.$Modal.confirm({
        title: '确认提示',
        content: '<p>您确认删除此记录吗?</p>',
        onOk: () => {
          api.deleteStudent(ids).then(res => {
            this.$Message.success('删除成功!')
            this.handleSearch()
          })
        }
      })
    },
    onModalImport () {
      this.$refs.uploadStuType.clearFiles()
      this.ImportStuResult = []
      this.ImportStuResultMsg = ''
      this.modalImport = true
    },
    onMaintenance () {
      this.$refs.uploadStuClass.clearFiles()
      console.log(this.$refs.uploadStuClass.clearFiles(), 'rrr')
      this.ImportStuResult = []
      this.ImportStuResultMsg = ''
      this.Maintenance = true
    },
    handleBeforeUpload () {
      this.$refs.uploadStuType.clearFiles()
      this.$refs.uploadStuClass.clearFiles()
      this.ImportStuResultMsg = ''
      this.ImportStuResult = []
      console.log('handleBeforeUpload')
    },
    handleUploadSuccess (response, file, fileList) {
      console.log(response, 'ddd')
      if (response.code === 200) {
        this.ImportStuResult = []
        this.ImportStuResultMsg = '导入成功'
      } else {
        this.ImportStuResultMsg = '导入失败'
        this.ImportStuResult = response.data
      }

      console.log('handleUploadSuccess=', JSON.stringify(response))
    },
    // 下载导入模版
    downloadTeplate (type) {
      const url = 'http://info.sppm.tsinghua.edu.cn/sppmtest/file/template/importstudenttype.xlsx'
      const url2 = 'http://info.sppm.tsinghua.edu.cn/sppmtest/file/template/importstudentclass.xlsx'
      const link = document.createElement('a')
      link.style.display = 'none'
      if (type === 'stuType') {
        link.href = url
        link.setAttribute('download', '导入学生分类模板')
      } else {
        link.href = url2
        link.setAttribute('download', '导入学生班级模板')
      }
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
