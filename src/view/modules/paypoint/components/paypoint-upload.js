/* eslint-disable prefer-promise-reject-errors */
import api from '@/api/paypoint/paypointdepartment'
import pubServiceApi from '@/api/paypoint/paypointpubservice'
import coursePayApi from '@/api/paypoint/paypointcoursepay'
import otherApi from '@/api/paypoint/paypointother'
import { getFormateDateTime } from '@/libs/util'
const curYear = new Date().getFullYear()
const PP_IMP = {
  batchCache: {},
  ruleCache: {},
  teacherCache: {},
  getBatch (code) {
    return new Promise((resolve, reject) => {
      if (this.batchCache[code]) {
        resolve(this.batchCache[code])
      } else {
        api.getBatchByCode({ code: code }).then(res => {
          this.batchCache[code] = res.data
          resolve(res.data)
        }).catch(e => {
          reject(e)
        })
      }
    })
  },
  getRule (code) {
    return new Promise((resolve, reject) => {
      if (this.ruleCache[code]) {
        resolve(this.ruleCache[code])
      } else {
        api.getRuleByCode({ code: code }).then(res => {
          this.ruleCache[code] = res.data
          resolve(res.data)
        }).catch(e => {
          reject(e)
        })
      }
    })
  },
  getTeacher (code) {
    return new Promise((resolve, reject) => {
      if (this.teacherCache[code]) {
        resolve(this.teacherCache[code])
      } else {
        api.getTeacherByCode({ code: code }).then(res => {
          this.teacherCache[code] = res.data
          resolve(res.data)
        }).catch(e => {
          reject(e)
        })
      }
    })
  },
  handleDate (records) {
    records.forEach(item => {
      let time = new Date((item['参与时间'] - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      item['参与时间'] = getFormateDateTime(time, 'yyyy-MM-dd')
    })
  },
  importPubService (records, importComObj) {
    let ctx = this
    return new Promise((resolve, reject) => {
      let handleNext = (index, result) => {
        let item = records[index]
        if (result) importComObj.removeRecord(item)
        if (index === records.length - 1) {
          importComObj.updateImportStatus(false)
          resolve()
        } else {
          handleRecord(index + 1)
        }
      }
      let handleRecord = (index) => {
        let item = records[index]
        let batchCode = item['批次编码']
        let ruleCode = item['绩点编码']
        let teacherCode = item['教师号']

        ctx.getBatch(batchCode).then(batch => {
          ctx.getRule(ruleCode).then(rule => {
            ctx.getTeacher(teacherCode).then(teacher => {
              item.errorMsg = ''
              if (!batch) {
                item.errorMsg += '批次编码不存在 '
              }
              if (!rule) {
                item.errorMsg += ' 绩点编码不存在'
              }
              if (!teacher) {
                item.errorMsg += ' 教师号不存在'
              }
              if (item.errorMsg) {
                handleNext(index, false)
                return false
              }
              let payStandard = parseInt(rule.payStandard) || 0
              let pointStandard = parseFloat(rule.pointStandard) || 0
              let curPointCount = 0
              let curPayCount = 0
              if (item['薪酬标准']) payStandard = parseInt(item['薪酬标准'])
              if (item['绩点标准']) pointStandard = parseFloat(item['绩点标准']).toFixed(2)
              if (item['绩点计数']) curPointCount = parseFloat(item['绩点计数']).toFixed(2)
              if (item['薪酬计数']) curPayCount = parseFloat(item['薪酬计数']).toFixed(2)
              let obj = {
                batchId: batch.id,
                paypointDepartmentId: batch.paypointDepartmentId,
                teacherId: teacher.id,
                serviceDate: item['参与时间'],
                categoryIdPath: rule.categoryIdPath,
                categoryId: rule.categoryId,
                payNotCounted: false,
                ruleId: rule.id,
                unit: rule.unit,
                serviceContent: rule.title,
                payStandard: item['薪酬标准'] || 0,
                curPayCount: curPayCount,
                curPayAmount: Math.round(payStandard * curPayCount),
                pointStandard: pointStandard,
                curPointCount: curPointCount,
                curPointAmount: (pointStandard * curPointCount).toFixed(2),
                term: item['学期'] || curYear,
                summary: item['摘要'],
                memo: item['备注']
              }
              let notCountedStr = item['不计薪酬标志(Y/N)'] || item['不计薪酬标志']
              if (notCountedStr && (notCountedStr === 'Y' || notCountedStr === 'y')) {
                obj.payNotCounted = true
                obj.curPayAmount = 0
              }
              pubServiceApi.savePaypointPubService(obj).then(res => {
                handleNext(index, true)
              })
            })
          })
        })
      }

      if (records && records.length) {
        importComObj.updateImportStatus(true)
        handleRecord(0)
      } else {
        reject('导入数据为空')
      }
    })
  },
  importCoursePay (records, importComObj) {
    let ctx = this
    let computeFactor = (personCount = 0) => {
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
    return new Promise((resolve, reject) => {
      let handleNext = (index, result) => {
        let item = records[index]
        if (result) importComObj.removeRecord(item)
        if (index === records.length - 1) {
          importComObj.updateImportStatus(false)
          resolve()
        } else {
          handleRecord(index + 1)
        }
      }
      let handleRecord = (index) => {
        let item = records[index]
        let batchCode = item['批次编码']
        let ruleCode = item['绩点编码']
        let teacherCode = item['教师号']

        ctx.getBatch(batchCode).then(batch => {
          ctx.getRule(ruleCode).then(rule => {
            ctx.getTeacher(teacherCode).then(teacher => {
              item.errorMsg = ''
              if (!batch) {
                item.errorMsg += '批次编码不存在 '
              }
              if (!rule) {
                item.errorMsg += ' 绩点编码不存在'
              }
              if (!teacher) {
                item.errorMsg += ' 教师号不存在'
              }
              if (item.errorMsg) {
                handleNext(index, false)
                return false
              }
              let personCount = parseInt(item['选课人数']) || 0
              let payFactor = computeFactor(personCount)
              let payCount = 0
              if (item['薪酬计数']) payCount = (parseFloat(item['薪酬计数'])).toFixed(2)
              let payStandard = parseInt(rule.payStandard) || 0
              if (item['薪酬标准']) payStandard = parseInt(item['薪酬标准'])

              let obj = {
                batchId: batch.id,
                paypointDepartmentId: batch.paypointDepartmentId,
                teacherId: teacher.id,
                serviceDate: item['参与时间'],
                categoryIdPath: rule.categoryIdPath,
                categoryId: rule.categoryId,
                ruleId: rule.id,
                unit: rule.unit,
                serviceContent: rule.title,
                payStandard: payStandard,
                curPayCount: payCount,
                curPayAmount: (payStandard * payFactor * payCount).toFixed(2),
                attendCount: personCount,
                langInfo: item['中/英文'] || '中文',
                payFactor: payFactor,
                term: item['学期'] || curYear,
                summary: item['摘要'],
                memo: item['备注']
              }

              coursePayApi.savePaypointCoursePay(obj).then(res => {
                handleNext(index, true)
              })
            })
          })
        })
      }

      if (records && records.length) {
        importComObj.updateImportStatus(true)
        handleRecord(0)
      } else {
        reject('导入数据为空')
      }
    })
  },
  importOther (records, importComObj) {
    let ctx = this
    return new Promise((resolve, reject) => {
      let handleNext = (index, result) => {
        let item = records[index]
        if (result) importComObj.removeRecord(item)
        if (index === records.length - 1) {
          importComObj.updateImportStatus(false)
          resolve()
        } else {
          handleRecord(index + 1)
        }
      }
      let handleRecord = (index) => {
        let item = records[index]
        let batchCode = item['批次编码']
        let ruleCode = item['绩点编码']
        let teacherCode = item['教师号']

        ctx.getBatch(batchCode).then(batch => {
          ctx.getRule(ruleCode).then(rule => {
            ctx.getTeacher(teacherCode).then(teacher => {
              item.errorMsg = ''
              if (!batch) {
                item.errorMsg += '批次编码不存在 '
              }
              if (!rule) {
                item.errorMsg += ' 绩点编码不存在'
              }
              if (!teacher) {
                item.errorMsg += ' 教师号不存在'
              }
              if (item.errorMsg) {
                handleNext(index, false)
                return false
              }
              let payStandard = 0
              let pointStandard = 0
              let curPointCount = 0
              let curPayount = 0
              if (item['薪酬标准']) payStandard = parseInt(item['薪酬标准'])
              if (item['绩点标准']) pointStandard = parseFloat(item['绩点标准']).toFixed(2)
              if (item['绩点计数']) curPointCount = parseFloat(item['绩点计数']).toFixed(2)
              if (item['薪酬计数']) curPayount = parseFloat(item['薪酬计数']).toFixed(2)
              let obj = {
                batchId: batch.id,
                paypointDepartmentId: batch.paypointDepartmentId,
                teacherId: teacher.id,
                serviceDate: item['参与时间'],
                categoryIdPath: rule.categoryIdPath,
                categoryId: rule.categoryId,
                ruleId: rule.id,
                unit: rule.unit,
                serviceContent: rule.title,
                payStandard: payStandard,
                pointStandard: pointStandard,
                curPointCount: curPointCount,
                curPointAmount: parseFloat(item['绩点数量']).toFixed(2),
                curPayCount: curPayount,
                curPayAmount: item['薪酬金额'] || 0,
                attendCount: item['选课人数'] || 0,
                langInfo: item['中/英文'] || '中文',
                payFactor: 1.2,
                term: item['学期'] || curYear,
                summary: item['摘要'],
                memo: item['备注']
              }

              otherApi.savePaypointCoursePay(obj).then(res => {
                handleNext(index, true)
              })
            })
          })
        })
      }

      if (records && records.length) {
        importComObj.updateImportStatus(true)
        handleRecord(0)
      } else {
        reject('导入数据为空')
      }
    })
  }
}

export default PP_IMP
