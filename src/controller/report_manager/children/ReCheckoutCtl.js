import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Modal } from 'antd'
import { fmtThousands } from '../../../util/numberUtils'
import checkoutReportModel from '../../../model/checkoutReportModel'
// import TodoTaskModel from '../../../model/TodoTaskModel'
import SearchReCheckoutForm from '../form/ReCheckoutForm'
import querystring from 'querystring'
const { confirm } = Modal

@controller(({ checkoutReport }) => {
  return {
    current: checkoutReport.current,
    size: checkoutReport.size,
    total: checkoutReport.total,
    checkoutRecords: checkoutReport.checkoutRecords,
    comList: checkoutReport.comList, // 分公司
    departList: checkoutReport.departList, // 部门
    ManagerList: checkoutReport.ManagerList// 销售经理
  }
})
export default class ReCheckoutCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '商品编号',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber'
      },
      {
        title: '商品分类',
        dataIndex: 'goodsCategory',
        key: 'goodsCategory'
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName'
      },
      {
        title: '销售数量',
        dataIndex: 'salesNum',
        key: 'salesNum'
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
        title: '下单员工数量',
        dataIndex: 'staffNum',
        key: 'staffNum'
      },
      {
        title: '销售经理数量',
        dataIndex: 'salesManagerNum',
        key: 'salesManagerNum'
      }
    ]
  }
  @autowire()
  checkoutReportModel: checkoutReportModel
  // @autowire()
  // todoTaskModel: TodoTaskModel
  fetchData = (current, size) => {
    this.searchRCForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let values = {
        ...fieldsValue,
        startDate: fmtDate(fieldsValue['startDate'], 'YYYY-MM-DD 00:00:00'),
        endDate: fmtDate(fieldsValue['endDate'], 'YYYY-MM-DD 23:59:59')
      }

      try {
        this.setState({
          isLoading: true
        })

        await this.checkoutReportModel.fetchCheckoutData({ current, size, ...values })
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
  exportCheckout = () => {
    this.searchRCForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let values = {
        Authorization: window.sessionStorage.getItem('token'),
        ...fieldsValue,
        startDate: fmtDate(fieldsValue['startDate'], 'YYYY-MM-DD 00:00:00'),
        endDate: fmtDate(fieldsValue['endDate'], 'YYYY-MM-DD 23:59:59')
      }

      try {
        this.setState({
          isLoading: true
        })
        let url = 'http://118.24.50.239:8181/report/exportOutStock'
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
    this.searchRCForm.props.form.resetFields()
    const { current, size } = this.props
    await this.checkoutReportModel.fetchCompany()
    await this.fetchData(current, size)
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
        <SearchReCheckoutForm exportCheckout={this.exportCheckout} onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchRCForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={this.props.checkoutRecords} columns={this.columns} bordered pagination={false} rowKey={(record, index) => { return (`出库报表${index}`) }} loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
