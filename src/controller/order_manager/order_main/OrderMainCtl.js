import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Divider } from 'antd'
import { constUtils, orderStatus } from '../../../util/constUtils'
import OrderModel from '../../../model/OrderModel'
// import TodoTaskModel from '../../../model/TodoTaskModel'
import SearchOrderMainForm from './OrderMainForm'

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  })
}
@controller(({ ord }) => {
  return {
    current: ord.current,
    size: ord.size,
    total: ord.total,
    records: ord.records
  }
})
export default class OrderMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false
    }
    this.columns = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber'
      },
      {
        title: '下单时间',
        dataIndex: 'endDate',
        render: (text, record, index) => {
          return (
            <span >{fmtDate(record.orderDate, 'YYYY-MM-DD')}</span>
          )
        }
      },
      {
        title: '分公司/部门',
        dataIndex: 'companyDepartName'
      },
      {
        title: '下单员工',
        dataIndex: 'staffName'
      },
      {
        title: '下单员工电话',
        dataIndex: 'phone'
      },
      {
        title: '销售经理',
        dataIndex: 'salesManagerName'
      },
      {
        title: '订单总金额',
        dataIndex: 'orderAmount'
      },
      {
        title: '商品数量',
        dataIndex: 'goodsNum',
        render: (text, record, index) => {
          return (
            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.goProDetail(record)}>{text}件</span>
          )
        }
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        render: (text, record, index) => {
          return (
            <span>{constUtils.getItemName(orderStatus, text)}</span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <span>
                <a href='javascript:;' onClick={() => this.goOrderDetail(record)}>查看</a>
              </span>
              <Divider type={'vertical'} />
              <span>
                <a href='javascript:;' onClick={() => this.sure(record)}>确认收货</a>
              </span>
              <Divider type={'vertical'} />
              <span>
                <a href='javascript:;' onClick={() => this.delOrder(record)} >删除</a>
              </span>
            </div>

          )
        }
      }
    ]
  }
  @autowire()
  orderModel: OrderModel
  // @autowire()
  // todoTaskModel: TodoTaskModel

  sure=async (record) => {
    try {
      await this.orderModel.sure({ id: record.id })
      Promise.all([this.props.onSubmit(), message.success('收货成功')])
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
  }
  delOrder=async (record) => {
    try {
      await this.orderModel.delOrder({ id: record.id })
      Promise.all([this.props.onSubmit(), message.success('删除成功')])
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
  }
  start = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      })
    }, 1000)
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  };
  fetchData = (current, size) => {
    this.searchOMForm.props.form.validateFields(async (err, fieldsValue) => {
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
        await this.orderModel.fetchOrderData({ current, size, ...values })
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  goOrderDetail = (record) => {
    this.props.history.push(
      `/home/orderManager/orderDetail?id=${record.id}`
    )
  }
  goProDetail = (record) => {
    this.props.history.push(
      `/home/orderManager/orderProDetail?id=${record.id}`
    )
  }

  async componentDidMount () {
    const { current, size } = this.props
    await this.fetchData(current, size)
  }

  exportOrder=() => {
    this.searchOMForm.props.form.validateFields(async (err, fieldsValue) => {
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
        await this.orderModel.exportOrder({ ...values })
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
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0
    return (
      <div>
        <SearchOrderMainForm exportOrder={this.exportOrder} selectedRowKeys={selectedRowKeys} hasSelected={hasSelected} loading={loading} onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchOMForm = form }} />
        <Table rowSelection={rowSelection} scroll={{ x: 'max-content' }} dataSource={this.props.records} columns={this.columns} bordered pagination={false} rowKey='id' loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
