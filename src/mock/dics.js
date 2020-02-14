import { getParams } from '@/libs/util'

export const getDicByType = req => {
  let params = getParams(req.url)
  console.log('param-type:' + params.type)
  if (params.type === 'grant-way') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '授予方式一', dicValue: 'val1' },
        { id: 2, dicName: '授予方式二', dicValue: 'val2' }
      ]
    }
  } else if (params.type === 'graduate-way') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '毕业方式一', dicValue: 'val1' },
        { id: 2, dicName: '毕业方式二', dicValue: 'val2' }
      ]
    }
  } else if (params.type === 'complete-way') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '结业方式一', dicValue: 'val1' },
        { id: 2, dicName: '结业方式二', dicValue: 'val2' }
      ]
    }
  } else if (params.type === 'exam-source') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '来源一', dicValue: 'val1' },
        { id: 2, dicName: '来源二', dicValue: 'val2' }
      ]
    }
  } else if (params.type === 'polity') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '群众', dicValue: 'val1' },
        { id: 2, dicName: '中共党员', dicValue: 'val2' }
      ]
    }
  } else if (params.type === 'marriage') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '单身', dicValue: 'val1' },
        { id: 2, dicName: '已婚', dicValue: 'val2' },
        { id: 3, dicName: '离异', dicValue: 'val3' },
        { id: 4, dicName: '丧偶', dicValue: 'val4' }
      ]
    }
  } else if (params.type === 'sex') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '男', dicValue: 'male' },
        { id: 2, dicName: '女', dicValue: 'female' }
      ]
    }
  } else if (params.type === 'nationality') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '汉族', dicValue: 'val1' },
        { id: 2, dicName: '满族', dicValue: 'val2' },
        { id: 3, dicName: '藏族', dicValue: 'val3' },
        { id: 4, dicName: '壮族', dicValue: 'val4' }
      ]
    }
  } else if (params.type === 'country') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '中国', dicValue: 'val1' },
        { id: 2, dicName: '美国', dicValue: 'val2' },
        { id: 3, dicName: '俄罗斯', dicValue: 'val3' }
      ]
    }
  } else if (params.type === 'position-title') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '讲师', dicValue: 'val1' },
        { id: 2, dicName: '教授', dicValue: 'val2' }
      ]
    }
  } else if (params.type === 'student-type') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '本科生', dicValue: 'val1' },
        { id: 2, dicName: '研究生', dicValue: 'val2' },
        { id: 3, dicName: '博士生', dicValue: 'val3' }
      ]
    }
  } else if (params.type === 'student-status') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '在校', dicValue: 'val1' },
        { id: 2, dicName: '离校', dicValue: 'val2' }
      ]
    }
  } else if (params.type === 'student-type-admission') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '入学方式一', dicValue: 'val1' },
        { id: 2, dicName: '入学方式二', dicValue: 'val2' },
        { id: 3, dicName: '入学方式三', dicValue: 'val3' }
      ]
    }
  } else if (params.type === 'subject-type') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '学科一', dicValue: 'val1' },
        { id: 2, dicName: '学科二', dicValue: 'val2' },
        { id: 3, dicName: '学科三', dicValue: 'val3' }
      ]
    }
  } else if (params.type === 'major') {
    return {
      code: 200,
      msg: '',
      data: [
        { id: 1, dicName: '学科一', dicValue: 'val1' },
        { id: 2, dicName: '学科二', dicValue: 'val2' },
        { id: 3, dicName: '学科三', dicValue: 'val3' }
      ]
    }
  } else {
    return {
      code: 200,
      msg: '',
      data: []
    }
  }
}
