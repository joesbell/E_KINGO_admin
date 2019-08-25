import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Modal } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
import ReportModel from '../../../model/ReportModel'
import SearchReSaleManForm from '../form/ReSaleManForm'
const { confirm } = Modal

@controller(({ report }) => {
  return {
    current: report.current,
    size: report.size,
    total: report.total,
    records: report.records,
    comList: report.comList, // 分公司
    departList: report.departList // 部门
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
        key: 'salesAmount'
      },
      {
        title: '成本总金额',
        dataIndex: 'costAmount',
        key: 'costAmount'
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
    reportModel: ReportModel
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
        console.log(values)

        try {
          this.setState({
            isLoading: true
          })

          await this.reportModel.fetchSaleData({ current, size, ...values })
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
      const { current, size } = this.props
      await this.reportModel.fetchCompany()
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
          <SearchReSaleManForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchRSMForm = form }} />
          <Table scroll={{ x: 'max-content' }} dataSource={this.props.records} columns={this.columns} bordered pagination={false} rowKey={(record, index) => { return (`销售报表${index}`) }} loading={this.state.isLoading} />
          <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
            showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
        </div>
      )
    }
}
