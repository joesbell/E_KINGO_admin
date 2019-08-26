import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class checkoutReportModel {
  namespace = 'checkoutReport'

  initState = {
    current: 1,
    size: 10,
    comList: null, // 分公司
    checkoutCom: null,
    departList: null, // 部门
    checkoutDepart: null,
    ManagerList: null, // 销售经理
    checkoutRecords: null
  }

  // 分公司
  async fetchCompany (val) {
    let { data: { data } } = await callApi('/mallCommon/queryCompany', { ...val }, { method: 'POST' })
    this.setState({
      comList: data
    })
  }

  // 导出报表
  async exportCheckout (val) {
    await callApi('/report/exportOutStock', { ...val }, { method: 'GET' })
  }
  // 出库报表分公司选择
  async selectCheckoutCompany (val) {
    this.setState({
      checkoutCom: val
    })
  }
  // 部门
  async fetchDepart (val) {
    let { data: { data } } = await callApi('/mallCommon/queryDepartment', { ...val }, { method: 'POST' })
    this.setState({
      departList: data
    })
  }

  // 清空部门
  async clearDepart () {
    this.setState({
      departList: null
    })
  }

  // 出库报表部门选择
  async selectCheckoutDepart (val) {
    this.setState({
      checkoutDepart: val
    })
  }
  // 销售经理
  async fetchManager (val) {
    let { data: { data } } = await callApi('/mallCommon/querySalesManager', { ...val }, { method: 'POST' })
    this.setState({
      ManagerList: data
    })
  }
  // 清空销售经理
  async clearManager () {
    this.setState({
      ManagerList: null
    })
  }

  // 商品出库报表
  async fetchCheckoutData (val) {
    let { data: { data } } = await callApi('/report/outStock', { ...val }, { method: 'POST' })
    this.setState({
      checkoutRecords: data.records,
      current: data.current,
      size: data.size,
      total: data.total
    })
  }
}
