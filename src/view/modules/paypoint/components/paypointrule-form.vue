<template>
    <div>
        <!-- 新增/编辑 start-->
        <Modal :title="modalTitle" v-model="formModalVisible" :mask-closable='false' :width="600" class-name="vertical-center-modal">
            <Spin size="large" fix v-if="loading"></Spin>
            <Form ref="dataForm" :model="dataForm" :label-width="100" :rules="dataFormValidate">
                <FormItem label="部门" prop="paypointDepartmentId">
                  <Select v-model="dataForm.paypointDepartmentId" placeholder="请选择">
                    <Option v-for="(item,index) in departmentList" :key="index" :value="item.id">{{item.name}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="绩点分类" prop="categoryIdPath">
                  <Cascader
                    :transfer="true"
                    v-model="dataForm.categoryIdPath"
                    :change-on-select="true"
                    :data="categoryList"
                  />
                </FormItem>
                <FormItem label="类型" prop="ruleCategory">
                  <Select v-model="dataForm.ruleCategory" placeholder="请选择">
                    <Option :value="0">课酬</Option>
                    <Option :value="1">公共服务</Option>
                    <Option :value="2">其它</Option>
                  </Select>
                </FormItem>
                <FormItem label="编码" prop="code">
                    <Input type="text" v-model="dataForm.code" :maxlength="50" placeholder="请输入编码" />
                </FormItem>
                <FormItem label="服务内容" prop="title">
                    <Input type="text" v-model="dataForm.title" :maxlength="250" placeholder="请输入服务内容" />
                </FormItem>
                <FormItem label="计量单位" prop="unit">
                    <Input type="text" v-model="dataForm.unit" :maxlength="50" placeholder="请输入计量单位,如:批，每年，生，人，组，学时，本，篇，等" />
                </FormItem>
                <FormItem label="薪酬标准" prop="payStandard" v-if="dataForm.ruleCategory !== 3">
                  <InputNumber :min="0" :max="999999" :step="100" v-model="dataForm.payStandard" placeholder="请输入薪酬标准" style="width: 200px;" />
                </FormItem>
                <FormItem label="绩点标准" prop="pointStandard" v-if="dataForm.ruleCategory !== 3">
                  <InputNumber :min="0" :max="999999" :step="0.1" v-model="dataForm.pointStandard" placeholder="请输入绩点标准" style="width: 200px;"/>
                </FormItem>
                <FormItem label="说明" prop="memo">
                    <Input type="text" v-model="dataForm.memo" :maxlength="300" placeholder="请输入说明" />
                </FormItem>
                <FormItem label="统计分类" prop="statsCategory">
                  <Select v-model="dataForm.statsCategory" placeholder="请选择" clearable>
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                  </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="savePaypointRule">提交</Button>
            </div>
        </Modal>
        <!-- 新增/编辑 end-->

    </div>
</template>

<script>
import api from '@/api/paypoint/paypointrule'
import departmentapi from '@/api/paypoint/paypointdepartment'
import categoryapi from '@/api/paypoint/paypointcategory'
export default {
  name: 'PaypointRule-form',
  data () {
    const validatePayStandard = (rule, value, callback) => {
      if (this.dataForm.ruleCategory === 3) {
        callback()
        return false
      }
      if (typeof (this.dataForm.payStandard) !== 'number') {
        callback(new Error('薪酬标准不能为空'))
      } else if (isNaN(this.dataForm.payStandard)) {
        callback(new Error('请输入0-99999之间的数字'))
      } else if (this.dataForm.payStandard < 0 || this.dataForm.payStandard > 99999) {
        callback(new Error('请输入0-99999之间的数字'))
      } else {
        callback()
      }
    }
    const validatePointStandard = (rule, value, callback) => {
      if (this.dataForm.ruleCategory === 3) {
        callback()
        return false
      }
      if (typeof (this.dataForm.pointStandard) !== 'number') {
        callback(new Error('绩点标准不能为空'))
      } else if (isNaN(this.dataForm.pointStandard)) {
        callback(new Error('请输入0-99999之间的数字'))
      } else if (this.dataForm.pointStandard < 0 || this.dataForm.pointStandard > 99999) {
        callback(new Error('请输入0-99999之间的数字'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!this.dataForm.code) {
        callback(new Error('编码不能为空'))
      } else {
        let data = Object.assign({}, this.dataForm)
        delete data.categoryIdPath
        api.validateCode(data).then(res => {
          if (!res.result) {
            callback(new Error('编码已经存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      formModalVisible: false,
      loading: false,
      modalTitle: '',
      departmentList: [],
      categoryList: [],
      dataForm: {
        paypointDepartmentId: '',
        categoryId: '',
        categoryIdPath: [],
        title: '',
        code: '',
        unit: '',
        ruleCategory: 1,
        payStandard: 100,
        pointStandard: 1.2,
        memo: '',
        statsCategory: '',
        id: undefined
      },
      dataFormValidate: {
        paypointDepartmentId: [
          { type: 'number', required: true, message: '部门不能为空', trigger: 'change' }
        ],
        payStandard: [
          { validator: validatePayStandard, trigger: 'blur' }
        ],
        pointStandard: [
          { validator: validatePointStandard, trigger: 'blur' }
        ],
        categoryIdPath: [
          { type: 'array', required: true, message: '绩点分类不能为空', trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, required: true, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '服务内容不能为空', trigger: 'blur' }
        ],
        ruleCategory: [
          { type: 'number', required: true, message: '类型不能为空', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '计量单位不能为空', trigger: 'blur' }
        ],
        statsCategory: [
          { required: false, message: '统计分类不能为空', trigger: 'change' }
        ]
      },
      submitLoading: false
    }
  },
  watch: {
    'dataForm.ruleCategory': {
      handler () {
        if (this.dataForm.ruleCategory === 3) {
          this.payStandard = null
          this.pointStandard = null
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loadDepartmentList()
      this.loadCategoryList()
    },
    loadDepartmentList () {
      departmentapi.getPaypointDepartmentDataList().then(res => {
        this.departmentList = res.list
      })
    },
    loadCategoryList () {
      categoryapi.getPaypointCategoryTree().then(res => {
        this.categoryList = res.list
      })
    },
    cancel () {
      this.formModalVisible = false
    },
    addPaypointRule () {
      this.modalTitle = '新增'
      this.$refs.dataForm.resetFields()
      this.dataForm.id = undefined
      this.formModalVisible = true
    },
    editPaypointRule (id) {
      this.modalTitle = '编辑'
      this.$refs.dataForm.resetFields()
      this.loading = true
      api.getPaypointRuleInfo(id).then(res => {
        let entity = res.paypointRule
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
    savePaypointRule () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 新增保存
          let data = Object.assign({}, this.dataForm)
          if (data.categoryIdPath) {
            data.categoryId = data.categoryIdPath[data.categoryIdPath.length - 1]
            data.categoryIdPath = data.categoryIdPath.map(item => item + '')
            data.categoryIdPath = JSON.stringify(data.categoryIdPath)
          }

          if (!data.id) {
            api.savePaypointRule(data).then(res => {
              this.$Message.success('操作成功！')
              this.formModalVisible = false
              this.$emit('update')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            api.updatePaypointRule(data).then(res => {
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
