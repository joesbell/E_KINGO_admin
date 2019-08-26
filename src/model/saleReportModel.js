import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class saleReportModel {
  namespace = 'saleReport'

  initState = {
    current: 1,
    size: 10,
    comList: null, // 分公司
    saleCom: null,
    departList: null, // 部门
    saleDepart: null,
    ManagerList: null, // 销售经理
    saleRecords: null
  }

  // 分公司
  async fetchCompany (val) {
    let { data: { data } } = await callApi('/mallCommon/queryCompany', { ...val }, { method: 'POST' })
    this.setState({
      comList: data
    })
  }
  // 销售报表分公司选择
  async selectSaleCompany (val) {
    this.setState({
      saleCom: val
    })
  }

  // 导出报表
  async exportSale (val) {
    await callApi('/report/exportSalesReport', { ...val }, { method: 'GET' })
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
  // 销售报表部门选择
  async selectSaleDepart (val) {
    this.setState({
      saleDepart: val
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
  // 销售报表
  async fetchSaleData (val) {
    let { data: { data } } = await callApi('/report/salesReport', { ...val }, { method: 'POST' })
    this.setState({
      saleRecords: data.records,
      current: data.current,
      size: data.size,
      total: data.total
    })
  }
}
