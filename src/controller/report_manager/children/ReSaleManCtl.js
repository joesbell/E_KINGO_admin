import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Modal } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
import saleReportModel from '../../../model/saleReportModel'
import SearchReSaleManForm from '../form/ReSaleManForm'
import { fmtThousands } from '../../../util/numberUtils'
import querystring from 'querystring'
const { confirm } = Modal

@controller(({ saleReport }) => {
  return {
    current: saleReport.current,
    size: saleReport.size,
    total: saleReport.total,
    saleRecords: saleReport.saleRecords,
    comList: saleReport.comList, // 分公司
    departList: saleReport.departList, // 部门
    ManagerList: null// 销售经理
  }
})
export default class ProductManMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '日期',
        dataIndex: 'orderDate',
        key: 'orderDate'

      },
      {
        title: '订单数量',
        dataIndex: 'orderNum',
        key: 'orderNum'
      },
      {
        title: '商品数量',
        dataIndex: 'goodsNum',
        key: 'goodsNum'
      },
      {
        title: '销售总金额',
        dataIndex: 'salesAmount',
        key: 'salesAmount',
        render: (text) => {
          return (
            fmtThousands(text)
          )
        }
      },
      {
        title: '成本总金额',
        dataIndex: 'costAmount',
        key: 'costAmount',
        render: (text) => {
          return (
            fmtThousands(text)
          )
        }
      },
      {
        title: '下单员工数量',
        dataIndex: 'staffNum',
        key: 'staffNum'
      },
      {
        title: '来源分公司数量',
        dataIndex: 'companyNum',
        key: 'companyNum'
      },
      {
        title: '来源部门数量',
        dataIndex: 'departmentNum',
        key: 'departmentNum'
      },
      {
        title: '销售经理数量',
        dataIndex: 'salesManagerNum',
        key: 'salesManagerNum'
      }
    ]
  }
  @autowire()
  saleReportModel: saleReportModel
  // @autowire()
  // todoTaskModel: TodoTaskModel
  fetchData = (current, size) => {
    this.searchRSMForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let values = {
        ...fieldsValue
      }

      try {
        this.setState({
          isLoading: true
        })

        await this.saleReportModel.fetchSaleData({ current, size, ...values })
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  goDetail = (record) => {
    this.props.history.push(
      '/creditGrantingAudit/' + encodeURI(record.flowInstanceId) + `/auditMsg?isAudit=false&taskId=${record.taskId}`
    )
  }
  offline = async (record) => {
    confirm({
      title: '确定下线此商品?',
      content: 'Some descriptions',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        console.log('OK')
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }
  async componentDidMount () {
    this.searchRSMForm.props.form.resetFields()
    const { current, size } = this.props
    await this.saleReportModel.fetchCompany()
    await this.fetchData(current, size)
  }
  exportSale = () => {
    this.searchRSMForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let values = {
        Authorization: window.sessionStorage.getItem('token'),
        ...fieldsValue
      }

      try {
        this.setState({
          isLoading: true
        })

        let url = 'http://118.24.50.239:8181/report/exportSalesReport'
        url += (url.indexOf('?') > 0 ? '' : '?') + querystring.stringify(values)
        window.open(url)
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  onSubmitSearch = async () => {
    const { size } = this.props
    this.fetchData(1, size)
  }
  onChangePage = (current, size) => {
    this.fetchData(current, size)
  }
  onShowSizeChange = (current, size) => {
    current = 1
    this.fetchData(current, size)
  }
  render () {
    const { current, size, total } = this.props
    return (
      <div>
        <SearchReSaleManForm exportSale={this.exportSale} onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchRSMForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={this.props.saleRecords} columns={this.columns} bordered pagination={false} rowKey={(record, index) => { return (`销售报表${index}`) }} loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
