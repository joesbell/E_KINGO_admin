import React, { Component } from 'react'
import PageHeader from '../../component/PageHeader'
import { PageBodyCard } from '../../component/Card'
import OrderMainCtl from './order_main/OrderMainCtl'
export default class OrderManCtl extends Component {
  render () {
    return (
      <div className='taskPools'>
        <PageHeader
          className='tabs'
          title={<div className='title'>订单管理</div>}
        />
        <PageBodyCard>
          <OrderMainCtl />
        </PageBodyCard>
      </div>
    )
  }
}
