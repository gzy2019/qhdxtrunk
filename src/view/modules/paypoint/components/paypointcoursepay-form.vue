<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="800" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="110" :rules="dataFormValidate">
                <Row>
                  <Col span="12">
                    <FormItem label="批次" prop="batchId">
                      <Select v-model="dataForm.batchId" placeholder="请选择">
                        <Option v-for="(item,index) in batchList" :key="index" :value="item.id">{{item.name}}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="时间" prop="serviceDate">
                        <IDatePicker type="date" v-model="dataForm.serviceDate" format="yyyy-MM-dd" placeholder="请输入时间" />
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="绩点分类" prop="categoryIdPath">
                      <Cascader
                        :transfer="true"
                        v-model="dataForm.categoryIdPath"
                        :change-on-select="true"
                        :data="categoryList"
                      />
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="规则" prop="ruleId">
                      <Select v-model="dataForm.ruleId" placeholder="请选择">
                        <Option v-for="(item,index) in ruleList" :key="index" :value="item.id">{{item.title}}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="8">
                    <FormItem label="计量单位" prop="unit">{{dataForm.unit}}</FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="薪酬系数" prop="payFactor">
                      {{comPayFactor}}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="8">
                    <FormItem label="教师" prop="teacherId">
                      <Select v-model="dataForm.teacherId" filterable :disabled="!!dataForm.id" placeholder="请选择">
                        <Option v-for="(item,index) in teacherList" :key="index" :value="item.id">{{item.teaName}}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="8">
                     <FormItem label="选课人数" prop="attendCount">
                      <InputNumber v-model="dataForm.attendCount" :min="1" :max="9999" placeholder="请输入选课人数" style="width: 100%;" />
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="中英文" prop="langInfo">
                      <Select v-model="dataForm.langInfo" placeholder="请选择">
                        <Option value="中文">中文</Option>
                        <Option value="英文">英文</Option>
                      </Select>
                  </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="8">
                    <FormItem label="本次薪酬计数" prop="curPayCount">
                      <InputNumber v-model="dataForm.curPayCount" :min="1" :step="0.1" :max="9999" placeholder="请输入薪酬计数" style="width: 100%;"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="薪酬标准" prop="payStandard">
                      <InputNumber v-model="dataForm.payStandard" :min="0" :max="999999" style="width: 100%;"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="本次薪酬金额" prop="curPayAmount">
                      {{comCurPayAmount}}
                    </FormItem>
                  </Col>
                </Row>
                <FormItem label="学年学期" prop="term">
                    <Select v-model="dataForm.term" placeholder="请选择">
                      <Option value="2018">2018</Option>
                      <Option value="2019">2019</Option>
                      <Option value="2020">2020</Option>
                      <Option value="2021">2021</Option>
                      <Option value="2022">2022</Option>
                      <Option value="2022">2023</Option>
                    </Select>
                </FormItem>
                <FormItem label="摘要" prop="summary">
                    <Input type="text" v-model="dataForm.summary" :maxlength="300" placeholder="请输入摘要" />
                </FormItem>
                <FormItem label="备注" prop="memo">
                    <Input type="textarea" v-model="dataForm.memo" :autosize="{minRows: 4,maxRows: 6}" :maxlength="500" placeholder="请输入备注" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="savePaypointCoursePay">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/paypoint/paypointcoursepay'
import batchapi from '@/api/paypoint/paypointbatch'
import categoryapi from '@/api/paypoint/paypointcategory'
import ruleapi from '@/api/paypoint/paypointrule'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'PaypointCoursePay-form',
  components: {
    IDatePicker
  },
  data () {
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      batchList: [],
      categoryList: [],
      ruleList: [],
      teacherList: [],
      dataForm: {
        batchId: '',
        paypointDepartmentId: '',
        serviceDate: '',
        categoryIdPath: [],
        categoryId: '',
        ruleId: '',
        serviceContent: '',
        unit: '',
        payStandard: 200,
        teacherId: '',
        attendCount: 1,
        langInfo: '中文',
        payFactor: 1,
        curPayCount: 1,
        curPayAmount: 0,
        term: '',
        summary: '',
        memo: '',
        id: undefined
      },
      dataFormValidate: {
        batchId: [
          { type: 'number', required: true, message: '批次不能为空', trigger: 'change' }
        ],
        serviceDate: [
          { required: true, message: '时间不能为空', trigger: 'blur' }
        ],
        categoryIdPath: [
          { type: 'array', required: true, message: '绩点分类不能为空', trigger: 'change' }
        ],
        ruleId: [
          { type: 'number', required: true, message: '规则ID不能为空', trigger: 'change' }
        ],
        teacherId: [
          { type: 'number', required: true, message: '教师ID不能为空', trigger: 'change' }
        ],
        attendCount: [
          { type: 'number', required: true, message: '选课人数不能为空', trigger: 'blur' }
        ],
        langInfo: [
          { required: true, message: '中英文不能为空', trigger: 'change' }
        ],
        payStandard: [
          { type: 'number', required: true, message: '薪酬标准不能为空', trigger: 'blur' }
        ],
        curPayCount: [
          { type: 'number', required: true, message: '本次薪酬计数不能为空', trigger: 'blur' }
        ],
        term: [
          { required: true, message: '学年学期不能为空', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '摘要不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    'dataForm.batchId': {
      immediate: true,
      handler () {
        if (this.batchList) {
          let batch = this.batchList.find(item => item.id === this.dataForm.batchId)
          if (batch) {
            this.dataForm.paypointDepartmentId = batch.paypointDepartmentId
          }
        }
        this.loadCategoryList()
      }
    },
    'dataForm.categoryIdPath': {
      immediate: true,
      handler () {
        this.loadRuleList()
      }
    },
    'dataForm.ruleId': {
      immediate: true,
      handler () {
        this.fillRuleInfo()
      }
    }
  },
  computed: {
    comPayFactor () {
      let personCount = this.dataForm.attendCount
      if (personCount) {
        if (personCount <= 40) {
          return 1
        } else if (personCount <= 70) {
          return 1.2
        } else if (personCount <= 100) {
          return 1.4
        } else {
          return 1.6
        }
      }

      return 1
    },
    comCurPayAmount () {
      return (this.comPayFactor * this.dataForm.payStandard * this.dataForm.curPayCount).toFixed(2)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadBatchList()
      this.loadTeacherList()
    },
    loadBatchList () {
      batchapi.getPaypointBatchDataList({ category: 0 }).then(res => {
        this.batchList = res.list
      })
    },
    loadCategoryList () {
      categoryapi.getPaypointCategoryTree().then(res => {
        this.categoryList = res.list
      })
    },
    loadTeacherList () {
      api.getTeacherList().then(res => {
        this.teacherList = res.data
      })
    },
    loadRuleList () {
      if (!this.dataForm.categoryIdPath || !this.dataForm.categoryIdPath.length) {
        return
      }
      if (!this.dataForm.paypointDepartmentId) {
        return
      }
      let params = {
        ruleCategory: 0,
        paypointDepartmentId: this.dataForm.paypointDepartmentId,
        categoryIdPath: this.dataForm.categoryIdPath[this.dataForm.categoryIdPath.length - 1] + ''
      }
      ruleapi.getPaypointRuleDataList(params).then(res => {
        this.ruleList = res.list
        this.ruleList.map(item => { item.title = item.title + '(' + item.code + ')' })
        this.fillRuleInfo()
      })
    },
    fillRuleInfo () {
      if (this.ruleList) {
        let rule = this.ruleList.find(item => item.id === this.dataForm.ruleId)
        if (rule) {
          this.dataForm.unit = rule.unit
          this.dataForm.payStandard = rule.payStandard
          this.dataForm.pointStandard = rule.pointStandard
          this.dataForm.serviceContent = rule.title
        }
      }
    },
    cancel () {
      this.formModalVisible = false
    },
    addPaypointCoursePay () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.term = new Date().getFullYear() + ''
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editPaypointCoursePay (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointCoursePayInfo(id).then(res => {
        let entity = res.paypointCoursePay
        Object.keys(this.dataForm).forEach(key => {
          if (key === 'categoryIdPath' && entity[key]) {
            let val = JSON.parse(entity[key])
            val = val.map(item => parseInt(item))
            entity[key] = val
          }
          this.dataForm[key] = entity[key]
        })
      }).finally(() => {
        this.loading = false
      })
      this.formModalVisible = true
    },
    savePaypointCoursePay () {
      this.dataForm.payFactor = this.comPayFactor
      this.dataForm.curPayAmount = this.comCurPayAmount
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (data.categoryIdPath && data.categoryIdPath.length) {
            data.categoryId = data.categoryIdPath[data.categoryIdPath.length - 1]
            data.categoryIdPath = data.categoryIdPath.map(item => item + '')
            data.categoryIdPath = JSON.stringify(data.categoryIdPath)
          } else {
            delete data.categoryIdPath
          }
          if (!data.id) {
            api.savePaypointCoursePay(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updatePaypointCoursePay(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
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
