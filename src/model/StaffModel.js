import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class StaffModel {
    namespace = 'staff'

    initState = {
      current: 1,
      size: 10,
      comList: [], // 分公司
      Com: null,
      departList: [], // 部门
      staffDetail: null// 员工详情
    }

    // 请求员工数据
    async fetchStaffModel (val) {
      let { data: { data } } = await callApi('/staff/query', { ...val }, { method: 'POST' })
      this.setState({
        ...data
      })
    }
    // 查询员工数据
    async getStaffModel (val) {
      let { data: { data } } = await callApi('/staff/get', { id: val }, { method: 'GET' })
      this.setState({
        staffDetail: data
      })
    }
    // 修改员工数据
    async updateStaffModel (val) {
      await callApi('/staff/update', { ...val }, { method: 'POST' })
    }

    // 删除员工

    async deleteStaffModel (val) {
      await callApi('/staff/delete', { ...val }, { method: 'POST' })
    }

    // 新增员工数据
    async addStaff (val) {
      await callApi('/staff/insert', { ...val }, { method: 'POST' })
    }

    // 分公司
    async fetchCompany (val) {
      let { data: { data } } = await callApi('/mallCommon/queryCompany', { ...val }, { method: 'POST' })
      this.setState({
        comList: data
      })
    }

    // 更改分公司
    async changeCompany (val) {
      let newList = this.getState().comList
      newList.push({ name: val })

      var hash = {}
      newList = newList.reduce(function (item, next) {
      // eslint-disable-next-line no-unused-expressions
        hash[next.name] ? '' : hash[next.name] = true && item.push(next)
        return item
      }, [])

      this.setState({
        comList: newList
      })
    }

    // 分公司选择
    async selectCompany (val) {
      this.setState({
        Com: val
      })
    }
    // 部门
    async fetchDepart (val) {
      let { data: { data } } = await callApi('/mallCommon/queryDepartment', { ...val }, { method: 'POST' })
      this.setState({
        departList: data
      })
    }

    // 更改部门
    async changeDepart (val) {
      let newList = this.getState().departList
      newList.push({ name: val })

      var hash = {}
      newList = newList.reduce(function (item, next) {
        // eslint-disable-next-line no-unused-expressions
        hash[next.name] ? '' : hash[next.name] = true && item.push(next)
        return item
      }, [])

      this.setState({
        departList: newList
      })
    }
    // 清空部门
    async clearDepart () {
      this.setState({
        departList: []
      })
    }
}
