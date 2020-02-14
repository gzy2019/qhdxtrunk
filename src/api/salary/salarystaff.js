import axios from '@/libs/api.request'

const api = {
  getTeacherDataList: (obj) => {
    return axios.request({
      url: '/salary/salarystaff/data/teacher_list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryDepartmentDataList: (obj) => {
    return axios.request({
      url: '/salary/salaryconfig/data/department_list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryStaffDataList: (obj) => {
    return axios.request({
      url: '/salary/salarystaff/data/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryStaffList: (obj) => {
    return axios.request({
      url: '/salary/salarystaff/list',
      params: obj,
      method: 'get'
    })
  },
  getSalaryStaffInfo: (id) => {
    return axios.request({
      url: `/salary/salarystaff/info/${id}`,
      method: 'get'
    })
  },
  saveSalaryStaff: (obj) => {
    return axios.request({
      url: '/salary/salarystaff/save',
      data: obj,
      method: 'post'
    })
  },
  baseSaveSalaryStaff: (obj) => {
    return axios.request({
      url: '/salary/salarystaff/batch_save',
      data: obj,
      method: 'post'
    })
  },
  updateSalaryStaff: (obj) => {
    return axios.request({
      url: '/salary/salarystaff/update',
      data: obj,
      method: 'post'
    })
  },
  deleteSalaryStaff: (obj) => {
    return axios.request({
      url: '/salary/salarystaff/delete',
      data: obj,
      method: 'post'
    })
  }
}

export default api
