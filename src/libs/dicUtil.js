import api from '@/api/dic'

const TYPE_MAP = [
  { name: '授予方式', value: 'grant-way' },
  { name: '毕业方式', value: 'graduate-way' },
  { name: '结业方式', value: 'complete-way' },
  { name: '考试方式', value: 'exam-way' },
  { name: '考生来源-学生管理', value: 'student-source-manager' },
  { name: '考生来源', value: 'student-source' },
  { name: '考生来源-高端', value: 'student-source-top' },
  { name: '学习方式', value: 'study-way' },
  { name: '政治面貌', value: 'polity' },
  { name: '婚姻状况', value: 'marriage' },
  { name: '性别', value: 'sex' },
  { name: '民族', value: 'nationality' },
  { name: '国家', value: 'country' },
  { name: '职称', value: 'position-title' },
  { name: '学生类别', value: 'student-type' },
  { name: '学生状态', value: 'student-status' },
  { name: '入学方式', value: 'student-admission' },
  { name: '学科门类', value: 'subject-type' },
  { name: '专业', value: 'major' },
  { name: '导师类型', value: 'supervisor-type' },
  { name: '岗位属性', value: 'duty-type' },
  { name: '证件类型', value: 'credential-type' },
  { name: '通行证类型', value: 'pass-type' },
  { name: '学位', value: 'degree' },
  { name: '学历', value: 'education' },
  { name: '研究方向', value: 'apply-direction' },
  { name: '导师申报分类', value: 'declare-tutor-type' },
  { name: '人员类别', value: 'people-type' },
  { name: '财务报销方式', value: 'submit-fee-type' },
  { name: '币种名称', value: 'currency-type' },
  { name: '现工作单位类别', value: 'cur-work-org-type' },
  { name: '现工作行业类别', value: 'cur-work-industry-type' },
  { name: '岗位职能', value: 'position-responsibilty' },
  { name: '英语考试名称', value: 'english-exam-name' },
  { name: '专项计划类型', value: 'spe-plan-type' },
  { name: '报考类别', value: 'apply-type' },
  { name: '会议室类型', value: 'meeting-room-type' },
  { name: '会议类型', value: 'meeting-type' },
  { name: '科研-成果来源', value: 'achievement-source' },
  { name: '科研-成果形式', value: 'achievement-form' },
  { name: '科研-发表范围', value: 'achievement-scope' },
  { name: '科研-研究类别', value: 'achievement-category' },
  { name: '科研-学科门类', value: 'achievement-subject' },
  { name: '三助评估-岗位类别', value: 'declare-estimate-category' },
  { name: '博士后研究方向', value: 'doctor-post-direction' },
  { name: '毕业单位所在地', value: 'graduated-place' },
  { name: '案例来源', value: 'case-source' }
]

let cache = {
  loaded: false
}
api.getDicByType('all').then(res => {
  res.data.map(item => {
    if (!cache[item.dicType]) cache[item.dicType] = {}
    cache[item.dicType][item.dicValue] = item.dicName
  })
  cache.loaded = true
})
const dicUtil = {
  getDicTypeList: () => {
    return TYPE_MAP
  },
  getDicTypeName: (type) => {
    let obj = TYPE_MAP.filter(item => item.value === type)
    if (obj.length) return obj[0].name
    return ''
  },
  getDicValByName: (type, name) => {
    if (cache[type]) {
      let kvMap = cache[type]
      let val = name
      Object.keys(kvMap).forEach(key => {
        if (kvMap[key] === name && !val) {
          val = kvMap[key]
        }
      })

      return val
    }
    return name
  },
  setDicName: (list, dicArr) => {
    list.map(item => {
      dicArr.map(dicItem => {
        let kvMap = cache[dicItem.type]
        let key = dicItem.key
        let value = item[key]
        if (kvMap && kvMap[value]) {
          item[key + 'Str'] = kvMap[value]
        }
      })
    })
  }
}

export default dicUtil
