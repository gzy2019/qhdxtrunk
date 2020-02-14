<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="900" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate" style="width: 850px;">
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
                    <FormItem label="薪酬标准" prop="payStandard">
                      <InputNumber v-model="dataForm.payStandard" :min="0" :max="999999" style="width: 100%;"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="绩点标准" prop="pointStandard">
                      <InputNumber v-model="dataForm.pointStandard" :min="0" :max="999999" style="width: 100%;"/>
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
            <Form ref="dataForm2" :model="dataForm2" :label-width="0">
              <FormItem style="margin: 3px;">
                  <Button type="primary" @click="addTeacherItem">新增教师</Button>
              </FormItem>
              <div class="ivu-table-wrapper ivu-table-wrapper-with-border">
              <div class="ivu-table ivu-table-default ivu-table-border">
                <table cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <th width="12%">教师</th>
                    <th width="12%">本次薪酬计数（数字）</th>
                    <th width="10%">本次薪酬金额</th>
                    <th width="12%">本次绩点计数（数字）</th>
                    <th width="10%">本次绩点金额</th>
                    <th width="10%">不计薪酬</th>
                    <th width="10%">操作</th>
                  </tr>
                  <tr v-for="(item,index) in dataForm2.list" :key="index">
                    <td>
                      <Select v-model="dataForm2.list[index].teacherId" transfer filterable placeholder="请选择" size="small" style="width: 110px;">
                        <Option v-for="(item,index) in teacherList" :key="index" :value="item.id">{{item.teaName}}</Option>
                      </Select>
                    </td>
                    <td>
                      <InputNumber @on-change="computeAmount" v-model="dataForm2.list[index].curPayCount" :min="0" :step="0.1" :max="9999" size="small" />
                    </td>
                    <td>
                      {{item.curPayAmount}}
                    </td>
                    <td>
                      <InputNumber @on-change="computeAmount" v-model="dataForm2.list[index].curPointCount" :step="0.1" :min="0" :max="9999" size="small" />
                    </td>
                    <td>
                      {{item.curPointAmount}}
                    </td>
                    <td>
                      <Checkbox @on-change="computeAmount" v-model="dataForm2.list[index].payNotCounted"></Checkbox>
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button @click="deleteTeacherItem(index)" type="error" size="small" icon="ios-trash" />
                      </ButtonGroup>
                    </td>
                  </tr>
                </table>
              </div>
              </div>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="savePaypointPubService">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/paypoint/paypointpubservice'
import batchapi from '@/api/paypoint/paypointbatch'
import categoryapi from '@/api/paypoint/paypointcategory'
import ruleapi from '@/api/paypoint/paypointrule'
import IDatePicker from '@/view/components/idate-picker'
export default {
  name: 'PaypointPubService-form',
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
        teacherId: '',
        serviceDate: '',
        categoryIdPath: [],
        categoryId: '',
        ruleId: '',
        unit: '',
        serviceContent: '',
        payStandard: 0,
        curPayCount: 0,
        curPayAmount: 0,
        pointStandard: 0,
        curPointCount: 0,
        curPointAmount: 0,
        term: '',
        summary: '',
        memo: '',
        id: undefined
      },
      formItem: {
        teacherId: '',
        curPayCount: 0,
        curPayAmount: 0,
        curPointCount: 0,
        curPointAmount: 0,
        payNotCounted: false
      },
      dataForm2: {
        list: []
      },
      dataFormValidate: {
        batchId: [
          { type: 'number', required: true, message: '批次不能为空', trigger: 'change' }
        ],
        serviceDate: [
          { required: true, message: '时间不能为空', trigger: 'blur' }
        ],
        categoryIdPath: [
          { type: 'array', required: true, message: '分类不能为空', trigger: 'change' }
        ],
        ruleId: [
          { type: 'number', required: true, message: '规则不能为空', trigger: 'change' }
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
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadBatchList()
      this.loadTeacherList()
    },
    loadBatchList () {
      batchapi.getPaypointBatchDataList({ category: 1 }).then(res => {
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
        ruleCategory: 1,
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
          this.dataForm.payStandard = this.dataForm.payStandard || rule.payStandard
          this.dataForm.pointStandard = this.dataForm.pointStandard || rule.pointStandard
          this.dataForm.serviceContent = rule.title

          this.computeAmount()
        }
      }
    },
    cancel () {
      this.formModalVisible = false
    },
    addPaypointPubService () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm2.list = []
      this.dataForm.term = new Date().getFullYear() + ''
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    computeAmount () {
      let payStandard = this.dataForm.payStandard || 0
      let pointStandard = this.dataForm.pointStandard || 0
      if (this.ruleList) {
        let rule = this.ruleList.find(item => item.id === this.dataForm.ruleId)
        if (rule) {
          payStandard = payStandard || rule.payStandard
          pointStandard = pointStandard || rule.pointStandard
        }
      }
      this.dataForm2.list.forEach(item => {
        item.curPayAmount = (item.curPayCount * payStandard).toFixed(2)
        if (item.payNotCounted) {
          item.curPayAmount = 0
        }
        item.curPointAmount = (item.curPointCount * pointStandard).toFixed(2)
      })
    },
    addTeacherItem () {
      let item = Object.assign({}, this.formItem)
      this.dataForm2.list.push(item)
    },
    deleteTeacherItem (index) {
      this.dataForm2.list.splice(index, 1)
    },
    validateTeacher () {
      let result = true
      if (!this.dataForm2.list || !this.dataForm2.list.length) {
        this.$Message.error('教师不能为空, 请新增教师!')
        return false
      }
      this.dataForm2.list.forEach(item => {
        if (!item.teacherId) {
          this.$Message.error('请选择教师!')
          result = false
        }
      })
      if (result) {
        let arr = this.dataForm2.list.map(item => item.teacherId)
        let arr2 = Array.from(new Set(arr))
        if (arr.length !== arr2.length) {
          this.$Message.error('教师存在重复，请检查!')
          result = false
        }
      }

      return result
    },

    savePaypointPubService () {
      this.$refs.dataForm.validate(valid => {
        if (valid && this.validateTeacher()) {
          this.submitLoading = true
          let data = Object.assign({}, this.dataForm)
          // 新增保存
          if (data.categoryIdPath && data.categoryIdPath.length) {
            data.categoryId = data.categoryIdPath[data.categoryIdPath.length - 1]
            data.categoryIdPath = data.categoryIdPath.map(item => item + '')
            data.categoryIdPath = JSON.stringify(data.categoryIdPath)
          } else {
            delete data.categoryIdPath
          }

          let arr = []
          this.dataForm2.list.forEach(item => {
            let obj = Object.assign({}, data)
            Object.assign(obj, item)

            arr.push(obj)
          })
          api.batchSavePaypointPubService(arr).then(res => {
            this.$Message.success('操作成功！')
            this.formModalVisible = false
            this.$emit('update')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.ivu-table {
  th {
    text-align: center;
  }
  td {
    text-align: center;
    height: 35px;
  }
}
</style>
