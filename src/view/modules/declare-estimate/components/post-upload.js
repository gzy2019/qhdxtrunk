/* eslint-disable prefer-promise-reject-errors */
import api from '@/api/declare-estimate/estimatepost'

const POST_IMP = {
  batchId: null,
  studentCache: {},
  teacherCache: {},
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
  getStudent (code) {
    return new Promise((resolve, reject) => {
      if (this.studentCache[code]) {
        resolve(this.studentCache[code])
      } else {
        api.getStudentByCode({ code: code }).then(res => {
          this.studentCache[code] = res.data
          resolve(res.data)
        }).catch(e => {
          reject(e)
        })
      }
    })
  },
  init (batchId) {
    this.batchId = batchId
  },
  importRecords (records, importComObj) {
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
        let courseName = item['岗位/课程名称']
        let teacherCode = item['教师号']
        let studentCode = item['学生号']
        let memo = item['备注']

        ctx.getStudent(studentCode).then(student => {
          ctx.getTeacher(teacherCode).then(teacher => {
            item.errorMsg = ''
            if (!student) {
              item.errorMsg += ' 学生号不存在'
            }
            if (!teacher) {
              item.errorMsg += ' 教师号不存在'
            }
            if (item.errorMsg) {
              handleNext(index, false)
              return false
            }
            let obj = {
              batchId: ctx.batchId,
              teacherId: teacher.id,
              teacherName: teacher.teaName,
              studentId: student.id,
              studentName: student.stuName,
              studentPhone: student.mobile,
              studentEmail: student.email,
              studentCode: student.stuCode,
              courseName: courseName,
              memo: memo
            }
            api.saveEstimatePost(obj).then(res => {
              handleNext(index, true)
            }).catch(e => {
              item.errorMsg += ' 服务器错误'
              handleNext(index, false)
              return false
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

export default POST_IMP
