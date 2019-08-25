import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class ReportModel {
    namespace = 'report'

    initState = {
      current: 1,
      size: 10,
      comList: null, // 分公司
      departList: null // 部门

    }

    // 分公司
    async fetchCompany (val) {
      let { data: { data } } = await callApi('/mallCommon/queryCompany', { ...val }, { method: 'POST' })
      this.setState({
        comList: data
      })
    }
    // 部门
    async fetchDepart (val) {
      let { data: { data } } = await callApi('/mallCommon/queryDepartment', { ...val }, { method: 'POST' })
      this.setState({
        departList: data
      })
    }
    // 销售报表
    async fetchSaleData (val) {
      let { data: { data } } = await callApi('/report/salesReport', { ...val }, { method: 'POST' })
      this.setState({
        ...data
      })
    }
}
