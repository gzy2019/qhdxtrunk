<template>
    <div>
      <!-- 新增/编辑 start-->
      <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="50" placeholder="请输入学号" />
          </FormItem>
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem>
          <FormItem label="班级" prop="classIds">
            <ClassSelect ref="classSelect" v-model="dataForm.classIds" :clearable="true" multiple @on-change="classHandle" placeholder="请输入班级"></ClassSelect>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select v-model="dataForm.sex"  clearable>
              <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="导师" prop="teacherIds">
            <TeacherSelect ref="teacherSelect" multiple v-model="dataForm.teacherIds" @on-change="teacherHandle"></TeacherSelect>
          </FormItem>
          <FormItem label="入校时间" prop="startDate">
            <IDatePicker type="date" v-model="dataForm.startDate" format="yyyy-MM-dd" placeholder="请输入入校时间" />
          </FormItem>
          <FormItem label="毕业时间" prop="endDate">
            <IDatePicker type="date" v-model="dataForm.endDate" format="yyyy-MM-dd" placeholder="请输入毕业时间" />
          </FormItem>
          <FormItem label="工作省份" prop="adsWorking">
            <Input type="text" v-model="dataForm.adsWorking" :maxlength="50" placeholder="请输入工作省份" />
          </FormItem>
          <FormItem label="单位/部门" prop="unit">
            <Input type="text" v-model="dataForm.unit" :maxlength="50" placeholder="请输入单位/部门" />
          </FormItem>
          <FormItem label="岗位" prop="post">
            <Input type="text" v-model="dataForm.post" :maxlength="50" placeholder="请输入岗位" />
          </FormItem>
          <FormItem label="级别" prop="rank">
            <Input type="text" v-model="dataForm.rank" :maxlength="50" placeholder="请输入级别" />
          </FormItem>
          <FormItem label="工作部门性质" prop="nature">
            <Input type="text" v-model="dataForm.nature" :maxlength="50" placeholder="请输入工作部门性质" />
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input type="text" v-model="dataForm.phone" :maxlength="50" placeholder="请输入电话" />
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input type="text" v-model="dataForm.email" :maxlength="50" placeholder="请输入邮箱" />
          </FormItem>
          <FormItem label="通讯地址" prop="adsContact">
            <Input type="text" v-model="dataForm.adsContact" :maxlength="100" placeholder="请输入通讯地址" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSchoolfellowInfo">提交</Button>
        </div>
      </Modal>
      <Modal :title="modalTitle" v-model="formModalVisibe" :mask-closable='false' :width="600" class-name="vertical-center-modal">
        <Spin size="large" fix v-if="loading"></Spin>
        <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
          <FormItem label="学号" prop="stuCode">
            <Input type="text" v-model="dataForm.stuCode" :maxlength="50" placeholder="请输入学号" />
          </FormItem>
          <FormItem label="学生姓名" prop="stuName">
            <Input type="text" v-model="dataForm.stuName" :maxlength="50" placeholder="请输入学生姓名" />
          </FormItem>
          <FormItem label="班级" prop="classIds">
            <ClassSelect ref="classSelect" v-model="dataForm.classIds" :clearable="true" multiple @on-change="classHandle" placeholder="请输入班级"></ClassSelect>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select v-model="dataForm.sex"  clearable>
              <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="导师" prop="teacherIds">
            <TeacherSelect ref="teacherSelect" multiple v-model="dataForm.teacherIds" @on-change="teacherHandle"></TeacherSelect>
            <!-- <TeacherSelect v-model="dataForm.teacherId" multiple :clearable="true"></TeacherSelect> -->
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input type="text" v-model="dataForm.phone" :maxlength="50" placeholder="请输入电话" />
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input type="text" v-model="dataForm.email" :maxlength="50" placeholder="请输入邮箱" />
          </FormItem>
          <FormItem label="通讯地址" prop="adsContact">
            <Input type="text" v-model="dataForm.adsContact" :maxlength="100" placeholder="请输入通讯地址" />
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="saveSchoolfellowInfo">提交</Button>
        </div>
      </Modal>
      <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/schoolfellow/schoolfellowinfo'
import IDatePicker from '@/view/components/idate-picker'
import ClassSelect from '@/view/components/class-select'
import TeacherSelect from '@/view/components/teacher-select'

export default {
  name: 'SchoolfellowInfo-form',
  components: {
    IDatePicker,
    ClassSelect,
    TeacherSelect
  },
  data () {
    return {
      formModalVisible: false,
      formModalVisibe: false,
      loading: false,
      modalTitle: '',
      sexList: [
        {value: '男', label: '男'},
        {value: '女', label: '女'}
      ],
      teacherName: '',
      dataForm: {
        stuCode: '',
        stuName: '',
        teacherIds: [],
        teacherNames: [],
        classIds: [],
        classNames: [],
        sex: '',
        startDate: '',
        endDate: '',
        adsWorking: '',
        unit: '',
        post: '',
        rank: '',
        nature: '',
        phone: '',
        email: '',
        adsContact: '',
        id: null
      },
      dataFormValidate: {
        unit: [
          { required: true, message: '单位不能为空', trigger: 'blur' }
        ],
        teacherIds: [
          { type: 'array', required: true, message: '导师不能为空', trigger: 'blur' }
        ],
        classIds: [
          { type: 'array', required: true, message: '班级不能为空', trigger: 'blur' }
        ],
        stuCode: [
          { required: true, message: '学号不能为空', trigger: 'blur' }
        ],
        stuName: [
          { required: true, message: '学生姓名不能为空', trigger: 'blur' }
        ],
        // phone: [{ required: true, message: '手机不能为空', trigger: 'blur' },
        //   { pattern: /^[1][0-9]{10}$/, message: '手机格式不正确', trigger: 'blur' }],
        // email: [
        //   { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //   { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
        formItem_: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' },
          { type: 'string', min: 20, message: '不能超过20个字符', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {

    },
    teacherHandle (id) {
      this.dataForm.teacherNames = this.$refs.teacherSelect.getTeacherNames(id)
    },
    classHandle (id) {
      this.dataForm.classNames = this.$refs.classSelect.getClassNames(id)
    },
    cancel () {
      this.formModalVisibe = false
      this.formModalVisible = false
    },
    addSchoolfellowInfo () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editSchoolfellowInfo (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getSchoolfellowInfoInfo(id).then(res => {
        let entity = res.schoolfellowInfo
        Object.keys(this.dataForm).forEach(key => {
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisibe = true
    },
    saveSchoolfellowInfo () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          // let data = Object.assign({}, this.dataForm)
          if (!this.dataForm.id) {
            api.saveSchoolfellowInfo(this.dataForm).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('on-save')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updateSchoolfellowInfo(this.dataForm).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisibe = false
              this.$emit('on-update')
            }).finally(() => {
              this.submitLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
