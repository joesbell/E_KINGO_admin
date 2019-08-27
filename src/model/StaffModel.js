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
      departList: [] // 部门
    }

    // 请求员工数据
    async fetchStaffModel (val) {
      let { data: { data } } = await callApi('/staff/query', { ...val }, { method: 'POST' })
      this.setState({
        ...data
      })
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
        departList: null
      })
    }

    async addPro (val) {
      await callApi('/goods/insert', { ...val }, { method: 'POST' })
    }
    // 修改商品
    async updatePro (val) {
      await callApi('/goods/update', { ...val }, { method: 'POST' })
    }
    // 商品分类
    async proCategory (name) {
      await callApi('/mallCommon/queryCategory', { ...name }, { method: 'POST' })
    }

    // 商品上下线
    async offlinePro (pro) {
      await callApi('/goods/updateOnLineStatus', { ...pro }, { method: 'POST' })
    }
    // 商品详情
    async getProDetail (id) {
      let { data: { data } } = await callApi('/goods/get', { id: id }, { method: 'GET' })
      this.setState({
        proDetail: data
      })
    }
    // 更改商品分类
    async changeCategoryValue (val) {
      this.setState({
        categoryValue: val
      })
    }
    // 更改图片
    async setFileList (fileList) {
      this.setState({
        fileList: fileList
      })
    }
}
