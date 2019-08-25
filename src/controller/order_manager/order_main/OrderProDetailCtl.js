import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import { PageBodyCard } from '../../../component/Card'
import OrderModel from '../../../model/OrderModel'
import { parse } from 'querystring'
import { Table } from 'antd'

@controller(({ ord }) => {
  let query = parse(window.location.search.slice(1))
  return {
    current: ord.current,
    size: ord.size,
    total: ord.total,
    records: ord.records,
    orderProDetailList: ord.orderProDetailList,
    id: query.id ? query.id : null
  }
})
export default class OrderProDetailCtl extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '商品编号',
        dataIndex: 'goodsNumber'
      },
      {
        title: '商品分类',
        dataIndex: 'goodsCategory'
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName'
      },
      {
        title: '数量',
        dataIndex: 'goodsNum'
      },
      {
        title: '上线有效期',
        dataIndex: 'onlineDate'
      },
      {
        title: '供货商名称',
        dataIndex: 'supplerName'
      },
      {
        title: '供货商电话',
        dataIndex: 'supplerPhone'
      }
    ]
  }
  @autowire()
  orderModel: OrderModel
  async componentDidMount () {
    await this.orderModel.fetchOrderProDetail(this.props.id)
  }

  goBack = async () => {
    await this.props.history.goBack()
  }
  render () {
    return (
      <div >
        <PageHeader
          onBack={this.goBack}
          className='tabs'
          title={<span className='title'>商品明细</span>}
        />
        <PageBodyCard>
          <Table scroll={{ x: 'max-content' }} dataSource={this.props.orderProDetailList} columns={this.columns} bordered pagination={false} rowKey={(record, index) => `${record.goodsName}${index}`} loading={this.state.isLoading} />

        </PageBodyCard>
      </div>
    )
  }
}
